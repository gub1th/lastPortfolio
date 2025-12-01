/**
 * Tile ID mapping for pokemon_tileset.png
 * Each tile is 32x32 pixels
 * 
 * To find a tile ID: (row * TILES_PER_ROW) + column
 * The tileset appears to be 16 tiles wide based on the image
 */

const TILES_PER_ROW = 16;

// Helper function to calculate tile ID from row/col
const tile = (row: number, col: number) => row * TILES_PER_ROW + col;

// Terrain & Floors
export const TILES = {
  // Grass variations (top rows)
  GRASS_1: tile(0, 0),
  GRASS_2: tile(0, 1),
  GRASS_3: tile(0, 2),
  GRASS_FLOWER: tile(0, 3),
  
  // Indoor floors (scanning the tileset)
  FLOOR_WOOD_LIGHT: tile(2, 0),
  FLOOR_WOOD_DARK: tile(2, 1),
  FLOOR_TILE_CREAM: tile(3, 0),
  FLOOR_TILE_CHECKERED: tile(3, 1),
  FLOOR_CARPET_RED: tile(4, 0),
  FLOOR_CARPET_BLUE: tile(4, 1),
  
  // Walls (typically mid-section of tilesets)
  WALL_TOP: tile(8, 0),
  WALL_SIDE_LEFT: tile(8, 1),
  WALL_SIDE_RIGHT: tile(8, 2),
  WALL_CORNER_TL: tile(7, 0),
  WALL_CORNER_TR: tile(7, 1),
  
  // Objects & Furniture
  DESK: tile(12, 0),
  CHAIR: tile(12, 1),
  BOOKSHELF: tile(13, 0),
  PLANT_POT: tile(14, 0),
  COMPUTER: tile(15, 0),
  
  // Decorative
  DOOR_CLOSED: tile(10, 0),
  WINDOW: tile(10, 1),
  RUG: tile(11, 0),
  
  // Water & Nature
  WATER: tile(5, 0),
  TREE_TOP: tile(6, 0),
  TREE_BOTTOM: tile(6, 1),
  FLOWER: tile(1, 4),
  ROCK: tile(1, 5),
} as const;

// Collision tiles (tiles that block movement)
export const COLLISION_TILES = new Set([
  TILES.WALL_TOP,
  TILES.WALL_SIDE_LEFT,
  TILES.WALL_SIDE_RIGHT,
  TILES.WALL_CORNER_TL,
  TILES.WALL_CORNER_TR,
  TILES.DESK,
  TILES.BOOKSHELF,
  TILES.PLANT_POT,
  TILES.TREE_BOTTOM,
  TILES.ROCK,
  TILES.WATER,
]);

/**
 * NOTE: These tile IDs are estimates based on typical tileset layouts.
 * You may need to adjust them by:
 * 1. Opening pokemon_tileset.png in an image editor
 * 2. Counting tiles from top-left (0-indexed)
 * 3. Updating the tile() row/col values above
 */
