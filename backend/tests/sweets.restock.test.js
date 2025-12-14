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
      email: 'admin@restock.com',
      password: '123456',
      role: 'admin'
    })

  const user = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'user',
      email: 'user@restock.com',
      password: '123456'
    })

  adminToken = admin.body.token
  userToken = user.body.token
})

beforeEach(async () => {
  // Clear only sweets, keep users
  const Sweet = require('../src/models/Sweet')
  await Sweet.deleteMany({})
  
  const sweet = await request(app)
    .post('/api/sweets')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'Barfi',
      category: 'Indian',
      price: 30,
      quantity: 1
    })

  sweetId = sweet.body._id
})

afterAll(async () => {
  await db.clearDatabase()
})

describe('Restock Sweet', () => {
  it('increases quantity when admin restocks', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 5 })

    expect(res.statusCode).toBe(200)
    expect(res.body.quantity).toBe(6)
  })

  it('rejects non-admin restock', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ amount: 3 })

    expect(res.statusCode).toBe(403)
  })
})
