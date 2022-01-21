import React, { useState, useEffect, useContext, FormEvent } from "react";
import axios from "axios";
import { uuid } from '../util/uuidGen';
import TodosContext from "../contexts/todo";
import { TodoApiUrl } from "../constants";
import { fromApiPayload, toApiPayload } from "../util/mapper";

export default function TodoForm() {
  const [todo, setTodo] = useState("");

  const value = useContext(TodosContext);
  const { state: {currentTodo}, dispatch } = value;

  useEffect(
    () => {
      if (currentTodo && currentTodo.taskName) {
        setTodo(currentTodo.taskName);
      } else {
        setTodo("");
      }
    },
    [value.state, currentTodo]
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (currentTodo && currentTodo.taskName) {
      const response = await axios.patch(
        `${TodoApiUrl}/${currentTodo.id}`,
        toApiPayload({...currentTodo, ...{taskName: todo}})
      );
      dispatch({ type: "UPDATE_TODO", payload: fromApiPayload(response.data) });
    } else {
      const body = toApiPayload({
        id: uuid(),
        taskName: todo,
        completed: false
      });
      const response = await axios.post(
        TodoApiUrl,
        body
      );
      dispatch({ type: "ADD_TODO", payload: fromApiPayload(response.data) });
    }
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
