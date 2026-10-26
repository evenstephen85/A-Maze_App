import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { drawMaze, type MazeColors } from '../lib/drawMaze';
import { isOpen, type Maze } from '../lib/maze';

/** Room around the board so the outer walls aren't clipped (walls are ≤ 6px). */
const PAD = 4;

interface Props {
  maze: Maze;
  colors: MazeColors;
  /** Draw-your-path input. Off for the settings preview. */
  interactive?: boolean;
  /** A fixed path to show (the preview); interactive boards start at the start cell. */
  initialPath?: readonly number[];
  /** Bump to wipe the drawn path back to the start. */
  resetSignal?: number;
  onFirstMove?: () => void;
  onSolved?: () => void;
}

/**
 * The maze, fitted to whatever space its parent gives it. The path lives in a
 * ref and is painted straight to the canvas, so dragging never re-renders React.
 *
 * Input rules: press on the path (or a cell open to its head) to pick it up,
 * drag through open corridors to extend it, drag back over it to rub it out.
 * Lifting a finger keeps the path, so you can carry on from anywhere along it.
 */
export default function MazeBoard({
  maze,
  colors,
  interactive = false,
  initialPath,
  resetSignal = 0,
  onFirstMove,
  onSolved,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const pathRef = useRef<number[]>([maze.start]);
  const solvedRef = useRef(false);
  const pointerRef = useRef<number | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const callbacks = useRef({ onFirstMove, onSolved });
  callbacks.current = { onFirstMove, onSolved };

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setBox({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cell = box.w
    ? Math.max(4, Math.floor(Math.min((box.w - PAD * 2) / maze.cols, (box.h - PAD * 2) / maze.rows)))
    : 0;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !cell) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(PAD, PAD);
    drawMaze(ctx, maze, cell, colors, pathRef.current);
  }, [maze, cell, colors]);

  // New maze or reset: back to just the start cell (or the preview's path).
  useEffect(() => {
    pathRef.current = initialPath ? [...initialPath] : [maze.start];
    solvedRef.current = false;
    pointerRef.current = null;
    draw();
    // draw is deliberately left out: a resize or colour change must not wipe the path.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maze, resetSignal, initialPath]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !cell) return;
    const dpr = window.devicePixelRatio || 1;
    const w = maze.cols * cell + PAD * 2;
    const h = maze.rows * cell + PAD * 2;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    draw();
  }, [cell, maze, draw]);

  const cellAt = (clientX: number, clientY: number): number => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const cx = Math.floor((clientX - rect.left - PAD) / cell);
    const cy = Math.floor((clientY - rect.top - PAD) / cell);
    if (cx < 0 || cy < 0 || cx >= maze.cols || cy >= maze.rows) return -1;
    return cy * maze.cols + cx;
  };

  /** Moves the path's head into cell c if the rules allow it. */
  const visit = (c: number) => {
    const path = pathRef.current;
    const head = path[path.length - 1];
    if (c < 0 || c === head) return;
    const back = path.indexOf(c);
    if (back >= 0) {
      path.length = back + 1;
      return;
    }
    if (!isOpen(maze, head, c)) return;
    path.push(c);
    if (path.length === 2) callbacks.current.onFirstMove?.();
    if (c === maze.end) {
      solvedRef.current = true;
      pointerRef.current = null;
      callbacks.current.onSolved?.();
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive || solvedRef.current || pointerRef.current !== null || !cell) return;
    const c = cellAt(e.clientX, e.clientY);
    if (c < 0) return;
    const path = pathRef.current;
    if (!path.includes(c) && !isOpen(maze, path[path.length - 1], c)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerRef.current = e.pointerId;
    lastPointRef.current = { x: e.clientX, y: e.clientY };
    visit(c);
    draw();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerId !== pointerRef.current || !lastPointRef.current) return;
    // A fast swipe can skip whole cells between events, so walk the segment
    // in quarter-cell steps rather than only looking at where it ended.
    const from = lastPointRef.current;
    const dx = e.clientX - from.x;
    const dy = e.clientY - from.y;
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / (cell / 4)));
    for (let i = 1; i <= steps && !solvedRef.current; i++) {
      visit(cellAt(from.x + (dx * i) / steps, from.y + (dy * i) / steps));
    }
    lastPointRef.current = { x: e.clientX, y: e.clientY };
    draw();
  };

  const onPointerEnd = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerId === pointerRef.current) pointerRef.current = null;
  };

  return (
    <div className="maze-board" ref={wrapRef}>
      <canvas
        ref={canvasRef}
        className={interactive ? 'maze-canvas interactive' : 'maze-canvas'}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        aria-label={interactive ? 'Maze. Drag from the dot to the goal square.' : 'Maze preview'}
        role="img"
      />
    </div>
  );
}
