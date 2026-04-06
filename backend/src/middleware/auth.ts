import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { Role } from '../data/users'

export const JWT_SECRET = process.env.JWT_SECRET || 'curation-secret-key-2024'

export interface JwtPayload {
  userId: string
  email: string
  role: Role
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token không hợp lệ' })
  }
  const token = header.slice(7)
  try {
    req.user = jwt.verify(token, JWT_SECRET) as JwtPayload
    next()
  } catch {
    res.status(401).json({ error: 'Token hết hạn hoặc không hợp lệ' })
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  authenticate(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Chỉ admin mới có quyền truy cập' })
    }
    next()
  })
}
