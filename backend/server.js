const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const dns = require('dns')
const http = require('http')
const authRoutes = require('./routes/authRoutes')

dotenv.config()

// Force Node's DNS resolver to use a public DNS server for SRV lookups
try {
  dns.setServers(['8.8.8.8'])
  console.log('ℹ️ DNS servers set to:', dns.getServers())
} catch (e) {
  console.warn('⚠️ Failed to set DNS servers:', e.message)
}

console.log('📋 Environment variables loaded:')
console.log('PORT:', process.env.PORT)
console.log('MONGO_URI:', process.env.MONGO_URI)
console.log('CLIENT_URL:', process.env.CLIENT_URL)
const app = express()
const server = http.createServer(app)

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🎓 UNI-KADE API is running!' })
})

// Auth routes
app.use('/api/auth', authRoutes)

// New routes
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const userRoutes = require('./routes/userRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')

app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/users', userRoutes)
app.use('/api/analytics', analyticsRoutes)

// MongoDB connect + start server
const PORT = process.env.PORT || 5000

console.log('🔗 Attempting MongoDB connection...')
console.log('Connection string:', process.env.MONGO_URI)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully')
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed')
    console.error('Error code:', err.code)
    console.error('Error message:', err.message)
    console.error('Full error:', err)
    process.exit(1)
  })
