import Phaser from 'phaser';
import { useStore } from '../../store';
import { createCroppedSprite } from '../constants/japaneseInteriorAtlas';
import { TILES } from '../constants/tiles';

export class MainScene extends Phaser.Scene {
  private currentPlayerKey = 'clair';
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private switchKeys!: { ONE: Phaser.Input.Keyboard.Key; TWO: Phaser.Input.Keyboard.Key; THREE: Phaser.Input.Keyboard.Key };
  
  // Grid movement
  private isMoving = false;
  private targetX = 0;
  private targetY = 0;
  private readonly TILE_SIZE = 64;
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
    // Create a simple background (optional)
    this.add.rectangle(0, 0, this.game.config.width as number, this.game.config.height as number, 0x2a2a2a).setOrigin(0);

    // Simple grid of bamboo floor tiles
    const BLOCK = 32;
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 15; y++) {
        createCroppedSprite(this, 'japanese-interior', 'BAMBOO_FLOOR_1', x * BLOCK, y * BLOCK);
      }
    }

    // Create Player
    const startX = 10 * BLOCK;
    const startY = 7 * BLOCK;
    
    this.player = this.physics.add.sprite(startX, startY, this.currentPlayerKey);
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(10);
    
    this.targetX = this.player.x;
    this.targetY = this.player.y;

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

    // Simple hotspots
    this.createHotspot(5 * BLOCK, 5 * BLOCK, 'about', '💼');
    this.createHotspot(15 * BLOCK, 5 * BLOCK, 'projects', '🖥️');
  }

  createRoomLayout(width: number, height: number): number[][] {
    const layout: number[][] = [];
    
    for (let y = 0; y < height; y++) {
      const row: number[] = [];
      for (let x = 0; x < width; x++) {
        // Outer area: grass
        if (x < 5 || x >= width - 5 || y < 4 || y >= height - 4) {
          row.push(TILES.GRASS_A);
        }
        // Room walls (use stone for now)
        else if (x === 5 || x === width - 6 || y === 4 || y === height - 5) {
          row.push(TILES.FLOWER_A);
        }
        // Interior floor
        else {
          // Checkered pattern
          if ((x + y) % 2 === 0) {
            row.push(TILES.STONE_A);
          } else {
            row.push(TILES.STONE_B);
          }
        }
      }
      layout.push(row);
    }
    
    return layout;
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

  createHotspot(x: number, y: number, section: 'about' | 'projects', emoji: string) {
    const zone = this.add.zone(x, y, this.TILE_SIZE, this.TILE_SIZE);
    this.physics.world.enable(zone);
    (zone.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    (zone.body as Phaser.Physics.Arcade.Body).moves = false;
    
    // Visual marker with emoji
    const text = this.add.text(x, y, emoji, {
      fontSize: '24px',
      align: 'center',
    }).setOrigin(0.5);
    
    // Floating animation
    this.tweens.add({
      targets: text,
      y: y - 5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.physics.add.overlap(this.player, zone, () => {
      const current = useStore.getState().currentSection;
      if (current !== section) {
        useStore.getState().setSection(section);
      }
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
