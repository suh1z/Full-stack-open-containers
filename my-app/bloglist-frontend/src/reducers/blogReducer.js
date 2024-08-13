
import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { notificationAction } from './notificationReducer'

const anecdoteSlice = createSlice({
  name: 'blogs',
  initialState:[],
  reducers: {
    voteBlog(state, action){
      const { id } = action.payload
      return state.map(blog =>
        blog.id !== id ? blog : {
          ...blog,
          likes: blog.likes + 1
        }
      )
    },
    commentBlog(state, action) {
      const updatedBlog = action.payload
      return state.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog)
    }
    ,
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlog(state, action) {
      return action.payload
    },
    delBlog(state, action) {
      console.log(action.payload)
      return state.filter(blog => blog.id !== action.payload.id)
    }
  },
})


export const { delBlog, voteBlog, appendBlog, setBlog, commentBlog } = anecdoteSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    console.log(blogs)
    dispatch(setBlog(blogs))
  }
}

export const voteObject = blog => {
  return async dispatch => {
    try {
      const updatedBlog = await blogService.update(blog)
      console.log(updatedBlog)
      dispatch(notificationAction(`You liked"${blog.title}"`, 'success', 5))
      await dispatch(voteBlog(updatedBlog))
    } catch (error) {
      dispatch(notificationAction(`"${error.response?.data?.error}"`, 'error', 5))
    }
  }
}

export const commentObject = (id, comment) => {
  return async dispatch => {
    try {
      const updatedBlog = await blogService.comment(id, comment)
      await dispatch(commentBlog(updatedBlog))
    } catch (error) {
      dispatch(notificationAction(`"${error.response?.data?.error}"`, 'error', 5))
    }
  }
}

export const createBlog = content => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(content)
      dispatch(appendBlog(newBlog))
      await dispatch(notificationAction(`"${newBlog.title}" successfully created`, 'success', 5))
    } catch (error) {
      dispatch(notificationAction(`"${error.response?.data?.error}"`, 'error', 5))
    }
  }
}

export const deleteBlog = content => {
  return async dispatch => {
    try {
      await blogService.delblog(content)
      dispatch(notificationAction(`"${content.title}" successfully deleted`, 'success', 5))
      await dispatch(delBlog(content))
    } catch (error) {
      dispatch(notificationAction(`"${error.response?.data?.error}"`, 'error', 5))
    }
  }
}

export default anecdoteSlice.reducer