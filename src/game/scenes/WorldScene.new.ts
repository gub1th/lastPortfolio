import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/GameConfig';
import type { NPCData } from '../entities/NPC';
import { NPC } from '../entities/NPC';
import type { Direction } from '../entities/Player';
import { Player } from '../entities/Player';
import { DialogBox } from '../ui/DialogBox';

// Portfolio data for NPCs
const PORTFOLIO_NPCS: NPCData[] = [
  {
    id: 'about',
    name: 'About Me',
    tileX: 8,
    tileY: 6,
    spriteFrame: 0,
    direction: 'down',
    dialogLines: [
      "Hi there! I'm Daniel, a passionate developer.",
      "I love building interactive web experiences.",
      "Feel free to explore this world to learn more about me!",
    ],
  },
  {
    id: 'skills',
    name: 'Skills',
    tileX: 14,
    tileY: 8,
    spriteFrame: 4,
    direction: 'down',
    dialogLines: [
      "Here are my technical skills:",
      "Frontend: React, TypeScript, Phaser.js",
      "Backend: Node.js, Python, PostgreSQL",
      "Tools: Git, Docker, AWS",
    ],
  },
  {
    id: 'projects',
    name: 'Projects',
    tileX: 20,
    tileY: 6,
    spriteFrame: 8,
    direction: 'down',
    dialogLines: [
      "Check out some of my projects!",
      "This Pokemon-style portfolio you're exploring now!",
      "Various web apps and games I've built.",
      "Visit my GitHub to see more!",
    ],
  },
  {
    id: 'contact',
    name: 'Contact',
    tileX: 14,
    tileY: 12,
    spriteFrame: 12,
    direction: 'down',
    dialogLines: [
      "Want to get in touch?",
      "Email: your.email@example.com",
      "GitHub: github.com/yourusername",
      "LinkedIn: linkedin.com/in/yourprofile",
    ],
  },
];

export class WorldScene extends Phaser.Scene {
  private player!: Player;
  private npcs: NPC[] = [];
  private dialogBox!: DialogBox;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private interactKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private collisionLayer!: Phaser.Tilemaps.TilemapLayer;
  private isDialogActive: boolean = false;

  constructor() {
    super('WorldScene');
  }

  create() {
    console.log('WorldScene create() called');
    
    // Create the tilemap
    this.createMap();
    
    // Create player
    this.player = new Player(this, 14, 10);
    if (this.collisionLayer) {
      this.player.setCollisionLayer(this.collisionLayer);
    }
    this.player.setInteractCallback(this.handleInteraction.bind(this));
    
    console.log('Player created at tile (14, 10)');
    
    // Create NPCs
    this.createNPCs();
    
    // Setup camera
    this.setupCamera();
    
    // Setup input
    this.setupInput();
    
    // Create dialog box
    this.dialogBox = new DialogBox(this);
    
    // Show welcome message
    this.time.delayedCall(500, () => {
      this.showDialog('Welcome', [
        'Welcome to my portfolio!',
        'Use ARROW KEYS or WASD to move around.',
        'Press SPACE or ENTER to interact with NPCs.',
        'Explore and learn more about me!',
      ]);
    });
  }

  private createMap() {
    // Create a procedural tilemap
    const mapWidth = GAME_CONFIG.MAP_WIDTH;
    const mapHeight = GAME_CONFIG.MAP_HEIGHT;
    
    // Create map data arrays
    const groundData: number[][] = [];
    const collisionData: number[][] = [];
    const decorData: number[][] = [];
    
    for (let y = 0; y < mapHeight; y++) {
      groundData[y] = [];
      collisionData[y] = [];
      decorData[y] = [];
      
      for (let x = 0; x < mapWidth; x++) {
        // Ground layer - grass with variations
        if (Math.random() < 0.1) {
          groundData[y][x] = 1; // Grass variation
        } else if (Math.random() < 0.05) {
          groundData[y][x] = 2; // Flower
        } else {
          groundData[y][x] = 0; // Base grass
        }
        
        // Collision layer - borders and obstacles
        if (x === 0 || x === mapWidth - 1 || y === 0 || y === mapHeight - 1) {
          collisionData[y][x] = 3; // Border trees/fence
        } else if (this.isObstaclePosition(x, y)) {
          collisionData[y][x] = 4; // Tree or rock
        } else {
          collisionData[y][x] = -1; // No collision
        }
        
        // Decoration layer
        decorData[y][x] = -1;
      }
    }
    
    // Add paths
    this.addPaths(groundData);
    
    // Create the tilemap
    const map = this.make.tilemap({
      tileWidth: GAME_CONFIG.TILE_SIZE,
      tileHeight: GAME_CONFIG.TILE_SIZE,
      width: mapWidth,
      height: mapHeight,
    });
    
    const tileset = map.addTilesetImage('tiles', 'tiles', GAME_CONFIG.TILE_SIZE, GAME_CONFIG.TILE_SIZE);
    
    if (!tileset) {
      console.error('Failed to load tileset');
      return;
    }
    
    // Create ground layer
    const groundLayer = map.createBlankLayer('ground', tileset, 0, 0);
    if (groundLayer) {
      for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
          groundLayer.putTileAt(groundData[y][x], x, y);
        }
      }
    }
    
    // Create collision layer
    this.collisionLayer = map.createBlankLayer('collision', tileset, 0, 0)!;
    if (this.collisionLayer) {
      for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
          if (collisionData[y][x] !== -1) {
            this.collisionLayer.putTileAt(collisionData[y][x], x, y);
          }
        }
      }
      this.collisionLayer.setCollisionByExclusion([-1]);
    }
    
    // Set world bounds
    this.physics.world.setBounds(
      0,
      0,
      mapWidth * GAME_CONFIG.TILE_SIZE,
      mapHeight * GAME_CONFIG.TILE_SIZE
    );
  }

  private isObstaclePosition(x: number, y: number): boolean {
    // Don't place obstacles near NPCs or player spawn
    const npcPositions = PORTFOLIO_NPCS.map(npc => ({ x: npc.tileX, y: npc.tileY }));
    const playerSpawn = { x: 14, y: 10 };
    
    for (const pos of [...npcPositions, playerSpawn]) {
      const dx = Math.abs(x - pos.x);
      const dy = Math.abs(y - pos.y);
      if (dx <= 2 && dy <= 2) return false;
    }
    
    // Random obstacles
    return Math.random() < 0.08;
  }

  private addPaths(groundData: number[][]) {
    // Create paths connecting NPCs
    const pathTile = 5; // Path tile index
    
    // Horizontal path
    for (let x = 5; x < 25; x++) {
      groundData[10][x] = pathTile;
      if (Math.random() < 0.3) {
        groundData[9][x] = pathTile;
        groundData[11][x] = pathTile;
      }
    }
    
    // Vertical paths to NPCs
    for (let y = 6; y <= 12; y++) {
      groundData[y][8] = pathTile;
      groundData[y][14] = pathTile;
      groundData[y][20] = pathTile;
    }
  }

  private createNPCs() {
    for (const npcData of PORTFOLIO_NPCS) {
      const npc = new NPC(this, npcData);
      this.npcs.push(npc);
    }
  }

  private setupCamera() {
    const mapWidth = GAME_CONFIG.MAP_WIDTH * GAME_CONFIG.TILE_SIZE;
    const mapHeight = GAME_CONFIG.MAP_HEIGHT * GAME_CONFIG.TILE_SIZE;
    
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.startFollow(this.player.getSprite(), true, 0.1, 0.1);
    this.cameras.main.setZoom(2);
  }

  private setupInput() {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    
    // WASD keys
    this.wasdKeys = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    
    console.log('Input setup complete');
  }

  private handleInteraction(tileX: number, tileY: number, direction: Direction) {
    // Check if there's an NPC at this position
    for (const npc of this.npcs) {
      const pos = npc.getTilePosition();
      if (pos.x === tileX && pos.y === tileY) {
        npc.facePlayer(direction);
        this.showDialog(npc.getName(), npc.getDialogLines());
        return;
      }
    }
  }

  private showDialog(name: string, lines: string[]) {
    this.isDialogActive = true;
    this.dialogBox.show(name, lines, () => {
      this.isDialogActive = false;
    });
  }

  update(time: number, delta: number) {
    // Update dialog
    this.dialogBox.update(time);
    
    // Handle dialog input
    if (this.isDialogActive) {
      if (Phaser.Input.Keyboard.JustDown(this.interactKey) ||
          Phaser.Input.Keyboard.JustDown(this.enterKey)) {
        this.dialogBox.advance();
      }
      return;
    }
    
    // Handle movement input
    this.handleMovementInput();
    
    // Handle interact input
    if (Phaser.Input.Keyboard.JustDown(this.interactKey) ||
        Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.player.interact();
    }
    
    // Update player
    this.player.update(delta);
  }

  private handleMovementInput() {
    if (this.player.getIsMoving()) return;
    
    let direction: Direction | null = null;
    
    // Check arrow keys and WASD
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
      // Check for NPC collision before moving
      const playerPos = this.player.getTilePosition();
      let targetX = playerPos.x;
      let targetY = playerPos.y;
      
      switch (direction) {
        case 'up': targetY--; break;
        case 'down': targetY++; break;
        case 'left': targetX--; break;
        case 'right': targetX++; break;
      }
      
      // Check if NPC is at target position
      const npcAtTarget = this.npcs.some(npc => {
        const pos = npc.getTilePosition();
        return pos.x === targetX && pos.y === targetY;
      });
      
      if (!npcAtTarget) {
        this.player.tryMove(direction);
      }
    }
  }
}
