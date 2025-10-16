import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { analyzeVideoWithGoogle, getYoutubeRecommendations } from '../utils/google.js';
import path from 'path';
import { getUploadDir } from '../utils/paths.js';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/upload', requireAuth, upload.single('video'), async (req, res) => {
  try {
    const video = await prisma.video.create({
      data: {
        userId: req.user.id,
        originalName: req.file.originalname,
        path: req.file.filename,
        status: 'analyzing',
        labelsJson: JSON.stringify([])
      }
    });

    // Kick off analysis (simple inline for now)
    const localPath = path.join(getUploadDir(), req.file.filename);
    const analysis = await analyzeVideoWithGoogle({ localPath, sportHint: req.body.sport });
    const recommendations = await getYoutubeRecommendations(`${req.body.sport || 'sports'} technique drills`);

    await prisma.video.update({
      where: { id: video.id },
      data: {
        status: 'complete',
        analysisJson: JSON.stringify({ ...analysis, recommendations }),
        score: analysis.score || null,
        labelsJson: JSON.stringify(analysis.labels || [])
      }
    });

    res.json({ id: video.id, status: 'complete' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  const videos = await prisma.video.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' } });
  res.json({ videos });
});

router.get('/:id', requireAuth, async (req, res) => {
  const v = await prisma.video.findUnique({ where: { id: req.params.id } });
  if (!v || v.userId !== req.user.id) return res.status(404).json({ error: 'Not found' });
  res.json({ video: v });
});

export default router;
