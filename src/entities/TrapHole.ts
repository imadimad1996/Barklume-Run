import Phaser from 'phaser';

export class TrapHole extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'trap-hole');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body!.setAllowGravity(false);
  }
}
