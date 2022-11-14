import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import DevicesManager from '../containers/Dashboard/DevicesManager'
import { red, green } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    primary: {
      main: red[200],
      light: red[400],
    },
    error: {
      main: red[500],
    },
    success: {
      main: green[400],
    },
  },
})

const DashboardPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <DevicesManager />
      </Router>
    </ThemeProvider>
  )
}

export default DashboardPage
