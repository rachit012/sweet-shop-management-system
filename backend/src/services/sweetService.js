const Sweet = require('../models/Sweet')

exports.create = data => Sweet.create(data)
exports.getAll = () => Sweet.find()

exports.search = ({ name, category, minPrice, maxPrice }) => {
  const filter = {}
  
  if (name) {
    filter.name = { $regex: name, $options: 'i' }
  }
  
  if (category) {
    filter.category = { $regex: category, $options: 'i' }
  }
  
  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.$gte = Number(minPrice)
    if (maxPrice) filter.price.$lte = Number(maxPrice)
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

exports.remove = id =>
  Sweet.findByIdAndDelete(id)

