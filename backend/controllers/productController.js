const Product = require('../models/Product')

// @desc    Get all products for current seller
// @route   GET /api/products
// @access  Private/Seller
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, description } = req.body

    const product = new Product({
      seller: req.user._id,
      name,
      category,
      price,
      description
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// @desc    Update a product (toggle active/stock etc)
// @route   PATCH /api/products/:id
// @access  Private/Seller
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to edit this product' })
    }

    const { name, category, price, description, active, stock } = req.body

    if (name !== undefined) product.name = name
    if (category !== undefined) product.category = category
    if (price !== undefined) product.price = price
    if (description !== undefined) product.description = description
    if (active !== undefined) product.active = active
    if (stock !== undefined) product.stock = stock

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    await product.deleteOne()
    res.json({ message: 'Product removed' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @desc    Get all active products for a specific shop
// @route   GET /api/products/shop/:shopId
// @access  Private/Student
exports.getShopProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.shopId, active: true })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
