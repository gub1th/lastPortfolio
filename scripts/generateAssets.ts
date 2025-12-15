/**
 * Asset generation script for Pokemon-style portfolio
 * Run with: npx ts-node scripts/generateAssets.ts
 */

import { CanvasRenderingContext2D, createCanvas } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';

type Ctx = CanvasRenderingContext2D;

const TILE_SIZE = 16;

// Ensure directories exist
const dirs = [
  'public/assets/tilesets',
  'public/assets/characters',
  'public/assets/ui',
  'public/assets/maps',
];

dirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Generate tileset
function generateTileset() {
  const tilesPerRow = 8;
  const rows = 4;
  const canvas = createCanvas(tilesPerRow * TILE_SIZE, rows * TILE_SIZE);
  const ctx = canvas.getContext('2d');

  // Tile 0: Base grass
  drawGrass(ctx, 0, 0, '#4a8f3c');
  
  // Tile 1: Grass variation
  drawGrass(ctx, 1, 0, '#5a9f4c');
  
  // Tile 2: Flower grass
  drawGrassWithFlower(ctx, 2, 0);
  
  // Tile 3: Tree/fence (collision)
  drawTree(ctx, 3, 0);
  
  // Tile 4: Rock (collision)
  drawRock(ctx, 4, 0);
  
  // Tile 5: Path
  drawPath(ctx, 5, 0);
  
  // Tile 6: Water
  drawWater(ctx, 6, 0);
  
  // Tile 7: Sand
  drawSand(ctx, 7, 0);
  
  // Row 2: Building tiles
  drawHouseTop(ctx, 0, 1);
  drawHouseBottom(ctx, 1, 1);
  drawDoor(ctx, 2, 1);
  drawWindow(ctx, 3, 1);
  
  // Row 3: More decorations
  drawSign(ctx, 0, 2);
  drawBush(ctx, 1, 2);
  drawFence(ctx, 2, 2);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(process.cwd(), 'public/assets/tilesets/tileset.png'), buffer);
  console.log('Generated tileset.png');
}

function drawGrass(ctx: Ctx, tileX: number, tileY: number, color: string) {
  const x = tileX * TILE_SIZE;
  const y = tileY * TILE_SIZE;
  
  ctx.fillStyle = color;
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  
  // Add some texture
  ctx.fillStyle = '#3a7f2c';
  for (let i = 0; i < 4; i++) {
    const px = x + Math.floor(Math.random() * TILE_SIZE);
    const py = y + Math.floor(Math.random() * TILE_SIZE);
    ctx.fillRect(px, py, 1, 2);
  }
}

function drawGrassWithFlower(ctx: Ctx, tileX: number, tileY: number) {
  drawGrass(ctx, tileX, tileY, '#4a8f3c');
  
  const x = tileX * TILE_SIZE;
  const y = tileY * TILE_SIZE;
  
  // Draw flower
  ctx.fillStyle = '#ff6b6b';
  ctx.fillRect(x + 6, y + 6, 4, 4);
  ctx.fillStyle = '#ffeb3b';
  ctx.fillRect(x + 7, y + 7, 2, 2);
}

function drawTree(ctx: Ctx, tileX: number, tileY: number) {
  const x = tileX * TILE_SIZE;
  const y = tileY * TILE_SIZE;
  
  // Background
  ctx.fillStyle = '#4a8f3c';
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  
  // Tree trunk
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(x + 6, y + 10, 4, 6);
  
  // Tree foliage
  ctx.fillStyle = '#228b22';
  ctx.fillRect(x + 2, y + 2, 12, 10);
  ctx.fillStyle = '#2e8b2e';
  ctx.fillRect(x + 4, y + 0, 8, 4);
}

function drawRock(ctx: Ctx, tileX: number, tileY: number) {
  const x = tileX * TILE_SIZE;
  const y = tileY * TILE_SIZE;
  
  // Background
  ctx.fillStyle = '#4a8f3c';
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  
  // Rock
  ctx.fillStyle = '#808080';
  ctx.fillRect(x + 2, y + 4, 12, 10);
  ctx.fillStyle = '#a0a0a0';
  ctx.fillRect(x + 3, y + 5, 10, 4);
  ctx.fillStyle = '#606060';
  ctx.fillRect(x + 3, y + 11, 10, 2);
}

function drawPath(ctx: Ctx, tileX: number, tileY: number) {
  const x = tileX * TILE_SIZE;
  const y = tileY * TILE_SIZE;
  
  ctx.fillStyle = '#d4a574';
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  
  // Add texture
  ctx.fillStyle = '#c49464';
  for (let i = 0; i < 3; i++) {
    const px = x + Math.floor(Math.random() * TILE_SIZE);
    const py = y + Math.floor(Math.random() * TILE_SIZE);
    ctx.fillRect(px, py, 2, 2);
  }
}

function drawWater(ctx: Ctx, tileX: number, tileY: number) {
  const x = tileX * TILE_SIZE;
  const y = tileY * TILE_SIZE;
  
  ctx.fillStyle = '#4a90d9';
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  
  // Waves
  ctx.fillStyle = '#6ab0f9';
  ctx.fillRect(x + 2, y + 4, 4, 1);
  ctx.fillRect(x + 10, y + 8, 4, 1);
  ctx.fillRect(x + 4, y + 12, 4, 1);
}

function drawSand(ctx: Ctx, tileX: number, tileY: number) {
  const x = tileX * TILE_SIZE;
  const y = tileY * TILE_SIZE;
  
  ctx.fillStyle = '#f4d03f';
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
}

function drawHouseTop(ctx: Ctx, tileX: number, tileY: number) {
  const x = tileX * TILE_SIZE;
  const y = tileY * TILE_SIZE;
  
  ctx.fillStyle = '#8b0000';
  ctx.fillRect(x, y + 4, TILE_SIZE, 12);
  
  // Roof peak
  ctx.fillStyle = '#a52a2a';
  ctx.beginPath();
  ctx.moveTo(x, y + 4);
  ctx.lineTo(x + 8, y);
  ctx.lineTo(x + 16, y + 4);
  ctx.fill();
}

function drawHouseBottom(ctx: Ctx, tileX: number, tileY: number) {
  const x = tileX * TILE_SIZE;
  const y = tileY * TILE_SIZE;
  
  ctx.fillStyle = '#deb887';
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  
  // Border
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(x, y, TILE_SIZE, 2);
}

function drawDoor(ctx: Ctx, tileX: number, tileY: number) {
  const x = tileX * TILE_SIZE;
  const y = tileY * TILE_SIZE;
  
  ctx.fillStyle = '#deb887';
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  
  // Door
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(x + 4, y + 4, 8, 12);
  ctx.fillStyle = '#ffeb3b';
  ctx.fillRect(x + 10, y + 9, 2, 2);
}

function drawWindow(ctx: Ctx, tileX: number, tileY: number) {
  const x = tileX * TILE_SIZE;
  const y = tileY * TILE_SIZE;
  
  ctx.fillStyle = '#deb887';
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  
  // Window
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(x + 4, y + 4, 8, 8);
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(x + 7, y + 4, 2, 8);
  ctx.fillRect(x + 4, y + 7, 8, 2);
}

function drawSign(ctx: Ctx, tileX: number, tileY: number) {
  const x = tileX * TILE_SIZE;
  const y = tileY * TILE_SIZE;
  
  // Background
  ctx.fillStyle = '#4a8f3c';
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  
  // Post
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(x + 7, y + 8, 2, 8);
  
  // Sign
  ctx.fillStyle = '#deb887';
  ctx.fillRect(x + 2, y + 2, 12, 8);
  ctx.fillStyle = '#8b4513';
  ctx.strokeStyle = '#8b4513';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 2, y + 2, 12, 8);
}

function drawBush(ctx: Ctx, tileX: number, tileY: number) {
  const x = tileX * TILE_SIZE;
  const y = tileY * TILE_SIZE;
  
  // Background
  ctx.fillStyle = '#4a8f3c';
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  
  // Bush
  ctx.fillStyle = '#228b22';
  ctx.fillRect(x + 2, y + 6, 12, 10);
  ctx.fillRect(x + 4, y + 4, 8, 4);
}

function drawFence(ctx: Ctx, tileX: number, tileY: number) {
  const x = tileX * TILE_SIZE;
  const y = tileY * TILE_SIZE;
  
  // Background
  ctx.fillStyle = '#4a8f3c';
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  
  // Fence posts
  ctx.fillStyle = '#deb887';
  ctx.fillRect(x + 2, y + 4, 2, 12);
  ctx.fillRect(x + 12, y + 4, 2, 12);
  
  // Horizontal bars
  ctx.fillRect(x, y + 6, TILE_SIZE, 2);
  ctx.fillRect(x, y + 12, TILE_SIZE, 2);
}

// Generate player sprite
function generatePlayerSprite() {
  const framesPerRow = 4;
  const directions = 4; // down, left, right, up
  const canvas = createCanvas(framesPerRow * TILE_SIZE, directions * TILE_SIZE);
  const ctx = canvas.getContext('2d');

  const colors = {
    skin: '#ffd5b5',
    hair: '#4a3728',
    shirt: '#3498db',
    pants: '#2c3e50',
    shoes: '#1a1a1a',
  };

  // Draw each direction
  for (let dir = 0; dir < directions; dir++) {
    for (let frame = 0; frame < framesPerRow; frame++) {
      drawPlayerFrame(ctx, frame, dir, colors, frame);
    }
  }

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(process.cwd(), 'public/assets/characters/player.png'), buffer);
  console.log('Generated player.png');
}

function drawPlayerFrame(
  ctx: Ctx,
  frameX: number,
  frameY: number,
  colors: Record<string, string>,
  animFrame: number
) {
  const x = frameX * TILE_SIZE;
  const y = frameY * TILE_SIZE;
  
  // Walking animation offset
  const walkOffset = animFrame % 2 === 1 ? 1 : 0;
  
  // Clear
  ctx.clearRect(x, y, TILE_SIZE, TILE_SIZE);
  
  // Body based on direction
  // 0 = down, 1 = left, 2 = right, 3 = up
  
  // Head
  ctx.fillStyle = colors.skin;
  ctx.fillRect(x + 5, y + 1, 6, 6);
  
  // Hair
  ctx.fillStyle = colors.hair;
  if (frameY === 0) { // Down
    ctx.fillRect(x + 5, y + 1, 6, 2);
  } else if (frameY === 1) { // Left
    ctx.fillRect(x + 5, y + 1, 6, 2);
    ctx.fillRect(x + 5, y + 1, 2, 4);
  } else if (frameY === 2) { // Right
    ctx.fillRect(x + 5, y + 1, 6, 2);
    ctx.fillRect(x + 9, y + 1, 2, 4);
  } else { // Up
    ctx.fillRect(x + 5, y + 1, 6, 4);
  }
  
  // Eyes (only for front/side views)
  if (frameY === 0) { // Down
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 6, y + 4, 1, 1);
    ctx.fillRect(x + 9, y + 4, 1, 1);
  } else if (frameY === 1) { // Left
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 6, y + 4, 1, 1);
  } else if (frameY === 2) { // Right
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 9, y + 4, 1, 1);
  }
  
  // Body/shirt
  ctx.fillStyle = colors.shirt;
  ctx.fillRect(x + 4, y + 7, 8, 5);
  
  // Arms with animation
  if (frameY === 1) { // Left
    ctx.fillRect(x + 3, y + 7 + walkOffset, 2, 4);
  } else if (frameY === 2) { // Right
    ctx.fillRect(x + 11, y + 7 + walkOffset, 2, 4);
  } else {
    ctx.fillRect(x + 3, y + 7, 2, 4);
    ctx.fillRect(x + 11, y + 7, 2, 4);
  }
  
  // Legs with walking animation
  ctx.fillStyle = colors.pants;
  const legOffset = animFrame % 2 === 0 ? 0 : 1;
  ctx.fillRect(x + 5, y + 12, 3, 3 + legOffset);
  ctx.fillRect(x + 8, y + 12, 3, 3 + (1 - legOffset));
  
  // Shoes
  ctx.fillStyle = colors.shoes;
  ctx.fillRect(x + 5, y + 14 + legOffset, 3, 1);
  ctx.fillRect(x + 8, y + 14 + (1 - legOffset), 3, 1);
}

// Generate NPC sprite
function generateNPCSprite() {
  const framesPerRow = 4;
  const npcs = 4; // Different NPC types
  const canvas = createCanvas(framesPerRow * TILE_SIZE, npcs * TILE_SIZE);
  const ctx = canvas.getContext('2d');

  const npcColors = [
    { skin: '#ffd5b5', hair: '#e74c3c', shirt: '#9b59b6', pants: '#34495e', shoes: '#1a1a1a' },
    { skin: '#d4a574', hair: '#2c3e50', shirt: '#27ae60', pants: '#2c3e50', shoes: '#1a1a1a' },
    { skin: '#ffd5b5', hair: '#f39c12', shirt: '#e74c3c', pants: '#2c3e50', shoes: '#1a1a1a' },
    { skin: '#c68642', hair: '#1a1a1a', shirt: '#3498db', pants: '#34495e', shoes: '#1a1a1a' },
  ];

  for (let npc = 0; npc < npcs; npc++) {
    for (let dir = 0; dir < framesPerRow; dir++) {
      drawNPCFrame(ctx, dir, npc, npcColors[npc], dir);
    }
  }

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(process.cwd(), 'public/assets/characters/npc.png'), buffer);
  console.log('Generated npc.png');
}

function drawNPCFrame(
  ctx: Ctx,
  frameX: number,
  frameY: number,
  colors: Record<string, string>,
  direction: number
) {
  const x = frameX * TILE_SIZE;
  const y = frameY * TILE_SIZE;
  
  ctx.clearRect(x, y, TILE_SIZE, TILE_SIZE);
  
  // Head
  ctx.fillStyle = colors.skin;
  ctx.fillRect(x + 5, y + 1, 6, 6);
  
  // Hair
  ctx.fillStyle = colors.hair;
  ctx.fillRect(x + 5, y + 1, 6, 3);
  
  // Eyes based on direction
  if (direction === 0) { // Down
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 6, y + 4, 1, 1);
    ctx.fillRect(x + 9, y + 4, 1, 1);
  } else if (direction === 1) { // Left
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 6, y + 4, 1, 1);
  } else if (direction === 2) { // Right
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 9, y + 4, 1, 1);
  }
  
  // Body
  ctx.fillStyle = colors.shirt;
  ctx.fillRect(x + 4, y + 7, 8, 5);
  ctx.fillRect(x + 3, y + 7, 2, 4);
  ctx.fillRect(x + 11, y + 7, 2, 4);
  
  // Legs
  ctx.fillStyle = colors.pants;
  ctx.fillRect(x + 5, y + 12, 3, 3);
  ctx.fillRect(x + 8, y + 12, 3, 3);
  
  // Shoes
  ctx.fillStyle = colors.shoes;
  ctx.fillRect(x + 5, y + 14, 3, 1);
  ctx.fillRect(x + 8, y + 14, 3, 1);
}

// Run generation
console.log('Generating game assets...');
generateTileset();
generatePlayerSprite();
generateNPCSprite();
console.log('Done!');
