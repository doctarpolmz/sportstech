import { Router } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

const ApplySchema = z.object({ farmerId: z.string(), amountUGX: z.number().int().positive() })

router.post('/apply', async (req, res) => {
  const parsed = ApplySchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const app = await prisma.loanApplication.create({ data: parsed.data })
  res.json(app)
})

export default router
