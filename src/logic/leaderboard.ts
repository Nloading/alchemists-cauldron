import type { ILeaderboardEntry } from '../types';

export const LEADERBOARD_SIZE = 10;
const NAME_MIN = 2;
const NAME_MAX = 15;
const NAME_PATTERN = /^[\p{L}\p{N} _-]+$/u;

export function getNameError(raw: string): string | null {
  const name = raw.trim();

  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    return 'Name must be 2–15 characters long.';
  }
  if (!NAME_PATTERN.test(name)) {
    return 'Use only letters, digits, space, _ and -.';
  }
  return null;
}

export function compareEntries(a: ILeaderboardEntry, b: ILeaderboardEntry): number {
  return b.score - a.score || a.timestamp - b.timestamp;
}

export function qualifiesForTop10(entries: readonly ILeaderboardEntry[], score: number): boolean {
  if (score <= 0) {
    return false;
  }
  if (entries.length < LEADERBOARD_SIZE) {
    return true;
  }
  const last = entries[entries.length - 1];
  return last === undefined || score > last.score;
}

export function insertEntry(
  entries: readonly ILeaderboardEntry[],
  entry: ILeaderboardEntry,
): ILeaderboardEntry[] {
  return [...entries, entry].sort(compareEntries).slice(0, LEADERBOARD_SIZE);
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const pad = (value: number): string => String(value).padStart(2, '0');

  return (
    pad(date.getDate()) +
    '.' +
    pad(date.getMonth() + 1) +
    '.' +
    String(date.getFullYear()) +
    ' ' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes())
  );
}
