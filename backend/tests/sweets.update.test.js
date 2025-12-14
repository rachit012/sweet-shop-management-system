const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../src/app')
const db = require('./setupTestDB')

let adminToken
let userToken
let sweetId

beforeEach(async () => {
  // Ensure mongoose is connected
  if (mongoose.connection.readyState !== 1) {
    await db.connect()
  }
  await db.clearDatabase()
  const admin = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'admin',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin'
    })

  const user = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'user',
      email: 'user@test.com',
      password: 'user123'
    })

  adminToken = admin.body.token
  userToken = user.body.token

  const sweet = await request(app)
    .post('/api/sweets')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'Gulab Jamun',
      category: 'Indian',
      price: 50,
      quantity: 10
    })

  sweetId = sweet.body._id
})

afterEach(async () => {
  await db.clearDatabase()
})

describe('Sweets Update', () => {
  it('rejects non-admin user', async () => {
    const res = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ price: 60 })

    expect(res.statusCode).toBe(403)
  })

  it('updates sweet when admin', async () => {
    const res = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 60 })

    expect(res.statusCode).toBe(200)
    expect(res.body.price).toBe(60)
  })
})
