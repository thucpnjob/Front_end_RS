import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'
import type { BookAPI } from '../lib/api'
import { matchSearch } from '../lib/normalize'
import BookCard from '../components/ui/BookCard'

export default function UserSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [allBooks, setAllBooks] = useState<BookAPI[]>([])
  const [loading, setLoading] = useState(true)

  // Load toàn bộ sách 1 lần, filter client-side để search realtime
  useEffect(() => {
    api.books.list({ limit: '200' })
      .then((res) => setAllBooks(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Sync URL khi query thay đổi
  useEffect(() => {
    if (query) setSearchParams({ q: query }, { replace: true })
    else setSearchParams({}, { replace: true })
  }, [query])

  const results = query
    ? allBooks.filter(
        (b) => matchSearch(b.title, query) || matchSearch(b.author, query)
      )
    : []

  return (
    <div>
      <h1 className="text-white text-xl font-bold mb-6">Tìm kiếm</h1>

      <div className="relative max-w-lg mb-8">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm tác phẩm, tác giả..."
          className="w-full bg-navy-800 text-white text-sm rounded-lg pl-9 pr-10 py-3 border border-navy-700 focus:outline-none focus:border-accent placeholder-slate-500"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {loading && (
        <div className="text-slate-500 text-sm">Đang tải...</div>
      )}

      {!loading && query && (
        <div>
          <p className="text-slate-400 text-sm mb-4">
            {results.length > 0
              ? <><span className="text-white font-medium">{results.length}</span> kết quả cho "<span className="text-accent">{query}</span>"</>
              : <>Không tìm thấy kết quả cho "<span className="text-accent">{query}</span>"</>
            }
          </p>
          <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}

      {!loading && !query && (
        <div className="text-center py-12 text-slate-500">
          <p className="text-4xl mb-3">📚</p>
          <p>Nhập tên sách hoặc tác giả để tìm kiếm</p>
          <p className="text-xs mt-2 text-slate-600">Không phân biệt hoa thường và dấu</p>
        </div>
      )}
    </div>
  )
}
