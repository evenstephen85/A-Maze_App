export type DifficultyId = 'easy' | 'medium' | 'hard' | 'expert' | 'master';

export interface Difficulty {
  id: DifficultyId;
  name: string;
  cols: number;
  rows: number;
  /** Solve at or under this many seconds for three stars. */
  threeStarSec: number;
  /** Solve at or under this many seconds for two stars; anything slower is one. */
  twoStarSec: number;
}

export interface Settings {
  showTimer: boolean;
  pathColor: string;
  wallColor: string;
}

export interface LevelRecord {
  completed: boolean;
  bestStars: number;
  bestTimeMs: number | null;
}

export type Progress = Partial<Record<DifficultyId, LevelRecord>>;
