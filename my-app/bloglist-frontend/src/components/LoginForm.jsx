import React from 'react'
import { TextField, Button, Typography, Container, Box } from '@mui/material'

const LoginForm = (props) => {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h4" color="primary" gutterBottom>
          Log in to application
        </Typography>
        <form onSubmit={props.handleLogin} style={{ width: '100%' }}>
          <div style={{ marginBottom: '16px' }}>
            <TextField
              data-testid="username"
              label="Username"
              type="text"
              value={props.username}
              name="Username"
              onChange={({ target }) => props.setUsername(target.value)}
              fullWidth
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <TextField
              data-testid="password"
              label="Password"
              type="password"
              value={props.password}
              name="Password"
              onChange={({ target }) => props.setPassword(target.value)}
              fullWidth
              required
            />
          </div>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Login
          </Button>
        </form>
      </Box>
    </Container>
  )
}

export default LoginForm
