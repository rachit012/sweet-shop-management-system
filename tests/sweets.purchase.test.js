const request = require('supertest')
const app = require('../src/app')
const db = require('./setupTestDB')

let token
let sweetId

beforeAll(async () => {
  await db.connect()

  const user = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'buyer',
      email: 'buyer@test.com',
      password: '123456'
    })

  token = user.body.token

  const sweet = await request(app)
    .post('/api/sweets')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Ladoo',
      category: 'Indian',
      price: 20,
      quantity: 1
    })

  sweetId = sweet.body._id
})

afterEach(async () => {
  await db.clearDatabase()
})

afterAll(async () => {
  await db.closeDatabase()
})

describe('Purchase Sweet', () => {
  it('decreases quantity by 1 when purchased', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.quantity).toBe(0)
  })

  it('rejects purchase when out of stock', async () => {
    await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${token}`)

    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(400)
  })
})

