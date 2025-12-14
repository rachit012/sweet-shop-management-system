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
      email: 'admin@search.com',
      password: '123456',
      role: 'admin'
    })

  token = admin.body.token
})

beforeEach(async () => {
  // Clear only sweets, keep users
  const Sweet = require('../src/models/Sweet')
  await Sweet.deleteMany({})
  
  await request(app)
    .post('/api/sweets')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Ladoo',
      category: 'Indian',
      price: 20,
      quantity: 5
    })

  await request(app)
    .post('/api/sweets')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Brownie',
      category: 'Bakery',
      price: 50,
      quantity: 3
    })
})

afterAll(async () => {
  await db.clearDatabase()
})

describe('Search Sweets', () => {
  it('searches sweets by name', async () => {
    const res = await request(app)
      .get('/api/sweets/search?name=Ladoo')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.length).toBe(1)
  })

  it('searches sweets by category', async () => {
    const res = await request(app)
      .get('/api/sweets/search?category=Bakery')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.length).toBe(1)
  })

  it('searches sweets by price range', async () => {
    const res = await request(app)
      .get('/api/sweets/search?minPrice=10&maxPrice=30')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.length).toBe(1)
  })
})
