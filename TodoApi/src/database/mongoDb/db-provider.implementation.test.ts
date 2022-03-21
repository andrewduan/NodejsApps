import 'reflect-metadata';
import { TodoModel } from './todo-schema';
import { DbProviderImpl } from './db-provider.implementation';
import { v4 as uuid } from 'uuid';
import { connectionString, closeDatabase } from '../test/db';
import { IDbConfig } from 'config/db-config';
import { container } from 'tsyringe';
import TodoNotFoundException from '../../exceptions/todoNotFoundException';
const id1 = uuid();
const id2 = uuid();
let dbproviderImpl: DbProviderImpl;
beforeAll(async () => {
  const mockDbConfig: IDbConfig = {
    connectionString: jest.fn().mockReturnValue(await connectionString()),
  };
  container.register('DbProvider', {
    useValue: new DbProviderImpl(mockDbConfig),
  });
  //Prepare initial data
  const todo1 = new TodoModel();
  todo1.TodoId = id1;
  todo1.TaskName = 'Prepare Dinner';
  todo1.IsCompleted = false;
  await todo1.save();
  const todo2 = new TodoModel();
  todo2.TodoId = id2;
  todo2.TaskName = 'Laundry';
  todo2.IsCompleted = true;
  await todo2.save();
  dbproviderImpl = new DbProviderImpl(mockDbConfig); //container.resolve('DbProvider');
});

afterAll(async () => {
  await closeDatabase();
});

describe('dbprovider tests', () => {
  it('should return all todos', async () => {
    const todos = await dbproviderImpl.getAllTodos();
    expect(todos.length).toBe(2);
  });

  it('should return expected todo with id', async () => {
    const todo = await dbproviderImpl.getTodoById(id2);
    expect(todo.TaskName).toBe('Laundry');
    expect(todo.TodoId).toBe(id2);
    expect(todo.IsCompleted).toBeTruthy();
  });

  it('should throw exception when trying to get a todo with an id does not exist', async () => {
    const testId = uuid();
    await expect(dbproviderImpl.getTodoById(testId)).rejects.toThrowError(
      TodoNotFoundException,
    );
    await expect(dbproviderImpl.getTodoById(testId)).rejects.toThrow(
      `Todo with id ${testId} Not found`,
    );
  });

  it('should return expected todo match passed in criteria', async () => {
    const todos = await dbproviderImpl.getFilteredTodos({
      search: 'Dinner',
      isCompleted: false,
    });
    expect(todos.length).toBe(1);
    expect(todos[0].TaskName).toBe('Prepare Dinner');
    expect(todos[0].TodoId).toBe(id1);
    expect(todos[0].IsCompleted).toBeFalsy();
  });

  it('should add todo', async () => {
    await dbproviderImpl.addTodo({ taskName: 'Exercise' });
    const todos = await dbproviderImpl.getFilteredTodos({ search: 'Exercise' });
    expect(todos.length).toBe(1);
    expect(todos[0].TaskName).toBe('Exercise');
    expect(todos[0].IsCompleted).toBeFalsy();
  });

  it('should update todo with passed in values', async () => {
    await dbproviderImpl.patchTodo(id2, {
      taskName: 'Swimming',
      isCompleted: false,
    });
    const todo = await dbproviderImpl.getTodoById(id2);
    expect(todo.TaskName).toBe('Swimming');
    expect(todo.IsCompleted).toBeFalsy();
  });

  it('should throw exception when trying to update a todo with an id does not exist', async () => {
    const testId = uuid();
    const patchMethod = async () =>
      await dbproviderImpl.patchTodo(testId, {
        taskName: 'some task',
        isCompleted: false,
      });
    await expect(patchMethod()).rejects.toThrowError(TodoNotFoundException);
    await expect(patchMethod()).rejects.toThrow(
      `Todo with id ${testId} Not found`,
    );
  });

  it('should delete todo', async () => {
    await dbproviderImpl.addTodo({ taskName: 'Clean backyard' });

    const todos = await dbproviderImpl.getFilteredTodos({
      search: 'Clean backyard',
    });
    expect(todos.length).toBe(1);

    const newAddedId = todos[0].TodoId;
    await dbproviderImpl.deleteTodoById(newAddedId);

    const todosAfterDelete = await dbproviderImpl.getFilteredTodos({
      search: 'Clean backyard',
    });
    expect(todosAfterDelete.length).toBe(0);
  });

  it('should throw exception when trying to delete a todo with an id does not exist', async () => {
    const testId = uuid();
    const deleteMethod = async () =>
      await dbproviderImpl.deleteTodoById(testId);
    await expect(deleteMethod).rejects.toThrowError(TodoNotFoundException);
    await expect(deleteMethod).rejects.toThrow(
      `Todo with id ${testId} Not found`,
    );
  });
});
