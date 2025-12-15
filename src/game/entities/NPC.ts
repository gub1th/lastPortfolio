import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/GameConfig';
import type { Direction } from './Player';

export interface NPCData {
  id: string;
  name: string;
  tileX: number;
  tileY: number;
  spriteFrame: number;
  direction: Direction;
  dialogLines: string[];
}

export class NPC {
  private sprite: Phaser.GameObjects.Sprite;
  private data: NPCData;
  private tileX: number;
  private tileY: number;

  constructor(scene: Phaser.Scene, data: NPCData) {
    this.data = data;
    this.tileX = data.tileX;
    this.tileY = data.tileY;

    const pixelX = this.tileToPixelX(data.tileX);
    const pixelY = this.tileToPixelY(data.tileY);

    this.sprite = scene.add.sprite(pixelX, pixelY, 'npc', data.spriteFrame);
    this.sprite.setOrigin(0.5, 0.5);
    this.sprite.setDepth(9);
  }

  private tileToPixelX(tileX: number): number {
    return tileX * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2;
  }

  private tileToPixelY(tileY: number): number {
    return tileY * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2;
  }

  getTilePosition(): { x: number; y: number } {
    return { x: this.tileX, y: this.tileY };
  }

  getData(): NPCData {
    return this.data;
  }

  getDialogLines(): string[] {
    return this.data.dialogLines;
  }

  getName(): string {
    return this.data.name;
  }

  faceDirection(direction: Direction) {
    // Update sprite frame based on direction
    const baseFrame = this.data.spriteFrame - (this.data.spriteFrame % 4);
    switch (direction) {
      case 'down':
        this.sprite.setFrame(baseFrame);
        break;
      case 'left':
        this.sprite.setFrame(baseFrame + 1);
        break;
      case 'right':
        this.sprite.setFrame(baseFrame + 2);
        break;
      case 'up':
        this.sprite.setFrame(baseFrame + 3);
        break;
    }
  }

  // Face the player when interacted with
  facePlayer(playerDirection: Direction) {
    const oppositeDirection: Record<Direction, Direction> = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left',
    };
    this.faceDirection(oppositeDirection[playerDirection]);
  }
}
