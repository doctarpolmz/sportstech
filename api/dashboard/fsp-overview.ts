import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_lib/prisma'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const [apps, approved, rejected] = await Promise.all([
    prisma.loanApplication.count(),
    prisma.loanApplication.count({ where: { status: 'APPROVED' } }),
    prisma.loanApplication.count({ where: { status: 'REJECTED' } }),
  ])
  res.json({ totalApplications: apps, approved, rejected })
}
