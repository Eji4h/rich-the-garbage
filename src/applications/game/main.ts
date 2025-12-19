import { GameScene } from './scenes/Games/GameScene';
import { AUTO, Game, Scale } from 'phaser';
import { RandomDrinkOutComeImpl } from './scenes/Games/repositories/RandomDrinkOutCome.imp';
import { ScoreApi } from '../../adapters/outbounds/repositories/Score.imp';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 1024,
  height: 576, // 16:9 aspect ratio
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
};

const StartGame = (parent: string) => {
  const game = new Game({ ...config, parent });
  const randomDrinkOutCome = new RandomDrinkOutComeImpl();
  const scoreRepository = new ScoreApi();
  game.scene.add(
    GameScene.SceneName,
    new GameScene(randomDrinkOutCome, scoreRepository),
  );
  game.scene.start(GameScene.SceneName);
  return game;
};

export default StartGame;
