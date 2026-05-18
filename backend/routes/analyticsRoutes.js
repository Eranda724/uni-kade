const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/overview', analyticsController.getSalesOverview);
router.get('/over-time', analyticsController.getSalesOverTime);
router.get('/top-products', analyticsController.getTopProducts);
router.get('/user-growth', analyticsController.getUserGrowth);
router.get('/category-distribution', analyticsController.getCategoryDistribution);

module.exports = router;