# Pawzlyne

Pawzlyne is a mobile-first portrait endless runner built with **Phaser 3 + TypeScript + Vite**.

## Run

```bash
npm install
npm run dev
```

Build production bundle:

```bash
npm run build
```

## Game loop

Menu → HowToPlay → Settings → Game → GameOver → Retry.

## Key systems

- **Scenes:** boot/preload/menu/how-to/settings/game/game-over
- **Managers:** input, spawn fairness, difficulty, audio, save/persistence
- **Entities:** dog, bones (normal + golden), trap banner/hole, moving trash, cat event
- **HUD:** score, best, combo multiplier, magnet timer, difficulty tier label

## Tuning knobs (`src/game/config.ts`)

- `difficultyTiers`: speed + density per tier
- `spawnRates`: obstacle, bone, magnet, cat reward odds
- `magnetDurationMs`, `magnetRadius`
- `comboGapMs`, `comboDecayMs`
- `catEventEveryMs`
- daily missions and reward values

## Persistence (`localStorage`)

Schema versioned via `pawzlyne.save.v1` and stores:

- best score
- settings (control mode, sound)
- daily missions and daily reward claim date
- treats currency
- cosmetic unlock stub (blue bandana)

## Controls

- **Swipe mode** (default): drag horizontally to switch lanes.
- **Tap mode**: tap left/right half of screen to nudge lanes.

Switch control mode in Settings (persisted).
