const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  stock: {
    type: String,
    enum: ['Available', 'Out of Stock'],
    default: 'Available'
  },
  active: {
    type: Boolean,
    default: true
  },
  ordersCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)
