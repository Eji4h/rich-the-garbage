import { EventBus } from '../../EventBus';
import { Scene } from 'phaser';
import { getClientId } from '../../../utils/clientId';
import { Character } from './Character';
import { match } from 'ts-pattern';
import { GameSceneGui } from './gui/GameSceneGui';
import { DrinkOutCome, DrinkOutComesScoreDict } from './DrinkOutComes';
import { RandomDrinkOutCome } from './ports/RandomDrinkOutCome.port';
import { ObservableScore } from './ObservableScore';

export class GameScene extends Scene {
  public static readonly SCENE_NAME = 'Game';

  private readonly clientId: string;
  public readonly clientScore = new ObservableScore(0);
  public readonly globalScore = new ObservableScore(0);
  private pendingScore: number = 0;
  private particles: Phaser.GameObjects.Particles.ParticleEmitter;
  private syncTimer: Phaser.Time.TimerEvent | null = null;
  private isSyncing: boolean = false;

  private readonly character: Character;
  private readonly gui: GameSceneGui;

  constructor(private readonly randomDrinkOutCome: RandomDrinkOutCome) {
    super(GameScene.SCENE_NAME);
    this.character = new Character(this);
    this.gui = new GameSceneGui(this);
    this.clientId = getClientId();
  }

  preload() {
    this.character.preload();
  }

  create() {
    this.character.create();
    this.gui.create();
    this.createParticles();
    this.fetchScores();

    EventBus.emit('current-scene-ready', this);
  }

  createParticles() {
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

  onCharacterClick() {
    const outcome = this.randomDrinkOutCome.randomDrinkOutCome();
    const scoreGain = DrinkOutComesScoreDict[outcome];

    // Optimistic update - observers will be notified automatically
    this.clientScore.add(scoreGain);
    this.globalScore.add(scoreGain);
    this.pendingScore += scoreGain;

    // Debug log to verify score increment
    console.log('Score updated:', {
      globalScore: this.globalScore.value,
      clientScore: this.clientScore.value,
      pendingScore: this.pendingScore,
      scoreGain,
    });

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

    // Debounce sync
    this.scheduleSyncScore();
  }

  scheduleSyncScore() {
    if (this.syncTimer) {
      this.syncTimer.destroy();
    }

    this.syncTimer = this.time.delayedCall(300, () => {
      this.syncScore();
    });
  }

  async syncScore() {
    if (this.isSyncing || this.pendingScore === 0) return;

    const scoreToSync = this.pendingScore;
    this.pendingScore = 0;
    this.isSyncing = true;

    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-ID': this.clientId,
        },
        body: JSON.stringify({ amount: scoreToSync }),
      });
      const data = await response.json();

      // Use server values (which already include the synced score)
      // and add any new pending scores that accumulated during sync
      // No limit - scores can go beyond 9999
      const serverGlobal = data.globalScore || 0;
      const serverClient = data.clientScore || 0;

      // Observers will be notified automatically
      this.globalScore.value = serverGlobal + this.pendingScore;
      this.clientScore.value = serverClient + this.pendingScore;

      // Debug log to verify sync
      console.log('Score synced:', {
        serverGlobal,
        serverClient,
        globalScore: this.globalScore.value,
        clientScore: this.clientScore.value,
        pendingScore: this.pendingScore,
      });
    } catch (error) {
      console.error('Failed to sync score:', error);
      // Restore pending score on error so we can retry
      this.pendingScore += scoreToSync;
    } finally {
      this.isSyncing = false;

      if (this.pendingScore > 0) {
        this.scheduleSyncScore();
      }
    }
  }

  async fetchScores() {
    try {
      const response = await fetch('/api/score', {
        headers: {
          'X-Client-ID': this.clientId,
        },
      });
      const data = await response.json();
      // Observers will be notified automatically
      this.globalScore.value = data.globalScore || 0;
      this.clientScore.value = data.clientScore || 0;
    } catch (error) {
      console.error('Failed to fetch scores:', error);
    }
  }
}
