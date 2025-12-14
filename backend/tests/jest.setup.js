const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env.test') })

const db = require('./setupTestDB')

module.exports = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI not defined')
  }
  try {
  await db.connect()
    console.log('MongoDB connected successfully in test setup')
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message)
    throw error
  }
}
