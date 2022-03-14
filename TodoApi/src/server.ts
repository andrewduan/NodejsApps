import 'reflect-metadata';
import 'dotenv/config';

import exceptionMiddleware from './middlewares/exceptionMiddleware';
import { container } from 'tsyringe';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { TodoService } from './todos/todo-service';
import { DbProviderImpl } from './database/mongoDb/db-provider.implementation';
import { DbConfig } from './config/db-config';

import TodoController from './todos/todo-controller';

container.register('DbConfig', { useClass: DbConfig });
container.register('DbProvider', { useClass: DbProviderImpl });
container.register('TodoService', { useClass: TodoService });
const todoController = container.resolve(TodoController);

const app = express();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

const path = '/todos';

// create application/json parser
const jsonParser = bodyParser.json();

app.get(path, todoController.getAllTodos);
app.get(`${path}/:id`, todoController.getTodoById);
app.patch(`${path}/:id`, jsonParser, todoController.modifyTodo);
app.delete(`${path}/:id`, todoController.deleteTodo);
app.post(path, jsonParser, todoController.createTodo);

app.use(exceptionMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`App listening on the port ${process.env.PORT}`);
});
