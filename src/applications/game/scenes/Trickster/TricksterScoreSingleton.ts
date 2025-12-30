import { ObservableScore } from '../DrinkGame/ObservableScore';

class TricksterScoreSingleton {
  private static instance: TricksterScoreSingleton | null = null;

  public readonly clientScore: ObservableScore;
  public readonly globalScore: ObservableScore;

  private constructor() {
    this.clientScore = new ObservableScore(0);
    this.globalScore = new ObservableScore(0);
  }

  public static getInstance(): TricksterScoreSingleton {
    TricksterScoreSingleton.instance ??= new TricksterScoreSingleton();
    return TricksterScoreSingleton.instance;
  }

  public reset(): void {
    this.clientScore.value = 0;
    this.globalScore.value = 0;
  }
}

export const tricksterScoreSingleton = TricksterScoreSingleton.getInstance();
