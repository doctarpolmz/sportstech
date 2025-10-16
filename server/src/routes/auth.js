import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/email.js';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
const router = express.Router();

function signTokens(user) {
  const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev', { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET || 'dev', { expiresIn: '7d' });
  return { token, refreshToken };
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name || !role) return res.status(400).json({ error: 'Missing fields' });
    if (!['athlete', 'coach', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();
    const user = await prisma.user.create({ data: { email, passwordHash, name, role, verificationToken } });

    const verifyLink = `${process.env.PUBLIC_BASE_URL || 'http://localhost:4000'}/api/auth/verify?token=${verificationToken}`;
    await sendEmail({ to: email, subject: 'Verify your SportsTech AI account', html: `<p>Hi ${name}, verify your account: <a href="${verifyLink}">Verify</a></p>` });

    res.json({ message: 'Registered. Check email to verify.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/verify', async (req, res) => {
  try {
    const { token } = req.query;
    const user = await prisma.user.findFirst({ where: { verificationToken: String(token) } });
    if (!user) return res.status(400).json({ error: 'Invalid token' });
    await prisma.user.update({ where: { id: user.id }, data: { verified: true, verificationToken: null } });
    res.json({ message: 'Email verified. You can login now.' });
  } catch (e) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    if (!user.verified) return res.status(403).json({ error: 'Email not verified' });

    const { token, refreshToken } = signTokens(user);
    res.json({ token, refreshToken, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
  } catch (e) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Missing refresh token' });
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'dev');
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const tokens = signTokens(user);
    res.json(tokens);
  } catch (e) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

router.post('/forgot', async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.json({ message: 'If that account exists, we sent an email.' });
  const resetToken = uuidv4();
  await prisma.user.update({ where: { id: user.id }, data: { resetToken } });
  const link = `${process.env.PUBLIC_BASE_URL || 'http://localhost:4000'}/api/auth/reset/confirm?token=${resetToken}`;
  await sendEmail({ to: email, subject: 'Reset your password', html: `<p>Reset your password: <a href="${link}">Reset</a></p>` });
  res.json({ message: 'If that account exists, we sent an email.' });
});

router.post('/reset', async (req, res) => {
  const { token, password } = req.body;
  const user = await prisma.user.findFirst({ where: { resetToken: token } });
  if (!user) return res.status(400).json({ error: 'Invalid token' });
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash, resetToken: null } });
  res.json({ message: 'Password updated' });
});

export default router;
