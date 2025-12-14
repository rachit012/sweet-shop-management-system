const request = require('supertest')
const app = require('../src/app')
const db = require('./setupTestDB')

let adminToken
let userToken

beforeAll(async () => {
  await db.connect()

  const admin = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'admin',
      email: 'admin@test.com',
      password: 'admin123'
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
})

afterEach(async () => {
  await db.clearDatabase()
})

afterAll(async () => {
  await db.closeDatabase()
})

describe('Sweets Create', () => {
  it('creates a sweet when admin is authenticated', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 10
      })

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('name', 'Gulab Jamun')
  })

  it('rejects unauthenticated request', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .send({
        name: 'Ladoo',
        category: 'Indian',
        price: 30,
        quantity: 5
      })

    expect(res.statusCode).toBe(401)
  })

  it('rejects non-admin user', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Barfi',
        category: 'Indian',
        price: 40,
        quantity: 8
      })

    expect(res.statusCode).toBe(403)
  })
})
