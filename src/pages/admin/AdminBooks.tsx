import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import type { BookAPI } from '../../lib/api'
import BookForm from './BookForm'

type Modal = { mode: 'create' } | { mode: 'edit'; book: BookAPI } | null

export default function AdminBooks() {
  const [books, setBooks] = useState<BookAPI[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<Modal>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function load(q = search) {
    try {
      const params: Record<string, string> = { limit: '50' }
      if (q) params.search = q
      const res = await api.books.list(params)
      setBooks(res.data)
      setTotal(res.meta.total)
      setError('')
    } catch {
      setError('Không thể kết nối backend. Hãy chạy: cd backend && npm run dev')
    }
  }

  useEffect(() => { load() }, [])

  async function handleCreate(data: Omit<BookAPI, 'id' | 'createdAt' | 'updatedAt'>) {
    setLoading(true)
    await api.books.create(data)
    await load()
    setModal(null)
    setLoading(false)
  }

  async function handleUpdate(data: Omit<BookAPI, 'id' | 'createdAt' | 'updatedAt'>) {
    if (modal?.mode !== 'edit') return
    setLoading(true)
    await api.books.update(modal.book.id, data)
    await load()
    setModal(null)
    setLoading(false)
  }

  async function handleDelete(id: string) {
    await api.books.delete(id)
    setDeleteId(null)
    await load()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-lg font-semibold">Quản lý sách</h2>
          <p className="text-gray-500 text-sm">{total} tác phẩm</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'create' })}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Thêm sách
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); load(e.target.value) }}
          placeholder="Tìm kiếm sách..."
          className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500 placeholder-gray-600"
        />
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 text-red-400 text-sm px-4 py-3 rounded-xl">
          ⚠ {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-xs">
              <th className="text-left px-4 py-3 font-medium">Sách</th>
              <th className="text-left px-4 py-3 font-medium">Thể loại</th>
              <th className="text-center px-4 py-3 font-medium">Năm</th>
              <th className="text-center px-4 py-3 font-medium">Điểm</th>
              <th className="text-center px-4 py-3 font-medium">Lượt xem</th>
              <th className="text-center px-4 py-3 font-medium">Featured</th>
              <th className="text-center px-4 py-3 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={book.cover} alt="" className="w-8 h-11 object-cover rounded flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium line-clamp-1">{book.title}</p>
                      <p className="text-gray-500 text-xs">{book.author}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {book.genre.map((g) => (
                      <span key={g} className="bg-gray-800 text-gray-400 text-xs px-1.5 py-0.5 rounded">{g}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-gray-400">{book.publishYear}</td>
                <td className="px-4 py-3 text-center">
                  <span className="text-yellow-400 font-medium">★ {book.rating.toFixed(1)}</span>
                </td>
                <td className="px-4 py-3 text-center text-gray-400">
                  {book.viewCount >= 1000 ? (book.viewCount / 1000).toFixed(1) + 'k' : book.viewCount}
                </td>
                <td className="px-4 py-3 text-center">
                  {book.featured ? (
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full">Yes</span>
                  ) : (
                    <span className="bg-gray-800 text-gray-600 text-xs px-2 py-0.5 rounded-full">No</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setModal({ mode: 'edit', book })}
                      className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 rounded hover:bg-blue-900/30 transition-colors"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => setDeleteId(book.id)}
                      className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-red-900/30 transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {books.length === 0 && !error && (
          <div className="text-center py-12 text-gray-600">Không có sách nào.</div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-white font-semibold mb-5">
              {modal.mode === 'create' ? '+ Thêm sách mới' : `Sửa: ${modal.book.title}`}
            </h3>
            <BookForm
              initial={modal.mode === 'edit' ? modal.book : undefined}
              onSubmit={modal.mode === 'create' ? handleCreate : handleUpdate}
              onCancel={() => setModal(null)}
              loading={loading}
            />
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-semibold mb-2">Xác nhận xóa</h3>
            <p className="text-gray-400 text-sm mb-5">Bạn có chắc muốn xóa sách này không? Hành động này không thể hoàn tác.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Xóa
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="border border-gray-700 text-gray-400 hover:text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
