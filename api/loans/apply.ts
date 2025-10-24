import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_lib/prisma'
import { requireAuth } from '../_lib/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const auth = requireAuth(req, res, ['FARMER'])
  if (!auth) return
  const { farmerId, amountUGX } = req.body as any
  if (!farmerId || !amountUGX) return res.status(400).json({ error: 'Missing fields' })
  const app = await prisma.loanApplication.create({ data: { farmerId, amountUGX: Number(amountUGX) } })
  res.json(app)
}
