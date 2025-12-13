const express = require('express')
const app = express()

app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/sweets', require('./routes/sweets'))


module.exports = app
