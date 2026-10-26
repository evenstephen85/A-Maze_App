import { useMemo } from 'react';
import MazeBoard from '../components/MazeBoard';
import Switch from '../components/Switch';
import { BackIcon } from '../components/icons';
import { DIFFICULTIES, currentLevelIndex } from '../data/difficulties';
import { PATH_COLORS, WALL_COLORS, swatchValue, type Swatch } from '../lib/colors';
import { generateMaze, solveMaze } from '../lib/maze';
import type { Progress, Settings } from '../types';

interface Props {
  settings: Settings;
  progress: Progress;
  onChange: (settings: Settings) => void;
  onResetProgress: () => void;
  onBack: () => void;
}

function SwatchRow({
  label,
  swatches,
  selected,
  onSelect,
}: {
  label: string;
  swatches: Swatch[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="setting-block">
      <span className="setting-label">{label}</span>
      <div className="swatches" role="radiogroup" aria-label={label}>
        {swatches.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={s.id === selected}
            aria-label={s.name}
            className={s.id === selected ? 'swatch selected' : 'swatch'}
            style={{ background: s.value }}
            onClick={() => onSelect(s.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default function SettingsScreen({ settings, progress, onChange, onResetProgress, onBack }: Props) {
  const level = DIFFICULTIES[currentLevelIndex(progress)];

  // One preview maze per visit, at the size of the level you'd play next,
  // with the route part-drawn so the path colour shows too.
  const preview = useMemo(() => {
    const maze = generateMaze(level.cols, level.rows);
    const route = solveMaze(maze);
    return { maze, path: route.slice(0, Math.ceil(route.length * 0.6)) };
  }, [level]);

  const colors = useMemo(
    () => ({
      path: swatchValue(PATH_COLORS, settings.pathColor),
      wall: swatchValue(WALL_COLORS, settings.wallColor),
    }),
    [settings.pathColor, settings.wallColor],
  );

  const resetProgress = () => {
    if (window.confirm('Reset all stars and lock every level except Easy?')) onResetProgress();
  };

  return (
    <main className="screen settings">
      <header className="topbar">
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Back">
          <BackIcon />
        </button>
        <h2>Settings</h2>
        <span className="icon-btn-spacer" />
      </header>

      <div className="settings-body">
        <div className="setting-row">
          <span className="setting-label">Show timer</span>
          <Switch
            label="Show timer"
            checked={settings.showTimer}
            onChange={(showTimer) => onChange({ ...settings, showTimer })}
          />
        </div>

        <SwatchRow
          label="Path color"
          swatches={PATH_COLORS}
          selected={settings.pathColor}
          onSelect={(pathColor) => onChange({ ...settings, pathColor })}
        />
        <SwatchRow
          label="Maze color"
          swatches={WALL_COLORS}
          selected={settings.wallColor}
          onSelect={(wallColor) => onChange({ ...settings, wallColor })}
        />

        <div className="setting-block">
          <span className="setting-label">
            Preview <span className="muted">· {level.name}, your current level</span>
          </span>
          <div className="preview">
            <MazeBoard maze={preview.maze} colors={colors} initialPath={preview.path} />
          </div>
        </div>

        <button type="button" className="btn danger" onClick={resetProgress}>
          Reset progress
        </button>
      </div>
    </main>
  );
}
