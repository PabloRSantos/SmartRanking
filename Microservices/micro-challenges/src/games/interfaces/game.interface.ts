import { Document } from 'mongoose';

export interface Game extends Document {
  category: string;
  players: Array<string>;
  challenge: string;
  def: string;
  result: Array<Result>;
}

export interface Result {
  set: string;
}
