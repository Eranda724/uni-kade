const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const http = require('http')

dotenv.config()

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
