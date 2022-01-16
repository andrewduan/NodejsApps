import TodoNotFoundException from '../exceptions/todoNotFoundException';
import { Request, Response, NextFunction, Router } from 'express';
import Controller from '../interfaces/controllerInterface';
import Todo from './todoInteface';
import todoModel from './todoModel';

var bodyParser = require('body-parser');
 
// create application/json parser
var jsonParser = bodyParser.json();
 

class TodoController implements Controller {
  public path = '/todos';
  public router = Router();
  private todo = todoModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllTodos);
    this.router
      .patch(`${this.path}/:id`, jsonParser, this.modifyTodo)
      .delete(`${this.path}/:id`, this.deleteTodo)
      .post(this.path, jsonParser, this.createTodo);
  }

  private getAllTodos = async (request: Request, response: Response) => {
    const todos = await this.todo.find();
    response.send(todos);
  }

  private getTodoById = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const todo = await this.todo.findOne({"TodoId": parseInt(id)});
    if (todo) {
      response.send(todo);
    } else {
      next(new TodoNotFoundException(id));
    }
  }

  private modifyTodo = async (request: Request, response: Response, next: NextFunction) => {
    const id = parseInt(request.params.id);
    const todoData: Todo = request.body;
    const todo = await this.todo.findOne({"TodoId": id});
    if (todo) {
      await this.todo.updateOne({'TodoId': id}, { $set: {...todoData}});
      response.send(todo);
    } else {
      next(new TodoNotFoundException(`${id}`));
    }
  }

  private createTodo = async (request: Request, response: Response) => {
    
    console.log('todoData request passed in', request.body);
    const todoData: Todo = request.body;

   
    const createdTodo = new this.todo();    
    const savedTodo = await this.todo.create({...todoData});
    response.send(savedTodo);
  }

  private deleteTodo = async (request: Request, response: Response, next: NextFunction) => {
    const id = parseInt(request.params.id);
    const successResponse = await this.todo.deleteOne({"TodoId": id});
    if (successResponse) {
      const todos = await this.todo.find();
      response.send(todos);
    } else {
      next(new TodoNotFoundException(`${id}`));
    }
  }
}

export default TodoController;