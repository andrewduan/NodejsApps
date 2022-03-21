export const TodoApiUrl = 'http://localhost:5000/todos'

export enum ActionType {
  UpdateTodo = 'UPDATE_TODO',
  AddTodo = 'ADD_TODO',
  DeleteTodo = 'DELETE_TODO',
  ToggleTodo = 'TOGGLE_TODO',
  RetrieveTodos = 'GET_TODOS',
}
