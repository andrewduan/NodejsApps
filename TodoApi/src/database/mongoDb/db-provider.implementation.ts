import { IDbConfig } from '../../config/db-config';
import { inject, singleton } from 'tsyringe';
import { IDbProvider } from '../db-provider.contract';
import { connect } from 'mongoose';
import { TodoModel } from './todo-schema';
import { Todo } from '../todo';
import { AddTodoDto } from '../../todos/dto/add-todo.dto';
import { FilterTodosDto } from '../../todos/dto/filter-todo.dto';
import { PatchTodoDto } from '../../todos/dto/patch-todo.dto';
import TodoNotFoundException from '../../exceptions/todoNotFoundException';
import { v4 as uuid } from 'uuid';

@singleton()
export class DbProviderImpl implements IDbProvider {
  constructor(@inject('DbConfig') private dbConfig: IDbConfig) {
    const { user, password, path } = this.dbConfig.mongoDb;
    connect(`mongodb+srv://${user}:${password}${path}`);
  }

  async getAllTodos(): Promise<Todo[]> {
    const todos = await TodoModel.find().exec();
    return todos;
  }

  async getTodoById(id: string): Promise<Todo> {
    const todo = await TodoModel.findOne({ TodoId: id }).exec();

    if (!todo) {
      throw new TodoNotFoundException(`Todo with id ${id} Not found`);
    }

    return todo;
  }

  async getFilteredTodos(filterDto: FilterTodosDto): Promise<Todo[]> {
    let allTodos = await this.getAllTodos();
    if (!!filterDto.isCompleted) {
      allTodos = allTodos.filter(
        (t) => t.IsCompleted === filterDto.isCompleted,
      );
    }
    if (filterDto.search) {
      allTodos = allTodos.filter(
        (t) => t.TaskName.indexOf(filterDto.search) > -1,
      );
    }
    return allTodos;
  }

  async addTodo(addTodoDto: AddTodoDto): Promise<Todo> {
    const todo: Todo = {
      TodoId: uuid(),
      TaskName: addTodoDto.taskName,
      IsCompleted: false,
    };

    await TodoModel.create(todo);
    return todo;
  }

  async deleteTodoById(id: string): Promise<void> {
    const todo = await this.getTodoById(id);

    if (!todo) {
      throw new TodoNotFoundException(`Todo with id ${id} Not found`);
    }
    await TodoModel.deleteOne({ TodoId: todo.TodoId }).exec();
  }

  async patchTodo(id: string, dto: PatchTodoDto): Promise<Todo> {
    const todo = await this.getTodoById(id);
    if (!todo) {
      throw new TodoNotFoundException(`Todo with id ${id} Not found`);
    }

    const { taskName, isCompleted } = dto;

    await TodoModel.updateOne(
      { TodoId: id },
      { $set: { TaskName: taskName, IsCompleted: isCompleted } },
    ).exec();
    return { TodoId: id, TaskName: taskName, IsCompleted: isCompleted };
  }
}
