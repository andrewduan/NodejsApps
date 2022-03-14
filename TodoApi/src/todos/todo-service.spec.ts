import { Todo } from 'database/todo';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { DbProviderImpl } from '../database/mongoDb/db-provider.implementation';
import { TodoService } from './todo-service';
import { v4 as uuid } from 'uuid';
import TodoNotFoundException from '../exceptions/todoNotFoundException';
let todoService: TodoService;
let mockDbProvider: DbProviderImpl;
const id1 = uuid();
const id2 = uuid();
const todo1: Todo = {
  TodoId: id1,
  TaskName: 'Prepare Dinner',
  IsCompleted: false,
};
const todo2: Todo = {
  TodoId: id2,
  TaskName: 'Laundry',
  IsCompleted: true,
};
const getAllTodos = jest
  .fn()
  .mockImplementation()
  .mockResolvedValue([todo1, todo2]);
const getTodoById = jest.fn();
const getFilteredTodos = jest.fn();
const addTodo = jest.fn();
const deleteTodoById = jest.fn();
const patchTodo = jest.fn();
beforeAll(async () => {
  mockDbProvider = {
    getAllTodos,
    getTodoById,
    getFilteredTodos,
    addTodo,
    deleteTodoById,
    patchTodo,
  };
  container.register('DbProvider', {
    useValue: mockDbProvider,
  });

  todoService = new TodoService(mockDbProvider);
});
afterAll(() => {
  jest.resetAllMocks();
});

describe('Todo service', () => {
  it('should return all todos', async () => {
    const todos = await todoService.getAllTodos();
    expect(todos.length).toBe(2);
  });

  it('should return todo with specified id', async () => {
    getTodoById.mockImplementation().mockResolvedValue(todo2);
    const todo = await todoService.getTodoById(id2);
    expect(todo.todoId).toEqual(id2);
    expect(todo.taskName).toEqual('Laundry');
    expect(todo.isCompleted).toBeTruthy();
  });

  it('should throw exception with specified id does not exist', async () => {
    getTodoById
      .mockImplementation()
      .mockRejectedValueOnce(new TodoNotFoundException('not found'));
    const getMethod = async (id: string) => todoService.getTodoById(id);
    await expect(getMethod(id2)).rejects.toThrowError(
      new TodoNotFoundException('not found'),
    );
  });

  it('should return todos matches specified criteria', async () => {
    getFilteredTodos.mockImplementation().mockResolvedValue([todo1]);
    const todos = await todoService.getFilteredTodos({
      search: 'Pre',
      isCompleted: false,
    });
    expect(todos.length).toBe(1);
    expect(todos[0].todoId).toEqual(id1);
    expect(todos[0].taskName).toEqual('Prepare Dinner');
    expect(todos[0].isCompleted).toBeFalsy();
  });

  it('should return added todo', async () => {
    const todoInDb = {
      TodoId: uuid(),
      TaskName: 'Exercise',
      IsCompleted: true,
    };
    addTodo.mockImplementation().mockResolvedValue(todoInDb);
    const todo = await todoService.addTodo({ taskName: 'Exercise' });
    expect(todo.todoId).toEqual(todoInDb.TodoId);
    expect(todo.taskName).toEqual('Exercise');
    expect(todo.isCompleted).toBeTruthy();
  });

  it('should return updated todo', async () => {
    const todoInDb = {
      TodoId: uuid(),
      TaskName: 'Workout',
      IsCompleted: false,
    };
    patchTodo.mockImplementation().mockResolvedValue(todoInDb);
    const todo = await todoService.patchTodo(todoInDb.TodoId, {
      taskName: 'Workout',
      isCompleted: false,
    });
    expect(todo.todoId).toEqual(todoInDb.TodoId);
    expect(todo.taskName).toEqual('Workout');
    expect(todo.isCompleted).toBeFalsy();
  });

  it('should not throw exception when delete an existing id', async () => {
    deleteTodoById.mockImplementationOnce(() => Promise.resolve());
    await expect(todoService.deleteTodoById(id1)).resolves.toBe(void 0);
  });

  it('should throw exception when delete an id does not exist', async () => {
    deleteTodoById
      .mockImplementation()
      .mockRejectedValueOnce(new TodoNotFoundException('not found'));
    const deleteMethod = async (id: string) => todoService.deleteTodoById(id);
    await expect(deleteMethod(id2)).rejects.toThrowError(
      new TodoNotFoundException('not found'),
    );
  });
});
