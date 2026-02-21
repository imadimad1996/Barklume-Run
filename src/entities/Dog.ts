import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_TUNING, getLaneX } from '../game/config';

export class Dog extends Phaser.Physics.Arcade.Sprite {
  lane = 2;
  targetLane = 2;

  constructor(scene: Phaser.Scene) {
    super(scene, getLaneX(2), GAME_HEIGHT - 170, 'dog');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setDepth(10);
    this.body!.setCircle(30, 10, 10);
  }

  moveToLane(lane: number): void {
    this.targetLane = lane;
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    const targetX = getLaneX(this.targetLane);
    this.x = Phaser.Math.Linear(this.x, targetX, GAME_TUNING.laneSwitchLerp);
    if (Math.abs(this.x - targetX) < 1) this.lane = this.targetLane;
  }
}
