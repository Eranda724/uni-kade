const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getSalesOverview = async (req, res) => {
  try {
    // Total sales (sum of order totals)
    const totalSalesResult = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: '$total' } } }
    ]);
    const totalSales = totalSalesResult.length > 0 ? totalSalesResult[0].totalSales : 0;

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Average order value
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Sales by status
    const salesByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$total' } } }
    ]);

    res.json({
      totalSales,
      totalOrders,
      avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
      salesByStatus
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSalesOverTime = async (req, res) => {
  try {
    const { period } = req.query; // e.g., 'daily', 'weekly', 'monthly'
    let groupFormat;
    switch (period) {
      case 'daily':
        groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
        break;
      case 'weekly':
        groupFormat = { $dateToString: { format: '%Y-%W', date: '$createdAt' } };
        break;
      case 'monthly':
        groupFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
        break;
      default:
        groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    }

    const salesOverTime = await Order.aggregate([
      {
        $group: {
          _id: groupFormat,
          totalSales: { $sum: '$total' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(salesOverTime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTopProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.qty' },
          revenue: { $sum: { $multiply: ['$items.qty', '$items.price'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          name: '$productInfo.name',
          totalSold: 1,
          revenue: 1
        }
      }
    ]);

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserGrowth = async (req, res) => {
  try {
    const { period } = req.query;
    let groupFormat;
    switch (period) {
      case 'daily':
        groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
        break;
      case 'weekly':
        groupFormat = { $dateToString: { format: '%Y-%W', date: '$createdAt' } };
        break;
      case 'monthly':
        groupFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
        break;
      default:
        groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    }

    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: groupFormat,
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(userGrowth);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryDistribution = async (req, res) => {
  try {
    const categoryDistribution = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $group: {
          _id: '$productInfo.category',
          count: { $sum: 1 },
          totalSold: { $sum: '$items.qty' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(categoryDistribution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};