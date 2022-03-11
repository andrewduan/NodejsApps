import { TodoDto } from 'todos/dto/todo.dto';
import { Todo } from '../database/todo';

export const mapToDto = (todo: Todo): TodoDto => {
  const { TodoId, TaskName, IsCompleted } = todo;
  return {
    todoId: TodoId,
    taskName: TaskName,
    isCompleted: IsCompleted,
  };
};

export const mapFromDto = (todo: TodoDto): Todo => {
  const { todoId, taskName, isCompleted } = todo;
  return {
    TodoId: todoId,
    TaskName: taskName,
    IsCompleted: isCompleted,
  };
};
