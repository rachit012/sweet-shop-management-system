const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../src/app')
const db = require('./setupTestDB')

beforeAll(async () => {
  // Ensure mongoose is connected
  if (mongoose.connection.readyState !== 1) {
    await db.connect()
  }
  await db.clearDatabase()
})

afterAll(async () => {
  await db.clearDatabase()
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

describe('Auth Login', () => {
  beforeAll(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'loginuser',
        email: 'login@test.com',
        password: 'password123'
      })
  })

  it('logs in user with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@test.com',
        password: 'password123'
      })

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('token')
  })

  it('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@test.com',
        password: 'wrong'
      })

    expect(res.statusCode).toBe(400)
  })

  it('rejects non-existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'no@test.com',
        password: '123'
      })

    expect(res.statusCode).toBe(400)
  })
})
