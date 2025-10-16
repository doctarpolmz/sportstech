import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthUser {
  userId: string;
  role: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev') as any;
    (req as any).authUser = { userId: payload.sub as string, role: String(payload.role) } as AuthUser;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authUser = (req as any).authUser as AuthUser | undefined;
    if (!authUser) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.includes(authUser.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}
