const jwt = require('jsonwebtoken')

exports.protect = (req, res, next) => {
  const header = req.headers.authorization
  if (!header) return res.status(401).end()

  const token = header.split(' ')[1]
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'test_secret')
    next()
  } catch {
    res.status(401).end()
  }
}

exports.admin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).end()
  next()
}
