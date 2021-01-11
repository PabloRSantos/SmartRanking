export interface RankingResponse {
  player?: string;
  position?: number;
  punctuation?: number;
  gamesHistoric?: Historic;
}

export interface Historic {
  victories?: number;
  defeats?: number;
}
