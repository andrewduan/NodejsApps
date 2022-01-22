import React, { useContext, useReducer, useState, useEffect } from "react";
import TodosContext from "./contexts/todo";
import todosReducer from "./reducers/todo";

import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import { TodoModel } from "./interfaces";
import { fromApiPayload } from "./util/mapper";
import { getTodos } from "./util/api";

import { ActionType } from './constants';

const useAPI = () => {
  const initialState: TodoModel[] = [];
  const [data, setData] = useState(initialState);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await getTodos();
    const todos: TodoModel[] = response.data.map<TodoModel>(fromApiPayload);
    setData(todos);
  };

  return data;
};

const App = () => {
  const initialState = useContext(TodosContext);
  const [state, dispatch] = useReducer(todosReducer, initialState.state);
  const existingTodos = useAPI();

  useEffect(
    () => {
      dispatch({type: ActionType.RetrieveTodos, payload: existingTodos});
    },
    [existingTodos]
  );

  return (
    <TodosContext.Provider value={{state, dispatch}}>
      <TodoForm />
      <TodoList />
    </TodosContext.Provider>
  );
};

export default App;