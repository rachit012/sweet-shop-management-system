const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const User = require('../src/models/User')

async function clearUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')
    
    const result = await User.deleteMany({})
    console.log(`Deleted ${result.deletedCount} users`)
    
    await mongoose.connection.close()
    console.log('Database cleared and connection closed')
    process.exit(0)
  } catch (error) {
    console.error('Error clearing users:', error)
    process.exit(1)
  }
}

clearUsers()

