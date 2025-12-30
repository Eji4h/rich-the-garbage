import { AUTO, Game, Scale } from 'phaser';
import { getGameById, type GameId } from './GameRegistry';

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

const StartGame = (parent: string, gameId: GameId) => {
  const game = new Game({ ...config, parent });
  const gameEntry = getGameById(gameId);
  const scene = gameEntry.createScene();

  game.scene.add(gameEntry.sceneName, scene);
  game.scene.start(gameEntry.sceneName);

  return game;
};

export default StartGame;
