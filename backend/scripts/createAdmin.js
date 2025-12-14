const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const User = require('../src/models/User')

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')
    
    // Get admin credentials from command line or use defaults
    const username = process.argv[2] || 'admin'
    const email = process.argv[3] || 'admin@sweetshop.com'
    const password = process.argv[4] || 'admin123'
    
    // Check if admin already exists
    const existing = await User.findOne({ email })
    if (existing) {
      // Update existing user to admin
      existing.role = 'admin'
      if (password !== 'admin123' || !existing.password) {
        const hashedPassword = await bcrypt.hash(password, 10)
        existing.password = hashedPassword
      }
      existing.username = username
      await existing.save()
      console.log(`Updated existing user to admin: ${email}`)
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(password, 10)
      const admin = await User.create({
        username,
        email,
        password: hashedPassword,
        role: 'admin'
      })
      console.log(`Admin user created: ${email}`)
    }
    
    console.log(`\nAdmin credentials:`)
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log(`\nYou can now login with these credentials!`)
    
    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('Error creating admin:', error)
    process.exit(1)
  }
}

createAdmin()

