import mongoose, { Schema, Document } from 'mongoose';

interface IRandom extends Document {
  collectiveCounterClicks: Number;
}

const RandomSchema: Schema = new Schema(
  {
    collectiveCounterClicks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// RandomSchema.methods.incrementCounterClicks = function incrementCounterClicks() {
//   this.collectiveCounterClicks = this.collectiveCounterClicks + 1;
// };

export default mongoose.model<IRandom>('random', RandomSchema);
