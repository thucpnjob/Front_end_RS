const BASE = 'http://localhost:3001/api'

export interface BookAPI {
  id: string
  title: string
  author: string
  cover: string
  rating: number
  ratingCount: number
  commentCount: number
  viewCount: number
  likeCount: number
  genre: string[]
  description: string
  publishYear: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface Stats {
  total: number
  featured: number
  avgRating: number
  totalViews: number
  totalLikes: number
  genreCount: Record<string, number>
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

function getToken() {
  return localStorage.getItem('token')
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || res.statusText)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (name: string, email: string, password: string) =>
      request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
    me: () => request<AuthUser>('/auth/me'),
  },
  books: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : ''
      return request<{ data: BookAPI[]; meta: { total: number; page: number; pages: number } }>(`/books${qs}`)
    },
    get: (id: string) => request<BookAPI>(`/books/${id}`),
    create: (data: Partial<BookAPI>) => request<BookAPI>('/books', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<BookAPI>) => request<BookAPI>(`/books/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/books/${id}`, { method: 'DELETE' }),
    stats: () => request<Stats>('/books/stats'),
  },
}
