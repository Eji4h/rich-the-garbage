import { match } from 'ts-pattern';
import { DrinkOutcomeType, DrinkOutCome } from '../DrinkOutComes';
import { RandomDrinkOutCome } from '../ports/RandomDrinkOutCome.port';

export class RandomDrinkOutComeImpl implements RandomDrinkOutCome {
  randomDrinkOutCome(): DrinkOutcomeType {
    const roll = Math.random();

    // Random outcome:
    // 70% - Normal drink (+1)
    // 20% - Drink then puke (+5)
    // 10% - Drink then puke with bin (+10)
    return match(roll)
      .when(
        (r) => r < 0.1,
        () => DrinkOutCome.puke_bin,
      )
      .when(
        (r) => r < 0.3,
        () => DrinkOutCome.puke,
      )
      .otherwise(() => DrinkOutCome.drink);
  }
}
