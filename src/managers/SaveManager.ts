import { ControlMode, GAME_TUNING } from '../game/config';

interface MissionState {
  id: 'collect_bones' | 'use_magnet' | 'survive';
  progress: number;
  target: number;
}

export interface SaveState {
  version: number;
  bestScore: number;
  treats: number;
  settings: {
    controlMode: ControlMode;
    soundOn: boolean;
  };
  daily: {
    missionsDate: string;
    missions: MissionState[];
    rewardClaimDate: string | null;
  };
  cosmetics: {
    blueBandanaUnlocked: boolean;
  };
}

const STORAGE_KEY = 'pawzlyne.save.v1';
const todayKey = () => new Date().toISOString().slice(0, 10);

export class SaveManager {
  private state: SaveState;

  constructor() {
    this.state = this.load();
  }

  private defaultMissions(): MissionState[] {
    return [
      { id: 'collect_bones', progress: 0, target: GAME_TUNING.missions.collectBonesTarget },
      { id: 'use_magnet', progress: 0, target: GAME_TUNING.missions.useMagnetTarget },
      { id: 'survive', progress: 0, target: GAME_TUNING.missions.surviveSecondsTarget },
    ];
  }

  private defaultState(): SaveState {
    return {
      version: 1,
      bestScore: 0,
      treats: 0,
      settings: { controlMode: 'swipe', soundOn: true },
      daily: {
        missionsDate: todayKey(),
        missions: this.defaultMissions(),
        rewardClaimDate: null,
      },
      cosmetics: { blueBandanaUnlocked: false },
    };
  }

  private load(): SaveState {
    const fallback = this.defaultState();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;

    try {
      const parsed = JSON.parse(raw) as Partial<SaveState>;
      return {
        ...fallback,
        ...parsed,
        settings: {
          ...fallback.settings,
          ...parsed.settings,
        },
        daily: {
          ...fallback.daily,
          ...parsed.daily,
          missions: this.defaultMissions().map((base) => {
            const persisted = parsed.daily?.missions?.find((m) => m.id === base.id);
            if (!persisted) return base;
            return { ...base, progress: Math.min(base.target, Math.max(0, persisted.progress ?? 0)) };
          }),
        },
        cosmetics: {
          ...fallback.cosmetics,
          ...parsed.cosmetics,
        },
      };
    } catch {
      return fallback;
    }
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  refreshDailyIfNeeded(): void {
    if (this.state.daily.missionsDate === todayKey()) return;
    this.state.daily.missionsDate = todayKey();
    this.state.daily.missions = this.defaultMissions();
    this.persist();
  }

  getState(): SaveState {
    this.refreshDailyIfNeeded();
    return this.state;
  }

  setControlMode(mode: ControlMode): void {
    this.state.settings.controlMode = mode;
    this.persist();
  }

  setSoundOn(on: boolean): void {
    this.state.settings.soundOn = on;
    this.persist();
  }

  updateBestScore(score: number): void {
    if (score <= this.state.bestScore) return;
    this.state.bestScore = score;
    this.persist();
  }

  addTreats(amount: number): void {
    this.state.treats += amount;
    if (this.state.treats >= 100) this.state.cosmetics.blueBandanaUnlocked = true;
    this.persist();
  }

  claimDailyReward(): boolean {
    if (this.state.daily.rewardClaimDate === todayKey()) return false;
    this.state.daily.rewardClaimDate = todayKey();
    this.addTreats(GAME_TUNING.dailyRewardTreats);
    this.persist();
    return true;
  }

  incrementMission(id: MissionState['id'], amount: number): void {
    const mission = this.state.daily.missions.find((m) => m.id === id);
    if (!mission) return;
    mission.progress = Math.min(mission.target, mission.progress + amount);
    this.persist();
  }
}
