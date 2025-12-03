export interface PlayerData {
  x: number;
  y: number;
  facingDirection: 'up' | 'down' | 'left' | 'right';
  currentSprite: 'clair' | 'sage' | 'wallace';
}

export class DataManager {
  private static instance: DataManager;
  private playerData: PlayerData;

  private constructor() {
    this.playerData = {
      x: 160, // 5 * 32
      y: 160, // 5 * 32
      facingDirection: 'down',
      currentSprite: 'clair'
    };
  }

  public static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  public getPlayerData(): PlayerData {
    return this.playerData;
  }

  public setPlayerPosition(x: number, y: number): void {
    this.playerData.x = x;
    this.playerData.y = y;
  }

  public setFacingDirection(direction: 'up' | 'down' | 'left' | 'right'): void {
    this.playerData.facingDirection = direction;
  }

  public setCurrentSprite(sprite: 'clair' | 'sage' | 'wallace'): void {
    this.playerData.currentSprite = sprite;
  }
}