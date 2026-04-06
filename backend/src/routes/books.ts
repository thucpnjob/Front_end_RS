import { Router } from 'express'
import { getBooks, getBook, createBook, updateBook, deleteBook, getStats } from '../controllers/bookController'
import { requireAdmin } from '../middleware/auth'

const router = Router()

// Public
router.get('/stats', getStats)
router.get('/', getBooks)
router.get('/:id', getBook)

// Admin only
router.post('/', requireAdmin, createBook)
router.put('/:id', requireAdmin, updateBook)
router.delete('/:id', requireAdmin, deleteBook)

export default router
