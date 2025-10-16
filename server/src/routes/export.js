import express from 'express';
import PDFDocument from 'pdfkit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/coach-report/:videoId', async (req, res) => {
  const v = await prisma.video.findUnique({ where: { id: req.params.videoId } });
  if (!v) return res.status(404).json({ error: 'Not found' });
  res.setHeader('Content-Type', 'application/pdf');
  const doc = new PDFDocument();
  doc.pipe(res);
  doc.fontSize(18).text('Coach\'s Report', { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(`Video: ${v.originalName}`);
  doc.text(`Score: ${v.score ?? 'N/A'}`);
  doc.moveDown();
  if (v.analysisJson) {
    const a = JSON.parse(v.analysisJson);
    const labels = v.labelsJson ? JSON.parse(v.labelsJson) : [];
    doc.text('Labels: ' + labels.join(', '));
    doc.moveDown();
    doc.text('Missing:');
    (a.feedback?.missing || []).forEach((m) => doc.text('- ' + m));
    doc.moveDown();
    doc.text('Improvements:');
    (a.feedback?.improvements || []).forEach((m) => doc.text('- ' + m));
  }
  doc.end();
});

export default router;
