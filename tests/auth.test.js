const request = require('supertest')
const app = require('../src/app')
const db = require('./setupTestDB')

beforeAll(async () => {
  await db.connect()
})

afterEach(async () => {
  await db.clearDatabase()
})

afterAll(async () => {
  await db.closeDatabase()
})

describe('Auth Register', () => {
  it('registers a new user and returns token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'test',
        email: 't@t.com',
        password: '123456'
      })
    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('token')
  })

  it('does not allow duplicate email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'a',
        email: 'dup@x.com',
        password: '123456'
      })

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'b',
        email: 'dup@x.com',
        password: '123456'
      })

    expect(res.statusCode).toBe(400)
  })
})
