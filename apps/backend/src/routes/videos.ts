import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../index.js';
import { analyzeVideoLabelsGCP, computeFeedbackFromLabels } from '../services/analysis.js';
import { fetchTutorialsForKeywords } from '../services/youtube.js';

const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: Number(process.env.MAX_UPLOAD_MB || 500) * 1024 * 1024 } });

const router = Router();

router.post('/', requireAuth, upload.single('video'), async (req, res) => {
  const userId = req.authUser!.userId;
  const file = req.file!;
  const { title } = req.body;
  const video = await prisma.video.create({ data: {
    userId,
    title: title || file.originalname,
    filename: file.filename,
    mimeType: file.mimetype,
    sizeBytes: file.size,
  }});
  res.status(201).json(video);
});

router.post('/:id/analyze', requireAuth, async (req, res) => {
  const userId = req.authUser!.userId;
  const { id } = req.params;
  const video = await prisma.video.findFirst({ where: { id, userId } });
  if (!video) return res.status(404).json({ error: 'Video not found' });

  // Placeholder: in production, upload to GCS and use gs:// URI
  const gcsUri = `gs://bucket/${video.filename}`;
  try {
    const labels = await analyzeVideoLabelsGCP(gcsUri);
    const { score, missing, improvements, concepts } = computeFeedbackFromLabels(labels);
    const tutorials = await fetchTutorialsForKeywords(concepts || ['sports training']);
    const analysis = await prisma.analysis.create({ data: {
      videoId: video.id,
      score,
      missing,
      improvements,
      recommendations: tutorials,
      rawLabels: labels as any
    }});
    await prisma.video.update({ where: { id: video.id }, data: { processed: true } });
    res.json(analysis);
  } catch (e: any) {
    res.status(500).json({ error: 'Analysis failed', details: e?.message });
  }
});

router.get('/', requireAuth, async (req, res) => {
  const userId = req.authUser!.userId;
  const videos = await prisma.video.findMany({ where: { userId }, include: { analysis: true }, orderBy: { createdAt: 'desc' } });
  res.json(videos);
});

export default router;
