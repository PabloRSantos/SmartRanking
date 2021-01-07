import { Document } from 'mongoose';
import { Player } from 'Monolito/src/players/interfaces/player.interface';
import { ChallengeStatus } from './challengeStatus.enum';

export interface Challenge extends Document {
  dateTimeChallenge: Date;
  status: ChallengeStatus;
  dateTimeSolicitation: Date;
  dateTimeAnswer: Date;
  requester: Player;
  category: string;
  players: Array<Player>;
  game: Game;
}

export interface Game extends Document {
  category: string;
  players: Array<Player>;
  def: Player;
  result: Array<Result>;
}

export interface Result {
  set: string;
}
