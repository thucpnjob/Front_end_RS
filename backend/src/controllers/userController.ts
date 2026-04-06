import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { supabase } from '../lib/supabase'

// GET /api/users/me/profile
export async function getProfile(req: Request, res: Response) {
  const userId = req.user!.userId

  const { data: user, error } = await supabase
    .from('users')
    .select('id, name, email, role, created_at')
    .eq('id', userId)
    .single()

  if (error || !user) return res.status(404).json({ error: 'User not found' })

  // Stats
  const [{ count: favCount }, { count: historyCount }] = await Promise.all([
    supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('reading_history').select('*', { count: 'exact', head: true }).eq('user_id', userId),
  ])

  res.json({ ...user, stats: { favorites: favCount ?? 0, booksRead: historyCount ?? 0 } })
}

// PUT /api/users/me/profile
export async function updateProfile(req: Request, res: Response) {
  const userId = req.user!.userId
  const { name, currentPassword, newPassword } = req.body

  if (!name?.trim()) return res.status(400).json({ error: 'Tên không được để trống' })

  const updates: Record<string, string> = { name: name.trim() }

  // Change password if requested
  if (newPassword) {
    if (newPassword.length < 6) return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' })

    const { data: user } = await supabase
      .from('users').select('password_hash').eq('id', userId).single()

    if (!user || !bcrypt.compareSync(currentPassword, user.password_hash)) {
      return res.status(401).json({ error: 'Mật khẩu hiện tại không đúng' })
    }
    updates.password_hash = bcrypt.hashSync(newPassword, 10)
  }

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select('id, name, email, role')
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// GET /api/users/me/history
export async function getHistory(req: Request, res: Response) {
  const userId = req.user!.userId

  const { data, error } = await supabase
    .from('reading_history')
    .select('viewed_at, books(*)')
    .eq('user_id', userId)
    .order('viewed_at', { ascending: false })
    .limit(50)

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// POST /api/users/me/history/:bookId
export async function addHistory(req: Request, res: Response) {
  const userId = req.user!.userId
  const { bookId } = req.params

  const { error } = await supabase
    .from('reading_history')
    .upsert({ user_id: userId, book_id: bookId, viewed_at: new Date().toISOString() }, { onConflict: 'user_id,book_id' })

  if (error) return res.status(500).json({ error: error.message })
  res.status(204).send()
}

// DELETE /api/users/me/history/:bookId
export async function removeHistory(req: Request, res: Response) {
  const userId = req.user!.userId
  const { bookId } = req.params

  const { error } = await supabase
    .from('reading_history')
    .delete()
    .eq('user_id', userId)
    .eq('book_id', bookId)

  if (error) return res.status(500).json({ error: error.message })
  res.status(204).send()
}

// GET /api/users/me/favorites
export async function getFavorites(req: Request, res: Response) {
  const userId = req.user!.userId

  const { data, error } = await supabase
    .from('favorites')
    .select('created_at, books(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// POST /api/users/me/favorites/:bookId
export async function toggleFavorite(req: Request, res: Response) {
  const userId = req.user!.userId
  const { bookId } = req.params

  const { data: existing } = await supabase
    .from('favorites')
    .select('book_id')
    .eq('user_id', userId)
    .eq('book_id', bookId)
    .single()

  if (existing) {
    await supabase.from('favorites').delete().eq('user_id', userId).eq('book_id', bookId)
    return res.json({ favorited: false })
  }

  await supabase.from('favorites').insert({ user_id: userId, book_id: bookId })
  res.json({ favorited: true })
}
