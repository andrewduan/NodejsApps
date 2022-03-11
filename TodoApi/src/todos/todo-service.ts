import { IDbProvider } from '../database/db-provider.contract';
import { AddTodoDto } from './dto/add-todo.dto';
import { FilterTodosDto } from './dto/filter-todo.dto';
import { PatchTodoDto } from './dto/patch-todo.dto';
import { TodoDto } from './dto/todo.dto';
import { inject, injectable } from 'tsyringe';
import { mapToDto } from '../utils/mapping-helper';
import { ITodoService } from './todo-service-contract';

@injectable()
export class TodoService implements ITodoService {
  constructor(@inject('DbProvider') private dbProvider: IDbProvider) {}
  async getAllTodos(): Promise<TodoDto[]> {
    const todos = await this.dbProvider.getAllTodos();
    return todos.map(mapToDto);
  }
  async getTodoById(id: string): Promise<TodoDto> {
    const todo = await this.dbProvider.getTodoById(id);
    return mapToDto(todo);
  }
  async getFilteredTodos(filterDto: FilterTodosDto): Promise<TodoDto[]> {
    const todos = await this.dbProvider.getFilteredTodos(filterDto);
    return todos.map(mapToDto);
  }
  async addTodo(addTodoDto: AddTodoDto): Promise<TodoDto> {
    const todo = await this.dbProvider.addTodo(addTodoDto);
    return mapToDto(todo);
  }
  async deleteTodoById(id: string): Promise<void> {
    await this.dbProvider.deleteTodoById(id);
  }
  async patchTodo(id: string, dto: PatchTodoDto): Promise<TodoDto> {
    const todo = await this.dbProvider.patchTodo(id, dto);
    return mapToDto(todo);
  }
}
