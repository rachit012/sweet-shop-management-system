const router = require('express').Router()
const { createSweet, getAllSweets } = require('../controllers/sweetsController')
const { protect, admin } = require('../middleware/auth')

router.post('/', protect, admin, createSweet)
router.get('/', protect, getAllSweets)

module.exports = router
