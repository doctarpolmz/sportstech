import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../security/auth.js'

const prisma = new PrismaClient()
const router = Router()

router.get('/fsp-overview', requireAuth(['FSP_STAFF', 'ADMIN']), async (_req, res) => {
  const [apps, approved, rejected] = await Promise.all([
    prisma.loanApplication.count(),
    prisma.loanApplication.count({ where: { status: 'APPROVED' } }),
    prisma.loanApplication.count({ where: { status: 'REJECTED' } }),
  ])
  res.json({ totalApplications: apps, approved, rejected })
})

export default router
