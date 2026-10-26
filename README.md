# A-Maze

Builds mazes for you. Built with React + TypeScript + Vite, wrapped for
iOS/Android with [Capacitor](https://capacitorjs.com/).

## Where it runs

The web build is published free on GitHub Pages:

```
https://evenstephen85.github.io/A-Maze_App/
```

The same code is set up to be wrapped as real native iOS and Android apps —
see [Native builds](#native-builds-ios--android) below.

## Project layout

```
src/
  App.tsx                 the app root
  lib/nativeChrome.ts     native-only tweaks (status bar); no-ops on the web
  index.css               theme tokens and base styles
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
