import { Schema } from 'mongoose';

export const ChallengeSchema = new Schema(
  {
    dateTimeChallenge: Date,
    status: String,
    dateTimeSolicitation: Date,
    dateTimeAnswer: Date,
    requester: Schema.Types.ObjectId,
    category: Schema.Types.ObjectId,
    players: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    game: {
      type: Schema.Types.ObjectId,
      ref: 'Games',
    },
  },
  { timestamps: true, collection: 'Challenges' },
);
