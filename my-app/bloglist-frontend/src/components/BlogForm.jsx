import { useDispatch, useSelector } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import React, { useState, useRef } from 'react'
import Toggable from './Toggable'
import BlogList from './BlogList'
import { Typography, Button, TextField } from '@mui/material'

const BlogForm = (props) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const dispatch = useDispatch()
  const user = useSelector(state => state.user.user)

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    }
    dispatch(createBlog(blogObject))
    setNewBlog({ title: '', author: '', url: '' })
    if (blogFormRef.current) {
      blogFormRef.current.toggleVisibility()
    }
  }

  const blogFormRef = useRef()

  return (
    <div>
      <br/>
      <Typography variant="h3" color="primary" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
      List of Blogs
      </Typography>
      <Toggable
        buttonLabel="New Blog"
        cancelButtonLabel="Cancel"
        ref={blogFormRef}
      >
        <form onSubmit={addBlog}>
          <div>
            <TextField
              label="Title"
              variant="outlined"
              color="primary"
              type="text"
              value={newBlog.title}
              onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
              placeholder="Title here"
              required />
          </div>
          <div>
            <TextField
              label="Author"
              variant="outlined"
              color="primary"
              type="text"
              value={newBlog.author}
              onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
              placeholder="Author here"
              required />
          </div>
          <div>
            <TextField
              label="URL"
              variant="outlined"
              color="primary"
              type="text"
              value={newBlog.url}
              onChange={(e) => setNewBlog({ ...newBlog, url: e.target.value })}
              placeholder="URL here"
              required />
          </div>
          <Button variant="contained" color="primary" type="submit">Create</Button>
        </form>
      </Toggable>
      <div>
        <BlogList user={user} />
      </div>
    </div>
  )
}

export default BlogForm
