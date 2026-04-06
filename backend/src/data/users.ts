import bcrypt from 'bcryptjs'

export type Role = 'user' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
  role: Role
  createdAt: string
}

const now = () => new Date().toISOString()

export const users: User[] = [
  {
    id: 'u1',
    name: 'Admin',
    email: 'admin@curation.vn',
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    createdAt: now(),
  },
  {
    id: 'u2',
    name: 'Modern Bibliophile',
    email: 'user@curation.vn',
    passwordHash: bcrypt.hashSync('user123', 10),
    role: 'user',
    createdAt: now(),
  },
]

let nextId = users.length + 1
export const getNextUserId = () => `u${nextId++}`
