import HttpException from './httpException';

class TodoNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Todo with id ${id} not found`);
  }
}

export default TodoNotFoundException;
