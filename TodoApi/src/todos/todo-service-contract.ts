import { AddTodoDto } from './dto/add-todo.dto';
import { FilterTodosDto } from './dto/filter-todo.dto';
import { PatchTodoDto } from './dto/patch-todo.dto';
import { TodoDto } from './dto/todo.dto';

export interface ITodoService {
  getAllTodos(): Promise<TodoDto[]>;
  getTodoById(id: string): Promise<TodoDto>;
  getFilteredTodos(filterDto: FilterTodosDto): Promise<TodoDto[]>;
  addTodo(addTodoDto: AddTodoDto): Promise<TodoDto>;
  deleteTodoById(id: string): Promise<void>;
  patchTodo(id: string, dto: PatchTodoDto): Promise<TodoDto>;
}
