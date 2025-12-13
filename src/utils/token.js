const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET || 'test_secret'

exports.generateToken = payload =>
  jwt.sign(payload, secret)
