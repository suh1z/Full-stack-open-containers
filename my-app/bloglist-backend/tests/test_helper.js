const Blog = require('../models/note')
const User = require('../models/user')

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}
const initialUsers = [
  {
    blogs: [],
    username: 'jobo',
    name: 'Test User',
    notes: [],
    id: '667c41f18c37e9950dba7b97',
  },
  {
    blogs: [],
    username: 'testuser',
    name: 'Test User',
    notes: [],
    id: '667c41f48c37e9950dba7b99',
  },
  {
    blogs: [],
    username: 'testauser',
    name: 'Test User',
    notes: [],
    id: '667c41f88c37e9950dba7b9b',
  },
]

const initialBlogs = [
  {
    title: 'Sample Blogs Post',
    author: 'John Does',
    url: 'waka.com',
    likes: 20,
    userId: '667c4311abe8fd3c269a7f50',
    id: '667c1cbb141ceb7d87d4b4fd',
  },
  {
    title: 'Sample Blogs Post',
    author: 'John Does',
    url: 'waka.com',
    likes: 20,
    userId: '667c4311abe8fd3c269a7f50',
    id: '667c4526bd34f86d3534cd9b',
  },
  {
    title: 'Sample Blogs Post',
    author: 'John Does',
    url: 'waka.com',
    likes: 0,
    userId: '667c4994c5f3e2f9e38d6584',
    id: '667c473772212b95ba4b2def',
  },
]

module.exports = {
  initialBlogs,
  usersInDb,
  initialUsers,
}
