import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

// Ensure assets dir exists
const assetsDir = path.join(process.cwd(), 'public', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. Generate Tileset (32x32 tiles)
// We'll make a 4x4 grid of tiles (128x128)
const canvas = createCanvas(128, 128);
const ctx = canvas.getContext('2d');

// Colors for different tile types
const colors = [
  '#90EE90', // Grass (0,0)
  '#F5DEB3', // Floor (1,0)
  '#8B4513', // Wall (2,0)
  '#4682B4', // Water (3,0)
];

// Draw 32x32 tiles
colors.forEach((color, i) => {
  ctx.fillStyle = color;
  ctx.fillRect(i * 32, 0, 32, 32);
  
  // Add a border to distinguish tiles
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.strokeRect(i * 32, 0, 32, 32);
});

// Save tileset
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(assetsDir, 'tileset.png'), buffer);
console.log('Generated tileset.png');

// 2. Generate Player Sprite (32x32)
// 4 rows (Down, Left, Right, Up), 4 frames each
const pCanvas = createCanvas(128, 128);
const pCtx = pCanvas.getContext('2d');

// Draw a simple character placeholder
for (let row = 0; row < 4; row++) {
  for (let col = 0; col < 4; col++) {
    const x = col * 32;
    const y = row * 32;
    
    pCtx.fillStyle = 'transparent';
    pCtx.fillRect(x, y, 32, 32);
    
    // Body
    pCtx.fillStyle = '#FF0000';
    pCtx.fillRect(x + 8, y + 8, 16, 16);
    
    // Head indicator (lighter red)
    pCtx.fillStyle = '#FF6666';
    pCtx.fillRect(x + 10, y + 4, 12, 8);
    
    // Direction indicator
    pCtx.fillStyle = 'black';
    if (row === 0) pCtx.fillRect(x + 12, y + 20, 8, 4); // Down
    if (row === 1) pCtx.fillRect(x + 4, y + 12, 4, 8); // Left
    if (row === 2) pCtx.fillRect(x + 24, y + 12, 4, 8); // Right
    if (row === 3) pCtx.fillRect(x + 12, y + 4, 8, 4); // Up
  }
}

const pBuffer = pCanvas.toBuffer('image/png');
fs.writeFileSync(path.join(assetsDir, 'player.png'), pBuffer);
console.log('Generated player.png');
