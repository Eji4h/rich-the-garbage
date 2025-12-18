import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

type DrinkOutcome = 'normal' | 'puke' | 'puke_bin';

// Generate or get session ID
function getSessionId(): string {
  const SESSION_KEY = 'game_session_id';
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  sessionId: string;
  sessionScore: number = 0;
  globalScore: number = 0;
  pendingScore: number = 0;
  sessionScoreText: Phaser.GameObjects.Text;
  globalScoreText: Phaser.GameObjects.Text;
  character: Phaser.GameObjects.Sprite;
  particles: Phaser.GameObjects.Particles.ParticleEmitter;
  syncTimer: Phaser.Time.TimerEvent | null = null;
  isSyncing: boolean = false;
  isAnimating: boolean = false;

  constructor() {
    super('Game');
  }

  preload() {
    // Load spritesheet: 6 columns x 4 rows, 256px each frame
    this.load.spritesheet(
      'character',
      'phaser/spritesheet_sitting_256_6x4.png',
      {
        frameWidth: 256,
        frameHeight: 256,
      },
    );
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x1a1a2e);

    this.sessionId = getSessionId();
    this.pendingScore = 0;
    this.isSyncing = false;
    this.isAnimating = false;

    // Create gradient-like background
    const bgGradient = this.add.graphics();
    bgGradient.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
    bgGradient.fillRect(0, 0, 1024, 576);

    // Title
    this.add
      .text(512, 30, '🍺 Click to Drink!', {
        fontFamily: 'Arial Black',
        fontSize: 36,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Score displays on the sides
    // Global Score - Left side
    this.add
      .text(100, 80, '🌍 Global Score', {
        fontFamily: 'Arial',
        fontSize: 16,
        color: '#94a3b8',
      })
      .setOrigin(0.5);

    this.globalScoreText = this.add
      .text(100, 115, '0', {
        fontFamily: 'Arial Black',
        fontSize: 32,
        color: '#22d3ee',
        stroke: '#0891b2',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Session Score - Right side
    this.add
      .text(924, 80, '⭐ Your Score', {
        fontFamily: 'Arial',
        fontSize: 16,
        color: '#94a3b8',
      })
      .setOrigin(0.5);

    this.sessionScoreText = this.add
      .text(924, 115, '0', {
        fontFamily: 'Arial Black',
        fontSize: 28,
        color: '#fbbf24',
        stroke: '#d97706',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Create animations
    this.createAnimations();

    // Create character sprite
    this.createCharacter();

    // Create particle emitter
    this.createParticles();

    // Fetch initial scores from server
    this.fetchScores();

    // Instructions
    this.add
      .text(512, 540, 'Click the character to drink! 🍻', {
        fontFamily: 'Arial',
        fontSize: 16,
        color: '#64748b',
      })
      .setOrigin(0.5);

    EventBus.emit('current-scene-ready', this);
  }

  createAnimations() {
    // Row 0: Idle (frames 0-5)
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('character', {
        start: 0,
        end: 5,
      }),
      frameRate: 12,
      repeat: -1,
    });

    // Row 1: Drink Beer (frames 6-11)
    this.anims.create({
      key: 'drink',
      frames: this.anims.generateFrameNumbers('character', {
        start: 6,
        end: 11,
      }),
      frameRate: 18,
      repeat: 0,
    });

    // Row 2: Puke (frames 12-17)
    this.anims.create({
      key: 'puke',
      frames: this.anims.generateFrameNumbers('character', {
        start: 12,
        end: 17,
      }),
      frameRate: 16,
      repeat: 0,
    });

    // Row 3: Puke with bin (frames 18-23)
    this.anims.create({
      key: 'puke_bin',
      frames: this.anims.generateFrameNumbers('character', {
        start: 18,
        end: 23,
      }),
      frameRate: 16,
      repeat: 0,
    });
  }

  createCharacter() {
    // Create character sprite at center
    this.character = this.add.sprite(512, 340, 'character');
    this.character.setScale(1.2);
    this.character.setInteractive({ useHandCursor: true });

    // Play idle animation
    this.character.play('idle');

    // Click to drink
    this.character.on('pointerdown', () => {
      this.onCharacterClick();
    });

    // Hover effect
    this.character.on('pointerover', () => {
      this.tweens.add({
        targets: this.character,
        scaleX: 1.25,
        scaleY: 1.25,
        duration: 100,
        ease: 'Power2',
      });
    });

    this.character.on('pointerout', () => {
      this.tweens.add({
        targets: this.character,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 100,
        ease: 'Power2',
      });
    });
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
    // Skip if already animating
    if (this.isAnimating) return;

    // Random outcome:
    // 70% - Normal drink (+1)
    // 20% - Drink then puke (+5)
    // 10% - Drink then puke with bin (+10)
    const roll = Math.random();
    let scoreGain: number;
    let outcome: DrinkOutcome;

    if (roll < 0.1) {
      // 10% chance - Puke with bin (+10)
      outcome = 'puke_bin';
      scoreGain = 10;
    } else if (roll < 0.3) {
      // 20% chance - Puke (+5)
      outcome = 'puke';
      scoreGain = 5;
    } else {
      // 70% chance - Normal drink (+1)
      outcome = 'normal';
      scoreGain = 1;
    }

    // Optimistic update - update UI immediately
    this.sessionScore += scoreGain;
    this.globalScore += scoreGain;
    this.pendingScore += scoreGain;
    this.updateScoreDisplay(this.sessionScoreText, this.sessionScore, 28);
    this.updateScoreDisplay(this.globalScoreText, this.globalScore, 32);

    // Play animations
    this.isAnimating = true;
    this.character.play('drink');

    // When drink animation completes
    this.character.once('animationcomplete', () => {
      if (outcome === 'puke' || outcome === 'puke_bin') {
        this.character.play(outcome);
        this.character.once('animationcomplete', () => {
          this.character.play('idle');
          this.isAnimating = false;
        });
      } else {
        this.character.play('idle');
        this.isAnimating = false;
      }
    });

    // Emit particles (more for higher scores)
    this.particles.explode(scoreGain * 5);

    // Floating score text
    const scoreText = this.getScoreText(outcome, scoreGain);
    const plusText = this.add
      .text(512 + Phaser.Math.Between(-50, 50), 200, scoreText, {
        fontFamily: 'Arial Black',
        fontSize: scoreGain > 1 ? 36 : 28,
        color: this.getScoreColor(outcome),
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: plusText,
      y: 120,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 800,
      ease: 'Power2',
      onComplete: () => plusText.destroy(),
    });

    // Debounce sync
    this.scheduleSyncScore();
  }

  getScoreText(outcome: DrinkOutcome, score: number): string {
    switch (outcome) {
      case 'puke_bin':
        return `+${score} 🗑️🤮`;
      case 'puke':
        return `+${score} 🤮`;
      default:
        return `+${score} 🍺`;
    }
  }

  getScoreColor(outcome: DrinkOutcome): string {
    switch (outcome) {
      case 'puke_bin':
        return '#10b981'; // Green - best!
      case 'puke':
        return '#a855f7'; // Purple
      default:
        return '#fbbf24'; // Yellow
    }
  }

  formatScore(score: number): string {
    return score.toLocaleString();
  }

  updateScoreDisplay(
    textObject: Phaser.GameObjects.Text,
    score: number,
    baseSize: number,
  ) {
    const formatted = this.formatScore(score);
    textObject.setText(formatted);

    // Dynamically adjust font size for very long numbers (10+ chars)
    const length = formatted.length;
    let fontSize = baseSize;
    if (length > 11) {
      fontSize = Math.max(18, baseSize - (length - 11) * 2);
    }
    textObject.setFontSize(fontSize);
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
          'X-Session-ID': this.sessionId,
        },
        body: JSON.stringify({ amount: scoreToSync }),
      });
      const data = await response.json();

      // Add pending score to server values to prevent score going backwards
      const serverGlobal = data.globalScore || 0;
      const serverSession = data.sessionScore || 0;

      this.globalScore = serverGlobal + this.pendingScore;
      this.sessionScore = serverSession + this.pendingScore;
      this.updateScoreDisplay(this.globalScoreText, this.globalScore, 32);
      this.updateScoreDisplay(this.sessionScoreText, this.sessionScore, 28);
    } catch (error) {
      console.error('Failed to sync score:', error);
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
          'X-Session-ID': this.sessionId,
        },
      });
      const data = await response.json();
      this.globalScore = data.globalScore || 0;
      this.sessionScore = data.sessionScore || 0;
      this.updateScoreDisplay(this.globalScoreText, this.globalScore, 32);
      this.updateScoreDisplay(this.sessionScoreText, this.sessionScore, 28);
    } catch (error) {
      console.error('Failed to fetch scores:', error);
    }
  }
}
