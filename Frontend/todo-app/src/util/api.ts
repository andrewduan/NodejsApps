import axios from "axios";
import { TodoApiUrl } from "../constants";
import { TodoApiResponse, TodoModel } from "../interfaces";
import { toApiPayload } from "./mapper";

export const patchTodo = async (todo:TodoModel) => {
    const response = await axios.patch(
        `${TodoApiUrl}/${todo.id}`,
        toApiPayload(todo)
      );
    return response;
}

export const addTodo = async (todo:TodoModel) => {
    const response = await axios.post(
        TodoApiUrl,
        toApiPayload(todo)
    );
    return response;
}

export const removeTodo = async (todo:TodoModel) => {
    const response = await axios.delete(
        `${TodoApiUrl}/${todo.id}`
    );
    return response;
}

export const getTodos = async () => {
    const response = await axios.get<TodoApiResponse[]>(`${TodoApiUrl}`);
    return response;
}