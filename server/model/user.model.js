import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const UserSchema = new mongoose.Schema(
  {
    telegramId: { type: String, required: false, unique: true },
    username: { type: String, require: true },
    name: { type: String },
    dateOfBirth: { type: Date },
    email: { type: Date },
    initialized: { type: Boolean, default: false },
  },
  { timestamps: true },
);

UserSchema.plugin(mongoosePaginate);

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
