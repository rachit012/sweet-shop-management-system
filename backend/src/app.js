const path = require('path')

// Load environment variables
const envPath = process.env.NODE_ENV === 'test'
  ? path.resolve(__dirname, '../.env.test')
  : path.resolve(__dirname, '../.env')

require('dotenv').config({ path: envPath })

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

// Connect to MongoDB (for non-test environments)
// In test environment, connection is handled by jest.setup.js
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sweet-shop')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err))
}

const authRoutes = require('./routes/auth')
const sweetsRoutes = require('./routes/sweets')

const app = express()

// Enable CORS for frontend
app.use(require('cors')({
  origin:[
     'http://localhost:5173',
      'http://localhost:3000',
      'https://sweet-shop-management-488l.onrender.com'
  ],
  credentials: true
}))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/sweets', sweetsRoutes)

module.exports = app
