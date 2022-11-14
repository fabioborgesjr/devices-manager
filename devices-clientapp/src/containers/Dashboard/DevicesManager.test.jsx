/* eslint-disable no-undef */
import React from 'react'
import axios from 'axios'
import { screen } from '@testing-library/react'
import { useCreateDevice, useDeleteDevice, useDevices, useUpdateDevice } from '../../hooks'
import DevicesManager from './DevicesManager'

const testMock = [
  {
    id: 'ID_TEST',
    system_name: 'SYSTEM_NAME_TEST',
    type: 'WINDOWS_WORKSTATION',
    hdd_capacity: '10',
  },
  {
    id: 'ID_TEST2',
    system_name: 'SYSTEM_NAME_TEST2',
    type: 'MAC',
    hdd_capacity: '11',
  },
]

jest.mock('axios', () => ({
  create: jest.fn(() => Promise.resolve()),
  post: jest.fn(() => Promise.resolve()),
}))

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn().mockImplementation(() => ({ pathname: '/' })),
}))

jest.mock('../../hooks/useDevices', () => ({
  useDevices: jest.fn(),
}))

jest.mock('../../hooks/useCreateDevice', () => ({
  useCreateDevice: jest.fn(),
}))

jest.mock('../../hooks/useUpdateDevice', () => ({
  useUpdateDevice: jest.fn(),
}))

jest.mock('../../hooks/useDeleteDevice', () => ({
  useDeleteDevice: jest.fn(),
}))

describe('Devices list tests', () => {
  beforeAll(() => {
    axios.create.mockReturnThis()
  })

  beforeEach(() => {
    useDevices.mockImplementation(() => ({
      devices: testMock,
      isLoading: false,
      refetch: jest.fn(),
      isRefetching: false,
      isFetching: false,
    }))
    useDeleteDevice.mockImplementation(() => ({ mutation: {} }))
    useCreateDevice.mockImplementation(() => ({ mutation: {} }))
    useUpdateDevice.mockImplementation(() => ({ mutation: {} }))
  })

  test('should render device list screen', () => {
    renderWithRouter(<DevicesManager />)

    const filterElement = screen.getByText(
      'List, create, update and delete devices, being able to filter and sort according to one or more device data fields',
    )

    expect(filterElement).toBeInTheDocument()
  })

  test('should render device add screen', () => {
    const route = '/add'

    renderWithRouter(<DevicesManager />, { route })

    const element = screen.getByText(
      'Add a new device by completing the form below and clicking on Save',
    )

    expect(element).toBeInTheDocument()
  })

  test('should render device add screen', () => {
    const route = '/edit/ID_TEST'

    renderWithRouter(<DevicesManager />, { route })

    const element = screen.getByText(
      'Change an existing device editing the form below and clicking on Save',
    )

    expect(element).toBeInTheDocument()
  })
})
