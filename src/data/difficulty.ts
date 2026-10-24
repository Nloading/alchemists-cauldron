import type { Difficulty } from '../types';

export interface IDifficultySettings {
  label: string;
  shelfSize: number;
  maxCauldronIngredients: number;
  startTimeMs: number;
  tolerance: number;
  lives: number;
  scorePerBrew: number;
  timeBonusMs: number;
  reactionCount: number;
}

export const DEFAULT_DIFFICULTY: Difficulty = 'medium';
export const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard'];

export const DIFFICULTY_SETTINGS: Readonly<Record<Difficulty, IDifficultySettings>> = {
  easy: {
    label: 'Easy',
    shelfSize: 4,
    maxCauldronIngredients: 4,
    startTimeMs: 180_000,
    tolerance: 12,
    lives: 5,
    scorePerBrew: 100,
    timeBonusMs: 15_000,
    reactionCount: 0,
  },
  medium: {
    label: 'Medium',
    shelfSize: 6,
    maxCauldronIngredients: 4,
    startTimeMs: 150_000,
    tolerance: 8,
    lives: 3,
    scorePerBrew: 200,
    timeBonusMs: 10_000,
    reactionCount: 2,
  },
  hard: {
    label: 'Hard',
    shelfSize: 8,
    maxCauldronIngredients: 5,
    startTimeMs: 150_000,
    tolerance: 5,
    lives: 3,
    scorePerBrew: 300,
    timeBonusMs: 5_000,
    reactionCount: 3,
  },
};
