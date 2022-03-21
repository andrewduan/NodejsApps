import { cleanup, render, screen } from '@testing-library/react'
import TodoForm from './todo-form'

afterEach(() => {
  cleanup()
  jest.resetAllMocks()
})

describe('todo form', () => {
  it('should render todo form', () => {
    render(<TodoForm />)

    const todoInput = screen.getAllByRole('textbox')
    expect(todoInput.length).toBe(1)
  })
})
