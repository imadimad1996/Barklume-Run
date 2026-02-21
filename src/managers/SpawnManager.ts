import Phaser from 'phaser';
import { Bone } from '../entities/Bone';
import { TrapBanner } from '../entities/TrapBanner';
import { TrapHole } from '../entities/TrapHole';
import { TrashMoving } from '../entities/TrashMoving';
import { GAME_TUNING, getLaneX, LANE_COUNT } from '../game/config';

interface TierData {
  obstacleDensity: number;
  movingTrashChance: number;
}

export class SpawnManager {
  private timers: Phaser.Time.TimerEvent[] = [];

  constructor(
    private scene: Phaser.Scene,
    private groups: {
      bones: Phaser.Physics.Arcade.Group;
      traps: Phaser.Physics.Arcade.Group;
      movingTrash: Phaser.Physics.Arcade.Group;
      magnets: Phaser.Physics.Arcade.Group;
    },
    private dogLane: () => number,
    private tier: () => TierData,
  ) {}

  start(): void {
    this.timers.push(
      this.scene.time.addEvent({ delay: 500, loop: true, callback: () => this.spawnBones() }),
      this.scene.time.addEvent({ delay: 800, loop: true, callback: () => this.spawnTraps() }),
      this.scene.time.addEvent({ delay: 2200, loop: true, callback: () => this.spawnMagnet() }),
    );
  }

  stop(): void {
    this.timers.forEach((t) => t.destroy());
    this.timers = [];
  }

  private chooseSafeLane(excludeDog = false): number {
    const lanes = [...Array(LANE_COUNT).keys()];
    if (excludeDog) {
      const idx = lanes.indexOf(this.dogLane());
      if (idx >= 0) lanes.splice(idx, 1);
    }
    return Phaser.Utils.Array.GetRandom(lanes);
  }

  private spawnBones(): void {
    const lane = Phaser.Utils.Array.GetRandom([...Array(LANE_COUNT).keys()]);
    const y = -40;
    const golden = Math.random() < GAME_TUNING.spawnRates.goldenBoneOdds;
    this.groups.bones.add(new Bone(this.scene, getLaneX(lane), y, golden));
  }

  private spawnTraps(): void {
    const t = this.tier();
    if (Math.random() > t.obstacleDensity) return;
    const safeLane = this.chooseSafeLane();
    const laneChoices = [...Array(LANE_COUNT).keys()].filter((l) => l !== safeLane && l !== this.dogLane());
    if (laneChoices.length < 1) return;
    const lane = Phaser.Utils.Array.GetRandom(laneChoices);
    const y = -80;
    const trap = Math.random() < 0.5
      ? new TrapBanner(this.scene, getLaneX(lane), y)
      : new TrapHole(this.scene, getLaneX(lane), y);
    this.groups.traps.add(trap);

    if (Math.random() < t.movingTrashChance) {
      const trashLane = this.chooseSafeLane(true);
      this.groups.movingTrash.add(new TrashMoving(this.scene, getLaneX(trashLane), y - 120));
    }
  }

  private spawnMagnet(): void {
    if (Math.random() > GAME_TUNING.spawnRates.magnetPerSecond) return;
    const lane = this.chooseSafeLane();
    const mag = this.scene.physics.add.sprite(getLaneX(lane), -30, 'magnet');
    this.groups.magnets.add(mag);
  }
}
