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
  private laneLockUntil: number[] = Array(LANE_COUNT).fill(0);

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

  private chooseLane(candidates: number[]): number | null {
    if (!candidates.length) return null;
    return Phaser.Utils.Array.GetRandom(candidates);
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

    const now = this.scene.time.now;
    const currentDogLane = this.dogLane();

    const viableTrapLanes = [...Array(LANE_COUNT).keys()].filter((lane) => {
      if (lane === currentDogLane) return false;
      return now >= this.laneLockUntil[lane];
    });

    if (viableTrapLanes.length < 1) return;

    // Keep at least one safe lane open in the immediate horizon.
    const safetyLane = Phaser.Utils.Array.GetRandom([...Array(LANE_COUNT).keys()]);
    const trapLaneChoices = viableTrapLanes.filter((lane) => lane !== safetyLane);
    const trapLane = this.chooseLane(trapLaneChoices.length ? trapLaneChoices : viableTrapLanes);
    if (trapLane === null) return;

    const y = -80;
    const trap = Math.random() < 0.5
      ? new TrapBanner(this.scene, getLaneX(trapLane), y)
      : new TrapHole(this.scene, getLaneX(trapLane), y);
    this.groups.traps.add(trap);

    this.laneLockUntil[trapLane] = now + GAME_TUNING.safeSpawnLeadTimeMs;

    if (Math.random() < t.movingTrashChance) {
      const trashLaneChoices = [...Array(LANE_COUNT).keys()].filter((lane) => lane !== currentDogLane && lane !== trapLane);
      const trashLane = this.chooseLane(trashLaneChoices);
      if (trashLane !== null) this.groups.movingTrash.add(new TrashMoving(this.scene, getLaneX(trashLane), y - 120));
    }
  }

  private spawnMagnet(): void {
    if (Math.random() > GAME_TUNING.spawnRates.magnetPerSecond) return;
    const laneChoices = [...Array(LANE_COUNT).keys()].filter((lane) => lane !== this.dogLane());
    const lane = this.chooseLane(laneChoices);
    if (lane === null) return;

    const mag = this.scene.physics.add.sprite(getLaneX(lane), -30, 'magnet');
    this.groups.magnets.add(mag);
  }
}
