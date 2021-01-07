import { Schema } from 'mongoose';

export const GameSchema = new Schema(
  {
    category: String,
    players: [Schema.Types.ObjectId],
    def: Schema.Types.ObjectId,
    challenge: Schema.Types.ObjectId,
    result: [
      {
        set: String,
      },
    ],
  },
  { timestamps: true, collection: 'Games' },
);
