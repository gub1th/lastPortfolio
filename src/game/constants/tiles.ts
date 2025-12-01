/**
 * Tile ID mapping for TX Tileset Grass.png
 * Each tile is 64x64 pixels
 * 
 * To find a tile ID: (row * TILES_PER_ROW) + column
 * The tileset is 4 tiles wide (256px / 64px)
 */

const TILES_PER_ROW = 4;

// Helper function to calculate tile ID from row/col
const tile = (row: number, col: number) => row * TILES_PER_ROW + col;

// Terrain & Floors (based on TX Tileset Grass.png 4 quadrants)
export const TILES = {
  // Top-left quadrant: grass variations
  GRASS_A: tile(0, 0),
  GRASS_B: tile(0, 1),
  GRASS_C: tile(1, 0),
  GRASS_D: tile(1, 1),
  
  // Top-right quadrant: flower variations
  FLOWER_A: tile(0, 2),
  FLOWER_B: tile(0, 3),
  FLOWER_C: tile(1, 2),
  FLOWER_D: tile(1, 3),
  
  // Bottom-left quadrant: stone variations
  STONE_A: tile(2, 0),
  STONE_B: tile(2, 1),
  STONE_C: tile(3, 0),
  STONE_D: tile(3, 1),
  
  // Bottom-right quadrant: more stone/ground
  STONE_E: tile(2, 2),
  STONE_F: tile(2, 3),
  STONE_G: tile(3, 2),
  STONE_H: tile(3, 3),
} as const;

// Collision tiles (tiles that block movement)
export const COLLISION_TILES: Set<number> = new Set([
  // For now, none of the grass tiles block movement
  // Add IDs here if you want certain tiles to be solid
  // Example: TILES.STONE_A, TILES.STONE_B
]);