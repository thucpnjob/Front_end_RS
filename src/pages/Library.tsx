import { useState } from 'react'
import { libraryBooks } from '../data/mockData'
import BookCard from '../components/ui/BookCard'

const categories = ['Bộ sưu tập', 'Đang đọc', 'Đã đọc', 'Muốn đọc']

export default function Library() {
  const [active, setActive] = useState('Bộ sưu tập')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-xl font-bold mb-1">Thư viện của tôi</h1>
          <p className="text-slate-400 text-sm">{libraryBooks.length} tác phẩm</p>
        </div>
        <button className="bg-accent hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition-colors">
          + Thêm sách
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
              active === cat
                ? 'bg-accent border-accent text-white'
                : 'border-navy-700 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Books grid */}
      <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {libraryBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}
