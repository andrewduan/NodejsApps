import * as mongoose from 'mongoose';
import User from './userInterface';
 
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
 
const userModel = mongoose.model<User & mongoose.Document>('Users', userSchema);
 
export default userModel;