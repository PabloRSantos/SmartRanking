export interface Game {
  category: string;
  players: Array<string>;
  challenge: string;
  def: string;
  result: Array<Result>;
}

export interface Result {
  set: string;
}
