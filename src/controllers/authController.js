const { registerUser, loginUser } = require('../services/authService')
const { generateToken } = require('../utils/token')

exports.register = async (req, res) => {
  try {
    const user = await registerUser(req.body)
    const token = generateToken({ id: user._id, role: user.role })
    res.status(201).json({ token })
  } catch (err) {
    if (err.message === 'EMAIL_EXISTS')
      return res.status(400).json({ message: 'Email already exists' })
    res.status(500).end()
  }
}

exports.login = async (req, res) => {
  try {
    const user = await loginUser(req.body)
    const token = generateToken({ id: user._id, role: user.role })
    res.status(200).json({ token })
  } catch {
    res.status(400).end()
  }
}
