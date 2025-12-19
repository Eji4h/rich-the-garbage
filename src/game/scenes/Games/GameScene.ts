import { EventBus } from '../../EventBus';
import { Scene } from 'phaser';
import { Character } from './Character';
import { match } from 'ts-pattern';
import { GameSceneGui } from './gui/GameSceneGui';
import { DrinkOutCome, DrinkOutComesScoreDict } from './DrinkOutComes';
import { RandomDrinkOutCome } from './ports/RandomDrinkOutCome.port';
import { ObservableScore } from './ObservableScore';
import { Score } from './ports/Score.port';
import { ScoreSync } from './ScoreSync';

export class GameScene extends Scene {
  public static readonly SceneName = 'Game';

  public readonly clientScore = new ObservableScore(0);
  public readonly globalScore = new ObservableScore(0);

  private particles: Phaser.GameObjects.Particles.ParticleEmitter;
  private readonly character: Character;
  private readonly gui: GameSceneGui;
  private readonly scoreSync: ScoreSync;

  constructor(
    private readonly randomDrinkOutComePort: RandomDrinkOutCome,
    private readonly scorePort: Score,
  ) {
    super(GameScene.SceneName);
    this.character = new Character(this);
    this.gui = new GameSceneGui(this);
    this.scoreSync = new ScoreSync(
      this,
      this.scorePort,
      this.clientScore,
      this.globalScore,
    );
  }

  preload() {
    this.character.preload();
  }

  create() {
    this.character.create();
    this.gui.create();
    this.createParticles();
    this.scoreSync.fetchScores();

    EventBus.emit('current-scene-ready', this);
  }

  onCharacterClick() {
    const outcome = this.randomDrinkOutComePort.randomDrinkOutCome();
    const scoreGain = DrinkOutComesScoreDict[outcome];

    // Optimistic update - observers will be notified automatically
    this.clientScore.add(scoreGain);
    this.globalScore.add(scoreGain);
    this.scoreSync.addPendingScore(scoreGain);

    match(outcome)
      .with(DrinkOutCome.puke, () => {
        this.character.puke();
      })
      .with(DrinkOutCome.puke_bin, () => {
        this.character.puke_bin();
      })
      .otherwise(() => {
        this.character.drink();
      });

    // Emit particles (more for higher scores)
    this.particles.explode(scoreGain * 5);

    // Floating score text
    this.gui.playFloatingText(outcome, scoreGain);
  }

  private createParticles() {
    // Create a simple circle texture for particles
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(8, 8, 8);
    graphics.generateTexture('particle', 16, 16);
    graphics.destroy();

    this.particles = this.add.particles(512, 300, 'particle', {
      speed: { min: 100, max: 300 },
      scale: { start: 0.5, end: 0 },
      lifespan: 500,
      tint: [0xfbbf24, 0xe94560, 0x22d3ee, 0x10b981],
      emitting: false,
    });
  }
}
