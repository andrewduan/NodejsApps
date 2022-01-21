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
    case "SET_CURRENT_TODO":
      if (Array.isArray(action.payload)) {
        return state;
      }
      return {
        ...state,
        currentTodo: action.payload
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
        t => state.currentTodo && t.id === state.currentTodo.id
      );
      const updatedTodos = [
        ...state.todos.slice(0, updatedTodoIndex),
        updatedTodo,
        ...state.todos.slice(updatedTodoIndex + 1)
      ];
      return {
        ...state,
        currentTodo: undefined,
        todos: updatedTodos
      };
    case "REMOVE_TODO":
      if (Array.isArray(action.payload)) {
        return state;
      }
      const removedTodo = action.payload;
      const filteredTodos = state.todos.filter(t => t.id !== removedTodo.id);
      const isRemovedTodo =
      state.currentTodo && state.currentTodo.id === removedTodo.id ? undefined : state.currentTodo;
      return {
        ...state,
        currentTodo: isRemovedTodo,
        todos: filteredTodos
      };
    default:
      return state;
  }
}
