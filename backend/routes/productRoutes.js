const express = require('express')
const router = express.Router()
const { getProducts, createProduct, updateProduct, deleteProduct, getShopProducts } = require('../controllers/productController')
const { protect, authorize } = require('../middleware/authMiddleware')

router.route('/')
  .get(protect, authorize('seller'), getProducts)
  .post(protect, authorize('seller'), createProduct)

router.route('/:id')
  .patch(protect, authorize('seller'), updateProduct)
  .delete(protect, authorize('seller'), deleteProduct)

router.route('/shop/:shopId')
  .get(protect, getShopProducts)

module.exports = router
