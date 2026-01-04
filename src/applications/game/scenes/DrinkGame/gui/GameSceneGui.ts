import { DrinkOutcomeType } from '../DrinkOutComes';
import { FloatingTextGui } from './FloatingTextGui';
import { DrinkGameScene } from '../DrinkGameScene';

export class DrinkGameSceneGui {
  private clientScoreText: Phaser.GameObjects.Text;
  private globalScoreText: Phaser.GameObjects.Text;
  private readonly floatingText: FloatingTextGui;

  constructor(private readonly scene: DrinkGameScene) {
    this.floatingText = new FloatingTextGui(scene);
  }

  create() {
    this.createTitle();
    this.createGlobalScoreDisplay();
    this.createInstructions();
    this.createClientScoreDisplay();
    this.floatingText.create();
    this.subscribeToScores();
  }

  playFloatingText(outcome: DrinkOutcomeType, score: number) {
    this.floatingText.play(outcome, score);
  }

  private subscribeToScores() {
    this.scene.clientScore.subscribe((score) => {
      this.clientScoreText.setText(score.toLocaleString());
    });

    this.scene.globalScore.subscribe((score) => {
      this.globalScoreText.setText(score.toLocaleString());
    });
  }

  private createTitle() {
    this.scene.add
      .text(512, 30, '🍺 Tap to Drink!', {
        fontFamily: 'Arial Black',
        fontSize: 36,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);
  }

  private createGlobalScoreDisplay() {
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
  }

  private createInstructions() {
    this.scene.add
      .text(512, 540, 'Tap the character to drink! 🍻', {
        fontFamily: 'Arial',
        fontSize: 16,
        color: '#64748b',
      })
      .setOrigin(0.5);
  }

  private createClientScoreDisplay() {
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
  }
}
