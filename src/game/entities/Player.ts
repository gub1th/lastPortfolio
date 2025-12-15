import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/GameConfig';

export type Direction = 'up' | 'down' | 'left' | 'right';

export class Player {
  private scene: Phaser.Scene;
  private sprite: Phaser.GameObjects.Sprite;
  private tileX: number;
  private tileY: number;
  private isMoving: boolean = false;
  private moveProgress: number = 0;
  private currentDirection: Direction = 'down';
  private targetTileX: number;
  private targetTileY: number;
  private collisionLayer: Phaser.Tilemaps.TilemapLayer | null = null;
  private interactCallback: ((x: number, y: number, direction: Direction) => void) | null = null;

  constructor(scene: Phaser.Scene, tileX: number, tileY: number) {
    this.scene = scene;
    this.tileX = tileX;
    this.tileY = tileY;
    this.targetTileX = tileX;
    this.targetTileY = tileY;

    const pixelX = this.tileToPixelX(tileX);
    const pixelY = this.tileToPixelY(tileY);

    this.sprite = scene.add.sprite(pixelX, pixelY, 'player', 0);
    this.sprite.setOrigin(0.5, 0.5);
    this.sprite.setDepth(10);

    this.createAnimations();
  }

  private tileToPixelX(tileX: number): number {
    return tileX * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2;
  }

  private tileToPixelY(tileY: number): number {
    return tileY * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2;
  }

  private createAnimations() {
    const anims = this.scene.anims;

    // Walking animations (4 frames each direction)
    if (!anims.exists('player-walk-down')) {
      anims.create({
        key: 'player-walk-down',
        frames: anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1,
      });
    }

    if (!anims.exists('player-walk-left')) {
      anims.create({
        key: 'player-walk-left',
        frames: anims.generateFrameNumbers('player', { start: 4, end: 7 }),
        frameRate: 8,
        repeat: -1,
      });
    }

    if (!anims.exists('player-walk-right')) {
      anims.create({
        key: 'player-walk-right',
        frames: anims.generateFrameNumbers('player', { start: 8, end: 11 }),
        frameRate: 8,
        repeat: -1,
      });
    }

    if (!anims.exists('player-walk-up')) {
      anims.create({
        key: 'player-walk-up',
        frames: anims.generateFrameNumbers('player', { start: 12, end: 15 }),
        frameRate: 8,
        repeat: -1,
      });
    }

    // Idle frames
    if (!anims.exists('player-idle-down')) {
      anims.create({
        key: 'player-idle-down',
        frames: [{ key: 'player', frame: 0 }],
        frameRate: 1,
      });
    }

    if (!anims.exists('player-idle-left')) {
      anims.create({
        key: 'player-idle-left',
        frames: [{ key: 'player', frame: 4 }],
        frameRate: 1,
      });
    }

    if (!anims.exists('player-idle-right')) {
      anims.create({
        key: 'player-idle-right',
        frames: [{ key: 'player', frame: 8 }],
        frameRate: 1,
      });
    }

    if (!anims.exists('player-idle-up')) {
      anims.create({
        key: 'player-idle-up',
        frames: [{ key: 'player', frame: 12 }],
        frameRate: 1,
      });
    }
  }

  setCollisionLayer(layer: Phaser.Tilemaps.TilemapLayer) {
    this.collisionLayer = layer;
  }

  setInteractCallback(callback: (x: number, y: number, direction: Direction) => void) {
    this.interactCallback = callback;
  }

  private canMoveTo(tileX: number, tileY: number): boolean {
    // Check map bounds
    if (tileX < 0 || tileY < 0) return false;
    
    if (this.collisionLayer) {
      const tile = this.collisionLayer.getTileAt(tileX, tileY);
      if (tile && tile.index !== -1) {
        return false;
      }
    }
    
    return true;
  }

  tryMove(direction: Direction): boolean {
    if (this.isMoving) return false;

    this.currentDirection = direction;
    
    let newTileX = this.tileX;
    let newTileY = this.tileY;

    switch (direction) {
      case 'up':
        newTileY -= 1;
        break;
      case 'down':
        newTileY += 1;
        break;
      case 'left':
        newTileX -= 1;
        break;
      case 'right':
        newTileX += 1;
        break;
    }

    if (this.canMoveTo(newTileX, newTileY)) {
      this.targetTileX = newTileX;
      this.targetTileY = newTileY;
      this.isMoving = true;
      this.moveProgress = 0;
      this.sprite.play(`player-walk-${direction}`, true);
      return true;
    } else {
      // Face the direction even if can't move
      this.sprite.play(`player-idle-${direction}`, true);
      return false;
    }
  }

  interact() {
    if (this.isMoving || !this.interactCallback) return;

    let targetX = this.tileX;
    let targetY = this.tileY;

    switch (this.currentDirection) {
      case 'up':
        targetY -= 1;
        break;
      case 'down':
        targetY += 1;
        break;
      case 'left':
        targetX -= 1;
        break;
      case 'right':
        targetX += 1;
        break;
    }

    this.interactCallback(targetX, targetY, this.currentDirection);
  }

  update(delta: number) {
    if (!this.isMoving) return;

    const moveDuration = (GAME_CONFIG.TILE_SIZE / GAME_CONFIG.PLAYER_SPEED) * 1000;
    this.moveProgress += delta;

    const progress = Math.min(this.moveProgress / moveDuration, 1);

    const startX = this.tileToPixelX(this.tileX);
    const startY = this.tileToPixelY(this.tileY);
    const endX = this.tileToPixelX(this.targetTileX);
    const endY = this.tileToPixelY(this.targetTileY);

    this.sprite.x = Phaser.Math.Linear(startX, endX, progress);
    this.sprite.y = Phaser.Math.Linear(startY, endY, progress);

    if (progress >= 1) {
      this.tileX = this.targetTileX;
      this.tileY = this.targetTileY;
      this.isMoving = false;
      this.sprite.x = endX;
      this.sprite.y = endY;
      this.sprite.play(`player-idle-${this.currentDirection}`, true);
    }
  }

  getSprite(): Phaser.GameObjects.Sprite {
    return this.sprite;
  }

  getTilePosition(): { x: number; y: number } {
    return { x: this.tileX, y: this.tileY };
  }

  getIsMoving(): boolean {
    return this.isMoving;
  }

  getDirection(): Direction {
    return this.currentDirection;
  }
}
