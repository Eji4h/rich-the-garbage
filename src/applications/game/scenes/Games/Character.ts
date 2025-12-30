import { characterSpritePath } from '../../AssetPath';
import { GameScene } from './GameScene';

const AnimationsKeys = {
  idle: 'idle',
  drink: 'drink',
  puke: 'puke',
  puke_bin: 'puke_bin',
} as const;

export class Character {
  static readonly characterKey = 'character';
  private _isAnimating: boolean = false;
  private characterSprite: Phaser.GameObjects.Sprite;

  private readonly baseScale: number = 1.2;
  private readonly hoverScale: number = 1.25;
  private readonly hoverDuration: number = 100;
  private readonly hoverEase: string = 'Power2';

  get isAnimating() {
    return this._isAnimating;
  }

  constructor(private readonly scene: GameScene) {}

  preload() {
    this.scene.load.spritesheet(Character.characterKey, characterSpritePath, {
      frameWidth: 256,
      frameHeight: 256,
    });
  }

  create() {
    this.createAnimations();
    this.characterSprite = this.scene.add.sprite(
      512,
      340,
      Character.characterKey,
    );
    this.characterSprite.setScale(this.baseScale);
    this.characterSprite.setInteractive({ useHandCursor: true });
    this.setupCharacterHover();

    this.characterSprite.on('pointerdown', this.onCharacterClick);
  }

  private setupCharacterHover() {
    this.characterSprite.on('pointerover', () => {
      this.scene.tweens.add({
        targets: this.characterSprite,
        scaleX: this.hoverScale,
        scaleY: this.hoverScale,
        duration: this.hoverDuration,
        ease: this.hoverEase,
      });
    });

    this.characterSprite.on('pointerout', () => {
      this.scene.tweens.add({
        targets: this.characterSprite,
        scaleX: this.baseScale,
        scaleY: this.baseScale,
        duration: this.hoverDuration,
        ease: this.hoverEase,
      });
    });
  }

  private onCharacterClick() {
    if (this.isAnimating) {
      return;
    }

    this.scene.onCharacterClick();
  }

  idle() {
    this._isAnimating = false;
    this.characterSprite.play(AnimationsKeys.idle);
  }

  drink() {
    this._isAnimating = true;
    this.characterSprite.play(AnimationsKeys.drink);
    this.characterSprite.once('animationcomplete', () => {
      this.idle();
    });
  }

  puke() {
    this._isAnimating = true;
    this.characterSprite.play(AnimationsKeys.puke);
    this.characterSprite.once('animationcomplete', () => {
      this.idle();
    });
  }

  puke_bin() {
    this._isAnimating = true;
    this.characterSprite.play(AnimationsKeys.puke_bin);
    this.characterSprite.once('animationcomplete', () => {
      this.idle();
    });
  }

  private createAnimations() {
    // Row 0: Idle (frames 0-5)
    this.scene.anims.create({
      key: AnimationsKeys.idle,
      frames: this.scene.anims.generateFrameNumbers(Character.characterKey, {
        start: 0,
        end: 5,
      }),
      frameRate: 12,
      repeat: -1,
    });

    // Row 1: Drink Beer (frames 6-11)
    this.scene.anims.create({
      key: AnimationsKeys.drink,
      frames: this.scene.anims.generateFrameNumbers(Character.characterKey, {
        start: 6,
        end: 11,
      }),
      frameRate: 18,
      repeat: 0,
    });

    // Row 2: Puke (frames 12-17)
    this.scene.anims.create({
      key: AnimationsKeys.puke,
      frames: this.scene.anims.generateFrameNumbers(Character.characterKey, {
        start: 12,
        end: 17,
      }),
      frameRate: 16,
      repeat: 0,
    });

    // Row 3: Puke with bin (frames 18-23)
    this.scene.anims.create({
      key: AnimationsKeys.puke_bin,
      frames: this.scene.anims.generateFrameNumbers(Character.characterKey, {
        start: 18,
        end: 23,
      }),
      frameRate: 16,
      repeat: 0,
    });
  }
}
