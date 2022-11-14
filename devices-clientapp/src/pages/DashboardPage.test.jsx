/* eslint-disable no-undef */
import React from 'react'
import axios from 'axios'
import { render, screen } from '@testing-library/react'
import DashboardPage from './DashboardPage'
import { useDeleteDevice, useDevices } from '../hooks'

jest.mock('axios', () => ({
  create: jest.fn(() => Promise.resolve()),
  post: jest.fn(() => Promise.resolve()),
}))

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn().mockImplementation(() => ({ pathname: '/' })),
}))

jest.mock('../hooks/useDevices', () => ({
  useDevices: jest.fn(),
}))

jest.mock('../hooks/useDeleteDevice', () => ({
  useDeleteDevice: jest.fn(),
}))

describe('Devices list tests', () => {
  beforeAll(() => {
    axios.create.mockReturnThis()
  })

  beforeEach(() => {
    useDevices.mockImplementation(() => ({
      isLoading: false,
      refetch: jest.fn(),
      isRefetching: false,
      isFetching: false,
    }))
    useDeleteDevice.mockImplementation(() => ({
      mutation: {},
    }))
  })

  test('should render page', () => {
    render(<DashboardPage />)

    const filterElement = screen.getByText('Devices Manager')

    expect(filterElement).toBeInTheDocument()
  })
})
