import { ActionType } from '../constants'
import { TodoAction, TodoModel, TodoState } from '../interfaces'

export default function reducer(
  state: TodoState,
  action: TodoAction
): TodoState {
  switch (action.type) {
    case ActionType.RetrieveTodos:
      const intialSavedTodos = {
        ...state,
        todos: action.payload,
      }
      return intialSavedTodos
    case ActionType.AddTodo:
      const newTodo = action.payload
      if (
        !newTodo?.taskName ||
        state.todos.findIndex((t) => t.taskName === newTodo?.taskName) > -1
      ) {
        return state
      }
      const addedTodos = [...state.todos, action.payload]
      return {
        ...state,
        todos: addedTodos,
      }
    case ActionType.ToggleTodo:
      const todo = action.payload
      const toggledTodos = state.todos.map((t: TodoModel) =>
        t.id === todo?.id ? todo : t
      )

      return {
        ...state,
        todos: toggledTodos,
      }
    case ActionType.UpdateTodo:
      const updatedTodo = { ...action.payload }
      const updatedTodoIndex = state.todos.findIndex(
        (t) => t.id === updatedTodo.id
      )
      const updatedTodos = [
        ...state.todos.slice(0, updatedTodoIndex),
        updatedTodo,
        ...state.todos.slice(updatedTodoIndex + 1),
      ]
      return {
        ...state,
        todos: updatedTodos,
      }
    case ActionType.DeleteTodo:
      const removedTodo = action.payload
      const filteredTodos = state.todos.filter((t) => t.id !== removedTodo.id)
      return {
        ...state,
        todos: filteredTodos,
      }
    default:
      return state
  }
}
