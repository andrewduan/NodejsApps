import { ActionType } from '../constants';

export interface TodoModel {
  id: string;
  taskName: string;
  completed: boolean;
}

export type TodoAction =
  | {
      type: ActionType.RetrieveTodos;
      payload: TodoModel[];
    }
  | {
      type:
        | ActionType.AddTodo
        | ActionType.DeleteTodo
        | ActionType.UpdateTodo
        | ActionType.ToggleTodo;
      payload: TodoModel;
    };

export interface TodoState {
  todos: TodoModel[];
}

export interface TodoApiResponse {
  TodoId: string;
  TaskName: string;
  IsCompleted: boolean;
}
