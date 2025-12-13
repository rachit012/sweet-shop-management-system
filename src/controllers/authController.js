const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
  const { username, email, password } = req.body

  const exists = await User.findOne({ email })
  if (exists) return res.status(400).json({ message: 'Email already exists' })

  const hashed = await bcrypt.hash(password, 10)
  const user = await User.create({ username, email, password: hashed })

  const token = jwt.sign({ id: user._id }, 'secret')
  res.status(201).json({ token })
}
