const router = require('express').Router()
const { createSweet, getAllSweets, searchSweets } = require('../controllers/sweetsController')
const { protect, admin } = require('../middleware/auth')

router.post('/', protect, admin, createSweet)
router.get('/', protect, getAllSweets)
router.get('/search', protect, searchSweets)

module.exports = router
