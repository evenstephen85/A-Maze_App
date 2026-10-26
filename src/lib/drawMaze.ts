import { BOARD_BG } from './colors';
import { E, N, S, W, type Maze } from './maze';

export interface MazeColors {
  wall: string;
  path: string;
}

/** Wall thickness for a given cell size; the board pads by half of this. */
export function wallWidth(cell: number): number {
  return Math.min(6, Math.max(2, Math.round(cell * 0.12)));
}

/** Draws in board coordinates: (0,0) is the top-left corner of the first cell. */
export function drawMaze(
  ctx: CanvasRenderingContext2D,
  maze: Maze,
  cell: number,
  colors: MazeColors,
  path: readonly number[],
) {
  const { cols, rows, walls } = maze;
  const centre = (i: number): [number, number] => [
    ((i % cols) + 0.5) * cell,
    (Math.floor(i / cols) + 0.5) * cell,
  ];

  ctx.fillStyle = BOARD_BG;
  ctx.fillRect(0, 0, cols * cell, rows * cell);

  // Goal: a tinted square with an outline.
  const ex = (maze.end % cols) * cell;
  const ey = Math.floor(maze.end / cols) * cell;
  const inset = cell * 0.2;
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = colors.path;
  ctx.fillRect(ex + inset, ey + inset, cell - inset * 2, cell - inset * 2);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = colors.path;
  ctx.lineWidth = Math.max(1.5, cell * 0.08);
  ctx.strokeRect(ex + inset, ey + inset, cell - inset * 2, cell - inset * 2);

  // The drawn path.
  if (path.length > 1) {
    ctx.strokeStyle = colors.path;
    ctx.lineWidth = cell * 0.42;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    const [sx, sy] = centre(path[0]);
    ctx.moveTo(sx, sy);
    for (let i = 1; i < path.length; i++) {
      const [px, py] = centre(path[i]);
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  // Start dot, with a halo until the player sets off.
  const [sx, sy] = centre(maze.start);
  if (path.length <= 1) {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = colors.path;
    ctx.beginPath();
    ctx.arc(sx, sy, cell * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = colors.path;
  ctx.beginPath();
  ctx.arc(sx, sy, cell * 0.28, 0, Math.PI * 2);
  ctx.fill();

  // Head of the path: where to keep drawing from.
  if (path.length > 1) {
    const [hx, hy] = centre(path[path.length - 1]);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(hx, hy, cell * 0.12, 0, Math.PI * 2);
    ctx.fill();
  }

  // Walls last, so the path reads as running inside the corridors.
  ctx.strokeStyle = colors.wall;
  ctx.lineWidth = wallWidth(cell);
  ctx.lineCap = 'square';
  ctx.beginPath();
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const w = walls[y * cols + x];
      const px = x * cell;
      const py = y * cell;
      if (w & N) {
        ctx.moveTo(px, py);
        ctx.lineTo(px + cell, py);
      }
      if (w & W) {
        ctx.moveTo(px, py);
        ctx.lineTo(px, py + cell);
      }
      if (x === cols - 1 && w & E) {
        ctx.moveTo(px + cell, py);
        ctx.lineTo(px + cell, py + cell);
      }
      if (y === rows - 1 && w & S) {
        ctx.moveTo(px, py + cell);
        ctx.lineTo(px + cell, py + cell);
      }
    }
  }
  ctx.stroke();
}
