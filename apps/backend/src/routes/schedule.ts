import { Router } from 'express';
import dayjs from 'dayjs';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../index.js';

const router = Router();

router.post('/', requireAuth, async (req, res) => {
  const userId = req.authUser!.userId;
  const { title, description, startTime, endTime, location } = req.body;
  const event = await prisma.schedule.create({ data: {
    userId, title, description, startTime: new Date(startTime), endTime: new Date(endTime), location
  }});
  res.status(201).json(event);
});

router.get('/', requireAuth, async (req, res) => {
  const userId = req.authUser!.userId;
  const { from, to } = req.query as any;
  const start = from ? new Date(from) : dayjs().subtract(30, 'day').toDate();
  const end = to ? new Date(to) : dayjs().add(30, 'day').toDate();
  const events = await prisma.schedule.findMany({ where: { userId, startTime: { gte: start }, endTime: { lte: end } }, orderBy: { startTime: 'asc' } });
  res.json(events);
});

export default router;
