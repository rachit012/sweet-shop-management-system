const Sweet = require('../models/Sweet')

exports.create = data => Sweet.create(data)
exports.getAll = () => Sweet.find()

exports.search = query => {
  const filter = {}

  if (query.name) filter.name = query.name
  if (query.category) filter.category = query.category

  if (query.minPrice || query.maxPrice) {
    filter.price = {}
    if (query.minPrice) filter.price.$gte = Number(query.minPrice)
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice)
  }

  return Sweet.find(filter)
}
