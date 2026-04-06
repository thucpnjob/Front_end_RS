import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import {
  getProfile, updateProfile,
  getHistory, addHistory, removeHistory,
  getFavorites, toggleFavorite,
} from '../controllers/userController'

const router = Router()

router.use(authenticate) // tất cả routes đều cần đăng nhập

router.get('/me/profile', getProfile)
router.put('/me/profile', updateProfile)

router.get('/me/history', getHistory)
router.post('/me/history/:bookId', addHistory)
router.delete('/me/history/:bookId', removeHistory)

router.get('/me/favorites', getFavorites)
router.post('/me/favorites/:bookId', toggleFavorite)

export default router
