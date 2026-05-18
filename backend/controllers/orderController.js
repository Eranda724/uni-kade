const Order = require('../models/Order')
const Product = require('../models/Product')

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Student
exports.addOrderItems = async (req, res) => {
  try {
    const { items, seller, total, note } = req.body

    if (items && items.length === 0) {
      return res.status(400).json({ message: 'No order items' })
    }

    const order = new Order({
      student: req.user._id,
      seller,
      items,
      total,
      note
    })

    const createdOrder = await order.save()

    // Increment order count dynamically for products
    for (let item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { ordersCount: item.qty } })
    }

    res.status(201).json(createdOrder)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// @desc    Get orders (contextual based on user role)
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    let orders
    if (req.user.role === 'student') {
      orders = await Order.find({ student: req.user._id })
        .populate('seller', 'shopName')
        .sort({ createdAt: -1 })
    } else if (req.user.role === 'seller') {
      orders = await Order.find({ seller: req.user._id })
        .populate('student', 'name phone')
        .sort({ createdAt: -1 })
    } else if (req.user.role === 'admin') {
      orders = await Order.find({})
        .populate('seller', 'shopName university')
        .populate('student', 'name')
        .sort({ createdAt: -1 })
    }

    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Seller or Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Admin can update any order; seller can only update their own
    if (req.user.role !== 'admin' && order.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    order.status = req.body.status
    await order.save()

    // Return populated order so frontend can update UI immediately
    const updated = await Order.findById(order._id)
      .populate('student', 'name phone')
      .populate('seller', 'shopName')

    res.json(updated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}
