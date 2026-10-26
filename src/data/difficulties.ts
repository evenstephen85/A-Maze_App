import type { Difficulty, Progress } from '../types';

/** Ordered easiest first — each one unlocks when the one before it is solved. */
export const DIFFICULTIES: Difficulty[] = [
  { id: 'easy', name: 'Easy', cols: 6, rows: 8, threeStarSec: 15, twoStarSec: 30 },
  { id: 'medium', name: 'Medium', cols: 9, rows: 12, threeStarSec: 30, twoStarSec: 60 },
  { id: 'hard', name: 'Hard', cols: 12, rows: 16, threeStarSec: 50, twoStarSec: 100 },
  { id: 'expert', name: 'Expert', cols: 15, rows: 20, threeStarSec: 80, twoStarSec: 160 },
  { id: 'master', name: 'Master', cols: 18, rows: 24, threeStarSec: 120, twoStarSec: 240 },
];

export function isUnlocked(progress: Progress, index: number): boolean {
  if (index === 0) return true;
  return progress[DIFFICULTIES[index - 1].id]?.completed ?? false;
}

/** The hardest difficulty the player can currently pick. */
export function currentLevelIndex(progress: Progress): number {
  let index = 0;
  while (index + 1 < DIFFICULTIES.length && isUnlocked(progress, index + 1)) index++;
  return index;
}
