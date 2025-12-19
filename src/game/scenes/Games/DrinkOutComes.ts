export const DrinkOutCome = {
  drink: 'normal',
  puke: 'puke',
  puke_bin: 'puke_bin',
} as const;
export type DrinkOutcomeType = (typeof DrinkOutCome)[keyof typeof DrinkOutCome];

export const DrinkOutComesScoreDict = {
  [DrinkOutCome.drink]: 1,
  [DrinkOutCome.puke]: 5,
  [DrinkOutCome.puke_bin]: 10,
} as const;
export type DrinkOutComesScoreType =
  (typeof DrinkOutComesScoreDict)[keyof typeof DrinkOutComesScoreDict];
