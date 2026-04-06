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
  featured?: boolean
}

export interface User {
  id: string
  name: string
  username: string
  avatar: string
  favoriteGenres: string[]
}

export interface Review {
  id: string
  bookId: string
  userId: string
  userName: string
  content: string
  rating: number
  date: string
}
