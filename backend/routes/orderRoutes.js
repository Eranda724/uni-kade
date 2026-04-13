const express = require('express')
const router = express.Router()
const { addOrderItems, getOrders, updateOrderStatus } = require('../controllers/orderController')
const { protect, authorize } = require('../middleware/authMiddleware')

router.route('/')
  .post(protect, authorize('student'), addOrderItems)
  .get(protect, getOrders)

router.route('/:id/status')
  .patch(protect, authorize('seller'), updateOrderStatus)

module.exports = router
