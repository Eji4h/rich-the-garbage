import { EventBus } from '../../EventBus';
import { Scene } from 'phaser';
import { tricksterScoreSingleton } from './TricksterScoreSingleton';

export class TricksterScene extends Scene {
  public static readonly SceneName = 'TricksterGame';

  public readonly clientScore = tricksterScoreSingleton.clientScore;
  public readonly globalScore = tricksterScoreSingleton.globalScore;

  constructor() {
    super(TricksterScene.SceneName);
  }

  preload() {
    // Preload assets for Trickster game
  }

  create() {
    // Create game elements
    this.createBackground();
    this.createPlaceholderUI();

    EventBus.emit('current-scene-ready', this);
  }

  update() {
    // Game loop logic
  }

  private createBackground() {
    // Create a gradient background
    const graphics = this.add.graphics();

    // Purple gradient background
    graphics.fillGradientStyle(0x6b21a8, 0x6b21a8, 0x3b0764, 0x3b0764, 1);
    graphics.fillRect(0, 0, 1024, 576);

    // Add some decorative elements
    graphics.fillStyle(0x7c3aed, 0.3);
    for (let i = 0; i < 10; i++) {
      const x = Phaser.Math.Between(50, 974);
      const y = Phaser.Math.Between(50, 526);
      const size = Phaser.Math.Between(20, 60);
      graphics.fillCircle(x, y, size);
    }
  }

  private createPlaceholderUI() {
    // Title
    const title = this.add.text(512, 200, '🃏 Trickster', {
      fontSize: '64px',
      fontFamily: 'Outfit, sans-serif',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    });
    title.setOrigin(0.5);

    // Coming soon text
    const subtitle = this.add.text(512, 300, 'Coming Soon!', {
      fontSize: '32px',
      fontFamily: 'Outfit, sans-serif',
      color: '#e9d5ff',
    });
    subtitle.setOrigin(0.5);

    // Animated card emoji
    const card = this.add.text(512, 420, '🎴', {
      fontSize: '80px',
    });
    card.setOrigin(0.5);

    // Add floating animation
    this.tweens.add({
      targets: card,
      y: 400,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Add rotation effect to title
    this.tweens.add({
      targets: title,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
}
