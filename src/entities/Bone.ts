import Phaser from 'phaser';

export class Bone extends Phaser.Physics.Arcade.Sprite {
  isGolden: boolean;
  constructor(scene: Phaser.Scene, x: number, y: number, golden = false) {
    super(scene, x, y, golden ? 'bone-golden' : 'bone');
    this.isGolden = golden;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(golden ? 1.1 : 1);
    this.body!.setAllowGravity(false);
  }
}
