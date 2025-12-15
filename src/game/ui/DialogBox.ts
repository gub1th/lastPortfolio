import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/GameConfig';

export class DialogBox {
  private container: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Graphics;
  private nameText: Phaser.GameObjects.Text;
  private dialogText: Phaser.GameObjects.Text;
  private continueIndicator: Phaser.GameObjects.Text;
  
  private dialogLines: string[] = [];
  private currentLineIndex: number = 0;
  private currentCharIndex: number = 0;
  private isTyping: boolean = false;
  private isVisible: boolean = false;
  private typeSpeed: number = 30; // ms per character
  private lastTypeTime: number = 0;
  private onComplete: (() => void) | null = null;

  constructor(scene: Phaser.Scene) {
    
    // Create container for all dialog elements
    this.container = scene.add.container(0, 0);
    this.container.setDepth(100);
    this.container.setScrollFactor(0);
    
    // Create background
    this.background = scene.add.graphics();
    this.drawBackground();
    this.container.add(this.background);
    
    // Create name text
    this.nameText = scene.add.text(20, GAME_CONFIG.GAME_HEIGHT - 85, '', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      color: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 6, y: 4 },
    });
    this.container.add(this.nameText);
    
    // Create dialog text
    this.dialogText = scene.add.text(20, GAME_CONFIG.GAME_HEIGHT - 60, '', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      color: '#ffffff',
      wordWrap: { width: GAME_CONFIG.GAME_WIDTH - 40 },
      lineSpacing: 8,
    });
    this.container.add(this.dialogText);
    
    // Create continue indicator
    this.continueIndicator = scene.add.text(
      GAME_CONFIG.GAME_WIDTH - 30,
      GAME_CONFIG.GAME_HEIGHT - 15,
      '▼',
      {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '10px',
        color: '#ffffff',
      }
    );
    this.container.add(this.continueIndicator);
    
    // Hide by default
    this.container.setVisible(false);
    
    // Animate continue indicator
    scene.tweens.add({
      targets: this.continueIndicator,
      y: GAME_CONFIG.GAME_HEIGHT - 12,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
  }

  private drawBackground() {
    const width = GAME_CONFIG.GAME_WIDTH;
    const height = 80;
    const y = GAME_CONFIG.GAME_HEIGHT - height - 5;
    
    this.background.clear();
    
    // Main background
    this.background.fillStyle(0x000000, 0.9);
    this.background.fillRoundedRect(5, y, width - 10, height, 8);
    
    // Border
    this.background.lineStyle(3, 0xffffff, 1);
    this.background.strokeRoundedRect(5, y, width - 10, height, 8);
  }

  show(name: string, lines: string[], onComplete?: () => void) {
    this.dialogLines = lines;
    this.currentLineIndex = 0;
    this.currentCharIndex = 0;
    this.isTyping = true;
    this.isVisible = true;
    this.onComplete = onComplete || null;
    
    this.nameText.setText(name);
    this.dialogText.setText('');
    this.continueIndicator.setVisible(false);
    this.container.setVisible(true);
  }

  hide() {
    this.isVisible = false;
    this.container.setVisible(false);
    this.dialogLines = [];
    this.currentLineIndex = 0;
    
    if (this.onComplete) {
      this.onComplete();
      this.onComplete = null;
    }
  }

  advance(): boolean {
    if (!this.isVisible) return false;
    
    if (this.isTyping) {
      // Skip to end of current line
      this.dialogText.setText(this.dialogLines[this.currentLineIndex]);
      this.isTyping = false;
      this.continueIndicator.setVisible(true);
      return true;
    }
    
    // Move to next line
    this.currentLineIndex++;
    
    if (this.currentLineIndex >= this.dialogLines.length) {
      this.hide();
      return false;
    }
    
    // Start typing next line
    this.currentCharIndex = 0;
    this.isTyping = true;
    this.dialogText.setText('');
    this.continueIndicator.setVisible(false);
    return true;
  }

  update(time: number) {
    if (!this.isVisible || !this.isTyping) return;
    
    if (time - this.lastTypeTime >= this.typeSpeed) {
      this.lastTypeTime = time;
      
      const currentLine = this.dialogLines[this.currentLineIndex];
      if (this.currentCharIndex < currentLine.length) {
        this.currentCharIndex++;
        this.dialogText.setText(currentLine.substring(0, this.currentCharIndex));
      } else {
        this.isTyping = false;
        this.continueIndicator.setVisible(true);
      }
    }
  }

  getIsVisible(): boolean {
    return this.isVisible;
  }
}
