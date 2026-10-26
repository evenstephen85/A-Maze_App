import { LogoMark, GearIcon, StarIcon } from '../components/icons';
import { DIFFICULTIES, currentLevelIndex } from '../data/difficulties';
import type { Progress } from '../types';

interface Props {
  progress: Progress;
  onPlay: () => void;
  onSettings: () => void;
}

export default function LandingScreen({ progress, onPlay, onSettings }: Props) {
  const level = DIFFICULTIES[currentLevelIndex(progress)];
  const totalStars = DIFFICULTIES.reduce((sum, d) => sum + (progress[d.id]?.bestStars ?? 0), 0);

  return (
    <main className="screen landing">
      <div className="landing-hero">
        <LogoMark size={112} />
        <h1>A-Maze</h1>
        <p className="muted">A fresh maze every time. Draw your way out.</p>
      </div>

      <div className="landing-stats">
        <div>
          <span className="stat-label">Current level</span>
          <span className="stat-value">{level.name}</span>
        </div>
        <div>
          <span className="stat-label">Stars</span>
          <span className="stat-value">
            <span className="star on">
              <StarIcon size={18} filled />
            </span>
            {totalStars} / {DIFFICULTIES.length * 3}
          </span>
        </div>
      </div>

      <div className="landing-actions">
        <button type="button" className="btn primary big" onClick={onPlay}>
          Play
        </button>
        <button type="button" className="btn" onClick={onSettings}>
          <GearIcon size={20} /> Settings
        </button>
      </div>
    </main>
  );
}
