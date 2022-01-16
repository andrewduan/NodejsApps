const mongoose = require('mongoose');


const { Schema } = mongoose; 
const todoSchema = new Schema({
  TodoId: Number,
  TaskName: String,
  IsCompleted: Boolean
});
 
const todoModel = mongoose.model('Todos', todoSchema);
 
export default todoModel;