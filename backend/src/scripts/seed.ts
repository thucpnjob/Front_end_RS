import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { supabase } from '../lib/supabase'

async function seed() {
  console.log('🌱 Seeding database...')

  // Test connection
  const { error: pingError } = await supabase.from('users').select('count').limit(1)
  if (pingError) {
    console.error('❌ Không kết nối được Supabase:', pingError.message)
    process.exit(1)
  }
  console.log('✅ Kết nối Supabase OK')

  // Seed users
  const users = [
    { name: 'Admin', email: 'admin@curation.vn', password: 'admin123', role: 'admin' },
    { name: 'Modern Bibliophile', email: 'user@curation.vn', password: 'user123', role: 'user' },
  ]

  for (const u of users) {
    const password_hash = bcrypt.hashSync(u.password, 10)
    const { error } = await supabase
      .from('users')
      .upsert({ name: u.name, email: u.email, password_hash, role: u.role }, { onConflict: 'email' })
    if (error) console.error(`❌ User ${u.email}:`, error.message)
    else console.log(`✅ User: ${u.email} / ${u.password}`)
  }

  // Seed books
  const books = [
    { title: 'Nỗi Buồn Chiến Tranh', author: 'Bảo Ninh', cover: 'https://picsum.photos/seed/book1/200/300', rating: 4.9, rating_count: 3200, comment_count: 1420, view_count: 15200, like_count: 6800, genre: ['Chiến tranh', 'Văn học hiện đại'], description: 'Một kiệt tác của văn học Việt Nam hiện đại.', publish_year: 1987, featured: true },
    { title: 'Cho Tôi Xin Một Vé Đi Tuổi Thơ', author: 'Nguyễn Nhật Ánh', cover: 'https://picsum.photos/seed/book2/200/300', rating: 5.0, rating_count: 2400, comment_count: 856, view_count: 12500, like_count: 5200, genre: ['Tình cảm', 'Học đường'], description: 'Cuốn sách dẫn người đọc trở về tuổi thơ hồn nhiên.', publish_year: 2008, featured: false },
    { title: 'Số Đỏ', author: 'Vũ Trọng Phụng', cover: 'https://picsum.photos/seed/book3/200/300', rating: 4.7, rating_count: 1950, comment_count: 742, view_count: 11200, like_count: 4600, genre: ['Trào phúng', 'Hiện thực'], description: 'Tiểu thuyết trào phúng kinh điển.', publish_year: 1936, featured: false },
    { title: 'Đất Rừng Phương Nam', author: 'Đoàn Giỏi', cover: 'https://picsum.photos/seed/book4/200/300', rating: 4.8, rating_count: 1800, comment_count: 642, view_count: 10800, like_count: 4200, genre: ['Phiêu lưu', 'Lịch sử'], description: 'Hành trình của cậu bé An trên vùng đất phương Nam.', publish_year: 1957, featured: false },
    { title: 'Mắt Biếc', author: 'Nguyễn Nhật Ánh', cover: 'https://picsum.photos/seed/book10/200/300', rating: 4.8, rating_count: 3600, comment_count: 1560, view_count: 18200, like_count: 5200, genre: ['Tình cảm', 'Học đường'], description: 'Câu chuyện tình yêu đơn phương của Ngạn.', publish_year: 1990, featured: false },
    { title: 'Chí Phèo', author: 'Nam Cao', cover: 'https://picsum.photos/seed/book14/200/300', rating: 4.8, rating_count: 3200, comment_count: 1380, view_count: 16800, like_count: 6200, genre: ['Hiện thực', 'Xã hội'], description: 'Kiệt tác về người nông dân bị lưu manh hóa.', publish_year: 1941, featured: false },
    { title: 'Tắt Đèn', author: 'Ngô Tất Tố', cover: 'https://picsum.photos/seed/book5/200/300', rating: 4.6, rating_count: 1650, comment_count: 580, view_count: 9800, like_count: 3800, genre: ['Hiện thực', 'Xã hội'], description: 'Câu chuyện về Chị Dậu trong xã hội phong kiến.', publish_year: 1939, featured: false },
    { title: 'Cánh Đồng Bất Tận', author: 'Nguyễn Ngọc Tư', cover: 'https://picsum.photos/seed/book11/200/300', rating: 4.6, rating_count: 2100, comment_count: 890, view_count: 13400, like_count: 4800, genre: ['Văn học đương đại', 'Hiện thực'], description: 'Truyện ngắn về cuộc sống trên cánh đồng miền Tây.', publish_year: 2005, featured: false },
  ]

  const { error: booksError } = await supabase.from('books').upsert(books, { onConflict: 'title' }).select()
  if (booksError) console.error('❌ Books:', booksError.message)
  else console.log(`✅ ${books.length} books seeded`)

  console.log('\n🎉 Seed hoàn tất!')
  console.log('   admin@curation.vn / admin123')
  console.log('   user@curation.vn  / user123')
}

seed().catch(console.error)
