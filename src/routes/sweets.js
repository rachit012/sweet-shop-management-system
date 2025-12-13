const router = require('express').Router()
const { createSweet } = require('../controllers/sweetsController')
const { protect, admin } = require('../middleware/auth')

router.post('/', protect, admin, createSweet)

module.exports = router
