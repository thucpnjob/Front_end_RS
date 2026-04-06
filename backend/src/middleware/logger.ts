import { Request, Response, NextFunction } from 'express'

export function logger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()
  res.on('finish', () => {
    const ms = Date.now() - start
    const status = res.statusCode
    const color = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : '\x1b[32m'
    console.log(`${color}${req.method}\x1b[0m ${req.path} → ${color}${status}\x1b[0m (${ms}ms)`)
    if (status >= 400 && req.body && Object.keys(req.body).length) {
      const safe = { ...req.body }
      if (safe.password) safe.password = '***'
      if (safe.password_hash) safe.password_hash = '***'
      console.log('  body:', JSON.stringify(safe))
    }
  })
  next()
}
