import { NavLink, useNavigate } from 'react-router-dom'
import { currentUser } from '../../data/mockData'

const navItems = [
  { to: '/', icon: '⊞', label: 'Home', end: true },
  { to: '/library', icon: '📚', label: 'Book Collection' },
  { to: '/profile', icon: '👤', label: 'Personal Information' },
  { to: '/favorites', icon: '♥', label: 'Favorites' },
  { to: '/history', icon: '🕐', label: 'History' },
  { to: '/search', icon: '🔍', label: 'User Search' },
]

const bottomItems = [
  { to: '/add', icon: '➕', label: 'Add New Volume' },
  { to: '/settings', icon: '⚙', label: 'Settings' },
]

export default function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="w-56 bg-navy-950 flex flex-col h-screen sticky top-0 flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-navy-800">
        <div className="text-white font-bold text-sm leading-tight">
          <div className="text-accent text-xs font-semibold tracking-widest uppercase mb-0.5">The Curation</div>
          <div className="text-slate-400 text-xs font-normal">Editorial Intelligence</div>
        </div>
      </div>

      {/* User */}
      <div className="px-5 py-4 border-b border-navy-800">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="text-white text-xs font-medium">{currentUser.name}</p>
            <p className="text-slate-500 text-xs">@{currentUser.username}</p>
          </div>
        </div>
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
        {bottomItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-navy-700 text-white' : 'text-slate-400 hover:text-white hover:bg-navy-800'
              }`
            }
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-navy-800 transition-colors w-full text-left"
        >
          <span className="text-base w-5 text-center">↩</span>
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}
