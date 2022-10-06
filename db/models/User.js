import mongoose from 'mongoose';

export default mongoose.model(
  'users',
  mongoose.Schema({
    firstname: String,
    username: String,
    password: String,
    token: String,
    created: { type: Date, default: new Date() },
  })
);
