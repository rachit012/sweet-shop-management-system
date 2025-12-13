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
      email: 'admin@delete.com',
      password: '123456'
    })

  const user = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'user',
      email: 'user@delete.com',
      password: '123456'
    })

  adminToken = admin.body.token
  userToken = user.body.token

  const sweet = await request(app)
    .post('/api/sweets')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'Jalebi',
      category: 'Indian',
      price: 15,
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

describe('Delete Sweet', () => {
  it('deletes sweet when admin', async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)

    const check = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(check.body.length).toBe(0)
  })

  it('rejects delete by non-admin', async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${userToken}`)

    expect(res.statusCode).toBe(403)
  })
})
