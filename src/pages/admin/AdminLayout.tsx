import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const adminNav = [
  { to: '/admin', label: '📊 Dashboard', end: true },
  { to: '/admin/books', label: '📚 Quản lý sách' },
]

export default function AdminLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <span className="text-gray-500 text-sm">Đang tải...</span>
      </div>
    )
  }

  // Not logged in → admin login page
  if (!user) return <Navigate to="/admin/login" replace />

  // Logged in but not admin → back to home
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg font-semibold mb-2">⛔ Không có quyền truy cập</p>
          <p className="text-gray-500 text-sm mb-4">Tài khoản của bạn không có quyền admin.</p>
          <NavLink to="/" className="text-accent text-sm hover:underline">← Về trang chủ</NavLink>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Admin Sidebar */}
      <aside className="w-52 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-800">
          <div className="text-white font-bold text-sm">The Curation</div>
          <div className="text-red-400 text-xs mt-0.5">Admin Panel</div>
        </div>

        {/* Admin user info */}
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-red-600/30 border border-red-600/40 flex items-center justify-center text-xs text-red-400">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-white text-xs font-medium">{user.name}</p>
              <p className="text-gray-600 text-xs">{user.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-red-600/20 text-red-400 border border-red-600/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800 space-y-1">
          <NavLink
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            ← Về trang chủ
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-gray-950">
        <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
          <h1 className="text-white font-semibold text-sm">Quản trị hệ thống</h1>
          <span className="text-gray-500 text-xs">API: localhost:3001</span>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
