import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification: (state, action) => {
      return action.payload
    },

    clearNotification: () => {
      return null
    },
  },
})

export const { setNotification, clearNotification } = notificationSlice.actions

let timeoutId

export const notificationAction = (message, type, timeout) => {
  return dispatch => {
    dispatch(setNotification(message, type))

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      dispatch(clearNotification())
    }, timeout * 1000)
  }
}

export default notificationSlice.reducer
