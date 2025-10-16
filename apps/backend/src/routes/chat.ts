import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../index.js';

const router = Router();

router.post('/threads', requireAuth, async (req, res) => {
  const { athleteId, coachId } = req.body;
  const thread = await prisma.messageThread.create({ data: { athleteId, coachId } });
  res.status(201).json(thread);
});

router.get('/threads', requireAuth, async (req, res) => {
  const userId = req.authUser!.userId;
  const threads = await prisma.messageThread.findMany({
    where: { OR: [{ athleteId: userId }, { coachId: userId }] },
    include: { messages: { orderBy: { sentAt: 'asc' } } },
  });
  res.json(threads);
});

export default router;
