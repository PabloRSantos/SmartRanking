import { Document } from 'mongoose';
import { ChallengeStatus } from './challengeStatus.enum';

export interface Challenge extends Document {
    dateTimeChallenge: Date;
    status: ChallengeStatus;
    dateTimeSolicitation: Date;
    dateTimeAnswer: Date;
    requester: string;
    category: string;
    players: Array<string>;
    game?: string;
}
