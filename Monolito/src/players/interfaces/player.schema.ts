import { timeStamp } from 'console';
import { Schema } from 'mongoose';

export const PlayerSchema = new Schema(
  {
    phoneNumber: String,
    email: { type: String, unique: true },
    name: String,
    ranking: String,
    positionRanking: Number,
    urlPhoto: String,
  },
  { timestamps: true, collection: 'Players' }
);
