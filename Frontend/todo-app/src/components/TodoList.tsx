import React, { useContext } from "react";
import axios from "axios";
import TodosContext from "../contexts/todo";
import { TodoModel, TodoState } from "../interfaces";
import { TodoApiUrl } from "../constants";
import { fromApiPayload, toApiPayload } from "../util/mapper";

export default function TodoList() {
  const value = useContext(TodosContext);
  const { state: {todos, currentTodo}, dispatch } = value;
  const title =
    todos.length > 0 ? `${todos.length} Tasks` : "Nothing To Do!";

  return (
    <div className="container mx-auto max-w-md text-center font-mono">
      <h1 className="text-bold">{title}</h1>
      <ul className="list-reset p-0">
        {todos.map((todo: TodoModel) => (
          <li
            key={todo.id}
            className="flex items-center bg-orange-dark border-black border-dashed border-2 my-2 py-4"
          > <span
              onDoubleClick={async () => {
                const response = await axios.patch(
                  `${TodoApiUrl}/${todo.id}`,
                  toApiPayload({...todo, ...{completed: !todo.completed}})
                );
                dispatch && dispatch({ type: "TOGGLE_TODO", payload: fromApiPayload(response.data) });
              }}
              className={`flex-1 ml-12 cursor-pointer text-grey-darkest  ${todo.completed &&
                "line-through"}`}
            >
              {todo.taskName}
            </span>
            <button
              onClick={() =>
                dispatch && dispatch({ type: "SET_CURRENT_TODO", payload: todo })
              }
            >
              <img
                src="https://img.icons8.com/color/48/000000/edit--v1.png"
                alt="Edit Icon"
                className="h-6"
              />
            </button>
            <button
              onClick={async () => {
                await axios.delete(
                  `${TodoApiUrl}/${todo.id}`
                );
                dispatch && dispatch({ type: "REMOVE_TODO", payload: todo });
              }}
            >
              <img
                src="https://img.icons8.com/plasticine/100/000000/filled-trash.png"
                alt="Delete Icon"
                className="h-6"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
