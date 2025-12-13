const Sweet = require('../models/Sweet')

exports.createSweet = async (req, res) => {
  const sweet = await Sweet.create(req.body)
  res.status(201).json(sweet)
}

exports.getAllSweets = async (req, res) => {
  const sweets = await Sweet.find()
  res.status(200).json(sweets)
}
