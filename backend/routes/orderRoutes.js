const express = require('express')
const router = express.Router()
const { addOrderItems, getOrders, updateOrderStatus } = require('../controllers/orderController')
const { protect, authorize } = require('../middleware/authMiddleware')

router.route('/')
  .post(protect, authorize('student'), addOrderItems)
  .get(protect, getOrders)

// Allow both seller and admin to update order status
router.route('/:id/status')
  .patch(protect, authorize('seller', 'admin'), updateOrderStatus)

module.exports = router
