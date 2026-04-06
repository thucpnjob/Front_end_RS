import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      // AuthGuard in AdminLayout will check role
      navigate('/admin')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 placeholder-gray-600'

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-red-600/20 border border-red-600/40 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            🛡
          </div>
          <div className="text-white text-xl font-bold">Admin Panel</div>
          <div className="text-gray-500 text-sm mt-1">The Curation — Quản trị viên</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-6 space-y-4 border border-gray-800">
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-400 text-sm px-3 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-400 text-xs mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@curation.vn"
              required
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs mb-1.5">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={inputCls}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors mt-2"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập Admin'}
          </button>
        </form>

        <div className="mt-4 bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-xs text-gray-600 text-center">
          admin@curation.vn / admin123
        </div>
      </div>
    </div>
  )
}
