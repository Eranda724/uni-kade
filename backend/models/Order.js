const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  items: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
      }
    }
  ],
  total: {
    type: Number,
    required: true,
    default: 0.0
  },
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Ready', 'Delivered'],
    default: 'Pending'
  },
  note: {
    type: String,
    default: ''
  }
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)
