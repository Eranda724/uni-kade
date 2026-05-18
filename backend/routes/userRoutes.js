const express = require('express')
const router = express.Router()
const {
  getActiveShops,
  getAllUsers,
  getUserById,
  updateUserProfile,
  updateSellerStatus,
  getAdminStats,
} = require('../controllers/userController')
const { protect, authorize } = require('../middleware/authMiddleware')

// Student: browse approved shops
router.get('/shops', protect, authorize('student'), getActiveShops)

// Admin: platform stats
router.get('/admin/stats', protect, authorize('admin'), getAdminStats)

// Admin: list all users (with optional ?role=seller&status=pending filters)
router.get('/', protect, authorize('admin'), getAllUsers)

// Any authenticated user: update own profile
router.patch('/profile', protect, updateUserProfile)

// Admin: change seller status (approved / rejected)
router.patch('/:id/status', protect, authorize('admin'), updateSellerStatus)

// Public: get user/shop by ID (for shop page)
router.get('/:id', getUserById)

module.exports = router
