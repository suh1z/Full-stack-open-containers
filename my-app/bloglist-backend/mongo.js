const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://joboholmberg:${password}@cluster1.2ktdr6p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`
mongoose.set('strictQuery', false)

mongoose.connect(url).then(() => {
  const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
  })

  const Blog = mongoose.model('Blog', blogSchema)

  const newBlog = new Blog({
    title: 'Sample Blog Title',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 10,
  })

  newBlog
    .save()
    .then((result) => {
      console.log('Blog entry saved:', result)
    })
    .catch((error) => {
      console.error('Error saving blog entry:', error.message)
    })

  Blog.find({}).then((result) => {
    result.forEach((note) => {
      console.log(note)
    })
    mongoose.connection.close()
  })
})
