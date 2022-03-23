import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import TodoList from './todo-list';
import { TodoModel, TodoState } from '../interfaces';
import { patchTodo } from '../util/api';
import { AxiosResponse } from 'axios';
import TodosContext from '../contexts/todo';

let todos: TodoModel[];

const mockDispatch = jest.fn();

let todoState: TodoState;
jest.mock('../util/api', () => ({
  ...jest.requireActual('../util/api'),
  patchTodo: jest.fn(),
  addTodo: jest.fn(),
  removeTodo: jest.fn(),
  getTodos: jest.fn(),
}));

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
  ];
  todoState = { todos };
});

const renderTodoList = (todosState: any, mockDispatch: any) =>{
  return render(<TodosContext.Provider value={{ state: todosState, dispatch: mockDispatch}}>
    <TodoList />
  </TodosContext.Provider>);
};

beforeEach(() => {
  mockDispatch.mockClear();
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('todo list', () => {
  it('should render todo list with passed in todos', () => {
    const component =  renderTodoList({todos}, mockDispatch);
    const todoItems = component.getAllByRole('listitem');

    expect(todoItems.length).toBe(2);
    expect(todoItems[0].children[0].textContent).toEqual('Prepare Dinner');
    expect(todoItems[0].children[0].className).not.toContain('line-through');
    expect(todoItems[1].children[0].textContent).toEqual('Laundry');
    expect(todoItems[1].children[0].className).toContain('line-through');
  });

  it('should fire event and update todo status-with provider', async () => {
    (patchTodo as jest.Mock).mockImplementation(
      () =>
        ({
          data: { TodoId: '1', TaskName: 'Prepare Dinner', IsCompleted: true },
        } as unknown as AxiosResponse<any, any>)
    );
    
    const component =  renderTodoList({todos}, mockDispatch);
    const todoItems = component.getAllByRole('listitem');
    const firstTodo = todoItems[0].children[0];
    fireEvent.doubleClick(firstTodo);
    
    await waitFor(() => expect(patchTodo).toHaveBeenCalledTimes(1));
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});
