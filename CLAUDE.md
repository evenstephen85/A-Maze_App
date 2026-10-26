# A-Maze — notes for Claude

Same stack and conventions as the owner's other apps (e.g. Pickler,
charades-by-mycrew): a static web app hosted free on GitHub Pages that can be
wrapped as iOS/Android apps with Capacitor later.

## Stack

- React 19 + TypeScript + Vite, linted with oxlint
- Capacitor 8 for native wrappers (`ios/` and `android/` not generated yet)
- No backend: everything runs in the browser. Persist settings with
  `localStorage` wrapped in try/catch so the app still works when storage is
  blocked.

## Before pushing

```bash
npm run lint
npm run build          # GitHub Pages build (base /A-Maze_App/)
npm run build:native   # Capacitor build (base /)
```

All three must pass. `npm ci` in CI uses `package-lock.json`, so commit it
whenever dependencies change.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml` and publishes to
https://evenstephen85.github.io/A-Maze_App/. Work happens on feature branches
and reaches `main` via pull request.

## Native-friendly rules

- Anything native-only (status bar, haptics, etc.) goes through a small
  wrapper in `src/lib/` that checks `Capacitor.isNativePlatform()` and falls
  back or no-ops on the web.
- Respect safe areas (`--safe-*` CSS vars) and `prefers-reduced-motion`.
- Keep asset paths relative/imported so both base paths work; files in
  `public/` are referenced without the repo prefix (Vite adds it).
- No emoji icons — inline SVGs.
