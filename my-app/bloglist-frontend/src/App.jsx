import { Routes, Route, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { notificationAction } from './reducers/notificationReducer'
import { initializeUser, loginUser }  from './reducers/userReducer'
import { ThemeProvider, CssBaseline, Container, Typography, AppBar, Toolbar, Button, Box } from '@mui/material'
import { lightTheme, darkTheme } from './theme'
import './Notifications.css'
import UserView from './components/UsersView'
import User from './components/User'
import BlogForm from './components/BlogForm'
import Logout from './components/Logout'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogView from './components/BlogView'
import DarkModeToggle from './components/DarkModeToggle'

const Menu = (props) => {

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="body1" color="inherit" style={{ flexGrow: 0.5, marginLeft: '20px' }} component={Link} to="/">
          Blogs App
        </Typography>
        <Button color="inherit" component={Link} to="/">
      blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
      users
        </Button>
        <Box sx={{ flexGrow: 6 }} />
        {props.user && (
          <>
            <Typography variant="body1" color="inherit" style={{ flexGrow: 0.5 , marginLeft: '20px' }}>
              {props.user.name} logged in
            </Typography>
            <Logout />
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(prevDarkMode => !prevDarkMode)
  }

  const user = useSelector(state => state.user.user)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUser())
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      dispatch(loginUser({ username, password }))
      setUsername('')
      setPassword('')
    } catch (error) {
      dispatch(notificationAction('Wrong credentials', 'error', 5))
      console.error('Login error:', error)
    }
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container>
        <DarkModeToggle darkMode={darkMode} onToggle={toggleDarkMode} />
        <div>
          <Menu user={user}/>
          <Notification />
          {user && (
            <>
              <Routes>
                <Route path="/" element={<BlogForm />} />
                <Route path="/users" element={<UserView />} />
                <Route path="/user/:id" element={<User />} />
                <Route path="/blog/:id" element={<BlogView user={user}/>} />
              </Routes></>
          )}
          {!user && (
            <div>
              <LoginForm
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
                handleLogin={handleLogin}
              />
            </div>
          )}
        </div>
      </Container>
    </ThemeProvider>
  )
}

export default App
