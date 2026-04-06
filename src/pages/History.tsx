import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import type { HistoryItem } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import RatingStars from '../components/ui/RatingStars'

export default function History() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) { navigate('/login', { state: { from: '/history' } }); return }
    api.users.history()
      .then(setItems)
      .catch(() => setError('Không thể tải lịch sử'))
      .finally(() => setLoading(false))
  }, [user])

  async function remove(bookId: string) {
    await api.users.removeHistory(bookId)
    setItems((prev) => prev.filter((i) => i.books.id !== bookId))
  }

  function formatDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  if (loading) return <div className="text-slate-400 text-sm">Đang tải...</div>

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-xl font-bold">Lịch sử đọc</h1>
          <p className="text-slate-500 text-sm">{items.length} tác phẩm đã xem</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={async () => {
              for (const item of items) await api.users.removeHistory(item.books.id)
              setItems([])
            }}
            className="text-red-400 text-xs hover:underline"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {items.length === 0 && !error && (
        <div className="text-center py-16 text-slate-500">
          <p className="text-4xl mb-3">🕐</p>
          <p className="mb-2">Chưa có lịch sử đọc</p>
          <Link to="/" className="text-accent text-sm hover:underline">Khám phá sách ngay</Link>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => {
          const book = item.books
          return (
            <div key={book.id} className="flex items-center gap-4 bg-navy-800 hover:bg-navy-700 transition-colors rounded-xl p-3 group">
              <img src={book.cover} alt={book.title} className="w-10 h-14 object-cover rounded-lg flex-shrink-0" />
              <Link to={`/books/${book.id}`} className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium line-clamp-1">{book.title}</p>
                <p className="text-slate-400 text-xs">{book.author}</p>
                <div className="flex items-center gap-2 mt-1">
                  <RatingStars rating={book.rating} />
                  <span className="text-slate-600 text-xs">·</span>
                  <span className="text-slate-500 text-xs">{formatDate(item.viewed_at)}</span>
                </div>
              </Link>
              <div className="flex flex-wrap gap-1 max-w-[120px]">
                {book.genre.slice(0, 2).map((g) => (
                  <span key={g} className="text-xs bg-navy-700 text-slate-400 px-1.5 py-0.5 rounded">{g}</span>
                ))}
              </div>
              <button
                onClick={() => remove(book.id)}
                className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-lg px-1"
                title="Xóa khỏi lịch sử"
              >
                ×
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
