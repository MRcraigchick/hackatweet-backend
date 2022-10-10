import mongoose from 'mongoose';

export default mongoose.model(
  'hash_tags',
  mongoose.Schema({
    tag: String,
    likes: { type: Number, default: 0 },
    updated: { type: Date, default: new Date() },
  })
);
