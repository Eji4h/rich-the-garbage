import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

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
  pendingScore: number = 0; // Score waiting to be sent
  sessionScoreText: Phaser.GameObjects.Text;
  globalScoreText: Phaser.GameObjects.Text;
  clickButton: Phaser.GameObjects.Container;
  buttonCircle: Phaser.GameObjects.Arc;
  buttonText: Phaser.GameObjects.Text;
  particles: Phaser.GameObjects.Particles.ParticleEmitter;
  syncTimer: Phaser.Time.TimerEvent | null = null;
  isSyncing: boolean = false;

  constructor() {
    super('Game');
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x1a1a2e);

    this.sessionId = getSessionId();
    this.pendingScore = 0;
    this.isSyncing = false;

    // Create gradient-like background with rectangles
    const bgGradient = this.add.graphics();
    bgGradient.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
    bgGradient.fillRect(0, 0, 1024, 576);

    // Title
    this.add
      .text(512, 50, '🎯 Click to Score!', {
        fontFamily: 'Arial Black',
        fontSize: 42,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Global Score Display
    this.add
      .text(512, 110, '🌍 Global Score', {
        fontFamily: 'Arial',
        fontSize: 18,
        color: '#94a3b8',
      })
      .setOrigin(0.5);

    this.globalScoreText = this.add
      .text(512, 145, '0', {
        fontFamily: 'Arial Black',
        fontSize: 36,
        color: '#22d3ee',
        stroke: '#0891b2',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Session Score Display
    this.add
      .text(512, 200, '⭐ Your Session Score', {
        fontFamily: 'Arial',
        fontSize: 18,
        color: '#94a3b8',
      })
      .setOrigin(0.5);

    this.sessionScoreText = this.add
      .text(512, 235, '0', {
        fontFamily: 'Arial Black',
        fontSize: 32,
        color: '#fbbf24',
        stroke: '#d97706',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Create click button
    this.createClickButton();

    // Create particle emitter for click effects
    this.createParticles();

    // Fetch initial scores from server
    this.fetchScores();

    EventBus.emit('current-scene-ready', this);
  }

  createClickButton() {
    const centerX = 512;
    const centerY = 400;

    // Button circle
    this.buttonCircle = this.add.circle(0, 0, 80, 0xe94560);
    this.buttonCircle.setStrokeStyle(4, 0xff6b6b);

    // Button text
    this.buttonText = this.add
      .text(0, 0, '👆\nCLICK!', {
        fontFamily: 'Arial Black',
        fontSize: 24,
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5);

    // Container for button
    this.clickButton = this.add.container(centerX, centerY, [
      this.buttonCircle,
      this.buttonText,
    ]);
    this.clickButton.setSize(160, 160);
    this.clickButton.setInteractive({ useHandCursor: true });

    // Button interactions
    this.clickButton.on('pointerdown', () => {
      this.onButtonClick();
    });

    this.clickButton.on('pointerover', () => {
      this.tweens.add({
        targets: this.clickButton,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
        ease: 'Power2',
      });
      this.buttonCircle.setFillStyle(0xff6b6b);
    });

    this.clickButton.on('pointerout', () => {
      this.tweens.add({
        targets: this.clickButton,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
        ease: 'Power2',
      });
      this.buttonCircle.setFillStyle(0xe94560);
    });

    // Idle animation
    this.tweens.add({
      targets: this.clickButton,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  createParticles() {
    // Create a simple circle texture for particles
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(8, 8, 8);
    graphics.generateTexture('particle', 16, 16);
    graphics.destroy();

    this.particles = this.add.particles(512, 400, 'particle', {
      speed: { min: 100, max: 300 },
      scale: { start: 0.5, end: 0 },
      lifespan: 500,
      tint: [0xfbbf24, 0xe94560, 0x22d3ee, 0x10b981],
      emitting: false,
    });
  }

  onButtonClick() {
    // Optimistic update - update UI immediately
    this.sessionScore++;
    this.globalScore++;
    this.pendingScore++;
    this.sessionScoreText.setText(this.sessionScore.toLocaleString());
    this.globalScoreText.setText(this.globalScore.toLocaleString());

    // Visual feedback
    this.tweens.add({
      targets: this.clickButton,
      scaleX: 0.9,
      scaleY: 0.9,
      duration: 50,
      yoyo: true,
      ease: 'Power2',
    });

    // Emit particles
    this.particles.explode(10);

    // Floating +1 text
    const plusOne = this.add
      .text(512 + Phaser.Math.Between(-30, 30), 350, '+1', {
        fontFamily: 'Arial Black',
        fontSize: 28,
        color: '#fbbf24',
        stroke: '#d97706',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: plusOne,
      y: 280,
      alpha: 0,
      duration: 600,
      ease: 'Power2',
      onComplete: () => plusOne.destroy(),
    });

    // Debounce sync - batch multiple clicks into one request
    this.scheduleSyncScore();
  }

  scheduleSyncScore() {
    // Cancel previous timer if exists
    if (this.syncTimer) {
      this.syncTimer.destroy();
    }

    // Schedule sync after 300ms of no clicks
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

      // Update with actual server values
      this.globalScore = data.globalScore || this.globalScore;
      this.sessionScore = data.sessionScore || this.sessionScore;
      this.globalScoreText.setText(this.globalScore.toLocaleString());
      this.sessionScoreText.setText(this.sessionScore.toLocaleString());
    } catch (error) {
      console.error('Failed to sync score:', error);
      // Score already shown optimistically, just log the error
    } finally {
      this.isSyncing = false;

      // If more clicks happened during sync, sync again
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
      this.globalScoreText.setText(this.globalScore.toLocaleString());
      this.sessionScoreText.setText(this.sessionScore.toLocaleString());
    } catch (error) {
      console.error('Failed to fetch scores:', error);
    }
  }
}
