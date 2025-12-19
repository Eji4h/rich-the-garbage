export const DrinkOutComes = {
  drink: 'normal',
  puke: 'puke',
  puke_bin: 'puke_bin',
} as const;
export type DrinkOutcome = (typeof DrinkOutComes)[keyof typeof DrinkOutComes];
