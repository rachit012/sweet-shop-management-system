const router = require('express').Router()
const {
  createSweet,
  getAllSweets,
  searchSweets,
  purchaseSweet
} = require('../controllers/sweetsController')
const { protect, admin } = require('../middleware/auth')

router.post('/', protect, admin, createSweet)
router.get('/', protect, getAllSweets)
router.get('/search', protect, searchSweets)
router.post('/:id/purchase', protect, purchaseSweet)

module.exports = router
