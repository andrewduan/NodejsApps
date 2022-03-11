import { AddTodoDto } from '../todos/dto/add-todo.dto';
import { FilterTodosDto } from '../todos/dto/filter-todo.dto';
import { PatchTodoDto } from '../todos/dto/patch-todo.dto';
import { Todo } from './todo';

export interface IDbProvider {
  getAllTodos(): Promise<Todo[]>;
  getTodoById(id: string): Promise<Todo>;
  getFilteredTodos(filterDto: FilterTodosDto): Promise<Todo[]>;
  addTodo(addTodoDto: AddTodoDto): Promise<Todo>;
  deleteTodoById(id: string): Promise<void>;
  patchTodo(id: string, dto: PatchTodoDto): Promise<Todo>;
}
