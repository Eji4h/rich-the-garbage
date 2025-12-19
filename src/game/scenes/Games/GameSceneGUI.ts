import { match } from 'ts-pattern';
import { DrinkOutcome } from './DrinkOutComes';
import { GameScene } from './GameScene';

export class GameSceneGui {
  private clientScoreText: Phaser.GameObjects.Text;
  private globalScoreText: Phaser.GameObjects.Text;
  private floatingText: Phaser.GameObjects.Text;
  private floatingTextTween?: Phaser.Tweens.Tween;

  constructor(private readonly scene: GameScene) {
    this.scene = scene;
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

    this.floatingText = this.scene.add
      .text(512, 200, '+0', {
        fontFamily: 'Arial Black',
        fontSize: 36,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5);
    this.floatingText.setVisible(false);
  }

  updateClientScore(score: number) {
    this.clientScoreText.setText(score.toLocaleString());
  }

  updateGlobalScore(score: number) {
    this.globalScoreText.setText(score.toLocaleString());
  }

  playFloatingText(outcome: DrinkOutcome, score: number) {
    const floatingScoreText = this.getFloatingScoreText(outcome, score);
    const floatingScoreColor = this.getFloatingScoreColor(outcome);

    // Destroy previous tween if exists
    this.floatingTextTween?.destroy();

    this.floatingText.setText(floatingScoreText);
    this.floatingText.setColor(floatingScoreColor);
    this.floatingText.setPosition(512 + Phaser.Math.Between(-50, 50), 180);
    this.floatingText.setScale(1);
    this.floatingText.setAlpha(1);
    this.floatingText.setVisible(true);

    // Create new tween each time - this is the reliable pattern in Phaser
    this.floatingTextTween = this.scene.tweens.add({
      targets: this.floatingText,
      y: '-=80',
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 800,
      ease: 'Power2',
      onComplete: () => this.floatingText.setVisible(false),
    });
  }

  private getFloatingScoreText(outcome: DrinkOutcome, score: number): string {
    return match(outcome)
      .with('puke_bin', () => `+${score} 🗑️🤮`)
      .with('puke', () => `+${score} 🤮`)
      .otherwise(() => `+${score} 🍺`);
  }

  private getFloatingScoreColor(outcome: DrinkOutcome): string {
    return match(outcome)
      .with('puke_bin', () => '#10b981') // Green - best!
      .with('puke', () => '#a855f7') // Purple
      .otherwise(() => '#fbbf24'); // Yellow
  }
}
