
import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import userService from '../services/users'

const initialState = {
  users: [],
  user: null,
  token: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user,
      state.token = action.payload.token
    },
    setUsers(state, action) {
      state.users = action.payload
    },
    clearUser(state) {
      state.user = null
      state.token = null
    },
  }
})

export const { setUser, clearUser, setUsers } = userSlice.actions

export const allUsers = () => {
  return async dispatch => {
    const users = await userService.getAllUsers()
    dispatch(setUsers(users))
  }
}

export const loginUser = (credentials) => {
  return async dispatch => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser({ user: user, token: user.token }))
    } catch (error) {
      console.error('Login error:', error)
    }
  }
}

export const initializeUser = () => {
  return dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser({ user: user, token: user.token }))
      blogService.setToken(user.token)
    }
  }
}

export default userSlice.reducer
