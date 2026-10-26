import type { Difficulty } from '../types';

export function starsFor(difficulty: Difficulty, timeMs: number): number {
  const sec = timeMs / 1000;
  if (sec <= difficulty.threeStarSec) return 3;
  if (sec <= difficulty.twoStarSec) return 2;
  return 1;
}

/** m:ss.t — e.g. 0:07.4, 2:15.0 */
export function formatTime(ms: number): string {
  const tenths = Math.floor(ms / 100);
  const minutes = Math.floor(tenths / 600);
  const seconds = Math.floor((tenths % 600) / 10);
  return `${minutes}:${String(seconds).padStart(2, '0')}.${tenths % 10}`;
}

/** m:ss for whole-second thresholds. */
export function formatSeconds(sec: number): string {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}
