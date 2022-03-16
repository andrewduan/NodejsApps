import { Request, Response, NextFunction } from 'express';
import { ITodoService } from './todo-service-contract';
import { injectable, inject } from 'tsyringe';
import { TodoDto } from './dto/todo.dto';
import { FilterTodosDto } from './dto/filter-todo.dto';
import { valueToBoolean } from '../utils/boolean-transformer';
import { PatchTodoDto } from './dto/patch-todo.dto';

@injectable()
class TodoController {
  constructor(@inject('TodoService') private service: ITodoService) {}

  public getAllTodos = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { search, isCompleted } = request.query || {};

      let todos: TodoDto[];
      if (search || isCompleted) {
        // TODO, trying to bind to filterTodosDto and execute transform, still working on it
        const filterTodosDto: FilterTodosDto = {
          search,
          isCompleted: valueToBoolean(isCompleted),
        };
        todos = await this.service.getFilteredTodos(filterTodosDto);
      } else {
        todos = await this.service.getAllTodos();
      }
      response.status(200);
      response.send(todos);
    } catch (e) {
      next(e);
    }
  };

  public getTodoById = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = request.params.id;
    try {
      const todo = await this.service.getTodoById(id);
      response.status(200);
      response.send(todo);
    } catch (e) {
      next(e);
    }
  };

  public modifyTodo = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = request.params.id;
    const todoData: PatchTodoDto = request.body;
    const { taskName, isCompleted } = todoData;
    try {
      const todo = await this.service.patchTodo(id, { taskName, isCompleted });
      response.send(todo);
    } catch (e) {
      next(e);
    }
  };

  public createTodo = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const todoData: TodoDto = request.body;
      const savedTodo = await this.service.addTodo({
        taskName: todoData.taskName,
      });
      response.send(savedTodo);
    } catch (e) {
      next(e);
    }
  };

  public deleteTodo = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = request.params.id;
    try {
      await this.service.deleteTodoById(id);
      response.status(200);
      response.send();
    } catch (e) {
      next(e);
    }
  };
}

export default TodoController;
