import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { books, reviews, recommendedBooks } from '../data/mockData'
import BookCard from '../components/ui/BookCard'

export default function BookDetail() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<'review' | 'comments' | 'related'>('review')

  const book = books.find((b) => b.id === id)
  if (!book) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Không tìm thấy sách.</p>
        <Link to="/" className="text-accent hover:underline mt-2 inline-block">Về trang chủ</Link>
      </div>
    )
  }

  const bookReviews = reviews.filter((r) => r.bookId === id)
  const related = recommendedBooks.filter((b) => b.id !== id && b.genre.some((g) => book.genre.includes(g))).slice(0, 4)

  const tabs = [
    { key: 'review', label: 'Nhận ký Phê bình' },
    { key: 'comments', label: 'Bình luận' },
    { key: 'related', label: 'Liên quan' },
  ] as const

  return (
    <div className="max-w-4xl">
      {/* Book info */}
      <div className="flex gap-8 mb-8">
        <img
          src={book.cover}
          alt={book.title}
          className="w-44 h-64 object-cover rounded-xl shadow-2xl flex-shrink-0"
        />
        <div className="flex-1">
          <div className="flex flex-wrap gap-1 mb-3">
            {book.genre.map((g) => (
              <span key={g} className="text-xs bg-navy-700 text-slate-400 px-2 py-1 rounded-full">
                {g}
              </span>
            ))}
          </div>
          <h1 className="text-white text-2xl font-bold mb-1">{book.title}</h1>
          <p className="text-slate-400 mb-4">{book.author} · {book.publishYear}</p>

          <div className="flex items-center gap-6 mb-4">
            <div className="text-center">
              <div className="text-gold text-2xl font-bold">{book.rating.toFixed(1)}</div>
              <div className="text-slate-500 text-xs">Điểm đánh giá</div>
            </div>
            <div className="text-center">
              <div className="text-white text-xl font-bold">{(book.ratingCount / 1000).toFixed(1)}k</div>
              <div className="text-slate-500 text-xs">Đánh giá</div>
            </div>
            <div className="text-center">
              <div className="text-white text-xl font-bold">{(book.commentCount / 1000).toFixed(1)}k</div>
              <div className="text-slate-500 text-xs">Bình luận</div>
            </div>
            <div className="text-center">
              <div className="text-white text-xl font-bold">{(book.viewCount / 1000).toFixed(1)}k</div>
              <div className="text-slate-500 text-xs">Lượt xem</div>
            </div>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed mb-5">{book.description}</p>

          <div className="flex gap-3">
            <button className="bg-accent hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
              Đọc ngay
            </button>
            <button className="border border-navy-600 text-slate-300 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-navy-700 transition-colors">
              ♥ Yêu thích
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-navy-700 mb-6">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-accent text-accent'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'review' && (
        <div className="prose-sm text-slate-300 space-y-4">
          <p>
            <strong className="text-white">Nhận ký phê bình:</strong> {book.title} là một tác phẩm
            xuất sắc trong nền văn học Việt Nam. Tác giả {book.author} đã khéo léo kết hợp giữa bút
            pháp hiện thực và lãng mạn để tạo nên một câu chuyện đầy cảm xúc.
          </p>
          <p>
            Tác phẩm được xuất bản năm {book.publishYear}, đã trở thành một trong những cuốn sách
            được yêu thích nhất của độc giả Việt Nam qua nhiều thế hệ. Giá trị nhân văn sâu sắc
            và văn phong tinh tế là những điểm nổi bật của tác phẩm.
          </p>
          <p>
            Với {(book.ratingCount / 1000).toFixed(1)}k lượt đánh giá và điểm số {book.rating}/5,
            đây là minh chứng rõ ràng cho sức hút của tác phẩm đối với cộng đồng độc giả.
          </p>
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="space-y-4">
          {bookReviews.length > 0 ? (
            bookReviews.map((review) => (
              <div key={review.id} className="bg-navy-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">{review.userName}</span>
                  <span className="text-gold text-xs">{'★'.repeat(review.rating)}</span>
                </div>
                <p className="text-slate-300 text-sm">{review.content}</p>
                <p className="text-slate-500 text-xs mt-2">{review.date}</p>
              </div>
            ))
          ) : (
            <p className="text-slate-400 text-sm">Chưa có bình luận nào.</p>
          )}
        </div>
      )}

      {activeTab === 'related' && (
        <div className="grid grid-cols-4 gap-4">
          {related.length > 0 ? (
            related.map((b) => <BookCard key={b.id} book={b} />)
          ) : (
            <p className="text-slate-400 text-sm col-span-4">Không có sách liên quan.</p>
          )}
        </div>
      )}
    </div>
  )
}
