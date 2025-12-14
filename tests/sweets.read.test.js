const request = require('supertest')
const app = require('../src/app')
const db = require('./setupTestDB')

let token

beforeAll(async () => {
  await db.connect()

  const res = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'user',
      email: 'user@read.com',
      password: '123456'
    })

  token = res.body.token
})

afterEach(async () => {
  await db.clearDatabase()
})

afterAll(async () => {
  await db.closeDatabase()
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
