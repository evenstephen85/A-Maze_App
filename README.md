# A-Maze

A fresh maze every time — draw your way out with your finger (or mouse).
Built with React + TypeScript + Vite, wrapped for iOS/Android with
[Capacitor](https://capacitorjs.com/).

## Where it runs

The web build is published free on GitHub Pages:

```
https://evenstephen85.github.io/A-Maze_App/
```

The same code is set up to be wrapped as real native iOS and Android apps —
see [Native builds](#native-builds-ios--android) below.

## How it plays

- **Landing page** → **Play** opens the difficulty list; **Settings** is on both.
- **Five difficulties**, Easy (6×8) to Master (18×24). Each one unlocks when
  you solve the one before it. Locked ones say what to finish first.
- **Every maze is new**: a depth-first carve (`src/lib/maze.ts`), so there is
  exactly one route from the top-left dot to the bottom-right square.
- **Draw your path**: press on the dot and drag through the corridors. Drag
  back over your path to rub it out. Lifting your finger keeps the path —
  press anywhere on it to carry on from there. Fast swipes are sampled in
  quarter-cell steps so they don't skip cells.
- **The clock starts on your first step**, not when the maze appears, so
  looking first is free. **Clear path** keeps the clock running; **New maze**
  resets it.
- **Stars** come from your time against each difficulty's targets in
  `src/data/difficulties.ts` (e.g. Easy: 3★ under 0:15, 2★ under 0:30,
  otherwise 1★). Best stars and best time are saved per difficulty.

## Settings

- **Show timer** — hides the running clock (your time still shows when you finish)
- **Path color** and **Maze color** — six of each
- **Preview** — a maze the size of your current level, part-solved, in your colors
- **Reset progress** — re-locks everything above Easy

Settings and progress live in `localStorage` (`amaze.settings.v1`,
`amaze.progress.v1`).

## Project layout

```
src/
  App.tsx                 screen switching, owns settings + progress
  types.ts                shared types
  data/difficulties.ts    sizes, star targets, unlock rules
  lib/maze.ts             generate, isOpen, solve
  lib/drawMaze.ts         canvas rendering (shared by play + preview)
  lib/scoring.ts          stars and time formatting
  lib/colors.ts           path / maze color palettes
  lib/storage.ts          settings + progress persistence
  lib/nativeChrome.ts     native-only tweaks (status bar); no-ops on the web
  components/MazeBoard.tsx  the canvas + draw-your-path input
  screens/                landing, level select, play, settings
public/                   favicon + web app manifest (copied as-is)
.github/workflows/        GitHub Pages deploy
capacitor.config.ts       native app id / name
```

## Local development

```bash
npm install
npm run dev
npm run lint
npm run build
```

To try it on a phone: `npm run dev -- --host` and open the printed network
address on a device on the same wifi.

## Deploying the website (GitHub Pages)

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every
push to `main`.

One-time setup: in the repo's **Settings → Pages**, set "Source" to
**GitHub Actions**.

The production build uses the repo name as its base path (`vite.config.ts`).
If you ever rename the repo, update `repoBase` there to match.

## Native builds (iOS / Android)

The Capacitor config is in place but the native platform projects have not
been generated yet — they're one command each, whenever you want them:

```bash
npx cap add ios
npx cap add android
```

After that:

```bash
npm run cap:sync      # build with root-relative paths, copy into the native projects
npm run cap:android   # ...and open Android Studio
npm run cap:ios       # ...and open Xcode (Mac only)
```

Native builds need a **root-relative** asset path, unlike the GitHub Pages
build which lives under a subpath — that's what the `:native` scripts and the
`CAP_BUILD` switch in `vite.config.ts` handle.

### Before you publish to a store

- **Bundle ID**: `capacitor.config.ts` uses `com.mycrew.amaze`. It can't be
  changed after publishing to either store, so set it before you ship.
- **App icon / splash art**: `public/favicon.svg` is a placeholder. Generate
  the native assets with
  [`@capacitor/assets`](https://github.com/ionic-team/capacitor-assets) once
  the real artwork exists.
