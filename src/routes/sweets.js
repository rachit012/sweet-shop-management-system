const router = require('express').Router()
const {
  createSweet,
  getAllSweets,
  searchSweets,
  purchaseSweet,
  restockSweet,
  updateSweet,
  deleteSweet
} = require('../controllers/sweetsController')
const { protect, admin } = require('../middleware/auth')

router.post('/', protect, admin, createSweet)
router.get('/', protect, getAllSweets)
router.get('/search', protect, searchSweets)
router.post('/:id/purchase', protect, purchaseSweet)
router.post('/:id/restock', protect, admin, restockSweet)
router.put('/:id', protect, admin, updateSweet)
router.delete('/:id', protect, admin, deleteSweet)


module.exports = router
