import mongoose, { Schema } from 'mongoose';
import IPost from '../interfaces/post';

const PostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: String,
  },
  { timestamps: true }
);

export default mongoose.model<IPost>('post', PostSchema);
