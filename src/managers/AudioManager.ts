import Phaser from 'phaser';

export class AudioManager {
  private enabled = true;
  private ctx?: AudioContext;

  constructor(private scene: Phaser.Scene) {
    this.ctx = this.scene.sound.context as AudioContext;
  }

  setEnabled(on: boolean): void {
    this.enabled = on;
  }

  private beep(freq: number, duration = 0.08, type: OscillatorType = 'sine'): void {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  playBone(): void { this.beep(540, 0.09, 'triangle'); }
  playMagnet(): void { this.beep(280, 0.2, 'sawtooth'); }
  playNearMiss(): void { this.beep(190, 0.14, 'square'); }
  playCat(): void { this.beep(620, 0.05, 'sine'); }
  playGameOver(): void { this.beep(120, 0.4, 'square'); }
}
