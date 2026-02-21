import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from './config';
import { BootScene } from '../scenes/BootScene';
import { PreloadScene } from '../scenes/PreloadScene';
import { MenuScene } from '../scenes/MenuScene';
import { HowToPlayScene } from '../scenes/HowToPlayScene';
import { SettingsScene } from '../scenes/SettingsScene';
import { GameScene } from '../scenes/GameScene';
import { GameOverScene } from '../scenes/GameOverScene';

export const createGame = (parent: HTMLElement): Phaser.Game => {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#f7fbff',
    roundPixels: true,
    render: {
      antialias: false,
      pixelArt: false,
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    },
    physics: {
      default: 'arcade',
      arcade: { debug: false },
    },
    scene: [BootScene, PreloadScene, MenuScene, HowToPlayScene, SettingsScene, GameScene, GameOverScene],
  });
};
