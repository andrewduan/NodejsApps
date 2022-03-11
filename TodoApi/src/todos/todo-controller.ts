import { Request, Response, NextFunction } from 'express';
import { ITodoService } from './todo-service-contract';
import { injectable, inject } from 'tsyringe';
import { TodoDto } from './dto/todo.dto';

@injectable()
class TodoController {
  constructor(@inject('TodoService') private service: ITodoService) {}

  public getAllTodos = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const todos = await this.service.getAllTodos();
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
    const todoData: TodoDto = request.body;
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
      response.send();
    } catch (e) {
      next(e);
    }
  };
}

export default TodoController;