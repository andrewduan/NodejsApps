import TodoNotFoundException from '../exceptions/todoNotFoundException';
import { Request, Response, NextFunction, Router } from 'express';
import todoModel from './todoModel';
import Todo from './todoInteface';

const mongoose = require('mongoose');
 
class TodoController {
  public path = '/todos';
  public router = Router();

  constructor(){
    this.connectToTheDatabase();
  }

  private connectToTheDatabase() {
    const {
      MONGO_USER,
      MONGO_PASSWORD,
      MONGO_PATH,
    } = process.env;
    console.log(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);
    
    mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`,{ useNewUrlParser: true, useUnifiedTopology: true  });
  }

  public async getAllTodos(request: Request, response: Response) {
    const todos = await todoModel.find();
    response.send(todos);
  }

  public async getTodoById(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;
    const todo = await todoModel.findOne({"TodoId": id});
    if (todo) {
      response.send(todo);
    } else {
      next(new TodoNotFoundException(id));
    }
  }

  public async modifyTodo(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;
    const todoData: Todo = request.body;
    const todo = await todoModel.findOne({"TodoId": id});
    if (todo) {
      await todoModel.updateOne({'TodoId': id}, { $set: {...todoData}});
      response.send(todoData);
    } else {
      next(new TodoNotFoundException(`${id}`));
    }
  }

  public async createTodo(request: Request, response: Response) {
    
    console.log('todoData request passed in', request.body);
    const todoData: Todo = request.body;

   
    const createdTodo = new todoModel();    
    const savedTodo = await todoModel.create({...todoData});
    response.send(savedTodo);
  }

  public async deleteTodo(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;
    const successResponse = await todoModel.deleteOne({"TodoId": id});
    if (successResponse) {
      const todos = await todoModel.find();
      response.send(todos);
    } else {
      next(new TodoNotFoundException(`${id}`));
    }
  }
}

export default new TodoController();