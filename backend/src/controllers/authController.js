const { registerUser, loginUser } = require('../services/authService')
const { generateToken } = require('../utils/token')

exports.register = async (req, res) => {
  try {
    console.log('Registration request received:', { email: req.body.email, username: req.body.username })
    
    // Validate required fields
    if (!req.body.email || !req.body.password || !req.body.username) {
      return res.status(400).json({ message: 'Email, username, and password are required' })
    }
    
    const user = await registerUser(req.body)
    console.log('User created successfully:', { email: user.email, id: user._id, role: user.role })
    
    // Check if user has _id
    if (!user._id) {
      console.error('User created but _id is missing!', user)
      return res.status(500).json({ message: 'User creation failed. Please try again.' })
    }
    
    // Check JWT_SECRET before generating token
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing!')
      return res.status(500).json({ message: 'Server configuration error. Please contact administrator.' })
    }
    
    const token = generateToken({ id: user._id.toString(), role: user.role || 'user' })
    console.log('Token generated successfully')
    
    res.status(201).json({ token })
  } catch (err) {
    if (err.message === 'EMAIL_EXISTS') {
      console.log('Email already exists:', req.body.email)
      return res.status(400).json({ message: 'Email already exists' })
    }
    if (err.message === 'JWT_SECRET is not defined in environment variables') {
      console.error('JWT_SECRET missing!')
      return res.status(500).json({ message: 'Server configuration error. Please contact administrator.' })
    }
    console.error('Registration error:', err.message)
    console.error('Error stack:', err.stack)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

exports.login = async (req, res) => {
  try {
    console.log('Login request received:', { email: req.body.email, hasPassword: !!req.body.password })
    
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }
    
    const user = await loginUser(req.body)
    
    if (!user._id) {
      console.error('User found but _id is missing!', user)
      return res.status(500).json({ message: 'Login failed. Please try again.' })
    }
    
    const token = generateToken({ id: user._id.toString(), role: user.role || 'user' })
    console.log('Login successful, token generated')
    
    res.status(200).json({ token })
  } catch (err) {
    if (err.message === 'INVALID_CREDENTIALS') {
      console.log('Invalid credentials for email:', req.body.email)
      return res.status(400).json({ message: 'Invalid email or password' })
    }
    console.error('Login error:', err.message, err.stack)
    res.status(400).json({ message: 'Login failed', error: err.message })
  }
}

