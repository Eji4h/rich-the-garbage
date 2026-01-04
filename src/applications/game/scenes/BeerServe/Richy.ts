import { characterSpritePath } from '../../AssetPath';
import { BeerServeScene } from './BeerServeScene';

const AnimationsKeys = {
  idle: 'beerserve_idle',
  drink: 'beerserve_drink',
} as const;

export class Richy {
  static readonly characterKey = 'beerserve_character';

  private sprite: Phaser.GameObjects.Sprite;
  private hole: Phaser.GameObjects.Graphics;

  private _isUp: boolean = false;
  private _isServed: boolean = false;
  private hideTimer: Phaser.Time.TimerEvent | null = null;

  private readonly popUpDuration: number = 180;
  private readonly hideDuration: number = 100;
  private readonly holeWidth: number = 130;
  private readonly holeHeight: number = 30;
  private readonly spriteScale: number = 0.5;
  private readonly hiddenY: number = 150;

  private _visibleTime: number = 1200;

  get isUp(): boolean {
    return this._isUp;
  }

  get isServed(): boolean {
    return this._isServed;
  }

  set visibleTime(value: number) {
    this._visibleTime = value;
  }

  constructor(
    private readonly scene: BeerServeScene,
    private readonly x: number,
    private readonly y: number,
    private readonly row: number,
    private readonly onServed: () => void,
    private readonly onMissed: () => void,
  ) {}

  static preload(scene: Phaser.Scene) {
    if (!scene.textures.exists(Richy.characterKey)) {
      scene.load.spritesheet(Richy.characterKey, characterSpritePath, {
        frameWidth: 256,
        frameHeight: 512,
      });
    }
  }

  create() {
    this.createAnimations();
    this.createSprite();
    this.createHole();
  }

  private createAnimations() {
    if (!this.scene.anims.exists(AnimationsKeys.idle)) {
      this.scene.anims.create({
        key: AnimationsKeys.idle,
        frames: this.scene.anims.generateFrameNumbers(Richy.characterKey, {
          start: 0,
          end: 5,
        }),
        frameRate: 12,
        repeat: -1,
      });
    }

    if (!this.scene.anims.exists(AnimationsKeys.drink)) {
      this.scene.anims.create({
        key: AnimationsKeys.drink,
        frames: this.scene.anims.generateFrameNumbers(Richy.characterKey, {
          start: 6,
          end: 11,
        }),
        frameRate: 18,
        repeat: 0,
      });
    }
  }

  private createSprite() {
    this.sprite = this.scene.add.sprite(
      this.x,
      this.y + this.hiddenY,
      Richy.characterKey,
    );
    this.sprite.setScale(this.spriteScale);
    // Each row has its own depth layer (sprite behind hole for same row)
    this.sprite.setDepth(this.row * 10 + 1);
    this.sprite.play(AnimationsKeys.idle);

    this.sprite.setInteractive({ useHandCursor: true });
    this.sprite.on('pointerdown', this.onPointerDown, this);
  }

  private createHole() {
    this.hole = this.scene.add.graphics();
    // Hole cover is in front of sprite for same row, behind sprites of rows below
    this.hole.setDepth(this.row * 10 + 2);

    // Cover below hole (background color to hide sprite when down)
    this.hole.fillStyle(0x2c3e50, 1);
    this.hole.fillRect(
      this.x - this.holeWidth / 2 - 5,
      this.y + this.holeHeight / 2 - 5,
      this.holeWidth + 10,
      200,
    );

    // Barrel rim
    this.hole.fillStyle(0x34495e, 1);
    this.hole.fillEllipse(
      this.x,
      this.y,
      this.holeWidth + 8,
      this.holeHeight + 5,
    );

    // Barrel opening
    this.hole.fillStyle(0x1a1a2e, 1);
    this.hole.fillEllipse(this.x, this.y, this.holeWidth, this.holeHeight);

    // Rim highlight
    this.hole.lineStyle(2, 0x4a5568, 0.6);
    this.hole.strokeEllipse(
      this.x,
      this.y,
      this.holeWidth + 4,
      this.holeHeight + 2,
    );
  }

  private onPointerDown() {
    if (this._isUp && !this._isServed) {
      this.serveBeer();
    }
  }

  popUp() {
    if (this._isUp) return;

    this._isUp = true;
    this._isServed = false;

    this.scene.tweens.add({
      targets: this.sprite,
      y: this.y - 25,
      duration: this.popUpDuration,
      ease: 'Back.easeOut',
    });

    this.hideTimer = this.scene.time.delayedCall(this._visibleTime, () => {
      if (this._isUp && !this._isServed) {
        this.onMissed();
        this.hide();
      }
    });
  }

  hide() {
    if (!this._isUp) return;

    this._isUp = false;

    if (this.hideTimer) {
      this.hideTimer.destroy();
      this.hideTimer = null;
    }

    this.scene.tweens.add({
      targets: this.sprite,
      y: this.y + this.hiddenY,
      duration: this.hideDuration,
      ease: 'Power2.easeIn',
    });
  }

  serveBeer() {
    if (!this._isUp || this._isServed) return;

    this._isServed = true;

    if (this.hideTimer) {
      this.hideTimer.destroy();
      this.hideTimer = null;
    }

    this.sprite.play(AnimationsKeys.drink);
    this.onServed();

    this.sprite.once('animationcomplete', () => {
      this.sprite.play(AnimationsKeys.idle);
      this.hide();
    });
  }

  reset() {
    this._isUp = false;
    this._isServed = false;
    this.sprite.y = this.y + this.hiddenY;
    this.sprite.setScale(this.spriteScale);
    if (this.hideTimer) {
      this.hideTimer.destroy();
      this.hideTimer = null;
    }
  }

  destroy() {
    if (this.hideTimer) {
      this.hideTimer.destroy();
    }
    this.sprite.destroy();
    this.hole.destroy();
  }
}
