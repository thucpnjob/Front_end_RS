import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import type { BookAPI } from '../lib/api';
import { matchSearch } from '../lib/normalize';
import { recommendationAPI } from '../lib/recommendationService';
import BookCard from '../components/ui/BookCard';

export default function UserSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [allBooks, setAllBooks] = useState<BookAPI[]>([]);
  const [loading, setLoading] = useState(true);

  // Phần gợi ý từ model Python
  const [recommendations, setRecommendations] = useState<BookAPI[]>([]);
  const [recLoading, setRecLoading] = useState(true);

  const { user } = useAuth();

  // Load tất cả sách để search
  useEffect(() => {
    api.books.list({ limit: '200' })
        .then((res) => setAllBooks(res.data))
        .catch(() => {})
        .finally(() => setLoading(false));
  }, []);

  // Sync URL
  useEffect(() => {
    if (query) setSearchParams({ q: query }, { replace: true });
    else setSearchParams({}, { replace: true });
  }, [query]);

  // Kết quả tìm kiếm
  const results = query
      ? allBooks.filter(
          (b) => matchSearch(b.title, query) || matchSearch(b.author, query)
      )
      : [];

  // Lấy gợi ý từ model FM - SỬ DỤNG USER ID THẬT
  useEffect(() => {
    const fetchRecs = async () => {
      if (allBooks.length === 0) return;
      setRecLoading(true);

      try {
        // Ép kiểu về number - Đây là fix chính cho lỗi 422
        let userId = 1; // fallback
        if (user?.id) {
          userId = typeof user.id === 'string' ? parseInt(user.id, 10) : Number(user.id);
        }

        console.log(`📌 Gọi recommendation cho userId = ${userId} (kiểu: ${typeof userId})`);

        const bookIds = await recommendationAPI.getRecommendations(userId, 15);

        const recBooks = allBooks.filter((book) =>
            bookIds.includes(Number(book.id))
        );

        setRecommendations(recBooks.length > 0 ? recBooks : allBooks.slice(0, 12));
      } catch (err) {
        console.error('Lỗi gọi recommendation API:', err);
        setRecommendations(allBooks.slice(0, 12));
      } finally {
        setRecLoading(false);
      }
    };

    fetchRecs();
  }, [allBooks, user]);   // Quan trọng: thêm user vào dependency

  return (
      <div>
        <h1 className="text-white text-xl font-bold mb-6">Tìm kiếm</h1>

        {/* Ô tìm kiếm */}
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

        {/* Kết quả tìm kiếm */}
        {loading && <div className="text-slate-500 text-sm">Đang tải...</div>}

        {!loading && query && (
            <div className="mb-12">
              <p className="text-slate-400 text-sm mb-4">
                {results.length > 0
                    ? (
                        <>
                          <span className="text-white font-medium">{results.length}</span> kết quả cho "
                          <span className="text-accent">{query}</span>"
                        </>
                    )
                    : (
                        <>Không tìm thấy kết quả cho "<span className="text-accent">{query}</span>"</>
                    )}
              </p>
              <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {results.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
              </div>
            </div>
        )}

        {/* Gợi ý từ Model FM */}
        <div>
          <h2 className="text-white text-xl font-bold mb-1 flex items-center gap-2">
            Gợi ý dành cho bạn
            <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">Model FM</span>
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Dựa trên mô hình Factorization Machine đã train
          </p>

          {recLoading ? (
              <div className="text-center py-12 text-slate-400">Đang lấy gợi ý sách...</div>
          ) : (
              <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {recommendations.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
              </div>
          )}
        </div>
      </div>
  );
}