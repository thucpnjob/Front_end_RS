import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { books } from '../data/mockData'
import BookCard from '../components/ui/BookCard'

export default function UserSearch() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [query, setQuery] = useState(q)

  const results = query
    ? books.filter(
        (b) =>
          b.title.toLowerCase().includes(query.toLowerCase()) ||
          b.author.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <div>
      <h1 className="text-white text-xl font-bold mb-6">Tìm kiếm</h1>

      <div className="relative max-w-lg mb-8">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm tác phẩm, tác giả..."
          className="w-full bg-navy-800 text-white text-sm rounded-lg pl-9 pr-4 py-3 border border-navy-700 focus:outline-none focus:border-accent placeholder-slate-500"
        />
      </div>

      {query && (
        <div>
          <p className="text-slate-400 text-sm mb-4">
            {results.length > 0 ? `${results.length} kết quả cho "${query}"` : `Không tìm thấy kết quả cho "${query}"`}
          </p>
          <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}

      {!query && (
        <div className="text-center py-12 text-slate-500">
          <p className="text-4xl mb-3">📚</p>
          <p>Nhập tên sách hoặc tác giả để tìm kiếm</p>
        </div>
      )}
    </div>
  )
}
