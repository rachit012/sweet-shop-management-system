const Sweet = require('../models/Sweet')

exports.create = data => Sweet.create(data)
exports.getAll = () => Sweet.find()

exports.search = ({ name, category, minPrice, maxPrice }) => {
  const filter = {
    ...(name && { name }),
    ...(category && { category }),
    ...((minPrice || maxPrice) && {
      price: {
        ...(minPrice && { $gte: Number(minPrice) }),
        ...(maxPrice && { $lte: Number(maxPrice) })
      }
    })
  }
  return Sweet.find(filter)
}

exports.purchase = async id => {
  const sweet = await Sweet.findById(id)
  if (!sweet || sweet.quantity === 0) return null
  sweet.quantity -= 1
  return sweet.save()
}
