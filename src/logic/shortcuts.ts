import type { GameStatus } from '../types';

export type ShortcutAction =
  | { type: 'add'; index: number }
  | { type: 'brew' }
  | { type: 'pour-out' }
  | { type: 'toggle-pause' };

const DIGIT_CODE = /^(?:Digit|Numpad)([1-8])$/;

export function resolveShortcut(
  code: string,
  status: GameStatus,
  shelfSize: number,
): ShortcutAction | null {
  if (status !== 'playing' && status !== 'paused') {
    return null;
  }
  if (code === 'KeyP' || code === 'Escape') {
    return { type: 'toggle-pause' };
  }
  if (status !== 'playing') {
    return null;
  }
  if (code === 'KeyB') {
    return { type: 'brew' };
  }
  if (code === 'KeyO') {
    return { type: 'pour-out' };
  }

  const digit = DIGIT_CODE.exec(code)?.[1];

  if (digit === undefined) {
    return null;
  }

  const index = Number(digit) - 1;
  return index < shelfSize ? { type: 'add', index } : null;
}
