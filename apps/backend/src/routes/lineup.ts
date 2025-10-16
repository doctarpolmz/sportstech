import { Router } from 'express';
import PDFDocument from 'pdfkit';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../index.js';

const router = Router();

router.post('/', requireAuth, async (req, res) => {
  const userId = req.authUser!.userId;
  const { sport, name, formation, players } = req.body;
  const lineup = await prisma.lineup.create({ data: { userId, sport, name, formation, players } });
  res.status(201).json(lineup);
});

router.get('/', requireAuth, async (req, res) => {
  const userId = req.authUser!.userId;
  const lineups = await prisma.lineup.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  res.json(lineups);
});

router.get('/:id/report.pdf', requireAuth, async (req, res) => {
  const userId = req.authUser!.userId;
  const { id } = req.params;
  const lineup = await prisma.lineup.findFirst({ where: { id, userId } });
  if (!lineup) return res.status(404).end();
  res.setHeader('Content-Type', 'application/pdf');
  const doc = new PDFDocument();
  doc.pipe(res);
  doc.fontSize(20).text('Coach\'s Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Sport: ${lineup.sport}`);
  doc.text(`Name: ${lineup.name}`);
  if (lineup.formation) doc.text(`Formation: ${lineup.formation}`);
  doc.moveDown();
  doc.text('Players:');
  doc.moveDown();
  doc.fontSize(12).text(JSON.stringify(lineup.players, null, 2));
  doc.end();
});

export default router;
