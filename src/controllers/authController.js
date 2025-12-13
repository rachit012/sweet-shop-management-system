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
