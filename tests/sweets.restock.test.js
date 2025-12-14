const request = require('supertest')
const app = require('../src/app')
const db = require('./setupTestDB')

let adminToken
let userToken
let sweetId

beforeAll(async () => {
  await db.connect()

  const admin = await request(app)
    .post('/api/auth/register')
    .send({
        username: 'admin',
        email: 'admin@restock.com',
        password: '123456'
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

afterEach(async () => {
  await db.clearDatabase()
})

afterAll(async () => {
  await db.closeDatabase()
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
