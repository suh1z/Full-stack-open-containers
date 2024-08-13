import React, { useState } from 'react'
import { Switch, FormControlLabel, Grid } from '@mui/material'

const DarkModeToggle = ({ darkMode, onToggle }) => {
  const handleChange = () => {
    onToggle()
  }

  return (
    <Grid container alignItems="center" justifyContent="flex-end">
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={handleChange} />}
        label="Dark Mode"
        style={{ fontWeight: 'bold' }}
      />
    </Grid>
  )
}

export default DarkModeToggle
