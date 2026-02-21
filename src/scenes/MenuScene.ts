import Phaser from 'phaser';
import { Button } from '../ui/components/Button';
import { saveManager } from '../game/services';

export class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create(): void {
    const state = saveManager.getState();
    this.add.text(360, 170, 'Pawzlyne', { fontSize: '84px', color: '#1f2a44', fontStyle: '800' }).setOrigin(0.5);
    this.add.text(360, 240, 'Dog Endless Runner', { fontSize: '28px', color: '#4f6693' }).setOrigin(0.5);

    new Button(this, 360, 390, 'Start', () => this.scene.start('GameScene'));
    new Button(this, 360, 500, 'How To Play', () => this.scene.start('HowToPlayScene'));
    new Button(this, 360, 610, 'Settings', () => this.scene.start('SettingsScene'));

    this.add.text(360, 730, `Best Score: ${state.bestScore}  | Treats: ${state.treats}`, { fontSize: '28px', color: '#35507f' }).setOrigin(0.5);
    this.add.text(360, 810, 'Daily Missions', { fontSize: '32px', color: '#1f2a44', fontStyle: '700' }).setOrigin(0.5);
    state.daily.missions.forEach((m, i) => {
      this.add.text(360, 860 + i * 42, `${m.id}: ${m.progress}/${m.target}`, { fontSize: '24px', color: '#5d739d' }).setOrigin(0.5);
    });

    const canClaim = state.daily.rewardClaimDate !== new Date().toISOString().slice(0, 10);
    new Button(this, 360, 1030, canClaim ? 'Claim Daily Reward' : 'Reward Claimed', () => {
      if (saveManager.claimDailyReward()) this.scene.restart();
    }, 380);
    this.add.text(360, 1100, `Cosmetic: Blue Bandana ${state.cosmetics.blueBandanaUnlocked ? 'Unlocked' : 'Locked (100 treats)'}`, { fontSize: '20px', color: '#6d80a6' }).setOrigin(0.5);
  }
}
