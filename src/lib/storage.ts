import type { Progress, Settings } from '../types';

const KEYS = {
  settings: 'amaze.settings.v1',
  progress: 'amaze.progress.v1',
} as const;

export const defaultSettings: Settings = {
  showTimer: true,
  pathColor: 'cyan',
  wallColor: 'snow',
};

function read<T extends object>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) } as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode, quota) — the app still works, it just
    // won't remember settings or unlocked levels between visits.
  }
}

export function loadSettings(): Settings {
  return read<Settings>(KEYS.settings, defaultSettings);
}

export function saveSettings(settings: Settings) {
  write(KEYS.settings, settings);
}

export function loadProgress(): Progress {
  return read<Progress>(KEYS.progress, {});
}

export function saveProgress(progress: Progress) {
  write(KEYS.progress, progress);
}
