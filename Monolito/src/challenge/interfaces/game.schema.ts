import { Schema } from 'mongoose';

export const gameSchema = new Schema(
  {
    category: String,
    players: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Players',
      },
    ],
    def: {
      type: Schema.Types.ObjectId,
      ref: 'Players',
    },
    result: [
      {
        set: String,
      },
    ],
  },
  { timestamps: true, collection: 'Games' }
);
