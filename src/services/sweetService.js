const Sweet = require('../models/Sweet')

exports.getAll = () => Sweet.find()
exports.create = data => Sweet.create(data)
