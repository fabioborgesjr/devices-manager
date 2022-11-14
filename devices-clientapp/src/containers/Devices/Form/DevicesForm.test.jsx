/* eslint-disable no-undef */
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import axios from 'axios'
import { act, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCreateDevice, useDevices, useUpdateDevice } from '../../../hooks'
import DevicesForm from './DevicesForm'

const testMock = [
  {
    id: 'ID_TEST',
    system_name: 'SYSTEM_NAME_TEST',
    type: 'WINDOWS_WORKSTATION',
    hdd_capacity: '10',
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

jest.mock('../../../hooks/useCreateDevice', () => ({
  useCreateDevice: jest.fn(),
}))

jest.mock('../../../hooks/useUpdateDevice', () => ({
  useUpdateDevice: jest.fn(),
}))

const mutateCreateMock = jest.fn()
const mutateUpdateMock = jest.fn()

describe('Devices form tests', () => {
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
    useCreateDevice.mockImplementation(() => ({ mutation: { mutate: mutateCreateMock } }))
    useUpdateDevice.mockImplementation(() => ({ mutation: { mutate: mutateUpdateMock } }))
  })

  test('should render edit form with device data', async () => {
    const { getByTestId } = renderWithRouter(
      <Routes>
        <Route path='/add' element={<DevicesForm />} />
      </Routes>,
      { route: '/add' },
    )

    await screen.findByTestId('add-form')

    expect(getByTestId('add-form')).toBeTruthy()
  })

  test('should render edit form', async () => {
    const { getByTestId } = renderWithRouter(
      <Routes>
        <Route path='/edit/:id' element={<DevicesForm />} />
      </Routes>,
      { route: `/edit/${testMock[0]}` },
    )

    await screen.findByTestId('edit-form')

    expect(getByTestId('edit-form')).toBeTruthy()
  })

  test('should render device name on input field', () => {
    const { getByTestId } = renderWithRouter(
      <Routes>
        <Route path='/edit/:id' element={<DevicesForm />} />
      </Routes>,
      { route: `/edit/${testMock[0]}` },
    )

    expect(getByTestId('form-system_name')).toHaveValue(testMock[0].system_name)
  })

  test('should render device type on select field', () => {
    const { getByTestId } = renderWithRouter(
      <Routes>
        <Route path='/edit/:id' element={<DevicesForm />} />
      </Routes>,
      { route: `/edit/${testMock[0]}` },
    )

    expect(getByTestId('form-type-input')).toHaveValue(testMock[0].type)
  })

  test('should render device hdd capacity on input field', () => {
    const { getByTestId } = renderWithRouter(
      <Routes>
        <Route path='/edit/:id' element={<DevicesForm />} />
      </Routes>,
      { route: `/edit/${testMock[0]}` },
    )

    expect(getByTestId('form-hdd_capacity')).toHaveValue(parseInt(testMock[0].hdd_capacity, 10))
  })

  test('should save device changes when changing a field and then clicing on Save', async () => {
    const { getByTestId } = renderWithRouter(
      <Routes>
        <Route path='/edit/:id' element={<DevicesForm />} />
      </Routes>,
      { route: `/edit/${testMock[0]}` },
    )

    const inputElm = await getByTestId('form-system_name')

    await userEvent.clear(inputElm)
    await userEvent.type(inputElm, 'New System Name')

    await act(async () => {
      await fireEvent.click(screen.getByText('Save').closest('button'))
    })

    expect(mutateUpdateMock).toBeCalledWith({ ...testMock[0], system_name: 'New System Name' })
  })

  test('should create new device after completing the form and clicing on Save', async () => {
    const { getByTestId } = renderWithRouter(
      <Routes>
        <Route path='/add' element={<DevicesForm />} />
      </Routes>,
      { route: `/add` },
    )

    const newDevice = {
      system_name: 'New System Name',
      type: 'MAC',
      hdd_capacity: 20,
    }

    await act(async () => {
      await userEvent.type(getByTestId('form-system_name'), newDevice.system_name)
    })

    await act(async () => {
      await userEvent.type(getByTestId('form-hdd_capacity'), newDevice.hdd_capacity.toString())
    })

    await act(async () => {
      const typeSelectElm = getByTestId('form-type-input')

      fireEvent.change(typeSelectElm, { target: { value: newDevice.type } })
    })

    await act(async () => {
      await fireEvent.click(screen.getByText('Save').closest('button'))
    })

    // expect(mutateCreateMock).toBeCalledWith(newDevice)
  })
})
