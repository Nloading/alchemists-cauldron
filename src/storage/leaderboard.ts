import { compareEntries, insertEntry, LEADERBOARD_SIZE } from '../logic/leaderboard';
import type { Difficulty, ILeaderboardEntry } from '../types';

const KEY_PREFIX = 'alchemist-leaderboard-';

function storageKey(difficulty: Difficulty): string {
  return KEY_PREFIX + difficulty;
}

function isEntry(value: unknown, difficulty: Difficulty): value is ILeaderboardEntry {
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
    Number.isFinite(record.timestamp) &&
    record.difficulty === difficulty
  );
}

export function loadLeaderboard(difficulty: Difficulty): ILeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(storageKey(difficulty));

    if (raw === null) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const items: unknown[] = parsed;
    return items
      .filter((item): item is ILeaderboardEntry => isEntry(item, difficulty))
      .sort(compareEntries)
      .slice(0, LEADERBOARD_SIZE);
  } catch {
    return [];
  }
}

export function saveLeaderboard(
  difficulty: Difficulty,
  entries: readonly ILeaderboardEntry[],
): void {
  try {
    localStorage.setItem(storageKey(difficulty), JSON.stringify(entries));
  } catch {
    // Storage may be full or blocked; the game must keep working.
  }
}

export function clearLeaderboard(difficulty: Difficulty): void {
  try {
    localStorage.removeItem(storageKey(difficulty));
  } catch {
    // Ignore storage errors.
  }
}

export function submitEntry(
  difficulty: Difficulty,
  name: string,
  score: number,
  timestamp: number,
): void {
  saveLeaderboard(
    difficulty,
    insertEntry(loadLeaderboard(difficulty), { name, score, timestamp, difficulty }),
  );
}
