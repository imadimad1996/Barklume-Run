import Phaser from 'phaser';
import { Dog } from '../entities/Dog';
import { Bone } from '../entities/Bone';
import { Cat } from '../entities/Cat';
import { TrashMoving } from '../entities/TrashMoving';
import { GAME_HEIGHT, GAME_TUNING } from '../game/config';
import { AudioManager } from '../managers/AudioManager';
import { DifficultyManager } from '../managers/DifficultyManager';
import { InputManager } from '../managers/InputManager';
import { SpawnManager } from '../managers/SpawnManager';
import { saveManager } from '../game/services';
import { HUD } from '../ui/HUD';

export class GameScene extends Phaser.Scene {
  private dog!: Dog;
  private bones!: Phaser.Physics.Arcade.Group;
  private traps!: Phaser.Physics.Arcade.Group;
  private movingTrash!: Phaser.Physics.Arcade.Group;
  private magnets!: Phaser.Physics.Arcade.Group;
  private inputManager!: InputManager;
  private spawnManager!: SpawnManager;
  private difficultyManager = new DifficultyManager();
  private audioManager!: AudioManager;
  private hud!: HUD;

  private score = 0;
  private combo = 1;
  private lastBoneAt = 0;
  private magnetUntil = 0;
  private runStart = 0;
  private nearMissCooldownUntil = 0;
  private catEvent?: Phaser.Time.TimerEvent;
  private surviveAccumulatorMs = 0;

  constructor() { super('GameScene'); }

  create(): void {
    this.runStart = this.time.now;
    const state = saveManager.getState();
    this.audioManager = new AudioManager(this);
    this.audioManager.setEnabled(state.settings.soundOn);
    this.hud = new HUD(this, state.bestScore);

    this.add.rectangle(360, 640, 720, 1280, 0xf5f9ff);
    for (let i = 0; i < 5; i++) this.add.rectangle(100 + i * 130, 640, 4, 1280, 0xd0d9ed, 0.6);

    this.bones = this.physics.add.group();
    this.traps = this.physics.add.group();
    this.movingTrash = this.physics.add.group();
    this.magnets = this.physics.add.group();

    this.dog = new Dog(this);
    this.inputManager = new InputManager(this, state.settings.controlMode, () => this.dog.targetLane);
    this.inputManager.onLaneRequest = (lane) => this.dog.moveToLane(lane);

    this.spawnManager = new SpawnManager(this, {
      bones: this.bones,
      traps: this.traps,
      movingTrash: this.movingTrash,
      magnets: this.magnets,
    }, () => this.dog.targetLane, () => this.difficultyManager.getTier(this.time.now - this.runStart));
    this.spawnManager.start();

    this.physics.add.overlap(this.dog, this.bones, (_, b) => this.collectBone(b as Bone));
    this.physics.add.overlap(this.dog, this.magnets, (_, m) => this.collectMagnet(m as Phaser.Physics.Arcade.Sprite));
    this.physics.add.overlap(this.dog, this.traps, () => this.triggerGameOver());
    this.physics.add.overlap(this.dog, this.movingTrash, () => this.triggerGameOver());

    this.catEvent = this.time.addEvent({ delay: GAME_TUNING.catEventEveryMs, loop: true, callback: () => this.spawnCatsEvent() });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.cleanup());
  }

  update(_: number, delta: number): void {
    const elapsed = this.time.now - this.runStart;
    const tier = this.difficultyManager.getTier(elapsed);
    this.hud.setTier(tier.name);

    const speed = tier.speed * (delta / 1000);
    [...this.bones.getChildren(), ...this.traps.getChildren(), ...this.magnets.getChildren()].forEach((obj) => {
      const sprite = obj as Phaser.Physics.Arcade.Sprite;
      sprite.y += speed;
      if (sprite.y > GAME_HEIGHT + 120) sprite.destroy();
    });

    this.movingTrash.getChildren().forEach((obj) => {
      const trash = obj as TrashMoving;
      trash.y += speed;
      trash.update(delta);
      if (trash.y > GAME_HEIGHT + 150) trash.destroy();
    });

    if (this.time.now > this.lastBoneAt + GAME_TUNING.comboDecayMs) this.combo = 1;
    this.hud.setCombo(this.combo);

    const magnetRemaining = Math.max(0, (this.magnetUntil - this.time.now) / 1000);
    this.hud.setMagnet(magnetRemaining);
    if (magnetRemaining > 0) this.magnetPull();

    this.checkNearMiss();
    this.surviveAccumulatorMs += delta;
    if (this.surviveAccumulatorMs >= 1000) {
      const seconds = Math.floor(this.surviveAccumulatorMs / 1000);
      this.surviveAccumulatorMs -= seconds * 1000;
      saveManager.incrementMission('survive', seconds);
    }
  }

  private collectBone(bone: Bone): void {
    bone.destroy();
    const now = this.time.now;
    if (now - this.lastBoneAt < GAME_TUNING.comboGapMs) this.combo = Math.min(8, this.combo + 0.2);
    else this.combo = 1;
    this.lastBoneAt = now;
    const base = bone.isGolden ? 25 : 6;
    this.score += Math.round(base * this.combo);
    this.hud.setScore(this.score);
    this.audioManager.playBone();
    saveManager.incrementMission('collect_bones', 1);

    this.tweens.add({ targets: this.dog, scaleX: 1.08, scaleY: 0.92, yoyo: true, duration: 80 });
    const p = this.add.particles(bone.x, bone.y, 'bone', { speed: 30, lifespan: 220, quantity: 5, scale: 0.2 });
    this.time.delayedCall(250, () => p.destroy());
  }

  private collectMagnet(magnet: Phaser.Physics.Arcade.Sprite): void {
    magnet.destroy();
    this.magnetUntil = this.time.now + GAME_TUNING.magnetDurationMs;
    this.audioManager.playMagnet();
    saveManager.incrementMission('use_magnet', 1);
  }

  private magnetPull(): void {
    this.bones.getChildren().forEach((obj) => {
      const bone = obj as Bone;
      const dist = Phaser.Math.Distance.Between(bone.x, bone.y, this.dog.x, this.dog.y);
      if (dist > GAME_TUNING.magnetRadius) return;
      this.tweens.add({ targets: bone, x: this.dog.x, y: this.dog.y - 20, duration: 220, ease: 'Sine.In', onComplete: () => this.collectBone(bone) });
    });
  }

  private checkNearMiss(): void {
    if (this.time.now < this.nearMissCooldownUntil) return;
    const near = [...this.traps.getChildren(), ...this.movingTrash.getChildren()].some((o) => {
      const s = o as Phaser.GameObjects.Sprite;
      return Math.abs(s.y - this.dog.y) < 38 && Math.abs(s.x - this.dog.x) < GAME_TUNING.closeCallDistance;
    });
    if (!near) return;
    this.nearMissCooldownUntil = this.time.now + GAME_TUNING.closeCallCooldownMs;
    this.cameras.main.shake(120, 0.003);
    this.audioManager.playNearMiss();
    this.time.timeScale = 0.88;
    this.time.delayedCall(180, () => (this.time.timeScale = 1));
  }

  private spawnCatsEvent(): void {
    const count = Phaser.Math.Between(1, 3);
    for (let i = 0; i < count; i++) {
      const cat = new Cat(this, Phaser.Math.Between(120, 600), Phaser.Math.Between(250, 550));
      this.audioManager.playCat();
      this.time.delayedCall(300 + i * 120, () => cat.flee());
    }
    const dropBoneCluster = Math.random() < 0.75;
    if (dropBoneCluster) {
      for (let i = 0; i < 4; i++) {
        const bone = new Bone(this, Phaser.Math.Between(140, 580), -60 - i * 40, Math.random() < 0.08);
        this.bones.add(bone);
      }
    } else if (Math.random() < GAME_TUNING.spawnRates.catDropMagnetChance) {
      const mag = this.physics.add.sprite(Phaser.Math.Between(140, 580), -40, 'magnet');
      this.magnets.add(mag);
    }
  }

  private triggerGameOver(): void {
    this.audioManager.playGameOver();
    saveManager.updateBestScore(this.score);
    this.cleanup();
    this.scene.start('GameOverScene', { score: this.score });
  }

  private cleanup(): void {
    this.spawnManager?.stop();
    this.inputManager?.destroy();
    this.catEvent?.destroy();
  }
}
