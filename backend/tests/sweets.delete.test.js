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
      email: 'admin@delete.com',
      password: '123456',
      role: 'admin'
    })

  adminToken = admin.body.token

  const user = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'user',
      email: 'user@delete.com',
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

describe('Delete Sweet', () => {
  it('rejects delete by non-admin', async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${userToken}`)

    expect(res.statusCode).toBe(403)
  })

  it('deletes sweet when admin', async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
  })
})


