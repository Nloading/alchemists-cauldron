import { isValidSave } from '../logic/save-validation';
import { createRestoredState, type IGameState } from '../state/game-state';
import type { ISaveData } from '../types';

const SAVE_KEY = 'alchemist-save';

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // Ignore storage errors.
  }
}

export function saveGame(state: Readonly<IGameState>): void {
  const status = state.status;

  if (status !== 'playing' && status !== 'paused') {
    return;
  }

  const data: ISaveData = {
    difficulty: state.difficulty,
    score: state.score,
    timeLeft: state.timeLeft,
    lives: state.lives,
    activeRecipe: state.activeRecipe,
    cauldronIngredients: state.cauldronIngredients,
    shelfStock: state.shelfStock,
    status,
  };

  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // Storage may be full or blocked; the game must keep working.
  }
}

export function loadGame(): IGameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);

    if (raw === null) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);

    if (isValidSave(parsed)) {
      const restored = createRestoredState(parsed);

      if (restored !== null) {
        return restored;
      }
    }
  } catch {
    // Broken JSON falls through to the cleanup below.
  }

  clearSave();
  return null;
}