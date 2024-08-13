const { test, after, beforeEach, describe } = require('node:test')
const Blog = require('../models/note')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('assert')
const api = supertest(app)
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

let token
let userId

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('testpassword', 10)

  const user = new User({
    username: 'testuser',
    name: 'Test User',
    passwordHash,
  })

  const savedUser = await user.save()
  userId = savedUser._id

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  }

  token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' })

  const blogObjects = helper.initialBlogs.map(
    (blog) => new Blog({ ...blog, user: userId })
  )
  const promiseArray = blogObjects.map((blog) => blog.save())
  await Promise.all(promiseArray)
})

describe('valid blogs', () => {
  test('check if _id do not exist in blogs response', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => {
      assert.strictEqual('id_' in blog, false)
      assert.strictEqual('id' in blog, true)
    })
  })

  test('likes must be a value ', async () => {
    const newBlog = {
      title: 'Async/Await Simplifies Making Async Calls',
      author: 'John Doe',
      url: 'https://example.com/html',
      likes: 'not int',
      userId: userId,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogs = response.body

    blogs.forEach((blog) => {
      assert.strictEqual(typeof blog.likes, 'number')
    })
  })

  test('blog with titel and url', async () => {
    const newBlog = {
      author: 'John Doe',
      likes: 0,
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    assert.strictEqual(response.body.error, 'Title and URL must be filled')
  })
})

describe.only('Get/Add/Delete/Update blogs', () => {
  test('verify number of blogs returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a valid note can be added ', async () => {
    const newBlog = {
      title: 'Async/Await Simplifies Making Async Calls',
      author: 'John Doe',
      url: 'https://example.com/html',
      likes: 5,
      userId: userId,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map((blog) => blog.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    assert(titles.includes('Async/Await Simplifies Making Async Calls'))
  })

  test('blog deletion', async () => {
    const newBlog = {
      title: 'Async/Await Simplifies Making Async Calls',
      author: 'John Doe',
      url: 'https://example.com/html',
      likes: 5,
      userId: userId,
    }

    const postResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogId = postResponse.body.id
    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const gresponse = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(gresponse.body.length, helper.initialBlogs.length)
  })

  test('blog updating likes', async () => {
    const newBlog = {
      title: 'HTML is easy',
      author: 'John Doe',
      url: 'https://example.com/html',
      likes: 5,
      userId: userId,
    }

    const postResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const updatedLikes = 100
    const blogId = postResponse.body.id

    await api
      .put(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ likes: updatedLikes })
      .expect(201)

    const response = await api.get(`/api/blogs/${blogId}`)
    const updatedBlog = response.body

    assert.strictEqual(updatedBlog.likes, updatedLikes)
  })

  describe('users test', () => {
    beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })

      await user.save()
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('expected `username` to be unique'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'jobo',
        name: 'Jonatan',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map((u) => u.username)
      assert(usernames.includes(newUser.username))
    })

    test('usernames/password over 3 char', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'ro',
        name: 'Superuser',
        password: 'sa',
      }

      const result = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(
        result.body.error.includes(
          'username and password needs to be atleast 3 characters'
        )
      )

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
