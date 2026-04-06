-- ============================================================
-- The Curation — Database Schema
-- Chạy file này trong Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- USERS
-- ============================================================
create table if not exists users (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null unique,
  password_hash text not null,
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz not null default now()
);

-- ============================================================
-- BOOKS
-- ============================================================
create table if not exists books (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  author        text not null,
  cover         text default '',
  rating        numeric(3,2) not null default 0 check (rating >= 0 and rating <= 5),
  rating_count  integer not null default 0,
  comment_count integer not null default 0,
  view_count    integer not null default 0,
  like_count    integer not null default 0,
  genre         text[] not null default '{}',
  description   text not null default '',
  publish_year  integer not null default extract(year from now())::integer,
  featured      boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger books_updated_at
  before update on books
  for each row execute function update_updated_at();

-- ============================================================
-- REVIEWS
-- ============================================================
create table if not exists reviews (
  id         uuid primary key default gen_random_uuid(),
  book_id    uuid not null references books(id) on delete cascade,
  user_id    uuid not null references users(id) on delete cascade,
  content    text not null,
  rating     integer not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  unique (book_id, user_id)   -- 1 review per user per book
);

-- ============================================================
-- FAVORITES
-- ============================================================
create table if not exists favorites (
  user_id    uuid not null references users(id) on delete cascade,
  book_id    uuid not null references books(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, book_id)
);

-- ============================================================
-- READING HISTORY
-- ============================================================
create table if not exists reading_history (
  user_id   uuid not null references users(id) on delete cascade,
  book_id   uuid not null references books(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  primary key (user_id, book_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_books_featured   on books(featured);
create index if not exists idx_books_rating      on books(rating desc);
create index if not exists idx_books_view_count  on books(view_count desc);
create index if not exists idx_books_genre       on books using gin(genre);
create index if not exists idx_reviews_book_id   on reviews(book_id);
create index if not exists idx_reviews_user_id   on reviews(user_id);
create index if not exists idx_favorites_user_id on favorites(user_id);
create index if not exists idx_history_user_id   on reading_history(user_id);
create index if not exists idx_users_email       on users(email);

-- ============================================================
-- SEED DATA
-- ============================================================
-- Chú ý: password_hash dưới đây là bcrypt của 'admin123' và 'user123'
-- Nếu muốn tạo hash mới, dùng: npm run seed (xem hướng dẫn bên dưới)


insert into books (title, author, cover, rating, rating_count, comment_count, view_count, like_count, genre, description, publish_year, featured) values
  ('Nỗi Buồn Chiến Tranh', 'Bảo Ninh', 'https://picsum.photos/seed/book1/200/300', 4.9, 3200, 1420, 15200, 6800, array['Chiến tranh','Văn học hiện đại'], 'Một kiệt tác của văn học Việt Nam hiện đại, kể về thân phận con người và những vết sẹo tâm hồn sau cuộc chiến.', 1987, true),
  ('Cho Tôi Xin Một Vé Đi Tuổi Thơ', 'Nguyễn Nhật Ánh', 'https://picsum.photos/seed/book2/200/300', 5.0, 2400, 856, 12500, 5200, array['Tình cảm','Học đường'], 'Cuốn sách dẫn người đọc trở về những năm tháng tuổi thơ hồn nhiên, vô lo.', 2008, false),
  ('Số Đỏ', 'Vũ Trọng Phụng', 'https://picsum.photos/seed/book3/200/300', 4.7, 1950, 742, 11200, 4600, array['Trào phúng','Hiện thực'], 'Tiểu thuyết trào phúng kinh điển phản ánh xã hội thực dân phong kiến Việt Nam đầu thế kỷ XX.', 1936, false),
  ('Đất Rừng Phương Nam', 'Đoàn Giỏi', 'https://picsum.photos/seed/book4/200/300', 4.8, 1800, 642, 10800, 4200, array['Phiêu lưu','Lịch sử'], 'Hành trình của cậu bé An trên vùng đất phương Nam hoang dã và trù phú.', 1957, false),
  ('Tắt Đèn', 'Ngô Tất Tố', 'https://picsum.photos/seed/book5/200/300', 4.6, 1650, 580, 9800, 3800, array['Hiện thực','Xã hội'], 'Câu chuyện về người phụ nữ nông dân Chị Dậu trong xã hội phong kiến.', 1939, false),
  ('Mắt Biếc', 'Nguyễn Nhật Ánh', 'https://picsum.photos/seed/book10/200/300', 4.8, 3600, 1560, 18200, 5200, array['Tình cảm','Học đường'], 'Câu chuyện tình yêu đơn phương của Ngạn dành cho Hà Lan có đôi mắt biếc đẹp như mơ.', 1990, false),
  ('Cánh Đồng Bất Tận', 'Nguyễn Ngọc Tư', 'https://picsum.photos/seed/book11/200/300', 4.6, 2100, 890, 13400, 4800, array['Văn học đương đại','Hiện thực'], 'Truyện ngắn về cuộc sống trên những cánh đồng miền Tây Nam Bộ.', 2005, false),
  ('Chí Phèo', 'Nam Cao', 'https://picsum.photos/seed/book14/200/300', 4.8, 3200, 1380, 16800, 6200, array['Hiện thực','Xã hội'], 'Kiệt tác về Chí Phèo - người nông dân bị xã hội đẩy vào con đường lưu manh hóa.', 1941, false),
  ('Lão Hạc', 'Nam Cao', 'https://picsum.photos/seed/book15/200/300', 4.9, 2900, 1050, 13200, 5800, array['Hiện thực','Xã hội'], 'Câu chuyện cảm động về lão Hạc và cái chết đầy bi kịch vì lòng tự trọng.', 1943, false),
  ('Truyện Kiều', 'Nguyễn Du', 'https://picsum.photos/seed/book8/200/300', 4.9, 4100, 1820, 9800, 7200, array['Thơ','Cổ điển'], 'Kiệt tác của văn học Việt Nam qua 3254 câu thơ lục bát.', 1820, false)
on conflict do nothing;
