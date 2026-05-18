const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['seller', 'student'], required: true },
  university: { type: String },
  // seller only
  shopName: { type: String },
  shopDescription: { type: String },
  facultyArea: { type: String },
  category: { type: String },
  // student only
  faculty: { type: String },
  studentId: { type: String },
  // status for sellers (pending approval)
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  // seller shop open/close toggle
  isOpen: { type: Boolean, default: true },
}, { timestamps: true })

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12)
})

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)