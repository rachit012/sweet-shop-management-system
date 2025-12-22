const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../src/app')
const db = require('./setupTestDB')

let adminToken
let userToken
let sweetId

beforeAll(async () => {
  // Ensure mongoose is connected
  if (mongoose.connection.readyState !== 1) {
    await db.connect()
  }

  await db.clearDatabase()

  const admin = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'admin',
      email: 'admin@purchase.com',
      password: '123456',
      role: 'admin'
    })

  adminToken = admin.body.token

  const user = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'user',
      email: 'user@purchase.com',
      password: '123456'
    })

  userToken = user.body.token

  const sweet = await request(app)
    .post('/api/sweets')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'Ladoo',
      category: 'Indian',
      price: 20,
      quantity: 5
    })

  sweetId = sweet.body._id
})

afterAll(async () => {
  await db.clearDatabase()
})

describe('Purchase Sweet', () => {
  it('rejects purchase without authentication', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .send({ quantity: 1 })

    expect(res.statusCode).toBe(401)
  })

  it('allows purchase for authenticated user', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 1 })

    expect(res.statusCode).toBe(200)
  })
})
