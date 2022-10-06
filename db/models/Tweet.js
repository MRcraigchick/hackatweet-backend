import mongoose from 'mongoose';

export default mongoose.model(
  'tweets',
  mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectID, ref: 'users' },
    tweet: String,
    likes: { type: Number, default: 0 },
    created: { type: Date, default: new Date() },
  })
);
