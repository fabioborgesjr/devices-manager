// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { BrowserRouter as Router } from 'react-router-dom'

global.renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: Router }),
  }
}
