export interface Book {
  id: string
  title: string
  author: string
  cover: string
  rating: number
  ratingCount: number
  commentCount: number
  viewCount: number
  likeCount: number
  genre: string[]
  description: string
  publishYear: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

const now = () => new Date().toISOString()
const cover = (id: number) => `https://picsum.photos/seed/book${id}/200/300`

export const db: Book[] = [
  {
    id: '1', title: 'Nỗi Buồn Chiến Tranh', author: 'Bảo Ninh',
    cover: cover(1), rating: 4.9, ratingCount: 3200, commentCount: 1420,
    viewCount: 15200, likeCount: 6800, genre: ['Chiến tranh', 'Văn học hiện đại'],
    description: 'Một kiệt tác của văn học Việt Nam hiện đại, kể về thân phận con người và những vết sẹo tâm hồn sau cuộc chiến.',
    publishYear: 1987, featured: true, createdAt: now(), updatedAt: now(),
  },
  {
    id: '2', title: 'Cho Tôi Xin Một Vé Đi Tuổi Thơ', author: 'Nguyễn Nhật Ánh',
    cover: cover(2), rating: 5.0, ratingCount: 2400, commentCount: 856,
    viewCount: 12500, likeCount: 5200, genre: ['Tình cảm', 'Học đường'],
    description: 'Cuốn sách dẫn người đọc trở về những năm tháng tuổi thơ hồn nhiên, vô lo.',
    publishYear: 2008, featured: false, createdAt: now(), updatedAt: now(),
  },
  {
    id: '3', title: 'Số Đỏ', author: 'Vũ Trọng Phụng',
    cover: cover(3), rating: 4.7, ratingCount: 1950, commentCount: 742,
    viewCount: 11200, likeCount: 4600, genre: ['Trào phúng', 'Hiện thực'],
    description: 'Tiểu thuyết trào phúng kinh điển phản ánh xã hội thực dân phong kiến Việt Nam đầu thế kỷ XX.',
    publishYear: 1936, featured: false, createdAt: now(), updatedAt: now(),
  },
  {
    id: '4', title: 'Đất Rừng Phương Nam', author: 'Đoàn Giỏi',
    cover: cover(4), rating: 4.8, ratingCount: 1800, commentCount: 642,
    viewCount: 10800, likeCount: 4200, genre: ['Phiêu lưu', 'Lịch sử'],
    description: 'Hành trình của cậu bé An trên vùng đất phương Nam hoang dã và trù phú.',
    publishYear: 1957, featured: false, createdAt: now(), updatedAt: now(),
  },
  {
    id: '5', title: 'Tắt Đèn', author: 'Ngô Tất Tố',
    cover: cover(5), rating: 4.6, ratingCount: 1650, commentCount: 580,
    viewCount: 9800, likeCount: 3800, genre: ['Hiện thực', 'Xã hội'],
    description: 'Câu chuyện về người phụ nữ nông dân Chị Dậu trong xã hội phong kiến.',
    publishYear: 1939, featured: false, createdAt: now(), updatedAt: now(),
  },
  {
    id: '6', title: 'Mắt Biếc', author: 'Nguyễn Nhật Ánh',
    cover: cover(10), rating: 4.8, ratingCount: 3600, commentCount: 1560,
    viewCount: 18200, likeCount: 5200, genre: ['Tình cảm', 'Học đường'],
    description: 'Câu chuyện tình yêu đơn phương của Ngạn dành cho Hà Lan có đôi mắt biếc đẹp như mơ.',
    publishYear: 1990, featured: false, createdAt: now(), updatedAt: now(),
  },
  {
    id: '7', title: 'Cánh Đồng Bất Tận', author: 'Nguyễn Ngọc Tư',
    cover: cover(11), rating: 4.6, ratingCount: 2100, commentCount: 890,
    viewCount: 13400, likeCount: 4800, genre: ['Văn học đương đại', 'Hiện thực'],
    description: 'Truyện ngắn về cuộc sống trên những cánh đồng miền Tây Nam Bộ.',
    publishYear: 2005, featured: false, createdAt: now(), updatedAt: now(),
  },
  {
    id: '8', title: 'Chí Phèo', author: 'Nam Cao',
    cover: cover(14), rating: 4.8, ratingCount: 3200, commentCount: 1380,
    viewCount: 16800, likeCount: 6200, genre: ['Hiện thực', 'Xã hội'],
    description: 'Kiệt tác về Chí Phèo - người nông dân bị xã hội đẩy vào con đường lưu manh hóa.',
    publishYear: 1941, featured: false, createdAt: now(), updatedAt: now(),
  },
]

let nextId = db.length + 1
export const getNextId = () => String(nextId++)
