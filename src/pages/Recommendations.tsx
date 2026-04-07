import { useState, useEffect } from 'react';
import { recommendationAPI } from '../lib/recommendationService';
import BookCard from '../components/ui/BookCard';
import { books } from '../data/mockData';

type Book = (typeof books)[number];

export default function Recommendations() {
    const [recommendations, setRecommendations] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecs = async () => {
            try {
                const bookIds = await recommendationAPI.getRecommendations(1, 20);

                // Sửa lỗi TypeScript: chuyển b.id sang number
                const recBooks = books.filter((b) =>
                    bookIds.includes(Number(b.id))
                );

                setRecommendations(recBooks.length > 0 ? recBooks : books.slice(0, 12));
            } catch (err) {
                console.error(err);
                setRecommendations(books.slice(0, 12));
            } finally {
                setLoading(false);
            }
        };

        fetchRecs();
    }, []);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-white text-xl font-bold mb-1">Gợi ý dành cho bạn</h1>
                <p className="text-slate-400 text-sm">Dựa trên mô hình Factorization Machine</p>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-400">Đang lấy gợi ý...</div>
            ) : (
                <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {recommendations.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            )}
        </div>
    );
}