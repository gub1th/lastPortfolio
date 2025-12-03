import Phaser from 'phaser';
import { WorldScene } from './scenes/WorldScene';

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-container',
  width: 960,
  height: 480,
  pixelArt: true, // Crucial for Pokemon style
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 }, // Top down, no gravity
      debug: false,
    },
  },
  scene: [WorldScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

export const initGame = () => {
  return new Phaser.Game(config);
};
