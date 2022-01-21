import React from "react";
import { TodoAction, TodoState } from "../interfaces";

const initialState : TodoState = {
    todos: [],
    currentTodo: undefined
  };
const TodosContext = React.createContext<{state: TodoState, dispatch?: React.Dispatch<TodoAction>}>({state: initialState}); 

export default TodosContext;
