import Stars from '../components/Stars';
import { BackIcon, GearIcon, LockIcon } from '../components/icons';
import { DIFFICULTIES, isUnlocked } from '../data/difficulties';
import { formatTime } from '../lib/scoring';
import type { DifficultyId, Progress } from '../types';

interface Props {
  progress: Progress;
  onPick: (id: DifficultyId) => void;
  onBack: () => void;
  onSettings: () => void;
}

export default function LevelSelectScreen({ progress, onPick, onBack, onSettings }: Props) {
  return (
    <main className="screen">
      <header className="topbar">
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Back">
          <BackIcon />
        </button>
        <h2>Choose difficulty</h2>
        <button type="button" className="icon-btn" onClick={onSettings} aria-label="Settings">
          <GearIcon />
        </button>
      </header>

      <ul className="level-list">
        {DIFFICULTIES.map((d, i) => {
          const unlocked = isUnlocked(progress, i);
          const record = progress[d.id];
          return (
            <li key={d.id}>
              <button
                type="button"
                className={unlocked ? 'level-card' : 'level-card locked'}
                disabled={!unlocked}
                onClick={() => onPick(d.id)}
              >
                <span className="level-main">
                  <span className="level-name">{d.name}</span>
                  <span className="level-meta">
                    {unlocked
                      ? `${d.cols} × ${d.rows}${record?.bestTimeMs != null ? ` · best ${formatTime(record.bestTimeMs)}` : ''}`
                      : `Finish ${DIFFICULTIES[i - 1].name} to unlock`}
                  </span>
                </span>
                {unlocked ? <Stars count={record?.bestStars ?? 0} /> : <LockIcon size={22} />}
              </button>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
