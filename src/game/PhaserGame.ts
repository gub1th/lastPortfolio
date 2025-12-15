import Phaser from 'phaser';
import { PHASER_CONFIG } from './config/GameConfig';
import { BootScene } from './scenes/BootScene';
import { WorldScene } from './scenes/WorldScene.new';

export const initGame = () => {
  const config: Phaser.Types.Core.GameConfig = {
    ...PHASER_CONFIG,
    scene: [BootScene, WorldScene],
  };
  
  return new Phaser.Game(config);
};
