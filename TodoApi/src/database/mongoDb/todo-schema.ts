import { Schema, model } from 'mongoose';
import { Todo } from '../../database/todo';

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<Todo>({
  TodoId: { type: String, required: true },
  TaskName: { type: String, required: true },
  IsCompleted: { type: Boolean, required: true },
});

export const TodoModel = model<Todo>('Todos', schema);
