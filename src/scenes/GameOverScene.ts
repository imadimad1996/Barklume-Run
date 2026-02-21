import Phaser from 'phaser';
import { Button } from '../ui/components/Button';
import { saveManager } from '../game/services';

export class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }

  create(data: { score: number }): void {
    const best = saveManager.getState().bestScore;
    this.add.text(360, 260, 'Game Over', { fontSize: '82px', color: '#1f2a44', fontStyle: '800' }).setOrigin(0.5);
    this.add.text(360, 420, `Score: ${data.score}`, { fontSize: '52px', color: '#35507f', fontStyle: '700' }).setOrigin(0.5);
    this.add.text(360, 490, `Best: ${best}`, { fontSize: '34px', color: '#6b7ea8' }).setOrigin(0.5);
    new Button(this, 360, 670, 'Retry', () => this.scene.start('GameScene'));
    new Button(this, 360, 780, 'Customize (Soon)', () => this.scene.start('MenuScene'), 360);
    new Button(this, 360, 890, 'Menu', () => this.scene.start('MenuScene'));
  }
}
