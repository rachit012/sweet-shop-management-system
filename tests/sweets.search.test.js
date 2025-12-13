const request = require('supertest')
const app = require('../src/app')
const db = require('./setupTestDB')

let token

beforeAll(async () => {
  await db.connect()

  const res = await request(app)
    .post('/api/auth/register')
    .send({
        username: 'admin',
        email: 'admin@search.com',
        password: '123456'
    })


  token = res.body.token

  await request(app)
    .post('/api/sweets')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Ladoo', category: 'Indian', price: 20, quantity: 5 })

  await request(app)
    .post('/api/sweets')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Brownie', category: 'Bakery', price: 50, quantity: 3 })
})

afterEach(async () => {
  await db.clearDatabase()
})

afterAll(async () => {
  await db.closeDatabase()
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
