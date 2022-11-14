import React, { useMemo } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import DevicesList from '../Devices/List/DevicesList'
import DevicesForm from '../Devices/Form/DevicesForm'
import useSnackbar from '../../hooks/Snackbar/useSnackbar'
import { Box } from '@mui/material'

const DevicesManager = () => {
  const location = useLocation()
  const path = useMemo(() => location?.pathname || '', [location])

  const [renderCreatedSnackbar, showCreatedSnackbar] = useSnackbar({
    severity: 'success',
    text: 'The device was created successfully!',
  })

  const [renderUpdatedSnackbar, showUpdatedSnackbar] = useSnackbar({
    severity: 'success',
    text: 'The device was updated successfully!',
  })

  const [renderDeletedSnackbar, showDeletedSnackbar] = useSnackbar({
    severity: 'success',
    text: 'The device was deleted successfully!',
  })

  return (
    <Container component='main' maxWidth={path === '/' ? 'md' : 'sm'} sx={{ mb: 4 }}>
      <Box sx={{ mt: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography component='h1' variant='h4' align='center' sx={{ mb: 1 }}>
          Devices Manager
        </Typography>
        <Typography component='p' variant='caption' align='center'>
          {path.includes('edit')
            ? 'Change an existing device editing the form below and clicking on Save'
            : path === '/add'
            ? 'Add a new device by completing the form below and clicking on Save'
            : 'List, create, update and delete devices, being able to filter and sort according to one or more device data fields'}
        </Typography>
      </Box>
      <Paper variant='outlined' sx={{ mb: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Routes>
          <Route index element={<DevicesList showDeletedSnackbar={showDeletedSnackbar} />} />
          <Route path='/add' element={<DevicesForm showSuccessSnackbar={showCreatedSnackbar} />} />
          <Route
            path='/edit/:id'
            element={<DevicesForm showSuccessSnackbar={showUpdatedSnackbar} />}
          />
          <Route path='*' element={<Navigate replace to='/' />} />
        </Routes>
      </Paper>
      {renderCreatedSnackbar()}
      {renderUpdatedSnackbar()}
      {renderDeletedSnackbar()}
    </Container>
  )
}

export default DevicesManager
