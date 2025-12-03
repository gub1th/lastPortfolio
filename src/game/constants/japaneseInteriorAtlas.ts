/**
 * Manual atlas for japanese_interior.png
 * Each entry: {x, y, width, height} in pixels (top-left origin)
 */

export interface SpriteFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

// most are in 32x32 blocks
const BLOCK_SIZE = 32;

export const JAPANESE_INTERIOR_FRAMES: Record<string, SpriteFrame> = {
  BLACK_BLOCK: { x: 0, y: 0, width: BLOCK_SIZE, height: BLOCK_SIZE },
  BAMBOO_FLOOR_1: { x: 0, y: BLOCK_SIZE, width: BLOCK_SIZE, height: BLOCK_SIZE },
  BAMBOO_FLOOR_2: { x: 0, y: BLOCK_SIZE * 4, width: BLOCK_SIZE, height: BLOCK_SIZE },
  TATAMI_MAT_1: { x: BLOCK_SIZE * 2, y: BLOCK_SIZE * 4, width: BLOCK_SIZE, height: BLOCK_SIZE * 2 },
  SHOJI_SCREEN_1: { x: BLOCK_SIZE, y: 0, width: BLOCK_SIZE, height: BLOCK_SIZE * 2 },
  SHOJI_SCREEN_2: { x: BLOCK_SIZE * 2, y: 0, width: BLOCK_SIZE, height: BLOCK_SIZE * 2 },
  SHOJI_SCREEN_3: { x: BLOCK_SIZE * 5, y: 0, width: BLOCK_SIZE, height: BLOCK_SIZE * 2 },
  WALL_DECORATED: { x: BLOCK_SIZE * 3, y: 0, width: BLOCK_SIZE * 2, height: BLOCK_SIZE * 2 },
  SMALL_WALL_EMPTY: { x: BLOCK_SIZE * 6, y: 0, width: BLOCK_SIZE, height: BLOCK_SIZE * 2 },
  WALL_EMPTY: { x: 0, y: BLOCK_SIZE * 2, width: BLOCK_SIZE * 2, height: BLOCK_SIZE * 2 },
  LOW_TABLE: { x: BLOCK_SIZE * 6, y: BLOCK_SIZE * 7, width: BLOCK_SIZE * 2, height: BLOCK_SIZE * 2 },
  CUSHION_SEAT: { x: BLOCK_SIZE * 4, y: BLOCK_SIZE * 8, width: BLOCK_SIZE, height: BLOCK_SIZE },
  GOURD: { x: BLOCK_SIZE * 5, y: BLOCK_SIZE * 8, width: BLOCK_SIZE, height: BLOCK_SIZE },
};

/**
 * Helper to create a cropped sprite from the atlas
 */
export function createCroppedSprite(
  scene: Phaser.Scene,
  key: string,
  frameName: string,
  x: number,
  y: number
): Phaser.GameObjects.Sprite {
  const frame = JAPANESE_INTERIOR_FRAMES[frameName];
  if (!frame) {
    throw new Error(`Frame "${frameName}" not found`);
  };

  const sprite = scene.add.sprite(x, y, key);
  sprite.setCrop(frame.x, frame.y, frame.width, frame.height);
  sprite.setOrigin(0, 0);
  
  // Don't offset position for tilemap use - let the sprite stay at grid position
  
  return sprite;
}
