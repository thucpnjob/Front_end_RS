import { Link } from 'react-router-dom'
import type { Book } from '../../types'
import RatingStars from './RatingStars'
import StatBadge from './StatBadge'


interface Props {
  book: Book
  rank?: number
  statType?: 'comments' | 'views' | 'likes' | 'rating'
}


export default function BookCardHorizontal({ book, rank, statType = 'rating' }: Props) {
  const statMap = {
    comments: { icon: '💬', value: book.commentCount, label: 'thảo luận' },
    views: { icon: '👁', value: book.viewCount, label: 'lượt xem' },
    likes: { icon: '❤️', value: book.likeCount, label: 'Likes' },
    rating: { icon: '★', value: book.ratingCount, label: 'đánh giá' },
  }
  const stat = statMap[statType]

  return (
    <Link to={`/books/${book.id}`} className="flex items-center gap-3 group hover:bg-navy-700 p-2 rounded-lg transition-colors">
      {rank && (
        <span className="text-slate-500 text-xs w-4 text-center font-mono">{rank}</span>
      )}
      <img
        src={book.cover}
        alt={book.title}
        className="w-10 h-14 object-cover rounded flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium line-clamp-2">{book.title}</p>
        <p className="text-slate-400 text-xs">{book.author}</p>
        <div className="flex items-center gap-3 mt-1">
          <RatingStars rating={book.rating} />
          <StatBadge icon={stat.icon} value={stat.value} label={stat.label} />
        </div>
      </div>
    </Link>
  )
}
