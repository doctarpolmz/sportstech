import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_lib/prisma'
import { requireAuth } from '../_lib/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = requireAuth(req, res, ['FSP_STAFF','ADMIN'])
  if (!auth) return
  const [apps, approved, rejected] = await Promise.all([
    prisma.loanApplication.count(),
    prisma.loanApplication.count({ where: { status: 'APPROVED' } }),
    prisma.loanApplication.count({ where: { status: 'REJECTED' } }),
  ])
  res.json({ totalApplications: apps, approved, rejected })
}
