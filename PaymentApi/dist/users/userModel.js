import * as mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});
const userModel = mongoose.model('Users', userSchema);
export default userModel;
//# sourceMappingURL=userModel.js.map