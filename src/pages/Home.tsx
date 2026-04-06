import { Link } from 'react-router-dom'
import {
  books,
  topRatedBooks,
  mostCommentedBooks,
  mostViewedBooks,
  mostLikedBooks,
} from '../data/mockData'
import BookCardHorizontal from '../components/ui/BookCardHorizontal'
import SectionHeader from '../components/ui/SectionHeader'

const featuredBook = books[0]

export default function Home() {
  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <section
        className="relative rounded-2xl overflow-hidden min-h-64"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${featuredBook.cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
          }}
        />
        <div className="relative z-10 flex items-center gap-8 p-8">
          <img
            src={featuredBook.cover}
            alt={featuredBook.title}
            className="w-36 h-52 object-cover rounded-xl shadow-2xl flex-shrink-0"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-accent/20 text-accent text-xs px-2 py-1 rounded-full font-medium">
                Tác phẩm tiêu biểu
              </span>
              <span className="text-gold text-sm font-semibold">★ {featuredBook.rating}</span>
            </div>
            <h1 className="text-white text-3xl font-bold mb-2">{featuredBook.title}</h1>
            <p className="text-slate-300 text-sm mb-1">{featuredBook.author}</p>
            <p className="text-slate-400 text-sm max-w-lg mb-6 line-clamp-3">
              {featuredBook.description}
            </p>
            <div className="flex gap-3">
              <Link
                to={`/books/${featuredBook.id}`}
                className="bg-accent hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Đọc ngay
              </Link>
              <Link
                to={`/books/${featuredBook.id}`}
                className="border border-white/30 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                Xem Chi Tiết
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated */}
      <section>
        <SectionHeader title="Đánh giá cao nhất" to="/recommendations" />
        <div className="grid grid-cols-2 gap-3">
          {topRatedBooks.slice(0, 4).map((book) => (
            <BookCardHorizontal key={book.id} book={book} statType="rating" />
          ))}
        </div>
      </section>

      {/* Most Commented */}
      <section>
        <SectionHeader title="Bình luận nhiều nhất" to="/recommendations" />
        <div className="grid grid-cols-2 gap-3">
          {mostCommentedBooks.slice(0, 4).map((book) => (
            <BookCardHorizontal key={book.id} book={book} statType="comments" />
          ))}
        </div>
      </section>

      {/* Most Viewed */}
      <section>
        <SectionHeader title="Xem nhiều nhất tuần qua" to="/recommendations" />
        <div className="space-y-1">
          {mostViewedBooks.map((book, i) => (
            <div key={book.id} className="flex items-center justify-between px-3 py-2 hover:bg-navy-800 rounded-lg transition-colors group">
              <div className="flex items-center gap-3">
                <span className="text-slate-600 text-xs font-mono w-4">{i + 1}</span>
                <Link to={`/books/${book.id}`} className="text-slate-300 text-sm group-hover:text-white transition-colors">
                  {book.title}
                </Link>
              </div>
              <span className="text-slate-500 text-xs">{(book.viewCount / 1000).toFixed(1)}k lượt xem</span>
            </div>
          ))}
        </div>
      </section>

      {/* Most Liked */}
      <section>
        <SectionHeader title="Được yêu thích nhất" to="/recommendations" />
        <div className="grid grid-cols-2 gap-4">
          {mostLikedBooks.map((book) => (
            <Link
              key={book.id}
              to={`/books/${book.id}`}
              className="flex items-center gap-3 bg-navy-800 rounded-xl p-3 hover:bg-navy-700 transition-colors group"
            >
              <img src={book.cover} alt={book.title} className="w-12 h-16 object-cover rounded-lg flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-white text-sm font-medium line-clamp-2">{book.title}</p>
                <p className="text-slate-400 text-xs mt-0.5">{book.author}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {book.genre.map((g) => (
                    <span key={g} className="text-xs bg-navy-700 text-slate-400 px-1.5 py-0.5 rounded">
                      {g}
                    </span>
                  ))}
                </div>
                <p className="text-accent text-xs mt-1">{(book.likeCount / 1000).toFixed(1)}k Likes</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
