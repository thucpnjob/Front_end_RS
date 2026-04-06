import { useState } from 'react'
import type { BookAPI } from '../../lib/api'

type FormData = Omit<BookAPI, 'id' | 'createdAt' | 'updatedAt'>

interface Props {
  initial?: Partial<FormData>
  onSubmit: (data: FormData) => Promise<void>
  onCancel: () => void
  loading: boolean
}

const defaultForm: FormData = {
  title: '', author: '', cover: '', description: '',
  rating: 0, ratingCount: 0, commentCount: 0, viewCount: 0, likeCount: 0,
  genre: [], publishYear: new Date().getFullYear(), featured: false,
}

export default function BookForm({ initial, onSubmit, onCancel, loading }: Props) {
  const [form, setForm] = useState<FormData>({ ...defaultForm, ...initial })
  const [genreInput, setGenreInput] = useState((initial?.genre || []).join(', '))
  const [error, setError] = useState('')

  function set(key: keyof FormData, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.author.trim()) {
      setError('Tên sách và tác giả là bắt buộc')
      return
    }
    const genres = genreInput.split(',').map((g) => g.trim()).filter(Boolean)
    try {
      await onSubmit({ ...form, genre: genres })
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const inputCls = 'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 placeholder-gray-600'
  const labelCls = 'block text-gray-400 text-xs mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 text-sm px-3 py-2 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Tên sách *</label>
          <input className={inputCls} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Nhập tên sách" />
        </div>
        <div>
          <label className={labelCls}>Tác giả *</label>
          <input className={inputCls} value={form.author} onChange={(e) => set('author', e.target.value)} placeholder="Nhập tên tác giả" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Năm xuất bản</label>
          <input type="number" className={inputCls} value={form.publishYear} onChange={(e) => set('publishYear', Number(e.target.value))} />
        </div>
        <div>
          <label className={labelCls}>Thể loại (phân cách bởi dấu phẩy)</label>
          <input className={inputCls} value={genreInput} onChange={(e) => setGenreInput(e.target.value)} placeholder="Hiện thực, Xã hội" />
        </div>
      </div>

      <div>
        <label className={labelCls}>URL ảnh bìa</label>
        <input className={inputCls} value={form.cover} onChange={(e) => set('cover', e.target.value)} placeholder="https://..." />
      </div>

      <div>
        <label className={labelCls}>Mô tả</label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={3}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Tóm tắt nội dung sách..."
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        {(['rating', 'ratingCount', 'viewCount', 'likeCount'] as const).map((key) => (
          <div key={key}>
            <label className={labelCls}>{key === 'rating' ? 'Điểm (0-5)' : key === 'ratingCount' ? 'Số đánh giá' : key === 'viewCount' ? 'Lượt xem' : 'Lượt thích'}</label>
            <input
              type="number"
              step={key === 'rating' ? '0.1' : '1'}
              min="0"
              max={key === 'rating' ? '5' : undefined}
              className={inputCls}
              value={form[key]}
              onChange={(e) => set(key, Number(e.target.value))}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={form.featured}
          onChange={(e) => set('featured', e.target.checked)}
          className="accent-blue-500"
        />
        <label htmlFor="featured" className="text-gray-400 text-sm">Tác phẩm tiêu biểu (Featured)</label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          {loading ? 'Đang lưu...' : 'Lưu'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-700 text-gray-400 hover:text-white text-sm px-5 py-2 rounded-lg transition-colors"
        >
          Hủy
        </button>
      </div>
    </form>
  )
}
