import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { api } from '../lib/api'
import type { AuthUser } from '../lib/api'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      api.auth.me()
        .then(setUser)
        .catch(() => { localStorage.removeItem('token'); setToken(null) })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  async function login(email: string, password: string) {
    const res = await api.auth.login(email, password)
    localStorage.setItem('token', res.token)
    setToken(res.token)
    setUser(res.user)
  }

  async function register(name: string, email: string, password: string) {
    const res = await api.auth.register(name, email, password)
    localStorage.setItem('token', res.token)
    setToken(res.token)
    setUser(res.user)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
