import Phaser from 'phaser';

export class HUD {
  score = 0;
  private scoreText: Phaser.GameObjects.Text;
  private bestText: Phaser.GameObjects.Text;
  private comboText: Phaser.GameObjects.Text;
  private magnetText: Phaser.GameObjects.Text;
  private tierText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, best: number) {
    this.scoreText = scene.add.text(28, 30, 'Score: 0', { fontSize: '34px', color: '#1f2a44', fontStyle: '700' }).setDepth(100);
    this.bestText = scene.add.text(28, 72, `Best: ${best}`, { fontSize: '24px', color: '#35507f' }).setDepth(100);
    this.comboText = scene.add.text(28, 108, 'Combo x1', { fontSize: '24px', color: '#48c78e' }).setDepth(100);
    this.magnetText = scene.add.text(520, 30, '', { fontSize: '24px', color: '#5f8bff', fontStyle: '700' }).setDepth(100);
    this.tierText = scene.add.text(520, 65, 'Easy', { fontSize: '20px', color: '#6b7ea8' }).setDepth(100);
  }

  setScore(value: number): void { this.score = value; this.scoreText.setText(`Score: ${value}`); }
  setCombo(multiplier: number): void { this.comboText.setText(`Combo x${multiplier.toFixed(1)}`); }
  setMagnet(sec: number): void { this.magnetText.setText(sec > 0 ? `🧲 ${sec.toFixed(1)}s` : ''); }
  setTier(name: string): void { this.tierText.setText(name); }
}
