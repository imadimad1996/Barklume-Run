import Phaser from 'phaser';

export class TrashMoving extends Phaser.Physics.Arcade.Sprite {
  private drift = Phaser.Math.Between(-40, 40);
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'trash');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body!.setAllowGravity(false);
  }

  update(delta: number): void {
    this.x += (this.drift * delta) / 1000;
    if (this.x < 80 || this.x > 640) this.drift *= -1;
  }
}
