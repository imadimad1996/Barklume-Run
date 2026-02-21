import Phaser from 'phaser';

export class Cat extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'cat');
    scene.add.existing(this);
  }

  flee(): void {
    this.scene.tweens.add({
      targets: this,
      x: this.x + Phaser.Math.Between(-180, 180),
      y: this.y - 250,
      alpha: 0,
      duration: 800,
      ease: 'Cubic.Out',
      onComplete: () => this.destroy(),
    });
  }
}
