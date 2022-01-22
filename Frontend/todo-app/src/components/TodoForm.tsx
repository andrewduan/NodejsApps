import React, { useState, useContext, FormEvent } from "react";
import { uuid } from '../util/uuidGen';
import TodosContext from "../contexts/todo";
import { fromApiPayload } from "../util/mapper";
import { addTodo } from "../util/api";
import { ActionType } from "../constants";

export default function TodoForm() {
  const [todo, setTodo] = useState("");

  const value = useContext(TodosContext);
  const { dispatch } = value;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await addTodo({
      id: uuid(),
      taskName: todo,
      completed: false
    });
    
    dispatch({ type: ActionType.AddTodo, payload: fromApiPayload(response.data) });
    setTodo("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center p-5">
      <input
        type="text"
        className="border-black border-solid border-2"
        onChange={event => setTodo(event.target.value)}
        value={todo}
      />
    </form>
  );
}
