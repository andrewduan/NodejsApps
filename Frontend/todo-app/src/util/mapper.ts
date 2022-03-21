import { TodoModel } from '../interfaces';

const toApiPayload = (todo: TodoModel) => {
  return {
    TodoId: todo.id,
    TaskName: todo.taskName,
    IsCompleted: todo.completed,
  };
};

const fromApiPayload = (payload: {
  TodoId: string;
  TaskName: string;
  IsCompleted: boolean;
}) => {
  return {
    id: payload.TodoId,
    taskName: payload.TaskName,
    completed: payload.IsCompleted,
  };
};

export { toApiPayload, fromApiPayload };
