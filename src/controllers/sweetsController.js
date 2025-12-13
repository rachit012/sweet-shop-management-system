const sweetService = require('../services/sweetService')

exports.createSweet = async (req, res) => {
  const sweet = await sweetService.create(req.body)
  res.status(201).json(sweet)
}

exports.getAllSweets = async (req, res) => {
  const sweets = await sweetService.getAll()
  res.status(200).json(sweets)
}

exports.searchSweets = async (req, res) => {
  const sweets = await sweetService.search(req.query)
  res.status(200).json(sweets)
}
