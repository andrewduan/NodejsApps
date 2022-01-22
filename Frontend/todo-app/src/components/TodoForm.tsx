import React, { useState, useEffect, useContext, FormEvent } from "react";
import axios from "axios";
import { uuid } from '../util/uuidGen';
import TodosContext from "../contexts/todo";
import { TodoApiUrl } from "../constants";
import { fromApiPayload, toApiPayload } from "../util/mapper";

export default function TodoForm() {
  const [todo, setTodo] = useState("");

  const value = useContext(TodosContext);
  const { dispatch } = value;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
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
