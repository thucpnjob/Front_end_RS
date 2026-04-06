import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const navItems = [
  { to: '/', icon: '⊞', label: 'Home', end: true },
  { to: '/library', icon: '📚', label: 'Book Collection' },
  { to: '/profile', icon: '👤', label: 'Personal Information' },
  { to: '/favorites', icon: '♥', label: 'Favorites' },
  { to: '/history', icon: '🕐', label: 'History' },
  { to: '/search', icon: '🔍', label: 'User Search' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-56 bg-navy-950 flex flex-col h-screen sticky top-0 flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-navy-800">
        <div className="text-accent text-xs font-semibold tracking-widest uppercase mb-0.5">The Curation</div>
        <div className="text-slate-400 text-xs font-normal">Editorial Intelligence</div>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b border-navy-800">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-sm font-semibold text-accent flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{user.name}</p>
              <p className="text-slate-500 text-xs truncate">{user.email}</p>
            </div>
          </div>
        ) : (
          <NavLink
            to="/login"
            className="flex items-center gap-2 text-accent text-xs hover:underline"
          >
            → Đăng nhập
          </NavLink>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-navy-700 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-navy-800'
                  }`
                }
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-navy-800 space-y-0.5">
        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-red-600/20 text-red-400' : 'text-slate-400 hover:text-white hover:bg-navy-800'
              }`
            }
          >
            <span className="text-base w-5 text-center">🛡</span>
            <span>Admin Panel</span>
          </NavLink>
        )}

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive ? 'bg-navy-700 text-white' : 'text-slate-400 hover:text-white hover:bg-navy-800'
            }`
          }
        >
          <span className="text-base w-5 text-center">⚙</span>
          <span>Settings</span>
        </NavLink>

        {user ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-navy-800 transition-colors w-full text-left"
          >
            <span className="text-base w-5 text-center">↩</span>
            <span>Đăng xuất</span>
          </button>
        ) : (
          <NavLink
            to="/register"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <span className="text-base w-5 text-center">✚</span>
            <span>Đăng ký</span>
          </NavLink>
        )}
      </div>
    </aside>
  )
}
