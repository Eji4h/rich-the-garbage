import { EventBus } from '../../EventBus';
import { Scene } from 'phaser';
import { getClientId } from '../../../utils/clientId';
import { Character } from './Character';
import { match } from 'ts-pattern';
import { GameSceneGui } from './GameSceneGui';
import { DrinkOutcome, DrinkOutComes } from './DrinkOutComes';

export class GameScene extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  clientId: string;
  clientScore: number = 0;
  globalScore: number = 0;
  pendingScore: number = 0;
  particles: Phaser.GameObjects.Particles.ParticleEmitter;
  syncTimer: Phaser.Time.TimerEvent | null = null;
  isSyncing: boolean = false;

  private readonly character: Character;
  private readonly gui: GameSceneGui;

  constructor() {
    super('Game');
    this.character = new Character(this);
    this.gui = new GameSceneGui(this);
    this.clientId = getClientId();
  }

  preload() {
    this.character.preload();
  }

  create() {
    // // Create gradient-like background
    // const bgGradient = this.add.graphics();
    // bgGradient.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
    // bgGradient.fillRect(0, 0, 1024, 576);
    this.character.create();
    this.gui.create();

    // Create particle emitter
    this.createParticles();

    // Fetch initial scores from server
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
    // Random outcome:
    // 70% - Normal drink (+1)
    // 20% - Drink then puke (+5)
    // 10% - Drink then puke with bin (+10)
    const roll = Math.random();
    let scoreGain: number;
    let outcome: DrinkOutcome;

    if (roll < 0.1) {
      // 10% chance - Puke with bin (+10)
      outcome = DrinkOutComes.puke_bin;
      scoreGain = 10;
    } else if (roll < 0.3) {
      // 20% chance - Puke (+5)
      outcome = DrinkOutComes.puke;
      scoreGain = 5;
    } else {
      // 70% chance - Normal drink (+1)
      outcome = DrinkOutComes.drink;
      scoreGain = 1;
    }

    // Optimistic update - update UI immediately
    // No limit - scores can go beyond 9999
    this.clientScore += scoreGain;
    this.globalScore += scoreGain;
    this.pendingScore += scoreGain;
    this.gui.updateClientScore(this.clientScore);
    this.gui.updateGlobalScore(this.globalScore);

    // Debug log to verify score increment
    console.log('Score updated:', {
      globalScore: this.globalScore,
      clientScore: this.clientScore,
      pendingScore: this.pendingScore,
      scoreGain,
    });

    match(outcome)
      .with(DrinkOutComes.puke, () => {
        this.character.puke();
      })
      .with(DrinkOutComes.puke_bin, () => {
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

      this.globalScore = serverGlobal + this.pendingScore;
      this.clientScore = serverClient + this.pendingScore;
      this.gui.updateGlobalScore(this.globalScore);
      this.gui.updateClientScore(this.clientScore);

      // Debug log to verify sync
      console.log('Score synced:', {
        serverGlobal,
        serverClient,
        globalScore: this.globalScore,
        clientScore: this.clientScore,
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
      this.globalScore = data.globalScore || 0;
      this.clientScore = data.clientScore || 0;
      this.gui.updateGlobalScore(this.globalScore);
      this.gui.updateClientScore(this.clientScore);
    } catch (error) {
      console.error('Failed to fetch scores:', error);
    }
  }
}
