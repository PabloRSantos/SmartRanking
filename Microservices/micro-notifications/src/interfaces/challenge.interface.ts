import { ChallengeStatus } from './challengeStatus.enum';

export interface Challenge {
  _id: string;
  dateTimeChallenge: Date;
  status: ChallengeStatus;
  dateTimeSolicitation: Date;
  dateTimeAnswer: Date;
  requester: string;
  category: string;
  players: Array<string>;
  game?: string;
}
