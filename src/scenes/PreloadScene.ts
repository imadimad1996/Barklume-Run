import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() { super('PreloadScene'); }

  create(): void {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    g.fillStyle(0xf3c27b); g.fillCircle(40, 40, 34); g.fillStyle(0x3a2a1f); g.fillCircle(30, 30, 6); g.fillCircle(50, 30, 6);
    g.generateTexture('dog', 80, 80); g.clear();

    g.fillStyle(0xffffff); g.fillRoundedRect(5, 10, 38, 14, 7); g.fillRoundedRect(37, 10, 38, 14, 7);
    g.fillStyle(0xd8d8d8); g.fillCircle(40, 17, 5);
    g.generateTexture('bone', 80, 36); g.clear();

    g.fillStyle(0xffd45f); g.fillRoundedRect(5, 10, 38, 14, 7); g.fillRoundedRect(37, 10, 38, 14, 7); g.fillStyle(0xfff3bf); g.fillCircle(40, 17, 5);
    g.generateTexture('bone-golden', 80, 36); g.clear();

    g.fillStyle(0xff6c7f); g.fillRect(0, 0, 110, 40); g.fillStyle(0xffffff); g.fillRect(8, 12, 94, 6);
    g.generateTexture('trap-banner', 110, 40); g.clear();

    g.fillStyle(0x22293a); g.fillEllipse(55, 35, 100, 42); g.lineStyle(4, 0x45506d); g.strokeEllipse(55, 35, 100, 42);
    g.generateTexture('trap-hole', 110, 70); g.clear();

    g.fillStyle(0x7f8da5); g.fillRoundedRect(0, 0, 70, 70, 10); g.fillStyle(0x9cabbd); g.fillRect(10, 10, 50, 12);
    g.generateTexture('trash', 70, 70); g.clear();

    g.fillStyle(0x7ee0ff); g.fillRoundedRect(0, 0, 58, 58, 18); g.fillStyle(0x2f7fc2); g.fillRect(22, 10, 14, 38); g.fillRect(10, 22, 38, 14);
    g.generateTexture('magnet', 58, 58); g.clear();

    g.fillStyle(0xf8b4ca); g.fillCircle(30, 30, 24); g.fillStyle(0x412535); g.fillTriangle(20, 12, 26, 2, 32, 12);
    g.fillTriangle(40, 12, 46, 2, 52, 12);
    g.generateTexture('cat', 60, 60); g.destroy();

    this.scene.start('MenuScene');
  }
}
