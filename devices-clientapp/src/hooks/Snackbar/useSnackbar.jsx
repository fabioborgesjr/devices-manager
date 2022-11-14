import React, { useCallback, forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const useSnackbar = ({ severity, text }) => {
  const [open, setOpen] = useState(false)

  const handleClose = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }, [])

  const showSnackbar = useCallback(() => {
    setOpen(true)
  }, [])

  const renderSnackbar = () => {
    return (
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity={severity} sx={{ width: '100%', color: '#fff' }}>
            {text}
          </Alert>
        </Snackbar>
      </Stack>
    )
  }

  return [renderSnackbar, showSnackbar]
}

useSnackbar.propTypes = {
  severity: PropTypes.string,
  text: PropTypes.string,
}

export default useSnackbar
