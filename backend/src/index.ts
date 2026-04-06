import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import booksRouter from './routes/books'
import authRouter from './routes/auth'
import usersRouter from './routes/users'
import { errorHandler, notFound } from './middleware/errorHandler'
import { logger } from './middleware/logger'
import { supabase } from './lib/supabase'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: /^http:\/\/localhost:\d+$/ }))
app.use(express.json())
app.use(logger)

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Debug endpoint — kiểm tra DB + env
app.get('/api/debug', async (_req, res) => {
  const checks: Record<string, unknown> = {
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL ? '✅ set' : '❌ missing',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ set' : '❌ missing',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ set' : '❌ missing',
    },
  }

  // Show key type hint
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  checks.key_type = key.startsWith('sb_secret_')
    ? '✅ Secret key (service_role) — new format'
    : key.startsWith('eyJ')
    ? '✅ JWT (service_role) — old format'
    : key.startsWith('sb_publishable_') || key.startsWith('b_publishable_')
    ? '❌ Publishable key — cần đổi sang sb_secret_ key'
    : '❌ Không rõ định dạng'

  try {
    const { count, error } = await supabase.from('users').select('*', { count: 'exact', head: true })
    if (error) {
      checks.db = {
        status: '❌ error',
        message: error.message || '(empty)',
        code: error.code,
        hint: error.hint,
        details: error.details,
      }
    } else {
      const { count: bookCount } = await supabase.from('books').select('*', { count: 'exact', head: true })
      checks.db = { status: '✅ connected', users: count, books: bookCount }
    }
  } catch (e) {
    checks.db = { status: '❌ exception', message: String(e) }
  }

  res.json(checks)
})

app.use('/api/auth', authRouter)
app.use('/api/books', booksRouter)
app.use('/api/users', usersRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`\n🚀 Backend: http://localhost:${PORT}`)
  console.log(`🔍 Debug:   http://localhost:${PORT}/api/debug`)
  console.log(`🔐 Auth:    POST /api/auth/login | POST /api/auth/register`)
  console.log(`📚 Books:   GET  /api/books\n`)
})
