import Phaser from 'phaser';
import { createCroppedSprite } from '../constants/japaneseInteriorAtlas';

export class MainScene extends Phaser.Scene {
  private currentPlayerKey = 'clair';
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private switchKeys!: { ONE: Phaser.Input.Keyboard.Key; TWO: Phaser.Input.Keyboard.Key; THREE: Phaser.Input.Keyboard.Key };
  private walls: Phaser.Types.Physics.Arcade.ImageWithStaticBody[] = [];
  
  // Grid movement
  private isMoving = false;
  private targetX = 0;
  private targetY = 0;
  private readonly MOVE_SPEED = 200; // pixels per second

  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image('japanese-interior', '/assets/japanese_interior.png');
    // Player spritesheets
    this.load.spritesheet('clair', '/assets/players/clair_aveon.png', {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet('sage', '/assets/players/sage_aveon.png', {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet('wallace', '/assets/players/wallace_aveon.png', {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    // Simple grid of bamboo floor tiles
    const BLOCK = 32;
    const WORLD_WIDTH = 14;
    const WORLD_HEIGHT = 10;

    // Floor
    for (let x = 0; x < WORLD_WIDTH; x++) {
      for (let y = 0; y < WORLD_HEIGHT; y++) {
        if (y === 0) {
          // Top row: place 2-block-wide walls every 2 blocks
          if (x % 2 === 0) {
            createCroppedSprite(this, 'japanese-interior', 'WALL_EMPTY', x * BLOCK, y * BLOCK);
            continue;
          } else {
            // Skip odd positions since WALL_DECORATED covers 2 blocks
            continue;
          }
        }
        if (y === 1) continue;
        createCroppedSprite(this, 'japanese-interior', 'BAMBOO_FLOOR_1', x * BLOCK, y * BLOCK);
      }
    }

    // Create Player first
    const startX = 5 * BLOCK;
    const startY = 5 * BLOCK;
    
    this.player = this.physics.add.sprite(startX, startY, this.currentPlayerKey);
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(10);
    
    this.targetX = this.player.x;
    this.targetY = this.player.y;

    // // Top wall only: collision on row 0
    // this.walls = [];
    // for (let x = 0; x < WORLD_WIDTH; x++) {
    //   const wall = this.physics.add.staticImage(x * BLOCK, 0, 'japanese-interior')
    //     .setCrop(0, 0, BLOCK, BLOCK)
    //     .setOrigin(0, 0)
    //     .setVisible(false);
    //   this.walls.push(wall);
    // }
    // this.physics.add.collider(this.player, this.walls);

    // // Top wall visuals: 2-block-wide sprites
    // // WALL_DECORATED and WALL_EMPTY are 64px wide, so place at 0, 64, 128...
    // for (let x = 0; x < WORLD_WIDTH; x += 2) {
    //   // Alternate between decorated and empty
    //   if (Math.floor(x / 2) % 2 === 0) {
    //     createCroppedSprite(this, 'japanese-interior', 'WALL_DECORATED', x * BLOCK, 0);
    //   } else {
    //     createCroppedSprite(this, 'japanese-interior', 'WALL_EMPTY', x * BLOCK, 0);
    //   }
    // }

    // Animations
    this.createAnimations();

    // Camera: fit on screen
    this.cameras.main.setZoom(1);

    // Controls
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = this.input.keyboard.addKeys({
        W: Phaser.Input.Keyboard.KeyCodes.W,
        A: Phaser.Input.Keyboard.KeyCodes.A,
        S: Phaser.Input.Keyboard.KeyCodes.S,
        D: Phaser.Input.Keyboard.KeyCodes.D,
      }) as any;
      this.switchKeys = this.input.keyboard.addKeys({
        ONE: Phaser.Input.Keyboard.KeyCodes.ONE,
        TWO: Phaser.Input.Keyboard.KeyCodes.TWO,
        THREE: Phaser.Input.Keyboard.KeyCodes.THREE,
      }) as any;
    }
  }

  createAnimations() {
    const key = this.currentPlayerKey;
    const animKeyPrefix = `${key}-`;
    // Skip if already created for this sprite
    if (this.anims.exists(`${animKeyPrefix}down`)) return;

    this.anims.create({
      key: `${animKeyPrefix}down`,
      frames: this.anims.generateFrameNumbers(key, { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: `${animKeyPrefix}left`,
      frames: this.anims.generateFrameNumbers(key, { start: 4, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: `${animKeyPrefix}right`,
      frames: this.anims.generateFrameNumbers(key, { start: 8, end: 11 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: `${animKeyPrefix}up`,
      frames: this.anims.generateFrameNumbers(key, { start: 12, end: 15 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  update(_time: number, _delta: number) {
    if (!this.player || !this.cursors) return;

    // Sprite switcher
    if (this.switchKeys.ONE.isDown && this.currentPlayerKey !== 'clair') {
      this.switchPlayerSprite('clair');
    } else if (this.switchKeys.TWO.isDown && this.currentPlayerKey !== 'sage') {
      this.switchPlayerSprite('sage');
    } else if (this.switchKeys.THREE.isDown && this.currentPlayerKey !== 'wallace') {
      this.switchPlayerSprite('wallace');
    }

    // Grid-based movement
    const speed = this.MOVE_SPEED;
    
    // Check if we're currently moving to a target
    if (this.isMoving) {
      const dx = this.targetX - this.player.x;
      const dy = this.targetY - this.player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 2) {
        // Reached target
        this.player.setVelocity(0);
        this.player.x = this.targetX;
        this.player.y = this.targetY;
        this.isMoving = false;
        this.player.anims.stop();
      }
    } else {
      // Not moving, check for input
      let direction: 'up' | 'down' | 'left' | 'right' | null = null;
      
      if (this.cursors.up.isDown || this.wasdKeys.W.isDown) {
        direction = 'up';
      } else if (this.cursors.down.isDown || this.wasdKeys.S.isDown) {
        direction = 'down';
      } else if (this.cursors.left.isDown || this.wasdKeys.A.isDown) {
        direction = 'left';
      } else if (this.cursors.right.isDown || this.wasdKeys.D.isDown) {
        direction = 'right';
      }
      
      if (direction) {
        this.moveInDirection(direction, speed);
      }
    }
  }

  switchPlayerSprite(key: 'clair' | 'sage' | 'wallace') {
    const { x, y } = this.player;
    this.currentPlayerKey = key;
    this.player.destroy();
    this.player = this.physics.add.sprite(x, y, key);
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(10);
    this.targetX = x;
    this.targetY = y;
    // Re-add collision with walls
    this.physics.add.collider(this.player, this.walls);
    // Recreate animations for the new sprite
    this.createAnimations();
  }

  moveInDirection(direction: 'up' | 'down' | 'left' | 'right', speed: number) {
    const BLOCK = 32;
    let newTargetX = this.player.x;
    let newTargetY = this.player.y;
    const animKeyPrefix = `${this.currentPlayerKey}-`;
    
    switch (direction) {
      case 'up':
        newTargetY -= BLOCK;
        this.player.anims.play(`${animKeyPrefix}up`, true);
        break;
      case 'down':
        newTargetY += BLOCK;
        this.player.anims.play(`${animKeyPrefix}down`, true);
        break;
      case 'left':
        newTargetX -= BLOCK;
        this.player.anims.play(`${animKeyPrefix}left`, true);
        break;
      case 'right':
        newTargetX += BLOCK;
        this.player.anims.play(`${animKeyPrefix}right`, true);
        break;
    }
    
    // Simple bounds check (world bounds already set by setCollideWorldBounds)
    this.targetX = newTargetX;
    this.targetY = newTargetY;
    this.isMoving = true;
    
    // Set velocity toward target
    const dx = this.targetX - this.player.x;
    const dy = this.targetY - this.player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    this.player.setVelocity(
      (dx / distance) * speed,
      (dy / distance) * speed
    );
  }
}
