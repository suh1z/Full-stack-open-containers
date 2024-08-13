import React from 'react'
import '../Notifications.css'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (notification === null) {
    return null
  }

  return (
    <div className={`notification ${notification.type}`}>
      <div className="icon"></div>
      {notification}
    </div>
  )
}

export default Notification
