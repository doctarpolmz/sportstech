import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../security/auth.js'

const prisma = new PrismaClient()
const router = Router()

router.get('/overview', requireAuth(['FSP_STAFF','ADMIN']), async (_req, res) => {
  const [apps, approved, rejected, farmers] = await Promise.all([
    prisma.loanApplication.count(),
    prisma.loanApplication.count({ where: { status: 'APPROVED' } }),
    prisma.loanApplication.count({ where: { status: 'REJECTED' } }),
    prisma.farmer.count(),
  ])
  res.json({ totals: { apps, approved, rejected, farmers } })
})

export default router
}