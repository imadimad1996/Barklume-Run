import Phaser from 'phaser';
import { Button } from '../ui/components/Button';
import { saveManager } from '../game/services';

export class SettingsScene extends Phaser.Scene {
  constructor() { super('SettingsScene'); }

  create(): void {
    const state = saveManager.getState();
    this.add.text(360, 170, 'Settings', { fontSize: '64px', color: '#1f2a44', fontStyle: '800' }).setOrigin(0.5);

    this.add.text(360, 320, `Control: ${state.settings.controlMode}`, { fontSize: '34px', color: '#35507f' }).setOrigin(0.5);
    new Button(this, 360, 420, 'Use Swipe', () => { saveManager.setControlMode('swipe'); this.scene.restart(); });
    new Button(this, 360, 520, 'Use Tap Zones', () => { saveManager.setControlMode('tap'); this.scene.restart(); });

    this.add.text(360, 650, `Sound: ${state.settings.soundOn ? 'On' : 'Off'}`, { fontSize: '34px', color: '#35507f' }).setOrigin(0.5);
    new Button(this, 360, 740, state.settings.soundOn ? 'Turn Sound Off' : 'Turn Sound On', () => {
      saveManager.setSoundOn(!state.settings.soundOn);
      this.scene.restart();
    }, 360);

    new Button(this, 360, 1080, 'Back', () => this.scene.start('MenuScene'));
  }
}
