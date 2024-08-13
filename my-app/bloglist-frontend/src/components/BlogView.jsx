import React, { useState } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { useMatch } from 'react-router-dom'
import { deleteBlog, voteObject, commentObject } from '../reducers/blogReducer'
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Grid,
} from '@mui/material'

const BlogView = (props) => {
  const [commentInput, setCommentInput] = useState('')

  const match = useMatch('/blog/:id')
  const blogs = useSelector(state => state.blogs)
  const blogid = match?.params.id
  console.log('props.blog.id:', blogid)
  const currentBlog = blogs.find(blog => blog.id === blogid)
  console.log('props.blog:', blogs)
  const dispatch = useDispatch()
  const newBlog = useSelector(state => state.blogs[state.blogs.length - 1])

  const handleDelClick =  () => {
    if (window.confirm(`Remove blog ${currentBlog.title} by ${currentBlog.author}?`)) {
      dispatch(deleteBlog(currentBlog))
    }
  }

  const handleLikeClick = () => {
    const likedBlog = { ...currentBlog, likes: currentBlog.likes + 1, user: currentBlog.user.id }
    dispatch(voteObject(likedBlog))
  }

  const handleComment = () => {
    dispatch(commentObject(currentBlog.id, commentInput))
    setCommentInput('')
  }


  if (!currentBlog) {
    return <div>No blogs here</div>
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h2">{currentBlog.title}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">{currentBlog.url}</Typography>
        <Typography variant="body1">Likes: {currentBlog.likes}</Typography>
        <Button variant="contained" color="primary" onClick={handleLikeClick}>
          Like
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">Added by {currentBlog.user.name}</Typography>
        {(props.user.name === currentBlog.user.name &&
          <Button variant="contained" color="primary" onClick={handleDelClick} style={{ flexGrow: 0.5 }}>
          Delete Blog
          </Button>
        )}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h3">Comments</Typography>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Comment blog"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          required
        />
        <Button variant="contained" color="primary" onClick={handleComment}>
          Comment
        </Button>

        <List>
          {currentBlog.comments.map((comment, index) => (
            <ListItem key={index}>
              <ListItemText>{comment}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  )
}

export default BlogView