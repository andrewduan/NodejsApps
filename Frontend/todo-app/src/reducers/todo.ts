import { TodoAction, TodoModel, TodoState } from "../interfaces";

export default function reducer(state: TodoState, action: TodoAction) : TodoState {
  switch (action.type) {
    case "GET_TODOS":
      if (!Array.isArray(action.payload)) {
        return state;
      }
      const intialSavedTodos = 
      {
        ...state,
        todos: action.payload
      };
      return intialSavedTodos;
    case "ADD_TODO":
      if (Array.isArray(action.payload)) {
        return state;
      }
      const newTodo = action.payload;
      if (!newTodo?.taskName || state.todos.findIndex(t => t.taskName === newTodo?.taskName) > -1) {
         return state;
      }
      const addedTodos = [...state.todos, action.payload];
      return {
        ...state,
        todos: addedTodos
      };
    case "TOGGLE_TODO":
      if (Array.isArray(action.payload)) {
        return state;
      }
      const todo = action.payload;
      const toggledTodos = state.todos.map((t: TodoModel) =>
        t.id === todo?.id ? todo : t
      );

      return {
        ...state,
        todos: toggledTodos
      };
    case "UPDATE_TODO":
      if(Array.isArray(action.payload)) {
        return state;
      }
      const updatedTodo = { ...action.payload };
      const updatedTodoIndex = state.todos.findIndex(
        t => t.id === updatedTodo.id
      );
      const updatedTodos = [
        ...state.todos.slice(0, updatedTodoIndex),
        updatedTodo,
        ...state.todos.slice(updatedTodoIndex + 1)
      ];
      return {
        ...state,
        todos: updatedTodos
      };
    case "REMOVE_TODO":
      if (Array.isArray(action.payload)) {
        return state;
      }
      const removedTodo = action.payload;
      const filteredTodos = state.todos.filter(t => t.id !== removedTodo.id);
      return {
        ...state,
        todos: filteredTodos
      };
    default:
      return state;
  }
}
