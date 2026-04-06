import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '../lib/supabase'
import { JWT_SECRET } from '../middleware/auth'

function makeToken(userId: string, email: string, role: string) {
  return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: '7d' })
}

// POST /api/auth/register
export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' })
  }

  // Check email exists
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (existing) return res.status(409).json({ error: 'Email đã được sử dụng' })

  const passwordHash = bcrypt.hashSync(password, 10)

  const { data: user, error } = await supabase
    .from('users')
    .insert({ name, email, password_hash: passwordHash, role: 'user' })
    .select('id, name, email, role')
    .single()

  if (error) return res.status(500).json({ error: error.message })

  const token = makeToken(user.id, user.email, user.role)
  res.status(201).json({ token, user })
}

// POST /api/auth/login
export async function login(req: Request, res: Response) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập email và mật khẩu' })
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('id, name, email, role, password_hash')
    .eq('email', email)
    .single()

  if (error || !user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' })
  }

  const token = makeToken(user.id, user.email, user.role)
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  })
}

// GET /api/auth/me
export async function me(req: Request, res: Response) {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, name, email, role')
    .eq('id', req.user?.userId)
    .single()

  if (error || !user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
}
