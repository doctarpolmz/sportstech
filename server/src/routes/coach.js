import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireRole } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/assign', requireAuth, requireRole(['coach', 'admin']), async (req, res) => {
  const { athleteId } = req.body;
  const link = await prisma.coachAthlete.upsert({
    where: { coachId_athleteId: { coachId: req.user.id, athleteId } },
    update: {},
    create: { coachId: req.user.id, athleteId }
  });
  res.json({ link });
});

router.get('/athletes', requireAuth, requireRole(['coach', 'admin']), async (req, res) => {
  const links = await prisma.coachAthlete.findMany({ where: { coachId: req.user.id }, include: { athlete: true } });
  res.json({ athletes: links.map((l) => l.athlete) });
});

router.post('/drill', requireAuth, requireRole(['coach', 'admin']), async (req, res) => {
  const { athleteId, title, description, dueDate } = req.body;
  const drill = await prisma.drill.create({ data: { title, description, assignedToId: athleteId, createdById: req.user.id, dueDate: dueDate ? new Date(dueDate) : null } });
  res.json({ drill });
});

router.get('/drills', requireAuth, async (req, res) => {
  const drills = await prisma.drill.findMany({ where: { OR: [{ assignedToId: req.user.id }, { createdById: req.user.id }] }, orderBy: { createdAt: 'desc' } });
  res.json({ drills });
});

export default router;
