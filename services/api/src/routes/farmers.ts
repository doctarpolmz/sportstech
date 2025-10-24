import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../security/auth.js'

const prisma = new PrismaClient()
const router = Router()

router.get('/:id/arip-score', requireAuth(), async (req, res) => {
  const { id } = req.params
  const latest = await prisma.creditScore.findFirst({ where: { farmerId: id }, orderBy: { createdAt: 'desc' } })
  if (!latest) return res.status(404).json({ error: 'No score' })
  res.json(latest)
})

router.get('/:id/farm', requireAuth(), async (req, res) => {
  const { id } = req.params
  const farm = await prisma.farm.findFirst({ where: { farmerId: id }, orderBy: { createdAt: 'asc' } as any })
  if (!farm) return res.status(404).json({ error: 'No farm' })
  res.json(farm)
})

export default router
