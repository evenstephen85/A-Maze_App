export interface Swatch {
  id: string;
  name: string;
  value: string;
}

export const PATH_COLORS: Swatch[] = [
  { id: 'cyan', name: 'Cyan', value: '#00e5ff' },
  { id: 'pink', name: 'Pink', value: '#ff4d8d' },
  { id: 'lime', name: 'Lime', value: '#a3e635' },
  { id: 'orange', name: 'Orange', value: '#ff9f1c' },
  { id: 'purple', name: 'Purple', value: '#b388ff' },
  { id: 'gold', name: 'Gold', value: '#ffd60a' },
];

export const WALL_COLORS: Swatch[] = [
  { id: 'snow', name: 'Snow', value: '#e8e8ee' },
  { id: 'steel', name: 'Steel', value: '#7c8aa5' },
  { id: 'mint', name: 'Mint', value: '#5eead4' },
  { id: 'amber', name: 'Amber', value: '#fbbf24' },
  { id: 'rose', name: 'Rose', value: '#fb7185' },
  { id: 'violet', name: 'Violet', value: '#a78bfa' },
];

export const BOARD_BG = '#131316';

/** Stored ids, not hex, so a palette tweak never strands a saved setting. */
export function swatchValue(list: Swatch[], id: string): string {
  return (list.find((s) => s.id === id) ?? list[0]).value;
}
