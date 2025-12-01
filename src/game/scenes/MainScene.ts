import Phaser from 'phaser';
import { useStore } from '../../store';
import { COLLISION_TILES, TILES } from '../constants/tiles';

export class MainScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private collisionLayer!: Phaser.Tilemaps.TilemapLayer;
  
  // Grid movement
  private isMoving = false;
  private targetX = 0;
  private targetY = 0;
  private readonly TILE_SIZE = 32;
  private readonly MOVE_SPEED = 200; // pixels per second

  constructor() {
    super('MainScene');
  }

  preload() {
    // Load tileset as spritesheet so Phaser knows how to slice it
    this.load.spritesheet('tiles', '/assets/pokemon_tileset.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('player', '/assets/player.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    const mapWidth = 25;
    const mapHeight = 20;

    // Build a proper room using the tileset
    const levelData = this.createRoomLayout(mapWidth, mapHeight);

    // Create Tilemap
    const map = this.make.tilemap({ 
      data: levelData, 
      tileWidth: this.TILE_SIZE, 
      tileHeight: this.TILE_SIZE 
    });
    
    // IMPORTANT: When using spritesheet, we need to tell Phaser the first tile ID
    const tileset = map.addTilesetImage('tiles', 'tiles', 32, 32, 0, 0);
    if (!tileset) {
      console.error('Failed to load tileset');
      return;
    }

    // Create layers
    this.collisionLayer = map.createLayer(0, tileset, 0, 0)!;
    
    // Set collision for specific tiles
    this.collisionLayer.setCollision(Array.from(COLLISION_TILES));

    // Create Player
    const startX = 10 * this.TILE_SIZE + this.TILE_SIZE / 2;
    const startY = 10 * this.TILE_SIZE + this.TILE_SIZE / 2;
    
    this.player = this.physics.add.sprite(startX, startY, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(10); // Above tiles
    
    // Set initial target position
    this.targetX = this.player.x;
    this.targetY = this.player.y;

    // Add collision between player and walls
    this.physics.add.collider(this.player, this.collisionLayer);

    // Animations
    this.createAnimations();

    // Camera
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(2.5);
    this.cameras.main.setBounds(0, 0, mapWidth * this.TILE_SIZE, mapHeight * this.TILE_SIZE);
    this.physics.world.setBounds(0, 0, mapWidth * this.TILE_SIZE, mapHeight * this.TILE_SIZE);

    // Controls
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = this.input.keyboard.addKeys({
        W: Phaser.Input.Keyboard.KeyCodes.W,
        A: Phaser.Input.Keyboard.KeyCodes.A,
        S: Phaser.Input.Keyboard.KeyCodes.S,
        D: Phaser.Input.Keyboard.KeyCodes.D,
      }) as any;
    }

    // Hotspots (interactive objects)
    this.createHotspot(8 * this.TILE_SIZE, 8 * this.TILE_SIZE, 'about', '💼');
    this.createHotspot(12 * this.TILE_SIZE, 8 * this.TILE_SIZE, 'projects', '🖥️');
  }

  createRoomLayout(width: number, height: number): number[][] {
    const layout: number[][] = [];
    
    for (let y = 0; y < height; y++) {
      const row: number[] = [];
      for (let x = 0; x < width; x++) {
        // Outer area: grass
        if (x < 5 || x >= width - 5 || y < 4 || y >= height - 4) {
          row.push(TILES.GRASS_1);
        }
        // Room walls
        else if (x === 5 || x === width - 6 || y === 4 || y === height - 5) {
          row.push(TILES.WALL_TOP);
        }
        // Interior floor
        else {
          // Checkered pattern
          if ((x + y) % 2 === 0) {
            row.push(TILES.FLOOR_TILE_CREAM);
          } else {
            row.push(TILES.FLOOR_TILE_CHECKERED);
          }
        }
      }
      layout.push(row);
    }
    
    return layout;
  }

  createAnimations() {
    if (this.anims.exists('down')) return;

    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
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

  moveInDirection(direction: 'up' | 'down' | 'left' | 'right', speed: number) {
    let newTargetX = this.player.x;
    let newTargetY = this.player.y;
    
    switch (direction) {
      case 'up':
        newTargetY -= this.TILE_SIZE;
        this.player.anims.play('up', true);
        break;
      case 'down':
        newTargetY += this.TILE_SIZE;
        this.player.anims.play('down', true);
        break;
      case 'left':
        newTargetX -= this.TILE_SIZE;
        this.player.anims.play('left', true);
        break;
      case 'right':
        newTargetX += this.TILE_SIZE;
        this.player.anims.play('right', true);
        break;
    }
    
    // Check if target position is valid (not colliding)
    const tileX = Math.floor(newTargetX / this.TILE_SIZE);
    const tileY = Math.floor(newTargetY / this.TILE_SIZE);
    const tile = this.collisionLayer.getTileAt(tileX, tileY);
    
    if (!tile || !COLLISION_TILES.has(tile.index)) {
      // Valid move
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
}
