/* eslint-disable no-undef */
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import axios from 'axios'
import { screen } from '@testing-library/react'
import { fireEvent } from '@storybook/testing-library'
import DevicesList from './DevicesList'
import { useCreateDevice, useDeleteDevice, useDevices, useUpdateDevice } from '../../../hooks'
import DevicesForm from '../Form/DevicesForm'

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

jest.mock('../../../hooks/useDevices', () => ({
  useDevices: jest.fn(),
}))

jest.mock('../../../hooks/useDeleteDevice', () => ({
  useDeleteDevice: jest.fn(),
}))

jest.mock('../../../hooks/useCreateDevice', () => ({
  useCreateDevice: jest.fn(),
}))

jest.mock('../../../hooks/useUpdateDevice', () => ({
  useUpdateDevice: jest.fn(),
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
    useDeleteDevice.mockImplementation(() => ({ mutation: { mutate: jest.fn() } }))
    useCreateDevice.mockImplementation(() => ({ mutation: {} }))
    useUpdateDevice.mockImplementation(() => ({ mutation: {} }))
  })

  test('should render device filter', () => {
    renderWithRouter(
      <Routes>
        <Route exact path='/' element={<DevicesList />} />
      </Routes>,
    )

    const filterElement = screen.getByText(/Device type/i)

    expect(filterElement).toBeInTheDocument()
  })

  test('should render sort by select', () => {
    renderWithRouter(
      <Routes>
        <Route exact path='/' element={<DevicesList />} />
      </Routes>,
    )

    const selectElement = screen.getByText(/Sort by/i)

    expect(selectElement).toBeInTheDocument()
  })

  test('should render device list', () => {
    renderWithRouter(
      <Routes>
        <Route exact path='/' element={<DevicesList />} />
      </Routes>,
    )

    const deviceList = screen.getByText(/Devices List/i)

    expect(deviceList).toBeInTheDocument()
  })

  test('should render add button', () => {
    renderWithRouter(
      <Routes>
        <Route exact path='/' element={<DevicesList />} />
      </Routes>,
    )

    const addButton = screen.getByText(/Add/i)

    expect(addButton).toBeInTheDocument()
  })

  test('should render device id', () => {
    renderWithRouter(
      <Routes>
        <Route exact path='/' element={<DevicesList />} />
      </Routes>,
    )

    const deviceId = screen.getByText(testMock[0].id)

    expect(deviceId).toBeInTheDocument()
  })

  test('should render device system', () => {
    renderWithRouter(
      <Routes>
        <Route exact path='/' element={<DevicesList />} />
      </Routes>,
    )

    const deviceSystem = screen.getByText(testMock[0].system_name)

    expect(deviceSystem).toBeInTheDocument()
  })

  test('should render device type', () => {
    renderWithRouter(
      <Routes>
        <Route exact path='/' element={<DevicesList />} />
      </Routes>,
    )

    const deviceType = screen.getByText('Windows Workstation')

    expect(deviceType).toBeInTheDocument()
  })

  test('should render device hdd capacity', () => {
    renderWithRouter(
      <Routes>
        <Route exact path='/' element={<DevicesList />} />
      </Routes>,
    )

    const deviceHdd = screen.getByText(`${testMock[0].hdd_capacity} GB`)

    expect(deviceHdd).toBeInTheDocument()
  })

  test('should render edit button when click on row', () => {
    renderWithRouter(
      <Routes>
        <Route exact path='/' element={<DevicesList />} />
      </Routes>,
    )

    const rowElement = screen.getByText(testMock[0].id)
    fireEvent.click(rowElement)

    const editButton = screen.getByText(/Edit/i)

    expect(editButton).toBeInTheDocument()
  })

  test('should render delete button when clicking on row', () => {
    renderWithRouter(
      <Routes>
        <Route exact path='/' element={<DevicesList />} />
      </Routes>,
    )

    const rowElement = screen.getByText(testMock[0].id)
    fireEvent.click(rowElement)

    const deleteButton = screen.getByText(/Delete/i)

    expect(deleteButton).toBeInTheDocument()
  })

  test('should not render edit button when clicking on more than one row', () => {
    renderWithRouter(
      <Routes>
        <Route exact path='/' element={<DevicesList />} />
      </Routes>,
    )

    const firstRow = screen.getByText(testMock[0].id)
    fireEvent.click(firstRow)

    const secondRow = screen.getByText(testMock[1].id)
    fireEvent.click(secondRow)

    const editButton = screen.queryByText(/Edit/i)

    expect(editButton).not.toBeInTheDocument()
  })

  test('should redirect to add page when clicking on add button', async () => {
    const { getByTestId } = renderWithRouter(
      <Routes>
        <Route exact path='/' element={<DevicesList />} />
        <Route path='/add' element={<DevicesForm />} />
      </Routes>,
    )

    await fireEvent.click(screen.getByText(/Add/i))

    expect(getByTestId('add-form')).toBeTruthy()
  })

  test('should delete row when clicking on delete button', async () => {
    renderWithRouter(
      <Routes>
        <Route exact path='/' element={<DevicesList />} />
      </Routes>,
    )

    await fireEvent.click(screen.getByText(testMock[1].id))

    await fireEvent.click(screen.getByText(/Delete/i))

    expect(useDeleteDevice).toBeCalled()
  })

  test('should redirect to edit page when clicking on edit button', async () => {
    jest.mock('react-router', () => ({
      ...jest.requireActual('react-router'),
      useLocation: jest.fn().mockImplementation(() => ({ pathname: '/' })),
      useParams: jest.fn().mockImplementation(() => ({ id: 'ID_TEST' })),
    }))

    useDevices.mockImplementation(() => ({
      devices: [testMock[0]],
      isLoading: false,
      refetch: jest.fn(),
      isRefetching: false,
      isFetching: false,
    }))

    const { getByTestId } = renderWithRouter(
      <Routes>
        <Route exact path='/' element={<DevicesList />} />
        <Route path='/edit/:id' element={<DevicesForm />} />
      </Routes>,
    )

    const rowElement = screen.getByText(testMock[0].id)
    fireEvent.click(rowElement)

    await fireEvent.click(screen.getByText(/Edit/i))

    expect(getByTestId('edit-form')).toBeTruthy()
  })
})
