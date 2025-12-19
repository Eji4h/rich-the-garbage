import { DrinkOutcome } from './DrinkOutComes';
import { FloatingTextGui } from './FloatingTextGui';
import { GameScene } from './GameScene';

export class GameSceneGui {
  private clientScoreText: Phaser.GameObjects.Text;
  private globalScoreText: Phaser.GameObjects.Text;
  private readonly floatingText: FloatingTextGui;

  constructor(private readonly scene: GameScene) {
    this.floatingText = new FloatingTextGui(scene);
  }

  create() {
    // Title
    this.scene.add
      .text(512, 30, '🍺 Tap to Drink!', {
        fontFamily: 'Arial Black',
        fontSize: 36,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Score displays on the sides
    // Global Score - Left side
    this.scene.add
      .text(150, 80, '🌍 Global Score', {
        fontFamily: 'Arial',
        fontSize: 16,
        color: '#94a3b8',
      })
      .setOrigin(0.5);

    this.globalScoreText = this.scene.add
      .text(150, 115, '0', {
        fontFamily: 'Arial Black',
        fontSize: 32,
        color: '#22d3ee',
        stroke: '#0891b2',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Instructions
    this.scene.add
      .text(512, 540, 'Tap the character to drink! 🍻', {
        fontFamily: 'Arial',
        fontSize: 16,
        color: '#64748b',
      })
      .setOrigin(0.5);

    // Device Score - Right side
    this.scene.add
      .text(874, 80, '⭐ Your Score', {
        fontFamily: 'Arial',
        fontSize: 16,
        color: '#94a3b8',
      })
      .setOrigin(0.5);

    this.clientScoreText = this.scene.add
      .text(874, 115, '0', {
        fontFamily: 'Arial Black',
        fontSize: 28,
        color: '#fbbf24',
        stroke: '#d97706',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    this.floatingText.create();
  }

  updateClientScore(score: number) {
    this.clientScoreText.setText(score.toLocaleString());
  }

  updateGlobalScore(score: number) {
    this.globalScoreText.setText(score.toLocaleString());
  }

  playFloatingText(outcome: DrinkOutcome, score: number) {
    this.floatingText.play(outcome, score);
  }
}
