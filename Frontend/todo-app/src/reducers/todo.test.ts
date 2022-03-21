import { ActionType } from '../constants'
import { TodoModel, TodoState } from '../interfaces'
import reducer from './todo'

const initialState: TodoState = {
  todos: [
    { id: '1', taskName: 'Prepare Dinner', completed: false },
    { id: '2', taskName: 'Laundry', completed: true },
  ],
}

describe('todo reducer', () => {
  it('add todo', () => {
    const newStateAfterAdd = reducer(initialState, {
      type: ActionType.AddTodo,
      payload: { id: '3', taskName: 'Exercise', completed: false },
    })
    expect(newStateAfterAdd.todos.length).toBe(3)
    expect(newStateAfterAdd.todos[2].id).toBe('3')
  })

  it('update todo', () => {
    const newStateAfterUpdate = reducer(initialState, {
      type: ActionType.UpdateTodo,
      payload: { id: '2', taskName: 'Exercise', completed: false },
    })
    expect(newStateAfterUpdate.todos.length).toBe(2)
    const todo = newStateAfterUpdate.todos[1]
    expect(todo.id).toBe('2')
    expect(todo.taskName).toBe('Exercise')
    expect(todo.completed).toBeFalsy()
  })

  it('delete todo', () => {
    const newStateAfterDelete = reducer(initialState, {
      type: ActionType.DeleteTodo,
      payload: { id: '1', taskName: 'Prepare Dinner', completed: false },
    })
    expect(newStateAfterDelete.todos.length).toBe(1)
    const todo = newStateAfterDelete.todos[0]
    expect(todo.id).toBe('2')
    expect(todo.taskName).toBe('Laundry')
    expect(todo.completed).toBeTruthy()
  })

  it('retrieve todos', () => {
    const newState = reducer(initialState, {
      type: ActionType.RetrieveTodos,
      payload: [
        { id: '4', taskName: 'friends catchup', completed: false },
        { id: '5', taskName: 'Run 10K', completed: false },
      ],
    })
    expect(newState.todos.length).toBe(2)
    const todo = newState.todos[0]
    expect(todo.id).toBe('4')
    expect(todo.taskName).toBe('friends catchup')
    expect(todo.completed).toBeFalsy()
  })

  it('toggle todo', () => {
    const newState = reducer(initialState, {
      type: ActionType.ToggleTodo,
      payload: { id: '1', taskName: 'Prepare Dinner', completed: true },
    })
    const todo = newState.todos[0]
    expect(todo.id).toBe('1')
    expect(todo.taskName).toBe('Prepare Dinner')
    expect(todo.completed).toBeTruthy()
  })
})
