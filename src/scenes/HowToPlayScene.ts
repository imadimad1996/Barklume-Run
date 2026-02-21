import Phaser from 'phaser';
import { Button } from '../ui/components/Button';

export class HowToPlayScene extends Phaser.Scene {
  constructor() { super('HowToPlayScene'); }

  create(): void {
    this.add.text(360, 170, 'How to Play', { fontSize: '64px', color: '#1f2a44', fontStyle: '800' }).setOrigin(0.5);
    const tips = [
      '• Dodge traps by switching among 5 lanes.',
      '• Collect bones for score. Golden bones are rare and worth more.',
      '• Keep collecting quickly to build combo multipliers.',
      '• Magnet power-up pulls nearby bones for 3s.',
      '• Cats show up and sometimes drop bonus rewards.',
    ];
    tips.forEach((line, i) => this.add.text(70, 340 + i * 70, line, { fontSize: '28px', color: '#35507f' }));
    new Button(this, 360, 1080, 'Back', () => this.scene.start('MenuScene'));
  }
}
