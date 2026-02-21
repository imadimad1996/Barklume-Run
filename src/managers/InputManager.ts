import Phaser from 'phaser';
import { ControlMode, LANE_COUNT } from '../game/config';

export class InputManager {
  private mode: ControlMode;
  private dragStartX = 0;
  onLaneRequest: ((lane: number) => void) | null = null;

  constructor(private scene: Phaser.Scene, initialMode: ControlMode, private getCurrentLane: () => number) {
    this.mode = initialMode;
    this.bind();
  }

  setMode(mode: ControlMode): void {
    this.mode = mode;
  }

  private bind(): void {
    this.scene.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.dragStartX = p.x;
      if (this.mode === 'tap') this.handleTap(p.x);
    });

    this.scene.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (!p.isDown || this.mode !== 'swipe') return;
      const delta = p.x - this.dragStartX;
      if (Math.abs(delta) < 40) return;
      const dir = delta > 0 ? 1 : -1;
      const nextLane = Phaser.Math.Clamp(this.getCurrentLane() + dir, 0, LANE_COUNT - 1);
      this.dragStartX = p.x;
      this.onLaneRequest?.(nextLane);
    });
  }

  private handleTap(x: number): void {
    const isLeft = x < this.scene.scale.width / 2;
    const dir = isLeft ? -1 : 1;
    const lane = Phaser.Math.Clamp(this.getCurrentLane() + dir, 0, LANE_COUNT - 1);
    this.onLaneRequest?.(lane);
  }

  destroy(): void {
    this.scene.input.removeAllListeners();
  }
}
