import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import type { UserProfile } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Edit form
  const [name, setName] = useState('')
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [showPwdForm, setShowPwdForm] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/login', { state: { from: '/profile' } }); return }
    api.users.profile()
      .then((p) => { setProfile(p); setName(p.name) })
      .catch(() => setMsg({ type: 'err', text: 'Không thể tải profile' }))
      .finally(() => setLoading(false))
  }, [user])

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setMsg(null)
    if (showPwdForm && newPwd !== confirmPwd) {
      setMsg({ type: 'err', text: 'Mật khẩu xác nhận không khớp' }); return
    }
    setSaving(true)
    try {
      await api.users.updateProfile({
        name,
        ...(showPwdForm && newPwd ? { currentPassword: currentPwd, newPassword: newPwd } : {}),
      })
      setMsg({ type: 'ok', text: 'Cập nhật thành công!' })
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('')
      setShowPwdForm(false)
    } catch (err) {
      setMsg({ type: 'err', text: (err as Error).message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-slate-400 text-sm">Đang tải...</div>
  if (!profile) return null

  const inputCls = 'w-full bg-navy-800 border border-navy-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent placeholder-slate-600'

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-white text-xl font-bold">Thông tin cá nhân</h1>

      {/* Avatar + stats */}
      <div className="bg-navy-800 border border-navy-700 rounded-2xl p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center text-3xl font-bold text-accent flex-shrink-0">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-white text-xl font-semibold">{profile.name}</p>
          <p className="text-slate-400 text-sm">{profile.email}</p>
          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
            profile.role === 'admin'
              ? 'bg-red-600/20 text-red-400 border border-red-600/30'
              : 'bg-accent/20 text-accent border border-accent/30'
          }`}>
            {profile.role === 'admin' ? '🛡 Admin' : '👤 User'}
          </span>
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <p className="text-white text-2xl font-bold">{profile.stats.booksRead}</p>
            <p className="text-slate-500 text-xs">Đã đọc</p>
          </div>
          <div>
            <p className="text-white text-2xl font-bold">{profile.stats.favorites}</p>
            <p className="text-slate-500 text-xs">Yêu thích</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mt-1">Tham gia</p>
            <p className="text-white text-sm font-medium">
              {new Date(profile.created_at).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-navy-800 border border-navy-700 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-5">Chỉnh sửa thông tin</h2>
        <form onSubmit={handleSave} className="space-y-4">
          {msg && (
            <div className={`text-sm px-4 py-2.5 rounded-xl border ${
              msg.type === 'ok'
                ? 'bg-green-900/30 border-green-700 text-green-400'
                : 'bg-red-900/30 border-red-700 text-red-400'
            }`}>
              {msg.text}
            </div>
          )}

          <div>
            <label className="block text-slate-400 text-xs mb-1.5">Họ tên</label>
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="block text-slate-400 text-xs mb-1.5">Email</label>
            <input className={`${inputCls} opacity-50 cursor-not-allowed`} value={profile.email} disabled />
          </div>

          {/* Password toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowPwdForm(!showPwdForm)}
              className="text-accent text-sm hover:underline"
            >
              {showPwdForm ? '✕ Hủy đổi mật khẩu' : '🔑 Đổi mật khẩu'}
            </button>
          </div>

          {showPwdForm && (
            <div className="space-y-3 border-t border-navy-700 pt-4">
              <div>
                <label className="block text-slate-400 text-xs mb-1.5">Mật khẩu hiện tại</label>
                <input type="password" className={inputCls} value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1.5">Mật khẩu mới</label>
                <input type="password" className={inputCls} value={newPwd} onChange={(e) => setNewPwd(e.target.value)} placeholder="Ít nhất 6 ký tự" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1.5">Xác nhận mật khẩu mới</label>
                <input type="password" className={inputCls} value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} placeholder="••••••••" />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
            <button
              type="button"
              onClick={() => { logout(); navigate('/login') }}
              className="border border-red-700/50 text-red-400 hover:bg-red-900/20 text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
