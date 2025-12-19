export interface ScoreResponse {
  globalScore: number;
  clientScore: number;
}

export interface Score {
  getScore(): Promise<ScoreResponse>;
  addScore(score: number): Promise<ScoreResponse>;
}
