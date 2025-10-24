import type { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'

export type AuthPayload = { sub: string; role: string }

export function getAuth(req: VercelRequest): AuthPayload | null {
  const header = (req.headers['authorization'] || req.headers['Authorization']) as string | undefined
  const token = header && header.startsWith('Bearer ') ? header.slice(7) : undefined
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'dev') as AuthPayload
  } catch {
    return null
  }
}

export function requireAuth(req: VercelRequest, res: VercelResponse, roles?: string[]): AuthPayload | null {
  const payload = getAuth(req)
  if (!payload) {
    res.status(401).json({ error: 'Unauthorized' })
    return null
  }
  if (roles && roles.length && !roles.includes(payload.role)) {
    res.status(403).json({ error: 'Forbidden' })
    return null
  }
  return payload
}
