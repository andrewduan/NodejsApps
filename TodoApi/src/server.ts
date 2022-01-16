import 'dotenv/config';
import App from './app';

import TodoController from './todos/todoController';

const app = new App(
  [
    new TodoController()
  ],
);
app.listen();