import { match } from 'ts-pattern';
import { DrinkOutcome } from './DrinkOutComes';

export class FloatingTextGui {
  private text: Phaser.GameObjects.Text;
  private tween?: Phaser.Tweens.Tween;

  constructor(private readonly scene: Phaser.Scene) {}

  create() {
    this.text = this.scene.add
      .text(512, 200, '+0', {
        fontFamily: 'Arial Black',
        fontSize: 36,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5);
    this.text.setVisible(false);
  }

  play(outcome: DrinkOutcome, score: number) {
    const floatingScoreText = this.getScoreText(outcome, score);
    const floatingScoreColor = this.getScoreColor(outcome);

    // Destroy previous tween if exists
    this.tween?.destroy();

    this.text.setText(floatingScoreText);
    this.text.setColor(floatingScoreColor);
    this.text.setPosition(512 + Phaser.Math.Between(-50, 50), 180);
    this.text.setScale(1);
    this.text.setAlpha(1);
    this.text.setVisible(true);

    // Create new tween each time - this is the reliable pattern in Phaser
    this.tween = this.scene.tweens.add({
      targets: this.text,
      y: '-=80',
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 800,
      ease: 'Power2',
      onComplete: () => this.text.setVisible(false),
    });
  }

  private getScoreText(outcome: DrinkOutcome, score: number): string {
    return match(outcome)
      .with('puke_bin', () => `+${score} 🗑️🤮`)
      .with('puke', () => `+${score} 🤮`)
      .otherwise(() => `+${score} 🍺`);
  }

  private getScoreColor(outcome: DrinkOutcome): string {
    return match(outcome)
      .with('puke_bin', () => '#10b981') // Green - best!
      .with('puke', () => '#a855f7') // Purple
      .otherwise(() => '#fbbf24'); // Yellow
  }
}
