import { useEffect } from 'react'
import { hideNativeStatusBar } from './lib/nativeChrome'

export default function App() {
  useEffect(() => {
    hideNativeStatusBar()
  }, [])

  return (
    <main className="app-shell">
      <h1>A-Maze</h1>
      <p>Builds mazes for you. Coming soon.</p>
    </main>
  )
}
