import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { allUsers } from '../reducers/userReducer'
import { Link } from 'react-router-dom'
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material'

const UserView = () => {
  const dispatch = useDispatch()
  const users = useSelector(state => state.user.users)

  useEffect(() => {
    dispatch(allUsers())
  }, [])

  return (
    <div>
      <br/>
      <Typography variant="h3" color="primary" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
        Users List
      </Typography>
      <Typography variant="h6" color="primary" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
        Blogs created
      </Typography>
      {users.length > 0 ? (
        <Paper elevation={3} style={{ padding: '10px', marginBottom: '20px' }}>
          <List>
            {users.map(user => (
              <ListItem key={user.id}>
                <ListItemText>
                  <Link to={`/user/${user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {user.name}
                  </Link>{' '}
                  - {user.blogs.length} blogs
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Paper>
      ) : (
        <Typography variant="body1" style={{ fontStyle: 'italic' }}>
          No users found
        </Typography>
      )}
    </div>
  )}


export default UserView
