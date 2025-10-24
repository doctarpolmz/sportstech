import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_lib/prisma'
import { Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, password, role = 'FARMER', name } = req.body as any
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' })
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(409).json({ error: 'Email in use' })
  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, password: hash, role: role as Role } })
  if (role === 'FARMER') {
    await prisma.farmer.create({ data: { userId: user.id, name: name || email.split('@')[0], language: 'en' } })
  }
  res.json({ id: user.id })
}
