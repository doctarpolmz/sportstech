import { Router } from 'express'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role).default('FARMER'),
  name: z.string().optional()
})

router.post('/register', async (req, res) => {
  const parsed = RegisterSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const { email, password, role, name } = parsed.data
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(409).json({ error: 'Email in use' })
  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, password: hash, role } })
  if (role === 'FARMER') {
    await prisma.farmer.create({ data: { userId: user.id, name: name || email.split('@')[0], language: 'en' } })
  }
  res.json({ id: user.id })
})

const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(6) })
router.post('/login', async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' })
  res.json({ token })
})

export default router
