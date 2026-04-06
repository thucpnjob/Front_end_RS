import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import BookDetail from './pages/BookDetail'
import Recommendations from './pages/Recommendations'
import Library from './pages/Library'
import UserSearch from './pages/UserSearch'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import History from './pages/History'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import AdminBooks from './pages/admin/AdminBooks'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth pages (no layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* User routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/library" element={<Library />} />
            <Route path="/search" element={<UserSearch />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/history" element={<History />} />
          </Route>

          {/* Admin routes — AdminLayout handles auth guard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="books" element={<AdminBooks />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
