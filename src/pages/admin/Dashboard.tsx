import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import type { Stats } from '../../lib/api'

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.books.stats()
      .then(setStats)
      .catch(() => setError('Không thể kết nối tới backend (localhost:3001)'))
  }, [])

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700 text-red-400 rounded-xl p-6">
        <p className="font-medium mb-1">⚠ Lỗi kết nối</p>
        <p className="text-sm">{error}</p>
        <p className="text-xs mt-2 text-gray-500">Chạy: <code className="bg-gray-800 px-1 rounded">cd backend && npm run dev</code></p>
      </div>
    )
  }

  if (!stats) {
    return <div className="text-gray-400 text-sm">Đang tải...</div>
  }

  const statCards = [
    { label: 'Tổng sách', value: stats.total, icon: '📚', color: 'blue' },
    { label: 'Nổi bật', value: stats.featured, icon: '⭐', color: 'yellow' },
    { label: 'Đánh giá TB', value: stats.avgRating.toFixed(2), icon: '★', color: 'gold' },
    { label: 'Tổng lượt xem', value: (stats.totalViews / 1000).toFixed(1) + 'k', icon: '👁', color: 'green' },
    { label: 'Tổng lượt thích', value: (stats.totalLikes / 1000).toFixed(1) + 'k', icon: '❤️', color: 'red' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-white text-lg font-semibold mb-1">Dashboard</h2>
        <p className="text-gray-500 text-sm">Thống kê tổng quan hệ thống</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className="text-white text-xl font-bold">{card.value}</div>
            <div className="text-gray-500 text-xs mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Genre breakdown */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-medium mb-4">Phân bố thể loại</h3>
        <div className="space-y-2">
          {Object.entries(stats.genreCount)
            .sort(([, a], [, b]) => b - a)
            .map(([genre, count]) => {
              const max = Math.max(...Object.values(stats.genreCount))
              const pct = Math.round((count / max) * 100)
              return (
                <div key={genre} className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm w-36 truncate">{genre}</span>
                  <div className="flex-1 bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-gray-500 text-xs w-4 text-right">{count}</span>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
