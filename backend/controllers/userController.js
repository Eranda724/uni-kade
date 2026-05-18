const User = require('../models/User')
const Order = require('../models/Order')

// @desc    Get all active sellers (shops) for students to browse
// @route   GET /api/users/shops
// @access  Private/Student
exports.getActiveShops = async (req, res) => {
  try {
    const shops = await User.aggregate([
      { $match: { role: 'seller', status: 'approved' } },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'seller',
          as: 'products'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          shopName: 1,
          shopDescription: 1,
          university: 1,
          facultyArea: 1,
          category: 1,
          isOpen: 1,
          productCount: { $size: '$products' }
        }
      }
    ])
    res.json(shops)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @desc    Get all users (optionally filter by role) — admin only
// @route   GET /api/users?role=seller
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const filter = {}
    if (req.query.role) filter.role = req.query.role
    if (req.query.status) filter.status = req.query.status

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })

    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public (for shop viewing)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @desc    Update user profile
// @route   PATCH /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Common fields
    if (req.body.name !== undefined) user.name = req.body.name
    if (req.body.phone !== undefined) user.phone = req.body.phone
    if (req.body.university !== undefined) user.university = req.body.university

    // Role-specific fields
    if (user.role === 'seller') {
      if (req.body.shopName !== undefined) user.shopName = req.body.shopName
      if (req.body.shopDescription !== undefined) user.shopDescription = req.body.shopDescription
      if (req.body.facultyArea !== undefined) user.facultyArea = req.body.facultyArea
      if (req.body.category !== undefined) user.category = req.body.category
      if (req.body.isOpen !== undefined) user.isOpen = req.body.isOpen
    } else {
      if (req.body.faculty !== undefined) user.faculty = req.body.faculty
      if (req.body.studentId !== undefined) user.studentId = req.body.studentId
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      university: updatedUser.university,
      phone: updatedUser.phone,
      shopName: updatedUser.shopName,
      shopDescription: updatedUser.shopDescription,
      category: updatedUser.category,
      facultyArea: updatedUser.facultyArea,
      isOpen: updatedUser.isOpen,
      faculty: updatedUser.faculty,
      studentId: updatedUser.studentId,
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// @desc    Update seller status (approve / reject / suspend) — admin only
// @route   PATCH /api/users/:id/status
// @access  Private/Admin
exports.updateSellerStatus = async (req, res) => {
  try {
    const { status } = req.body
    const allowed = ['pending', 'approved', 'rejected']
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowed.join(', ')}` })
    }

    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.status = status
    await user.save()

    res.json({ message: `User status updated to ${status}`, user })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// @desc    Get admin stats
// @route   GET /api/users/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    const totalSellers = await User.countDocuments({ role: 'seller' })
    const pendingSellers = await User.countDocuments({ role: 'seller', status: 'pending' })
    const totalStudents = await User.countDocuments({ role: 'student' })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const ordersToday = await Order.countDocuments({ createdAt: { $gte: today } })

    const revenueData = await Order.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ])
    const revenue = revenueData.length > 0 ? revenueData[0].total : 0

    res.json({ totalSellers, pendingSellers, totalStudents, ordersToday, revenue })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
