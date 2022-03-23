import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import TodoList from './todo-list';
import { TodoModel, TodoState } from '../interfaces';
import { patchTodo } from '../util/api';
import { AxiosResponse } from 'axios';
import { useContext } from 'react';

const mockDispatch = jest.fn();

const todos: TodoModel[] = [
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
];

const todoState: TodoState = { todos };

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

jest.mock('../util/api', () => ({
  ...jest.requireActual('../util/api'),
  patchTodo: jest.fn(),
  addTodo: jest.fn(),
  removeTodo: jest.fn(),
  getTodos: jest.fn(),
}));

const renderTodoList = () => render(<TodoList />);

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('todo list without provider', () => {
  it('should fire event and update todo status', async () => {
    (patchTodo as jest.Mock).mockImplementation(
      () =>
        ({
          data: { TodoId: '1', TaskName: 'Prepare Dinner', IsCompleted: true },
        } as unknown as AxiosResponse<any, any>)
    );

    (useContext as jest.Mock).mockImplementation(() => ({
      state: todoState,
      dispatch: mockDispatch,
    }));

    renderTodoList();
    const todoItems = screen.getAllByRole('listitem');
    const firstTodo = todoItems[0].children[0];
    fireEvent.doubleClick(firstTodo);

    await waitFor(() => expect(patchTodo).toBeCalledTimes(1));
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});
