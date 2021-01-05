import { Schema } from 'mongoose';

export const challengeSchema = new Schema(
  {
    dateTimeChallenge: Date,
    status: String,
    dateTimeSolicitation: Date,
    dateTimeAnswer: Date,
    requester: { type: Schema.Types.ObjectId, ref: 'Players' },
    category: String,
    players: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Players',
      },
    ],
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Games',
    },
  },
  { timestamps: true, collection: 'Challenges' }
);
