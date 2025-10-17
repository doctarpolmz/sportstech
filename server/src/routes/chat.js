import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/thread', requireAuth, async (req, res) => {
  const { coachId, athleteId } = req.body;
  const thread = await prisma.thread.upsert({
    where: { coachId_athleteId: { coachId, athleteId } },
    update: {},
    create: { coachId, athleteId }
  });
  res.json({ thread });
});

router.get('/thread', requireAuth, async (req, res) => {
  const roleField = req.user.role === 'coach' ? 'coachId' : 'athleteId';
  const threads = await prisma.thread.findMany({ where: { [roleField]: req.user.id } });
  res.json({ threads });
});

router.get('/messages/:threadId', requireAuth, async (req, res) => {
  const messages = await prisma.message.findMany({ where: { threadId: req.params.threadId }, orderBy: { createdAt: 'asc' } });
  res.json({ messages });
});

export default router;
