import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useMatch, Link } from 'react-router-dom'
import { Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material'

const User = () => {
  const match = useMatch('/user/:id')
  const users = useSelector(state => state.user.users)

  console.log('All users:', users)

  const userId = match?.params.id
  console.log('Received userId:', userId)

  const currentUser = users.find(user => user.id === userId)

  console.log('Current user:', currentUser)

  if (!currentUser) {
    return <div>User not found</div>
  }

  return (
    <div>
      <br/>
      <Typography variant="h5" color="primary" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
        {currentUser.name}
      </Typography>
      <Typography variant="h6" color="primary" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
        Blogs created
      </Typography>
      {currentUser.blogs.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {currentUser.blogs.map(blog => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <Link to={`/blog/${blog.id}`}>
                      {blog.title} by {blog.author}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No blogs created</p>
      )}
    </div>
  )
}

export default User
