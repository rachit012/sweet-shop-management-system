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
  const sweet = await Sweet.findOneAndUpdate(
    { _id: id, quantity: { $gt: 0 } },
    { $inc: { quantity: -1 } },
    { new: true }
  )
  return sweet
}

exports.restock = async (id, amount) =>
  Sweet.findByIdAndUpdate(
    id,
    { $inc: { quantity: amount } },
    { new: true }
  )

exports.update = (id, data) =>
  Sweet.findByIdAndUpdate(id, data, { new: true })

