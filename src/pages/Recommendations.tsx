import { useState } from 'react'
import { books } from '../data/mockData'
import BookCard from '../components/ui/BookCard'

const genres = ['Tất cả', 'Hiện thực', 'Tình cảm', 'Chiến tranh', 'Cổ điển', 'Văn học đương đại', 'Trào phúng']

export default function Recommendations() {
  const [activeGenre, setActiveGenre] = useState('Tất cả')

  const filtered =
    activeGenre === 'Tất cả'
      ? books
      : books.filter((b) => b.genre.includes(activeGenre))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-white text-xl font-bold mb-1">Gợi ý dành cho bạn</h1>
        <p className="text-slate-400 text-sm">Dựa trên sở thích và lịch sử đọc của bạn</p>
      </div>

      {/* Genre filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setActiveGenre(g)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              activeGenre === g
                ? 'bg-accent border-accent text-white'
                : 'border-navy-700 text-slate-400 hover:text-white hover:border-slate-500'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Book grid */}
      <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-slate-400 text-center py-12">Không có sách trong thể loại này.</p>
      )}
    </div>
  )
}
