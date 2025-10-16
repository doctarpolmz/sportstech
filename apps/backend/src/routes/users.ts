import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../index.js';

const router = Router();

router.get('/me', requireAuth, async (req, res) => {
  const userId = req.authUser!.userId;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, firstName: true, lastName: true, role: true, avatarUrl: true, emailVerified: true } });
  res.json(user);
});

export default router;
