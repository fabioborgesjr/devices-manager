import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  TextField,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import PureSelect from '../../../components/Select/PureSelect'
import { deviceOptions } from '../../../constants/index'
import { useDevices, useCreateDevice, useUpdateDevice } from '../../../hooks/index'

const schema = yup
  .object({
    system_name: yup.string().required(),
    type: yup.string().required(),
    hdd_capacity: yup.number().positive().integer().required(),
  })
  .required()

export const FormComponent = ({ defaultForm, showSuccessSnackbar }) => {
  const { mutation } = defaultForm
    ? useUpdateDevice(showSuccessSnackbar)
    : useCreateDevice(showSuccessSnackbar)
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, defaultValues },
    reset,
  } = useForm({
    defaultValues: {
      system_name: defaultForm?.system_name || '',
      type: defaultForm?.type || '',
      hdd_capacity: defaultForm?.hdd_capacity || undefined,
    },
    resolver: yupResolver(schema),
  })

  const onSubmit = (data) => {
    const formattedData = { ...data, hdd_capacity: data.hdd_capacity.toString() }

    mutation.mutate(defaultForm ? { ...defaultForm, ...formattedData } : formattedData)
  }

  useEffect(() => {
    if (defaultForm) {
      reset({
        system_name: defaultForm.system_name,
        type: defaultForm.type,
        hdd_capacity: defaultForm.hdd_capacity,
      })
    }
  }, [defaultForm])

  return (
    <form data-testid={defaultForm ? 'edit-form' : 'add-form'} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} sx={{ p: { xs: 2, sm: 2 } }}>
        <Grid item xs={12}>
          <TextField
            {...register('system_name')}
            fullWidth
            label='System Name'
            helperText={errors.system_name?.message}
            aria-invalid={errors.system_name ? 'true' : 'false'}
            required
            variant='standard'
            inputProps={{ 'data-testid': 'form-system_name' }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl required variant='standard' sx={{ minWidth: '100%' }}>
            <InputLabel id='type-label'>Type</InputLabel>
            <PureSelect
              {...register('type')}
              id='type'
              autoComplete='type'
              options={deviceOptions}
              defaultValue={defaultValues.type}
              inputProps={{ 'data-testid': 'form-type-input' }}
              aria-invalid={errors.type ? 'true' : 'false'}
              data-testid={'form-type-select'}
              fullWidth
            />
          </FormControl>
          <FormHelperText>{errors.type?.message}</FormHelperText>
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...register('hdd_capacity')}
            type='number'
            fullWidth
            label='HDD Capacity'
            helperText={errors.hdd_capacity?.message}
            aria-invalid={errors.hdd_capacity ? 'true' : 'false'}
            required
            variant='standard'
            inputProps={{ inputMode: 'numeric', min: 1, 'data-testid': 'form-hdd_capacity' }}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type='submit'
              variant='contained'
              onClick={handleSubmit(onSubmit)}
              sx={{ mt: 1, ml: 1, color: '#fff' }}
              disabled={Boolean(Object.keys(errors).length || !Object.keys(dirtyFields).length)}
            >
              Save
            </Button>
            <Button component={Link} to='/' sx={{ mt: 1, ml: 1 }}>
              Back
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  )
}

FormComponent.propTypes = {
  defaultForm: PropTypes.shape({
    id: PropTypes.string.isRequired,
    hdd_capacity: PropTypes.string.isRequired,
    system_name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }),
  showSuccessSnackbar: PropTypes.func,
}

FormComponent.defaultProps = {
  defaultForm: null,
}

const DevicesForm = ({ showSuccessSnackbar }) => {
  const { id } = useParams()

  if (!id) {
    return <FormComponent showSuccessSnackbar={showSuccessSnackbar} />
  }

  const { devices, isLoading } = useDevices(id)
  const defaultForm = devices.length === 1 ? devices[0] : null

  return isLoading || !defaultForm ? null : (
    <FormComponent defaultForm={defaultForm} showSuccessSnackbar={showSuccessSnackbar} />
  )
}

DevicesForm.propTypes = {
  showSuccessSnackbar: PropTypes.func,
}

export default DevicesForm
