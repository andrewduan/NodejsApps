import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import TodoList from './todo-list'
import { TodoAction, TodoModel, TodoState } from '../interfaces'
import { useContext } from 'react'
import { patchTodo } from '../util/api'
import { AxiosResponse } from 'axios'

let todos: TodoModel[]

const dispatch: (actionPayload: TodoAction) => void = jest.fn()

let todoState: TodoState

jest.mock('../util/api', () => ({
  ...jest.requireActual('../util/api'),
  patchTodo: jest.fn(),
  addTodo: jest.fn(),
  removeTodo: jest.fn(),
  getTodos: jest.fn(),
}))

beforeEach(() => {
  todos = [
    {
      id: '1',
      taskName: 'Prepare Dinner',
      completed: false,
    },
    {
      id: '2',
      taskName: 'Laundry',
      completed: true,
    },
  ]

  todoState = { todos }
})

afterEach(() => {
  cleanup()
  jest.resetAllMocks()
})

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
  useReducer: jest.fn(),
}))

jest.mock('../util/api', () => ({
  ...jest.requireActual('../util/api'),
  patchTodo: jest.fn(),
  addTodo: jest.fn(),
  removeTodo: jest.fn(),
  getTodos: jest.fn(),
}))

describe('todo list', () => {
  it('should render todo list with passed in todos', () => {
    ;(useContext as jest.Mock).mockImplementation(() => ({
      state: todoState,
      dispatch,
    }))

    render(<TodoList />)

    const todoItems = screen.getAllByRole('listitem')
    expect(todoItems.length).toBe(2)
    expect(todoItems[0].children[0].textContent).toEqual('Prepare Dinner')
    expect(todoItems[0].children[0].className).not.toContain('line-through')
    expect(todoItems[1].children[0].textContent).toEqual('Laundry')
    expect(todoItems[1].children[0].className).toContain('line-through')
  })

  it('should fire event and update todo status', async () => {
    ;(patchTodo as jest.Mock).mockImplementation(
      () =>
        ({
          data: { TodoId: '1', TaskName: 'Prepare Dinner', IsCompleted: true },
        } as unknown as AxiosResponse<any, any>)
    )

    ;(useContext as jest.Mock).mockImplementation(() => ({
      state: todoState,
      dispatch,
    }))

    render(<TodoList />)

    const todoItems = screen.getAllByRole('listitem')
    const todoElement1 = todoItems[0].children[0]
    fireEvent.doubleClick(todoElement1)
    expect(patchTodo).toBeCalledTimes(1)
    // TODO need to figure out how to verify dispatch
    // expect(dispatch).toHaveBeenCalledTimes(1);
    // expect(todoElement1.className).toContain("line-through");
  })
})
