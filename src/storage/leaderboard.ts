import { compareEntries, insertEntry, LEADERBOARD_SIZE } from '../logic/leaderboard';
import type { ILeaderboardEntry } from '../types';

const STORAGE_KEY = 'alchemist-leaderboard';

function isEntry(value: unknown): value is ILeaderboardEntry {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;

  return (
    typeof record.name === 'string' &&
    record.name.length > 0 &&
    record.name.length <= 15 &&
    typeof record.score === 'number' &&
    Number.isFinite(record.score) &&
    typeof record.timestamp === 'number' &&
    Number.isFinite(record.timestamp)
  );
}

export function loadLeaderboard(): ILeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw === null) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const items: unknown[] = parsed;
    return items.filter(isEntry).sort(compareEntries).slice(0, LEADERBOARD_SIZE);
  } catch {
    return [];
  }
}

export function saveLeaderboard(entries: readonly ILeaderboardEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage may be full or blocked; the game must keep working.
  }
}

export function clearLeaderboard(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
}

export function submitEntry(name: string, score: number, timestamp: number): void {
  saveLeaderboard(insertEntry(loadLeaderboard(), { name, score, timestamp }));
}
