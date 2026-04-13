const express = require('express')
const router = express.Router()
const { getActiveShops, updateUserProfile, getAdminStats } = require('../controllers/userController')
const { protect, authorize } = require('../middleware/authMiddleware')

router.route('/shops')
  .get(protect, authorize('student'), getActiveShops)

router.route('/profile')
  .patch(protect, updateUserProfile)

router.route('/admin/stats')
  .get(protect, authorize('admin'), getAdminStats)

module.exports = router
