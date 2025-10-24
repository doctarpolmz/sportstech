import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { Role } from '@prisma/client'

export function requireAuth(roles?: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev') as { sub: string, role: Role }
      ;(req as any).userId = payload.sub
      ;(req as any).role = payload.role
      if (roles && roles.length > 0 && !roles.includes(payload.role)) {
        return res.status(403).json({ error: 'Forbidden' })
      }
      next()
    } catch {
      return res.status(401).json({ error: 'Invalid token' })
    }
  }
}
