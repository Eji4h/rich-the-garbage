import { ObservableScore } from '../DrinkGame/ObservableScore';

class BeerServeScoreSingleton {
  private static instance: BeerServeScoreSingleton | null = null;

  public readonly clientScore: ObservableScore;
  public readonly globalScore: ObservableScore;

  private constructor() {
    this.clientScore = new ObservableScore(0);
    this.globalScore = new ObservableScore(0);
  }

  public static getInstance(): BeerServeScoreSingleton {
    BeerServeScoreSingleton.instance ??= new BeerServeScoreSingleton();
    return BeerServeScoreSingleton.instance;
  }

  public reset(): void {
    this.clientScore.value = 0;
    this.globalScore.value = 0;
  }
}

export const beerServeScoreSingleton = BeerServeScoreSingleton.getInstance();
