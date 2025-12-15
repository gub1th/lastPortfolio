import Phaser from 'phaser';

export const GAME_CONFIG = {
  // Tile settings
  TILE_SIZE: 16,
  SCALE: 2,
  
  // Map settings
  MAP_WIDTH: 30,
  MAP_HEIGHT: 20,
  
  // Player settings
  PLAYER_SPEED: 100,
  
  // Game dimensions (scaled)
  get GAME_WIDTH() {
    return 480;
  },
  get GAME_HEIGHT() {
    return 320;
  },
} as const;

export const PHASER_CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-container',
  width: GAME_CONFIG.GAME_WIDTH,
  height: GAME_CONFIG.GAME_HEIGHT,
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: '#5a8f3c',
};
