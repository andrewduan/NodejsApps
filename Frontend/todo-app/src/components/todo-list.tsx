import { useContext, useState } from 'react';
import TodosContext from '../contexts/todo';
import { TodoModel } from '../interfaces';
import { fromApiPayload } from '../util/mapper';
import { patchTodo, removeTodo } from '../util/api';
import { ActionType } from '../constants';

export default function TodoList() {
  const value = useContext(TodosContext);

  const {
    state: { todos },
    dispatch,
  } = value;

  const title = todos.length > 0 ? `${todos.length} Tasks` : 'Nothing To Do!';

  const [inEdit, setInEdit] = useState(false);
  const initialChosenTodo: TodoModel = {} as TodoModel;
  const [chosenTodo, setChosenTodo] = useState(initialChosenTodo);

  return (
    <div className="container mx-auto max-w-md text-center font-mono">
      <h1 className="text-bold">{title}</h1>
      <ul className="list-reset p-0">
        {todos.map((todo: TodoModel) => (
          <li
            key={todo.id}
            className="flex items-center bg-orange-dark border-black border-dashed border-2 my-2 py-4"
          >
            <span
              onDoubleClick={async () => {
                const response = await patchTodo({
                  ...todo,
                  ...{ completed: !todo.completed },
                });
                dispatch({
                  type: ActionType.ToggleTodo,
                  payload: fromApiPayload(response.data),
                });
              }}
              className={`flex-1 ml-12 cursor-pointer text-grey-darkest  ${
                todo.completed && 'line-through'
              }`}
            >
              {inEdit && todo.id === chosenTodo.id ? (
                <input
                  type="text"
                  className="border-black border-solid border-2"
                  onKeyPress={async (event) => {
                    // TODO need to handle user changes mind of updating
                    if (event.key === 'Enter') {
                      const response = await patchTodo(chosenTodo);
                      dispatch({
                        type: ActionType.UpdateTodo,
                        payload: fromApiPayload(response.data),
                      });
                      setChosenTodo(initialChosenTodo);
                      setInEdit(false);
                    }
                  }}
                  onChange={(event) => {
                    setChosenTodo({
                      ...chosenTodo,
                      ...{ taskName: event.target.value },
                    });
                  }}
                  value={chosenTodo.taskName}
                />
              ) : (
                <span>{todo.taskName}</span>
              )}
            </span>
            <button
              onClick={() => {
                setInEdit(true);
                setChosenTodo(todo);
              }}
            >
              <img
                src="https://img.icons8.com/color/48/000000/edit--v1.png"
                alt="Edit Icon"
                className="h-6"
              />
            </button>
            <button
              onClick={async () => {
                await removeTodo(todo);
                dispatch({ type: ActionType.DeleteTodo, payload: todo });
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
