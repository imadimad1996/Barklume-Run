import { GAME_TUNING } from '../game/config';

export interface DifficultyTier {
  name: string;
  speed: number;
  obstacleDensity: number;
  movingTrashChance: number;
}

export class DifficultyManager {
  getTier(elapsedMs: number): DifficultyTier {
    let curr = GAME_TUNING.difficultyTiers[0];
    for (const tier of GAME_TUNING.difficultyTiers) {
      if (elapsedMs >= tier.atMs) curr = tier;
    }
    return curr;
  }
}
