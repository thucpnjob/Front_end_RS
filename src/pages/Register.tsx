import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full bg-navy-800 border border-navy-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent placeholder-slate-600'

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-accent text-xs font-semibold tracking-widest uppercase mb-1">The Curation</div>
          <div className="text-white text-2xl font-bold">Tạo tài khoản</div>
          <div className="text-slate-500 text-sm mt-1">Tham gia cộng đồng đọc sách</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-navy-800 rounded-2xl p-6 space-y-4 border border-navy-700">
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-400 text-sm px-3 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-slate-400 text-xs mb-1.5">Họ tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A"
              required
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs mb-1.5">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ít nhất 6 ký tự"
              required
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs mb-1.5">Xác nhận mật khẩu</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              required
              className={inputCls}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-blue-600 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors mt-2"
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-5">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-accent hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}
