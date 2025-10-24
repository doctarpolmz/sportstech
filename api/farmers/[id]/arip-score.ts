import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../../_lib/prisma'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  const { id } = req.query as { id: string }
  const latest = await prisma.creditScore.findFirst({ where: { farmerId: id }, orderBy: { createdAt: 'desc' } })
  if (!latest) return res.status(404).json({ error: 'No score' })
  res.json(latest)
}
