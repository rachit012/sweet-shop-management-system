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

exports.purchaseSweet = async (req, res) => {
  const sweet = await sweetService.purchase(req.params.id)
  if (!sweet) return res.status(400).end()
  res.status(200).json(sweet)
}

exports.restockSweet = async (req, res) => {
  const sweet = await sweetService.restock(req.params.id, req.body.amount)
  if (!sweet) return res.status(400).end()
  res.status(200).json(sweet)
}

exports.updateSweet = async (req, res) => {
  const sweet = await sweetService.update(req.params.id, req.body)
  if (!sweet) return res.status(400).end()
  res.status(200).json(sweet)
}

exports.deleteSweet = async (req, res) => {
  const deleted = await sweetService.remove(req.params.id)
  if (!deleted) return res.status(400).end()
  res.status(200).end()
}
