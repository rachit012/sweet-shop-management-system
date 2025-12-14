const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../src/app')
const db = require('./setupTestDB')

let token

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
      email: 'admin@read.com',
      password: '123456',
      role: 'admin'
    })

  token = admin.body.token
})

afterAll(async () => {
  await db.clearDatabase()
})

describe('Get All Sweets', () => {
  it('returns empty array when no sweets exist', async () => {
    const res = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual([])
  })

  it('returns all sweets when sweets exist', async () => {
    await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Ladoo',
        category: 'Indian',
        price: 20,
        quantity: 5
      })

    const res = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.length).toBe(1)
  })
})
