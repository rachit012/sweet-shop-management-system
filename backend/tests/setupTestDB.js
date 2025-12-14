const mongoose = require('mongoose')

module.exports.connect = async () => {
  if (mongoose.connection.readyState === 1) {
    return
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    })
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    throw new Error(`Failed to connect to MongoDB: ${error.message}`)
  }
}

module.exports.clearDatabase = async () => {
  if (mongoose.connection.readyState !== 1) return

  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
}

module.exports.closeDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close()
  }
}
