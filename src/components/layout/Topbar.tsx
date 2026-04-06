import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Topbar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    if (location.pathname === '/search') {
      // Đang ở trang search → cập nhật URL để trigger filter
      navigate(`/search?q=${encodeURIComponent(q)}`, { replace: true })
    } else {
      navigate(`/search?q=${encodeURIComponent(q)}`)
    }
    setQuery('')
  }

  return (
    <header className="sticky top-0 z-10 bg-navy-900 border-b border-navy-800 px-6 py-3 flex items-center gap-4">
      <form onSubmit={handleSearch} className="flex-1 max-w-lg">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm tác phẩm, tác giả..."
            className="w-full bg-navy-800 text-white text-sm rounded-lg pl-9 pr-4 py-2 border border-navy-700 focus:outline-none focus:border-accent placeholder-slate-500"
          />
        </div>
      </form>
      <div className="flex items-center gap-3 ml-auto">
        <button className="text-slate-400 hover:text-white transition-colors text-lg">🔔</button>
        <button className="text-slate-400 hover:text-white transition-colors text-lg">⚙</button>
      </div>
    </header>
  )
}
