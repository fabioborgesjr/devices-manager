import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import apiClient from '../services/axios-instance'

const postDevice = (data) => apiClient.post('', data)

export const useCreateDevice = (snackbarCallback) => {
  const navigate = useNavigate()
  const mutation = useMutation(postDevice, {
    onSuccess: () => {
      snackbarCallback('The device was created successfully!')
      navigate('/')
    },
  })

  return {
    mutation,
  }
}

export default useCreateDevice
