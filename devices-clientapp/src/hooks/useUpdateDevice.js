import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import apiClient from '../services/axios-instance'

const updateDevice = ({ id, ...data }) => apiClient.put(id, data)

export const useUpdateDevice = (snackbarCallback) => {
  const navigate = useNavigate()
  const mutation = useMutation(updateDevice, {
    onSuccess: () => {
      snackbarCallback('The device was updated successfully!')
      navigate('/')
    },
  })

  return {
    mutation,
  }
}

export default useUpdateDevice
