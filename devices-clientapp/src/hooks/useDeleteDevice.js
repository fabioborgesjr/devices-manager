import { useMutation } from 'react-query'
import apiClient from '../services/axios-instance'

const deleteDevice = async (id) => {
  const response = await apiClient.delete(id)

  return response.data
}

export const useDeleteDevice = () => {
  const mutation = useMutation(deleteDevice)

  return { mutation }
}

export default useDeleteDevice
