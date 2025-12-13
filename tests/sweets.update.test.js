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
      email: 'admin@update.com',
      password: '123456'
    })

  const user = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'user',
      email: 'user@update.com',
      password: '123456'
    })

  adminToken = admin.body.token
  userToken = user.body.token

  const sweet = await request(app)
    .post('/api/sweets')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'Peda',
      category: 'Indian',
      price: 25,
      quantity: 10
    })

  sweetId = sweet.body._id
})

afterEach(async () => {
  await db.clearDatabase()
})

afterAll(async () => {
  await db.closeDatabase()
})

describe('Update Sweet', () => {
  it('updates sweet when admin', async () => {
    const res = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        price: 30,
        quantity: 20
      })

    expect(res.statusCode).toBe(200)
    expect(res.body.price).toBe(30)
    expect(res.body.quantity).toBe(20)
  })

  it('rejects update by non-admin', async () => {
    const res = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ price: 40 })

    expect(res.statusCode).toBe(403)
  })
})
