const User = require('../models/User')
const bcrypt = require('bcryptjs')

exports.registerUser = async ({ username, email, password }) => {
  const exists = await User.findOne({ email })
  if (exists) throw new Error('EMAIL_EXISTS')

  const hashed = await bcrypt.hash(password, 10)
  const role = email.startsWith('admin@') ? 'admin' : 'user'

  return User.create({ username, email, password: hashed, role })
}

exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email })
  if (!user) throw new Error('INVALID_CREDENTIALS')

  const match = await bcrypt.compare(password, user.password)
  if (!match) throw new Error('INVALID_CREDENTIALS')

  return user
}
