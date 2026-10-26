import { useEffect, useState } from 'react'
import { hideNativeStatusBar } from './lib/nativeChrome'
import { loadProgress, loadSettings, saveProgress, saveSettings } from './lib/storage'
import LandingScreen from './screens/LandingScreen'
import LevelSelectScreen from './screens/LevelSelectScreen'
import PlayScreen from './screens/PlayScreen'
import SettingsScreen from './screens/SettingsScreen'
import type { DifficultyId, Progress, Settings } from './types'

type Screen =
  | { name: 'landing' }
  | { name: 'levels' }
  | { name: 'play'; difficultyId: DifficultyId }
  | { name: 'settings'; back: 'landing' | 'levels' }

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'landing' })
  const [settings, setSettings] = useState<Settings>(loadSettings)
  const [progress, setProgress] = useState<Progress>(loadProgress)

  useEffect(() => {
    hideNativeStatusBar()
  }, [])

  const updateSettings = (next: Settings) => {
    setSettings(next)
    saveSettings(next)
  }

  const updateProgress = (next: Progress) => {
    setProgress(next)
    saveProgress(next)
  }

  const recordSolve = (id: DifficultyId, timeMs: number, stars: number) => {
    const before = progress[id]
    updateProgress({
      ...progress,
      [id]: {
        completed: true,
        bestStars: Math.max(stars, before?.bestStars ?? 0),
        bestTimeMs: before?.bestTimeMs != null ? Math.min(timeMs, before.bestTimeMs) : timeMs,
      },
    })
  }

  switch (screen.name) {
    case 'landing':
      return (
        <LandingScreen
          progress={progress}
          onPlay={() => setScreen({ name: 'levels' })}
          onSettings={() => setScreen({ name: 'settings', back: 'landing' })}
        />
      )
    case 'levels':
      return (
        <LevelSelectScreen
          progress={progress}
          onPick={(difficultyId) => setScreen({ name: 'play', difficultyId })}
          onBack={() => setScreen({ name: 'landing' })}
          onSettings={() => setScreen({ name: 'settings', back: 'levels' })}
        />
      )
    case 'play':
      return (
        <PlayScreen
          key={screen.difficultyId}
          difficultyId={screen.difficultyId}
          settings={settings}
          progress={progress}
          onComplete={recordSolve}
          onPlay={(difficultyId) => setScreen({ name: 'play', difficultyId })}
          onLevels={() => setScreen({ name: 'levels' })}
        />
      )
    case 'settings':
      return (
        <SettingsScreen
          settings={settings}
          progress={progress}
          onChange={updateSettings}
          onResetProgress={() => updateProgress({})}
          onBack={() => setScreen(screen.back === 'levels' ? { name: 'levels' } : { name: 'landing' })}
        />
      )
  }
}
