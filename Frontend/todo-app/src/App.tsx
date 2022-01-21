import React, { useContext, useReducer, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import TodosContext from "./contexts/todo";
import todosReducer from "./reducers/todo";

import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import { TodoApiUrl } from "./constants";
import { TodoApiResponse, TodoModel, TodoState } from "./interfaces";
import { fromApiPayload } from "./util/mapper";

const useAPI = (endpoint : string) => {
  const initialState: TodoModel[] = [];
  const [data, setData] = useState(initialState);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await axios.get<TodoApiResponse[]>(endpoint);
    const todos: TodoModel[] = response.data.map<TodoModel>(fromApiPayload);
    setData(todos);
  };

  return data;
};

const App = () => {
  const initialState = useContext(TodosContext);
  const [state, dispatch] = useReducer(todosReducer, initialState.state);
  const existingTodos = useAPI(TodoApiUrl);

  useEffect(
    () => {
      dispatch({type: 'GET_TODOS', payload: existingTodos});
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