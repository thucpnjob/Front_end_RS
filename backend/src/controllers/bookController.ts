import { Request, Response } from 'express'
import { supabase } from '../lib/supabase'

// GET /api/books
export async function getBooks(req: Request, res: Response) {
  const { search, genre, featured, page = '1', limit = '20' } = req.query

  let query = supabase.from('books').select('*', { count: 'exact' })

  if (search) {
    const q = String(search)
    query = query.or(`title.ilike.%${q}%,author.ilike.%${q}%`)
  }
  if (genre) {
    query = query.contains('genre', [String(genre)])
  }
  if (featured === 'true') {
    query = query.eq('featured', true)
  }

  const pageNum = parseInt(String(page))
  const limitNum = parseInt(String(limit))
  const from = (pageNum - 1) * limitNum
  query = query.range(from, from + limitNum - 1).order('created_at', { ascending: false })

  const { data, error, count } = await query
  if (error) return res.status(500).json({ error: error.message })

  res.json({
    data,
    meta: {
      total: count ?? 0,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil((count ?? 0) / limitNum),
    },
  })
}

// GET /api/books/stats
export async function getStats(_req: Request, res: Response) {
  const { data, error } = await supabase.from('books').select('*')
  if (error) return res.status(500).json({ error: error.message })

  const total = data.length
  const featured = data.filter((b) => b.featured).length
  const avgRating = total ? data.reduce((s, b) => s + Number(b.rating), 0) / total : 0
  const totalViews = data.reduce((s, b) => s + b.view_count, 0)
  const totalLikes = data.reduce((s, b) => s + b.like_count, 0)

  const genreCount: Record<string, number> = {}
  data.forEach((b) => (b.genre as string[]).forEach((g) => { genreCount[g] = (genreCount[g] || 0) + 1 }))

  res.json({ total, featured, avgRating: Number(avgRating.toFixed(2)), totalViews, totalLikes, genreCount })
}

// GET /api/books/:id
export async function getBook(req: Request, res: Response) {
  const { data, error } = await supabase.from('books').select('*').eq('id', req.params.id).single()
  if (error || !data) return res.status(404).json({ error: 'Book not found' })
  res.json(data)
}

// POST /api/books
export async function createBook(req: Request, res: Response) {
  const { title, author, cover, rating, rating_count, comment_count, view_count, like_count, genre, description, publish_year, featured } = req.body

  if (!title || !author) {
    return res.status(400).json({ error: 'title và author là bắt buộc' })
  }

  const { data, error } = await supabase.from('books').insert({
    title,
    author,
    cover: cover || '',
    rating: Number(rating) || 0,
    rating_count: Number(rating_count) || 0,
    comment_count: Number(comment_count) || 0,
    view_count: Number(view_count) || 0,
    like_count: Number(like_count) || 0,
    genre: Array.isArray(genre) ? genre : genre ? [genre] : [],
    description: description || '',
    publish_year: Number(publish_year) || new Date().getFullYear(),
    featured: Boolean(featured),
  }).select().single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
}

// PUT /api/books/:id
export async function updateBook(req: Request, res: Response) {
  const updates = { ...req.body }
  delete updates.id
  delete updates.created_at

  if (updates.genre && !Array.isArray(updates.genre)) {
    updates.genre = [updates.genre]
  }

  const { data, error } = await supabase
    .from('books')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) return res.status(error.code === 'PGRST116' ? 404 : 500).json({ error: error.message })
  res.json(data)
}

// DELETE /api/books/:id
export async function deleteBook(req: Request, res: Response) {
  const { error } = await supabase.from('books').delete().eq('id', req.params.id)
  if (error) return res.status(500).json({ error: error.message })
  res.status(204).send()
}
