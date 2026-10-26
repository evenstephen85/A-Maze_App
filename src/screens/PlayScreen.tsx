import { useEffect, useMemo, useRef, useState } from 'react';
import MazeBoard from '../components/MazeBoard';
import Stars from '../components/Stars';
import { BackIcon, EraseIcon, RefreshIcon } from '../components/icons';
import { DIFFICULTIES } from '../data/difficulties';
import { PATH_COLORS, WALL_COLORS, swatchValue } from '../lib/colors';
import { generateMaze } from '../lib/maze';
import { formatSeconds, formatTime, starsFor } from '../lib/scoring';
import type { DifficultyId, Progress, Settings } from '../types';

interface Props {
  difficultyId: DifficultyId;
  settings: Settings;
  progress: Progress;
  onComplete: (id: DifficultyId, timeMs: number, stars: number) => void;
  onPlay: (id: DifficultyId) => void;
  onLevels: () => void;
}

interface Result {
  timeMs: number;
  stars: number;
  newBest: boolean;
  unlocked: boolean;
}

export default function PlayScreen({
  difficultyId,
  settings,
  progress,
  onComplete,
  onPlay,
  onLevels,
}: Props) {
  const index = DIFFICULTIES.findIndex((d) => d.id === difficultyId);
  const difficulty = DIFFICULTIES[index];
  const next = DIFFICULTIES[index + 1];

  const [maze, setMaze] = useState(() => generateMaze(difficulty.cols, difficulty.rows));
  const [resetSignal, setResetSignal] = useState(0);
  const startRef = useRef<number | null>(null);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  const colors = useMemo(
    () => ({
      path: swatchValue(PATH_COLORS, settings.pathColor),
      wall: swatchValue(WALL_COLORS, settings.wallColor),
    }),
    [settings.pathColor, settings.wallColor],
  );

  // The clock starts on the first step, not when the maze appears, so
  // reading the maze before setting off is free.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      if (startRef.current !== null) setElapsed(performance.now() - startRef.current);
    }, 100);
    return () => window.clearInterval(id);
  }, [running]);

  const handleFirstMove = () => {
    if (startRef.current !== null) return;
    startRef.current = performance.now();
    setRunning(true);
  };

  const handleSolved = () => {
    const timeMs = performance.now() - (startRef.current ?? performance.now());
    const stars = starsFor(difficulty, timeMs);
    const before = progress[difficulty.id];
    setRunning(false);
    setElapsed(timeMs);
    setResult({
      timeMs,
      stars,
      newBest: before?.bestTimeMs != null && timeMs < before.bestTimeMs,
      unlocked: !!next && !before?.completed,
    });
    onComplete(difficulty.id, timeMs, stars);
  };

  const newMaze = () => {
    setMaze(generateMaze(difficulty.cols, difficulty.rows));
    startRef.current = null;
    setRunning(false);
    setElapsed(0);
    setResult(null);
  };

  const nextTarget =
    result && result.stars < 3
      ? result.stars === 1
        ? `Beat ${formatSeconds(difficulty.twoStarSec)} for 2 stars, ${formatSeconds(difficulty.threeStarSec)} for 3`
        : `Beat ${formatSeconds(difficulty.threeStarSec)} for 3 stars`
      : null;

  return (
    <main className="screen play">
      <header className="topbar">
        <button type="button" className="icon-btn" onClick={onLevels} aria-label="Back to levels">
          <BackIcon />
        </button>
        <h2>{difficulty.name}</h2>
        <span className="timer" aria-live="off">
          {settings.showTimer ? formatTime(elapsed) : ''}
        </span>
      </header>

      <p className="hint muted">
        {running || result
          ? `3 stars under ${formatSeconds(difficulty.threeStarSec)}`
          : 'Drag from the dot to the square'}
      </p>

      <MazeBoard
        maze={maze}
        colors={colors}
        interactive={!result}
        resetSignal={resetSignal}
        onFirstMove={handleFirstMove}
        onSolved={handleSolved}
      />

      <footer className="play-actions">
        <button type="button" className="btn" onClick={() => setResetSignal((s) => s + 1)} disabled={!!result}>
          <EraseIcon size={18} /> Clear path
        </button>
        <button type="button" className="btn" onClick={newMaze}>
          <RefreshIcon size={18} /> New maze
        </button>
      </footer>

      {result && (
        <div className="overlay" role="dialog" aria-modal="true" aria-label="Maze solved">
          <div className="result-card">
            <h2>Solved!</h2>
            <Stars count={result.stars} size={44} animate />
            <p className="result-time">{formatTime(result.timeMs)}</p>
            {result.newBest && <p className="badge">New best time</p>}
            {result.unlocked && <p className="badge">{next.name} unlocked</p>}
            {nextTarget && <p className="muted small">{nextTarget}</p>}
            <div className="result-actions">
              {next && (
                <button type="button" className="btn primary" onClick={() => onPlay(next.id)}>
                  Next: {next.name}
                </button>
              )}
              <button type="button" className={next ? 'btn' : 'btn primary'} onClick={newMaze}>
                Play again
              </button>
              <button type="button" className="btn ghost" onClick={onLevels}>
                Levels
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
