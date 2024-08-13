const blogsRouter = require('express').Router()
const Blog = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blog = await Blog.find({})
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 })
  response.json(blog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
const body = request.body
const decodedToken = jwt.verify(request.token, process.env.SECRET)
if (!decodedToken.id) {
  return response.status(401).json({ error: 'token invalid' })
}

const blog = await Blog.findById(request.params.id)

blog.comments = blog.comments ? blog.comments.concat(body.comment) : [body.comment]

const savedBlog = await blog.save()
response.status(201).json(savedBlog)

})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'Title and URL must be filled' })
  }

  if (typeof body.likes !== 'number' || isNaN(body.likes)) {
    body.likes = 0
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
    comments: body.comment,
  })

  user.blogs = user.blogs.concat(blog._id)
  await user.save()
  const savedBlog = await blog.save()

  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const blog = request.body
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(201).json(blog)
})

module.exports = blogsRouter
