import Phaser from 'phaser';
import { DataManager } from '../data/DataManager';

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private switchKeys!: { ONE: Phaser.Input.Keyboard.Key; TWO: Phaser.Input.Keyboard.Key; THREE: Phaser.Input.Keyboard.Key };
  
  // Grid movement
  private isMoving = false;
  private targetX = 0;
  private targetY = 0;
  private readonly MOVE_SPEED = 200;
  private readonly TILE_SIZE = 32;
  
  // World bounds
  private readonly WORLD_WIDTH = 14;
  private readonly WORLD_HEIGHT = 10;

  constructor() {
    super('WorldScene');
  }

  preload() {
    // Load tileset for floors only
    this.load.image('floor-tiles', '/assets/tilesets/tilesheet_32x32.png');
    
    // Load your original atlas for walls and objects
    this.load.image('japanese-interior', '/assets/japanese_interior.png');
    
    // Load player spritesheets
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
    // Create the world first
    this.createWorld();
    
    // Create the player after world
    this.createPlayer();
    
    // Setup inputs
    this.setupInputs();
    
    // Setup animations
    this.createAnimations();
    
    // Setup camera
    this.setupCamera();
  }

  private createWorld() {
    // Create floor tilemap (all floors, no walls)
    const mapData = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

    // Create floor tilemap
    const map = this.make.tilemap({
      data: mapData,
      tileWidth: this.TILE_SIZE,
      tileHeight: this.TILE_SIZE
    });

    const tileset = map.addTilesetImage('floor-tiles');
    if (!tileset) {
      console.error('Failed to load floor tiles - check floor-tiles image');
      throw new Error('Failed to load tileset');
    }

    const layer = map.createLayer(0, tileset, 0, 0);
    if (!layer) {
      throw new Error('Failed to create tilemap layer');
    }

    // Add walls as sprites (using your original atlas)
    this.createWallSprites();
  }

  private createWallSprites() {
    // Create walls around the edges using sprites
    // Top and bottom walls
    for (let x = 0; x < this.WORLD_WIDTH; x++) {
      // Top wall
      this.add.sprite(x * this.TILE_SIZE + 16, 16, 'japanese-interior')
        .setOrigin(0.5, 0.5)
        .setDepth(5);
      
      // Bottom wall  
      this.add.sprite(x * this.TILE_SIZE + 16, (this.WORLD_HEIGHT - 1) * this.TILE_SIZE + 16, 'japanese-interior')
        .setOrigin(0.5, 0.5)
        .setDepth(5);
    }
    
    // Left and right walls
    for (let y = 1; y < this.WORLD_HEIGHT - 1; y++) {
      // Left wall
      this.add.sprite(16, y * this.TILE_SIZE + 16, 'japanese-interior')
        .setOrigin(0.5, 0.5)
        .setDepth(5);
      
      // Right wall
      this.add.sprite((this.WORLD_WIDTH - 1) * this.TILE_SIZE + 16, y * this.TILE_SIZE + 16, 'japanese-interior')
        .setOrigin(0.5, 0.5)
        .setDepth(5);
    }
  }

  private createPlayer() {
    const playerData = DataManager.getInstance().getPlayerData();
    
    this.player = this.physics.add.sprite(
      playerData.x, 
      playerData.y, 
      playerData.currentSprite
    );
    
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(10);
    
    this.targetX = this.player.x;
    this.targetY = this.player.y;

    // No tilemap collision - using world bounds instead
  }

  private setupInputs() {
    this.cursors = this.input.keyboard!.createCursorKeys();
    
    this.wasdKeys = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    this.switchKeys = {
      ONE: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      TWO: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
      THREE: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
    };
  }

  private setupCamera() {
    // Camera follows player
    this.cameras.main.startFollow(this.player);
    
    // Set camera bounds to world size
    this.cameras.main.setBounds(
      0, 
      0, 
      this.WORLD_WIDTH * this.TILE_SIZE, 
      this.WORLD_HEIGHT * this.TILE_SIZE
    );
    
    // Set viewport size
    this.cameras.main.setSize(960, 480);
  }

  private createAnimations() {
    const key = DataManager.getInstance().getPlayerData().currentSprite;
    const animKeyPrefix = `${key}-`;
    
    // Skip if already created
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
    if (!this.player) return;

    // Handle sprite switching
    this.handleSpriteSwitch();

    // Handle movement
    this.handleMovement();
  }

  private handleSpriteSwitch() {
    const dataManager = DataManager.getInstance();
    const currentSprite = dataManager.getPlayerData().currentSprite;

    if (this.switchKeys.ONE.isDown && currentSprite !== 'clair') {
      this.switchPlayerSprite('clair');
    } else if (this.switchKeys.TWO.isDown && currentSprite !== 'sage') {
      this.switchPlayerSprite('sage');
    } else if (this.switchKeys.THREE.isDown && currentSprite !== 'wallace') {
      this.switchPlayerSprite('wallace');
    }
  }

  private switchPlayerSprite(spriteKey: 'clair' | 'sage' | 'wallace') {
    const { x, y } = this.player;
    
    // Update data manager
    DataManager.getInstance().setCurrentSprite(spriteKey);
    
    // Destroy old sprite and create new one
    this.player.destroy();
    this.player = this.physics.add.sprite(x, y, spriteKey);
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(10);
    
    this.targetX = x;
    this.targetY = y;
    
    // Recreate animations
    this.createAnimations();
  }

  private handleMovement() {
    if (this.isMoving) {
      // Continue moving to target
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
        
        // Save position to data manager
        DataManager.getInstance().setPlayerPosition(this.targetX, this.targetY);
      }
    } else {
      // Check for new movement input
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
        this.moveInDirection(direction);
      }
    }
  }

  private moveInDirection(direction: 'up' | 'down' | 'left' | 'right') {
    let newTargetX = this.player.x;
    let newTargetY = this.player.y;
    const playerData = DataManager.getInstance().getPlayerData();
    const animKeyPrefix = `${playerData.currentSprite}-`;
    
    switch (direction) {
      case 'up':
        newTargetY -= this.TILE_SIZE;
        this.player.anims.play(`${animKeyPrefix}up`, true);
        break;
      case 'down':
        newTargetY += this.TILE_SIZE;
        this.player.anims.play(`${animKeyPrefix}down`, true);
        break;
      case 'left':
        newTargetX -= this.TILE_SIZE;
        this.player.anims.play(`${animKeyPrefix}left`, true);
        break;
      case 'right':
        newTargetX += this.TILE_SIZE;
        this.player.anims.play(`${animKeyPrefix}right`, true);
        break;
    }
    
    // Check bounds
    if (newTargetX < this.TILE_SIZE || 
        newTargetX >= (this.WORLD_WIDTH - 1) * this.TILE_SIZE ||
        newTargetY < this.TILE_SIZE || 
        newTargetY >= (this.WORLD_HEIGHT - 1) * this.TILE_SIZE) {
      this.player.anims.stop();
      return;
    }
    
    this.targetX = newTargetX;
    this.targetY = newTargetY;
    this.isMoving = true;
    
    // Update facing direction
    DataManager.getInstance().setFacingDirection(direction);
    
    // Set velocity toward target
    const dx = this.targetX - this.player.x;
    const dy = this.targetY - this.player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    this.player.setVelocity(
      (dx / distance) * this.MOVE_SPEED,
      (dy / distance) * this.MOVE_SPEED
    );
  }
}
