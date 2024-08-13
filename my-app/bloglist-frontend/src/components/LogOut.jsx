import React from 'react'
import { useDispatch } from 'react-redux'
import { clearUser } from '../reducers/userReducer'
import blogService from '../services/blogs'
import { Button } from '@mui/material'

const Logout = ( ) => {
  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(clearUser())
    window.localStorage.removeItem('loggedNoteappUser')
    blogService.setToken(null)
  }

  return <Button variant="contained" color="primary" onClick={handleLogout}>Logout</Button>
}

export default Logout
