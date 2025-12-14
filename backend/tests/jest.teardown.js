const db = require('./setupTestDB')

module.exports = async () => {
  await db.closeDatabase()
}
