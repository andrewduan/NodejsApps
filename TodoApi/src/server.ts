import 'dotenv/config';
import TodoController from './todos/todoController';

import errorMiddleware from './middlewares/exceptionMiddleware';

const express = require('express');
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

const path = '/todos';
const bodyParser = require('body-parser'); 
// create application/json parser
const jsonParser = bodyParser.json();

app.get(path, TodoController.getAllTodos);
app.patch(`${path}/:id`, jsonParser, TodoController.modifyTodo)
app.delete(`${path}/:id`, TodoController.deleteTodo)
app.post(path, jsonParser, TodoController.createTodo);




app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`App listening on the port ${process.env.PORT}`);
});
