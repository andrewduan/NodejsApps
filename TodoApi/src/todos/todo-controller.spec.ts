import 'reflect-metadata';
import { TodoDto } from './dto/todo.dto';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { TodoService } from './todo-service';
import { v4 as uuid } from 'uuid';
import TodoController from './todo-controller';
import TodoNotFoundException from '../exceptions/todoNotFoundException';
import { PatchTodoDto } from './dto/patch-todo.dto';
let mockTodoService: TodoService;
let todoController: TodoController;
const id1 = uuid();
const id2 = uuid();
const todo1: TodoDto = {
  todoId: id1,
  taskName: 'Prepare Dinner',
  isCompleted: false,
};
const todo2: TodoDto = {
  todoId: id2,
  taskName: 'Laundry',
  isCompleted: true,
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
  mockTodoService = {
    getAllTodos,
    getTodoById,
    getFilteredTodos,
    addTodo,
    deleteTodoById,
    patchTodo,
  } as unknown as TodoService;
  container.register('TodoService', {
    useValue: mockTodoService,
  });

  todoController = new TodoController(mockTodoService);
});
afterEach(() => {
  jest.resetAllMocks();
});

describe('Todo controller', () => {
  it('should return all todos', async () => {
    getAllTodos.mockImplementation().mockResolvedValueOnce([todo1, todo2]);
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const nextFn = jest.fn();
    await todoController.getAllTodos(req, res, nextFn);
    expect(mockTodoService.getAllTodos).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith([todo1, todo2]);
  });

  it('should return todos matches specified criteria', async () => {
    getFilteredTodos.mockImplementation().mockResolvedValue([todo1]);
    const req = { query: { search: 'Pre', isCompleted: false } } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const nextFn = jest.fn();
    await todoController.getAllTodos(req, res, nextFn);
    expect(mockTodoService.getFilteredTodos).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith([todo1]);
  });

  it('should return todo with specified id', async () => {
    getTodoById.mockImplementationOnce((id: string) => {
      if (id === '1') return todo1;
      if (id === '2') return todo2;
    });
    const req = { params: { id: '1' } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const nextFn = jest.fn();
    await todoController.getTodoById(req, res, nextFn);
    expect(mockTodoService.getTodoById).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalledWith(todo1);
  });

  it('should throw exception with specified id does not exist', async () => {
    getTodoById.mockImplementationOnce(() => {
      throw new TodoNotFoundException('not found');
    });
    const req = { params: { id: '1' } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const nextFn = jest.fn();
    await todoController.getTodoById(req, res, nextFn);
    expect(mockTodoService.getTodoById).toBeCalledTimes(1);
    expect(nextFn).toBeCalledWith(new TodoNotFoundException('not found'));
  });

  /***
   * use it.each for passing customized parameter
   */
  it.each(['new task'])('should return added todo', async (taskName) => {
    const testTodoId = uuid();
    addTodo.mockImplementationOnce(() => ({
      todoId: testTodoId,
      taskName,
      isCompleted: false,
    }));
    const req = { body: { taskName } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const nextFn = jest.fn();
    await todoController.createTodo(req, res, nextFn);
    expect(mockTodoService.addTodo).toBeCalledTimes(1);
    expect(res.send).toBeCalledWith({
      todoId: testTodoId,
      taskName,
      isCompleted: false,
    });
  });

  it('should return updated todo', async () => {
    const testTodoId = uuid();
    patchTodo.mockImplementationOnce((id, dto: PatchTodoDto) => ({
      todoId: id,
      taskName: dto.taskName,
      isCompleted: dto.isCompleted,
    }));
    const req = {
      params: { id: testTodoId },
      body: { taskName: 'new task', isCompleted: true },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const nextFn = jest.fn();
    await todoController.modifyTodo(req, res, nextFn);
    expect(mockTodoService.patchTodo).toBeCalledTimes(1);
    expect(res.send).toBeCalledWith({
      todoId: testTodoId,
      taskName: 'new task',
      isCompleted: true,
    });
  });

  it('should throw exception when update an id does not exist', async () => {
    patchTodo.mockImplementationOnce(() => {
      throw new TodoNotFoundException('not found');
    });
    const req = {
      params: { id: '1' },
      body: { taskName: 'new task', isCompleted: false },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const nextFn = jest.fn();
    await todoController.modifyTodo(req, res, nextFn);
    expect(mockTodoService.patchTodo).toBeCalledTimes(1);
    expect(nextFn).toBeCalledWith(new TodoNotFoundException('not found'));
  });

  it('should delete successfully when delete an existing id', async () => {
    deleteTodoById.mockImplementationOnce(() => Promise.resolve());
    const req = {
      params: { id: id1 },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const nextFn = jest.fn();
    await todoController.deleteTodo(req, res, nextFn);
    expect(mockTodoService.deleteTodoById).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(200);
    expect(res.send).toBeCalled();
  });

  it('should throw exception when delete an id does not exist', async () => {
    deleteTodoById.mockImplementationOnce(() => {
      throw new TodoNotFoundException('Wrong id');
    });
    const req = {
      params: { id: uuid() },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const nextFn = jest.fn();
    await todoController.deleteTodo(req, res, nextFn);
    expect(mockTodoService.deleteTodoById).toBeCalledTimes(1);
    expect(nextFn).toBeCalledWith(new TodoNotFoundException('Wrong id'));
  });
});
