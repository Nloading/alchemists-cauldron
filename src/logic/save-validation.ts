import { DIFFICULTIES, DIFFICULTY_SETTINGS } from '../data/difficulty';
import { getShelfIngredients } from '../data/ingredients';
import { RECIPES } from '../data/recipes';
import type { Difficulty, ISaveData } from '../types';
import { getRecipesByDifficulty } from './recipe-generator';
import { MAX_STOCK } from './stock';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isDifficulty(value: unknown): value is Difficulty {
  return DIFFICULTIES.some((difficulty) => difficulty === value);
}

function isIntegerBetween(value: unknown, min: number, max: number): boolean {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}

function hasIdIn(value: unknown, ids: readonly string[]): boolean {
  if (!isRecord(value)) {
    return false;
  }
  const id = value.id;
  return typeof id === 'string' && ids.includes(id);
}

export function isValidSave(data: unknown): data is ISaveData {
  if (!isRecord(data)) {
    return false;
  }

  const {
    difficulty,
    score,
    timeLeft,
    lives,
    activeRecipe,
    cauldronIngredients,
    shelfStock,
    status,
  } = data;

  if (!isDifficulty(difficulty)) {
    return false;
  }

  const settings = DIFFICULTY_SETTINGS[difficulty];
  const shelfIds = getShelfIngredients(settings.shelfSize).map((item) => item.id);
  const recipeIds = getRecipesByDifficulty(RECIPES, difficulty).map((recipe) => recipe.id);

  if (status !== 'playing' && status !== 'paused') {
    return false;
  }
  if (!isIntegerBetween(score, 0, Number.MAX_SAFE_INTEGER)) {
    return false;
  }
  if (!isIntegerBetween(lives, 1, settings.lives)) {
    return false;
  }
  if (
    typeof timeLeft !== 'number' ||
    !Number.isFinite(timeLeft) ||
    timeLeft <= 0 ||
    timeLeft > settings.startTimeMs
  ) {
    return false;
  }
  if (!hasIdIn(activeRecipe, recipeIds)) {
    return false;
  }
  if (!Array.isArray(cauldronIngredients)) {
    return false;
  }

  const cauldron: unknown[] = cauldronIngredients;

  if (
    cauldron.length > settings.maxCauldronIngredients ||
    !cauldron.every((item) => hasIdIn(item, shelfIds))
  ) {
    return false;
  }
  if (!isRecord(shelfStock) || Object.keys(shelfStock).length !== shelfIds.length) {
    return false;
  }

  return shelfIds.every((id) => isIntegerBetween(shelfStock[id], 0, MAX_STOCK));
}
