import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import BookDetail from './pages/BookDetail'
import Recommendations from './pages/Recommendations'
import Library from './pages/Library'
import UserSearch from './pages/UserSearch'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/library" element={<Library />} />
          <Route path="/search" element={<UserSearch />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
