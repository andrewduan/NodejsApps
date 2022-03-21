import React from 'react';
import { TodoAction, TodoState } from '../interfaces';

const initialState: TodoState = {
  todos: [],
};
const TodosContext = React.createContext<{
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
}>({ state: initialState, dispatch: () => null });

export default TodosContext;
