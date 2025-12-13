const User = require('../models/User')
const bcrypt = require('bcryptjs')

exports.registerUser = async ({ username, email, password }) => {
  const exists = await User.findOne({ email })
  if (exists) throw new Error('EMAIL_EXISTS')

  const hashed = await bcrypt.hash(password, 10)
  return User.create({ username, email, password: hashed })
}
