const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { registerUser } = require('../services/authService')
const { generateToken } = require('../utils/token')

exports.register = async (req, res) => {
  try {
    const user = await registerUser(req.body)
    const token = generateToken({ id: user._id })
    res.status(201).json({ token })
  } catch (err) {
    if (err.message === 'EMAIL_EXISTS')
      return res.status(400).json({ message: 'Email already exists' })
    res.status(500).end()
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) return res.status(400).end()

  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(400).end()

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'test_secret')
  res.status(200).json({ token })
}
