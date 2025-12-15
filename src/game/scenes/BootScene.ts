import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Show loading progress
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 100, height / 2 - 15, 200, 30);
    
    const loadingText = this.add.text(width / 2, height / 2 - 30, 'Loading...', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#ffffff',
    });
    loadingText.setOrigin(0.5, 0.5);
    
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x4a8f3c, 1);
      progressBar.fillRect(width / 2 - 95, height / 2 - 10, 190 * value, 20);
    });
    
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Load all game assets
    this.loadAssets();
  }

  private loadAssets() {
    // Load tileset - our generated 16x16 tileset
    this.load.image('tiles', '/assets/tilesets/tileset.png');
    
    // Load player spritesheet (4 frames x 4 directions = 64x64 total, 16x16 per frame)
    this.load.spritesheet('player', '/assets/characters/player.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    
    // Load NPC spritesheets (4 directions x 4 NPC types)
    this.load.spritesheet('npc', '/assets/characters/npc.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  create() {
    console.log('BootScene complete, starting WorldScene');
    this.scene.start('WorldScene');
  }
}
