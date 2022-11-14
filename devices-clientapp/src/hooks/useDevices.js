import { useCallback, useState } from 'react'
import { useQuery } from 'react-query'
import apiClient from '../services/axios-instance'

const fetchDevices = async ({ queryKey }) => {
  const response = await apiClient.get(queryKey[1] || '')

  return response.data
}

export const useDevices = (id) => {
  const [devices, setDevices] = useState([])

  const { isLoading, isError, isRefetching, isFetching, error, refetch } = useQuery(
    ['devices', id],
    fetchDevices,
    {
      onSuccess: (data) => setDevices(Array.isArray(data) ? data : [data]),
    },
  )

  const handleRefetch = useCallback(
    async (itemsToRemove) => {
      setDevices([])

      refetch(itemsToRemove).then((res) => {
        if (res.isSuccess && itemsToRemove) {
          setDevices(
            devices.filter(
              (device) => !itemsToRemove.some((itemToRemove) => itemToRemove === device.id),
            ),
          )
        }
      })
    },
    [refetch, devices],
  )

  return {
    isLoading,
    isError,
    devices,
    error,
    refetch: handleRefetch,
    isRefetching,
    isFetching,
  }
}

export default useDevices
