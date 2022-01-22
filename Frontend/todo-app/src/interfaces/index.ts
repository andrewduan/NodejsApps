import { ActionType } from "../constants";

export interface TodoModel {
    id: string;
    taskName: string;
    completed: boolean;
}

export interface TodoAction {
    type: ActionType;
    payload: TodoModel | TodoModel[];
}

export interface TodoState {
    todos: TodoModel[];
}

export interface TodoApiResponse {
    TodoId: string;
    TaskName: string;
    IsCompleted: boolean;
}