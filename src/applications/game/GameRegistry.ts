import { Scene } from 'phaser';
import { DrinkGameScene } from './scenes/DrinkGame/DrinkGameScene';
import { RandomDrinkOutComeImpl } from './scenes/DrinkGame/repositories/RandomDrinkOutCome.imp';
import { TricksterScene } from './scenes/Trickster/TricksterScene';
import { ScoreApi } from '../../adapters/outbounds/repositories/Score.imp';

export type GameId = 'drink' | 'trickster';

export interface GameMetadata {
  id: GameId;
  name: string;
  description: string;
  icon: string;
  gradient: string;
}

export interface GameEntry extends GameMetadata {
  createScene: () => Scene;
  sceneName: string;
}

const scoreRepository = new ScoreApi();

export const gameRegistry: Record<GameId, GameEntry> = {
  drink: {
    id: 'drink',
    name: 'Drink Game',
    description: 'Tap to drink! Every tap adds to the global total!',
    icon: '🍺',
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    sceneName: DrinkGameScene.SceneName,
    createScene: () => {
      const randomDrinkOutCome = new RandomDrinkOutComeImpl();
      return new DrinkGameScene(randomDrinkOutCome, scoreRepository);
    },
  },
  trickster: {
    id: 'trickster',
    name: 'Trickster',
    description: 'Coming soon! A tricky game awaits...',
    icon: '🃏',
    gradient: 'from-purple-500 via-violet-500 to-indigo-600',
    sceneName: TricksterScene.SceneName,
    createScene: () => {
      return new TricksterScene();
    },
  },
};

export const getGameById = (id: GameId): GameEntry => {
  return gameRegistry[id];
};

export const getAllGames = (): GameEntry[] => {
  return Object.values(gameRegistry);
};

export const getGameMetadata = (): GameMetadata[] => {
  return Object.values(gameRegistry).map(
    ({ id, name, description, icon, gradient }) => ({
      id,
      name,
      description,
      icon,
      gradient,
    }),
  );
};
