import React, { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import LabelledSelect from '../../../components/Select/LabelledSelect'
import EnhancedTable from '../../../components/Table/EnhancedTable'
import { deviceOptions, deviceOptionsWithAll, sortOptions } from '../../../constants/index'
import { useDevices } from '../../../hooks'

const headCells = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'ID',
    align: 'center',
  },
  {
    id: 'system_name',
    numeric: false,
    disablePadding: true,
    label: 'System Name',
    align: 'center',
  },
  {
    id: 'type',
    numeric: false,
    disablePadding: true,
    label: 'Type',
    align: 'center',
    formatter: (value) => deviceOptions.find((device) => value === device.value).label,
  },
  {
    id: 'hdd_capacity',
    numeric: false,
    disablePadding: true,
    label: 'HDD Capacity',
    align: 'center',
    formatter: (value) => `${value} GB`,
  },
]

const DevicesList = ({ showDeletedSnackbar }) => {
  const { devices, isLoading, refetch, isRefetching, isFetching } = useDevices()
  const location = useLocation()
  const [deviceFilter, setDeviceFilter] = useState([deviceOptionsWithAll[0].value])
  const [deviceSort, setDeviceSort] = useState(sortOptions[3].value)

  const handleFilterChange = useCallback(
    (event) => {
      const newFilters = event.target.value

      if (deviceFilter.includes('ALL') && newFilters.length > 1) {
        setDeviceFilter(newFilters.filter((filter) => filter !== 'ALL'))
      } else if (newFilters.includes('ALL')) {
        setDeviceFilter(['ALL'])
      } else {
        setDeviceFilter(newFilters)
      }
    },
    [deviceFilter],
  )

  const handleSortChange = useCallback((event) => {
    setDeviceSort(event.target.value)
  })

  const filterDevices = useCallback(
    () =>
      !deviceFilter.includes('ALL')
        ? devices.filter((device) => deviceFilter.some((filter) => device.type === filter))
        : devices,
    [devices, deviceFilter],
  )

  useEffect(() => {
    refetch()
  }, [location])

  return (
    <>
      <Grid container spacing={2} sx={{ p: { xs: 2, sm: 2 }, ml: { xs: 0.2, sm: 2 } }}>
        <Grid item sx={{ pl: '0!important', pr: 2 }}>
          <LabelledSelect
            leftLabel='Device Type:'
            id='deviceType'
            name='deviceType'
            autoComplete='deviceType'
            options={deviceOptionsWithAll}
            value={deviceFilter}
            onChange={handleFilterChange}
            multiple
          />
        </Grid>
        <Grid item sx={{ pl: { xs: '0!important' } }}>
          <LabelledSelect
            leftLabel='Sort by:'
            id='sortBy'
            name='sortBy'
            autoComplete='sortBy'
            options={sortOptions}
            value={deviceSort}
            onChange={handleSortChange}
          />
        </Grid>
      </Grid>
      <Box sx={{ p: { xs: 2, sm: 2 }, pt: '0!important' }}>
        <EnhancedTable
          data={filterDevices()}
          headCells={headCells}
          deviceSort={deviceSort}
          refetch={refetch}
          showDeletedSnackbar={showDeletedSnackbar}
          isLoading={Boolean(isLoading || isRefetching || isFetching)}
        />
      </Box>
    </>
  )
}

DevicesList.propTypes = {
  showDeletedSnackbar: PropTypes.func,
}

export default DevicesList
