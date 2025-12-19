import { ObservableScore } from './ObservableScore';

class ScoreSingleton {
  private static instance: ScoreSingleton | null = null;

  public readonly clientScore: ObservableScore;
  public readonly globalScore: ObservableScore;

  private constructor() {
    this.clientScore = new ObservableScore(0);
    this.globalScore = new ObservableScore(0);
  }

  public static getInstance(): ScoreSingleton {
    ScoreSingleton.instance ??= new ScoreSingleton();
    return ScoreSingleton.instance;
  }

  public reset(): void {
    this.clientScore.value = 0;
    this.globalScore.value = 0;
  }
}

export const scoreSingleton = ScoreSingleton.getInstance();
