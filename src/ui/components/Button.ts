import Phaser from 'phaser';

export class Button extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, label: string, onClick: () => void, width = 280) {
    super(scene, x, y);
    const bg = scene.add.rectangle(0, 0, width, 84, 0x5f8bff).setOrigin(0.5).setStrokeStyle(2, 0xffffff, 0.7);
    const text = scene.add.text(0, 0, label, { fontSize: '30px', color: '#ffffff', fontStyle: '700' }).setOrigin(0.5);
    bg.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.setScale(0.97))
      .on('pointerup', () => {
        this.setScale(1);
        onClick();
      })
      .on('pointerout', () => this.setScale(1));
    this.add([bg, text]);
    scene.add.existing(this);
  }
}
