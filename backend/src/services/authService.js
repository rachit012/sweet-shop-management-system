const bcrypt = require('bcryptjs')
const User = require('../models/User')

const SALT_ROUNDS = process.env.NODE_ENV === 'test' ? 1 : 10

exports.registerUser = async ({ username, email, password, role }) => {
  if (!email || !password || !username) {
    throw new Error('Missing required fields')
  }

  try {
    const existing = await User.findOne({ email })
    if (existing) {
      throw new Error('EMAIL_EXISTS')
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    console.log('Password hashed successfully')

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    })
    
    console.log('User saved to database:', { email: user.email, id: user._id, role: user.role })
    
    // Ensure user object has _id
    if (!user._id) {
      throw new Error('User creation failed - missing _id')
    }
    
    return user
  } catch (err) {
    // Handle duplicate key error from MongoDB unique index
    if (err.code === 11000 || err.message.includes('duplicate') || err.message === 'EMAIL_EXISTS') {
      throw new Error('EMAIL_EXISTS')
    }
    console.error('Database error during registration:', err.message, err.stack)
    throw err
  }
}


exports.loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  const user = await User.findOne({ email })
  if (!user) {
    console.log('User not found for email:', email)
    throw new Error('INVALID_CREDENTIALS')
  }

  console.log('User found, comparing password...')
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    console.log('Password mismatch for email:', email)
    throw new Error('INVALID_CREDENTIALS')
  }

  console.log('Login successful for email:', email)
  return user
}
