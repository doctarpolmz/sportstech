import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireRole } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/', requireAuth, requireRole(['coach', 'admin']), async (req, res) => {
  const { teamName, formation, players } = req.body;
  const lineup = await prisma.lineup.create({ data: { coachId: req.user.id, teamName, formation, playersJson: JSON.stringify(players) } });
  res.json({ lineup });
});

router.get('/', requireAuth, requireRole(['coach', 'admin']), async (req, res) => {
  const lineups = await prisma.lineup.findMany({ where: { coachId: req.user.id }, orderBy: { createdAt: 'desc' } });
  res.json({ lineups });
});

export default router;
