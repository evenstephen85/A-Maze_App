/** Wall bits per cell. A set bit means that side is closed. */
export const N = 1;
export const E = 2;
export const S = 4;
export const W = 8;

const DIRS = [
  { bit: N, opp: S, dx: 0, dy: -1 },
  { bit: E, opp: W, dx: 1, dy: 0 },
  { bit: S, opp: N, dx: 0, dy: 1 },
  { bit: W, opp: E, dx: -1, dy: 0 },
] as const;

export interface Maze {
  cols: number;
  rows: number;
  walls: Uint8Array;
  start: number;
  end: number;
}

/**
 * Depth-first "recursive backtracker" carve (iterative, so big mazes can't
 * blow the stack). It makes long winding corridors with exactly one route
 * between any two cells, so there's always a single solution.
 */
export function generateMaze(cols: number, rows: number, random = Math.random): Maze {
  const walls = new Uint8Array(cols * rows).fill(N | E | S | W);
  const visited = new Uint8Array(cols * rows);
  const stack = [0];
  visited[0] = 1;

  while (stack.length) {
    const cur = stack[stack.length - 1];
    const x = cur % cols;
    const y = Math.floor(cur / cols);
    const options: { next: number; bit: number; opp: number }[] = [];
    for (const d of DIRS) {
      const nx = x + d.dx;
      const ny = y + d.dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      const next = ny * cols + nx;
      if (!visited[next]) options.push({ next, bit: d.bit, opp: d.opp });
    }
    if (!options.length) {
      stack.pop();
      continue;
    }
    const pick = options[Math.floor(random() * options.length)];
    walls[cur] &= ~pick.bit;
    walls[pick.next] &= ~pick.opp;
    visited[pick.next] = 1;
    stack.push(pick.next);
  }

  const end = cols * rows - 1;
  // Entrance and exit gaps in the outer wall — purely visual, moves are
  // bounds-checked so nothing can walk out through them.
  walls[0] &= ~N;
  walls[end] &= ~S;
  return { cols, rows, walls, start: 0, end };
}

/** True when b is a neighbour of a with no wall between them. */
export function isOpen(maze: Maze, a: number, b: number): boolean {
  const { cols, walls } = maze;
  const ax = a % cols;
  const ay = Math.floor(a / cols);
  const bx = b % cols;
  const by = Math.floor(b / cols);
  for (const d of DIRS) {
    if (ax + d.dx === bx && ay + d.dy === by) return (walls[a] & d.bit) === 0;
  }
  return false;
}

/** Shortest route from start to end (the only route, in a perfect maze). */
export function solveMaze(maze: Maze): number[] {
  const { cols, rows, walls, start, end } = maze;
  const prev = new Int32Array(cols * rows).fill(-1);
  prev[start] = start;
  const queue = [start];
  for (let head = 0; head < queue.length; head++) {
    const cur = queue[head];
    if (cur === end) break;
    const x = cur % cols;
    const y = Math.floor(cur / cols);
    for (const d of DIRS) {
      if (walls[cur] & d.bit) continue;
      const nx = x + d.dx;
      const ny = y + d.dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      const next = ny * cols + nx;
      if (prev[next] !== -1) continue;
      prev[next] = cur;
      queue.push(next);
    }
  }
  const route = [end];
  while (route[route.length - 1] !== start) route.push(prev[route[route.length - 1]]);
  return route.reverse();
}
