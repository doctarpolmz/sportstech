import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

router.get('/:id/arip-score', async (req, res) => {
  const { id } = req.params
  const latest = await prisma.creditScore.findFirst({ where: { farmerId: id }, orderBy: { createdAt: 'desc' } })
  if (!latest) return res.status(404).json({ error: 'No score' })
  res.json(latest)
})

export default router
