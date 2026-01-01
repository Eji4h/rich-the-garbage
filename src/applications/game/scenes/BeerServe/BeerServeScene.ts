import { EventBus } from '../../EventBus';
import { Scene } from 'phaser';
import { beerServeScoreSingleton } from './BeerServeScoreSingleton';
import { Richy } from './Richy';

type GameState = 'start' | 'playing' | 'gameover';

export class BeerServeScene extends Scene {
  public static readonly SceneName = 'BeerServeGame';

  public readonly clientScore = beerServeScoreSingleton.clientScore;
  public readonly globalScore = beerServeScoreSingleton.globalScore;

  // Game constants
  private readonly GAME_DURATION = 60;
  private readonly GRID_COLS = 3;
  private readonly GRID_ROWS = 3;
  private readonly SCORE_PER_SERVE = 10;

  // Difficulty settings
  private readonly INITIAL_VISIBLE_TIME = 1000;
  private readonly FINAL_VISIBLE_TIME = 350;
  private readonly INITIAL_SPAWN_INTERVAL = 800;
  private readonly FINAL_SPAWN_INTERVAL = 300;
  private readonly MAX_SIMULTANEOUS = 5;

  // Game state
  private gameState: GameState = 'start';
  private timeRemaining: number = this.GAME_DURATION;
  private richyGrid: Richy[] = [];
  private spawnTimer: Phaser.Time.TimerEvent | null = null;
  private countdownTimer: Phaser.Time.TimerEvent | null = null;

  // UI elements
  private scoreText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private startOverlay!: Phaser.GameObjects.Container;
  private gameOverOverlay!: Phaser.GameObjects.Container;
  private beerCursor!: Phaser.GameObjects.Text;

  constructor() {
    super(BeerServeScene.SceneName);
  }

  preload() {
    Richy.preload(this);
  }

  create() {
    this.resetGameState();
    this.createGrid();
    this.createUI();
    this.createBeerCursor();
    this.createStartOverlay();
    this.createGameOverOverlay();

    EventBus.emit('current-scene-ready', this);
  }

  update() {
    // Update beer cursor position to follow mouse
    this.updateBeerCursor();
  }

  private resetGameState() {
    this.gameState = 'start';
    this.timeRemaining = this.GAME_DURATION;
    beerServeScoreSingleton.reset();
  }

  private createGrid() {
    const startX = 200;
    const startY = 200;
    const spacingX = 280;
    const spacingY = 130;

    for (let row = 0; row < this.GRID_ROWS; row++) {
      for (let col = 0; col < this.GRID_COLS; col++) {
        const x = startX + col * spacingX;
        const y = startY + row * spacingY;

        const richy = new Richy(
          this,
          x,
          y,
          row,
          () => this.onBeerServed(),
          () => this.onBeerMissed(),
        );
        richy.create();
        this.richyGrid.push(richy);
      }
    }
  }

  private createUI() {
    // Score display
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '32px',
      fontFamily: 'Outfit, sans-serif',
      color: '#fef3c7',
      stroke: '#78350f',
      strokeThickness: 3,
    });
    this.scoreText.setDepth(10);

    // Timer display
    this.timerText = this.add.text(1004, 20, `Time: ${this.GAME_DURATION}`, {
      fontSize: '32px',
      fontFamily: 'Outfit, sans-serif',
      color: '#fef3c7',
      stroke: '#78350f',
      strokeThickness: 3,
    });
    this.timerText.setOrigin(1, 0);
    this.timerText.setDepth(10);

    // Title
    const title = this.add.text(512, 25, '🍺 Beer Serve 🍺', {
      fontSize: '36px',
      fontFamily: 'Outfit, sans-serif',
      color: '#fcd34d',
      stroke: '#78350f',
      strokeThickness: 4,
    });
    title.setOrigin(0.5, 0);
    title.setDepth(10);
  }

  private createBeerCursor() {
    // Create beer mug cursor that follows the mouse
    this.beerCursor = this.add.text(0, 0, '🍺', {
      fontSize: '48px',
    });
    this.beerCursor.setOrigin(0.5, 1);
    this.beerCursor.setDepth(200);

    // Hide default cursor when over game canvas
    this.input.setDefaultCursor('none');

    // Add tilt animation on click
    this.input.on('pointerdown', () => {
      if (this.gameState === 'playing') {
        this.tweens.add({
          targets: this.beerCursor,
          angle: -30,
          duration: 80,
          yoyo: true,
          ease: 'Power2',
        });
      }
    });
  }

  private updateBeerCursor() {
    const pointer = this.input.activePointer;
    this.beerCursor.setPosition(pointer.x, pointer.y);

    // Show/hide cursor based on game state
    this.beerCursor.setVisible(this.gameState === 'playing');
  }

  private createStartOverlay() {
    this.startOverlay = this.add.container(512, 288);
    this.startOverlay.setDepth(100);

    // Semi-transparent background
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.7);
    bg.fillRoundedRect(-250, -150, 500, 300, 20);
    this.startOverlay.add(bg);

    // Title
    const title = this.add.text(0, -80, '🍺 Beer Serve', {
      fontSize: '48px',
      fontFamily: 'Outfit, sans-serif',
      color: '#fcd34d',
    });
    title.setOrigin(0.5);
    this.startOverlay.add(title);

    // Instructions
    const instructions = this.add.text(
      0,
      -10,
      'Serve beer to Richy when he pops up!\nClick on him before he disappears.',
      {
        fontSize: '20px',
        fontFamily: 'Outfit, sans-serif',
        color: '#ffffff',
        align: 'center',
      },
    );
    instructions.setOrigin(0.5);
    this.startOverlay.add(instructions);

    // Start button
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0xf59e0b, 1);
    buttonBg.fillRoundedRect(-100, 50, 200, 60, 15);
    this.startOverlay.add(buttonBg);

    const buttonText = this.add.text(0, 80, 'START GAME', {
      fontSize: '28px',
      fontFamily: 'Outfit, sans-serif',
      color: '#1f2937',
      fontStyle: 'bold',
    });
    buttonText.setOrigin(0.5);
    this.startOverlay.add(buttonText);

    // Make button interactive
    const hitArea = this.add.rectangle(0, 80, 200, 60, 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });
    hitArea.on('pointerdown', () => this.startGame());
    hitArea.on('pointerover', () =>
      buttonBg
        .clear()
        .fillStyle(0xfbbf24, 1)
        .fillRoundedRect(-100, 50, 200, 60, 15),
    );
    hitArea.on('pointerout', () =>
      buttonBg
        .clear()
        .fillStyle(0xf59e0b, 1)
        .fillRoundedRect(-100, 50, 200, 60, 15),
    );
    this.startOverlay.add(hitArea);
  }

  private createGameOverOverlay() {
    this.gameOverOverlay = this.add.container(512, 288);
    this.gameOverOverlay.setDepth(100);
    this.gameOverOverlay.setVisible(false);

    // Semi-transparent background
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.8);
    bg.fillRoundedRect(-250, -180, 500, 360, 20);
    this.gameOverOverlay.add(bg);

    // Game Over title
    const title = this.add.text(0, -120, "Time's Up!", {
      fontSize: '52px',
      fontFamily: 'Outfit, sans-serif',
      color: '#ef4444',
    });
    title.setOrigin(0.5);
    this.gameOverOverlay.add(title);

    // Final score label
    const scoreLabel = this.add.text(0, -40, 'Final Score', {
      fontSize: '24px',
      fontFamily: 'Outfit, sans-serif',
      color: '#9ca3af',
    });
    scoreLabel.setOrigin(0.5);
    this.gameOverOverlay.add(scoreLabel);

    // Score will be updated when game ends
    const scoreValue = this.add.text(0, 10, '0', {
      fontSize: '64px',
      fontFamily: 'Outfit, sans-serif',
      color: '#fcd34d',
      fontStyle: 'bold',
    });
    scoreValue.setOrigin(0.5);
    scoreValue.setName('finalScore');
    this.gameOverOverlay.add(scoreValue);

    // Play Again button
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0x22c55e, 1);
    buttonBg.fillRoundedRect(-100, 80, 200, 60, 15);
    this.gameOverOverlay.add(buttonBg);

    const buttonText = this.add.text(0, 110, 'PLAY AGAIN', {
      fontSize: '28px',
      fontFamily: 'Outfit, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    buttonText.setOrigin(0.5);
    this.gameOverOverlay.add(buttonText);

    // Make button interactive
    const hitArea = this.add.rectangle(0, 110, 200, 60, 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });
    hitArea.on('pointerdown', () => this.restartGame());
    hitArea.on('pointerover', () =>
      buttonBg
        .clear()
        .fillStyle(0x4ade80, 1)
        .fillRoundedRect(-100, 80, 200, 60, 15),
    );
    hitArea.on('pointerout', () =>
      buttonBg
        .clear()
        .fillStyle(0x22c55e, 1)
        .fillRoundedRect(-100, 80, 200, 60, 15),
    );
    this.gameOverOverlay.add(hitArea);
  }

  private startGame() {
    this.gameState = 'playing';
    this.startOverlay.setVisible(false);
    this.timeRemaining = this.GAME_DURATION;
    beerServeScoreSingleton.reset();
    this.updateScoreDisplay();
    this.updateTimerDisplay();

    // Start countdown timer
    this.countdownTimer = this.time.addEvent({
      delay: 1000,
      callback: this.onSecondElapsed,
      callbackScope: this,
      repeat: this.GAME_DURATION - 1,
    });

    // Start spawning
    this.scheduleNextSpawn();
  }

  private onSecondElapsed() {
    this.timeRemaining--;
    this.updateTimerDisplay();

    if (this.timeRemaining <= 0) {
      this.endGame();
    }
  }

  private scheduleNextSpawn() {
    if (this.gameState !== 'playing') return;

    const spawnInterval = this.getCurrentSpawnInterval();

    this.spawnTimer = this.time.delayedCall(spawnInterval, () => {
      this.spawnRichy();
      this.scheduleNextSpawn();
    });
  }

  private getCurrentSpawnInterval(): number {
    const progress = 1 - this.timeRemaining / this.GAME_DURATION;
    return Phaser.Math.Linear(
      this.INITIAL_SPAWN_INTERVAL,
      this.FINAL_SPAWN_INTERVAL,
      progress,
    );
  }

  private getCurrentVisibleTime(): number {
    const progress = 1 - this.timeRemaining / this.GAME_DURATION;
    return Phaser.Math.Linear(
      this.INITIAL_VISIBLE_TIME,
      this.FINAL_VISIBLE_TIME,
      progress,
    );
  }

  private spawnRichy() {
    if (this.gameState !== 'playing') return;

    // Count how many are currently up
    const upCount = this.richyGrid.filter((r) => r.isUp).length;
    if (upCount >= this.MAX_SIMULTANEOUS) return;

    // Get available (not up) richies
    const available = this.richyGrid.filter((r) => !r.isUp);
    if (available.length === 0) return;

    // Pick a random one
    const randomIndex = Phaser.Math.Between(0, available.length - 1);
    const richy = available[randomIndex];

    // Set visible time based on difficulty
    richy.visibleTime = this.getCurrentVisibleTime();
    richy.popUp();
  }

  private onBeerServed() {
    if (this.gameState !== 'playing') return;

    this.clientScore.add(this.SCORE_PER_SERVE);
    this.updateScoreDisplay();

    // Visual feedback
    this.tweens.add({
      targets: this.scoreText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 100,
      yoyo: true,
    });
  }

  private onBeerMissed() {
    // Optional: Add penalty or visual feedback for missed serves
    // Currently no penalty, just miss the opportunity
  }

  private updateScoreDisplay() {
    this.scoreText.setText(`Score: ${this.clientScore.value}`);
  }

  private updateTimerDisplay() {
    this.timerText.setText(`Time: ${this.timeRemaining}`);

    // Flash timer when low
    if (this.timeRemaining <= 10) {
      this.timerText.setColor('#ef4444');
    }
  }

  private endGame() {
    this.gameState = 'gameover';

    // Stop timers
    if (this.spawnTimer) {
      this.spawnTimer.destroy();
      this.spawnTimer = null;
    }
    if (this.countdownTimer) {
      this.countdownTimer.destroy();
      this.countdownTimer = null;
    }

    // Hide all richies
    this.richyGrid.forEach((richy) => richy.hide());

    // Update final score in overlay
    const scoreText = this.gameOverOverlay.getByName('finalScore');
    if (scoreText && scoreText instanceof Phaser.GameObjects.Text) {
      scoreText.setText(this.clientScore.value.toString());
    }

    // Show game over overlay
    this.gameOverOverlay.setVisible(true);
    this.gameOverOverlay.setAlpha(0);
    this.tweens.add({
      targets: this.gameOverOverlay,
      alpha: 1,
      duration: 300,
    });
  }

  private restartGame() {
    this.gameOverOverlay.setVisible(false);
    this.timerText.setColor('#fef3c7');

    // Reset all richies
    this.richyGrid.forEach((richy) => richy.reset());

    this.startGame();
  }

  shutdown() {
    // Restore default cursor
    this.input.setDefaultCursor('default');

    // Clean up timers
    if (this.spawnTimer) {
      this.spawnTimer.destroy();
    }
    if (this.countdownTimer) {
      this.countdownTimer.destroy();
    }

    // Clean up richies
    this.richyGrid.forEach((richy) => richy.destroy());
    this.richyGrid = [];
  }
}
