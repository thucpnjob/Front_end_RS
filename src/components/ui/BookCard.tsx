import { Link } from 'react-router-dom'
import type { Book } from '../../types'
import RatingStars from './RatingStars'

interface Props {
  book: Book
  showStats?: boolean
}

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

export default function BookCard({ book, showStats = true }: Props) {
  return (
    <Link to={`/books/${book.id}`} className="group block">
      <div className="bg-navy-800 rounded-lg overflow-hidden hover:bg-navy-700 transition-colors">
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-3">
          <p className="text-white text-sm font-medium line-clamp-2 mb-1">{book.title}</p>
          <p className="text-slate-400 text-xs mb-2">{book.author}</p>
          <div className="flex items-center justify-between">
            <RatingStars rating={book.rating} />
            {showStats && (
              <span className="text-slate-500 text-xs">
                {formatNumber(book.ratingCount)} đánh giá
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
