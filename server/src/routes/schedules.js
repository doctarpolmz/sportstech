import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';
import dayjs from 'dayjs';
import { createGoogleCalendarEvent } from '../utils/google.js';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  const { athleteId, title, description, location, startTime, endTime } = req.body;
  const schedule = await prisma.schedule.create({
    data: {
      coachId: req.user.id,
      athleteId,
      title,
      description,
      location,
      startTime: new Date(startTime),
      endTime: new Date(endTime)
    }
  });
  res.json({ schedule });
});

router.get('/', requireAuth, async (req, res) => {
  const where = req.user.role === 'coach' ? { coachId: req.user.id } : { athleteId: req.user.id };
  const schedules = await prisma.schedule.findMany({ where, orderBy: { startTime: 'asc' } });
  res.json({ schedules });
});

router.post('/:id/calendar', requireAuth, async (req, res) => {
  const sched = await prisma.schedule.findUnique({ where: { id: req.params.id } });
  if (!sched) return res.status(404).json({ error: 'Not found' });
  // In a real app, you'd store OAuth tokens per user; here we accept an accessToken in body
  const { accessToken } = req.body;
  const event = await createGoogleCalendarEvent({
    accessToken,
    summary: sched.title,
    description: sched.description,
    start: dayjs(sched.startTime).toISOString(),
    end: dayjs(sched.endTime).toISOString(),
    attendees: []
  });
  await prisma.schedule.update({ where: { id: sched.id }, data: { googleEventId: event.id } });
  res.json({ event });
});

export default router;
