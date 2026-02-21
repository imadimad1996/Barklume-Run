export type ControlMode = 'swipe' | 'tap';

export const GAME_WIDTH = 720;
export const GAME_HEIGHT = 1280;
export const LANE_COUNT = 5;

export const GAME_TUNING = {
  baseScrollSpeed: 340,
  laneSwitchLerp: 0.25,
  comboGapMs: 1700,
  comboDecayMs: 3500,
  closeCallDistance: 80,
  closeCallCooldownMs: 1800,
  magnetDurationMs: 3000,
  magnetRadius: 200,
  catEventEveryMs: 20000,
  safeSpawnLeadTimeMs: 900,
  difficultyTiers: [
    { name: 'Easy', atMs: 0, speed: 340, obstacleDensity: 0.35, movingTrashChance: 0 },
    { name: 'Mid-Easy', atMs: 25000, speed: 390, obstacleDensity: 0.4, movingTrashChance: 0 },
    { name: 'Medium', atMs: 50000, speed: 450, obstacleDensity: 0.48, movingTrashChance: 0.04 },
    { name: 'Mid-Hard', atMs: 85000, speed: 510, obstacleDensity: 0.58, movingTrashChance: 0.12 },
    { name: 'Hard', atMs: 120000, speed: 580, obstacleDensity: 0.68, movingTrashChance: 0.2 },
  ],
  spawnRates: {
    bonesPerSecond: 2,
    trapPerSecond: 0.9,
    magnetPerSecond: 0.06,
    catDropMagnetChance: 0.1,
    goldenBoneOdds: 1 / 50,
  },
  missions: {
    collectBonesTarget: 35,
    useMagnetTarget: 3,
    surviveSecondsTarget: 45,
  },
  dailyRewardTreats: 25,
};

export interface SafeBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export const getLaneX = (lane: number): number => {
  const margin = 100;
  const laneWidth = (GAME_WIDTH - margin * 2) / (LANE_COUNT - 1);
  return margin + laneWidth * lane;
};
