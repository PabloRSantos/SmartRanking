import { Schema } from 'mongoose';

export const PlayerSchema = new Schema(
  {
    phoneNumber: String,
    email: { type: String, unique: true },
    name: String,
    ranking: String,
    positionRanking: Number,
    urlPhoto: String,
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Categories',
    },
  },
  { timestamps: true, collection: 'Players' },
);
