const blogsRouter = require('../controllers/notes')
const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}
const favoriteBlog = (blogs) => {
  const maxed = blogs.reduce(
    (max, blog) => (blog.likes > max.likes ? blog : max),
    blogs[0]
  )
  return maxed.likes
}

const mostBlog = (blogs) => {
  const authorCounts = _.countBy(blogs, 'author')
  const maxAuthor = _.maxBy(
    _.keys(authorCounts),
    (author) => authorCounts[author]
  )

  return {
    author: maxAuthor,
    blogs: authorCounts[maxAuthor],
  }
}

const mostLikes = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author')
  const authorLikes = _.mapValues(groupedByAuthor, (blogs) => {
    return _.sumBy(blogs, 'likes')
  })
  const mostLikedAuthor = _.maxBy(
    _.keys(authorLikes),
    (author) => authorLikes[author]
  )
  return { author: mostLikedAuthor, likes: authorLikes[mostLikedAuthor] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlog,
  mostLikes,
}
