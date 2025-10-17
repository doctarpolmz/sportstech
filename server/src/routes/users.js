import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role, profilePhotoUrl: user.profilePhotoUrl } });
});

router.post('/me/photo', requireAuth, upload.single('photo'), async (req, res) => {
  const url = `${process.env.PUBLIC_BASE_URL || 'http://localhost:4000'}/uploads/${req.file.filename}`;
  await prisma.user.update({ where: { id: req.user.id }, data: { profilePhotoUrl: url } });
  res.json({ url });
});

export default router;
