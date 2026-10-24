import { DIFFICULTY_SETTINGS } from '../data/difficulty';
import { REACTIONS } from '../data/reactions';
import type { Difficulty, ICauldronValues, IIngredient, IReaction } from '../types';
import { calculateCauldron } from './calculate-cauldron';

export interface IEffectTotals {
  timePenaltyMs: number;
  lifeLoss: number;
  clearsCauldron: boolean;
}

export function getActiveReactions(difficulty: Difficulty): IReaction[] {
  const { reactionCount } = DIFFICULTY_SETTINGS[difficulty];

  return REACTIONS.filter((reaction) => reaction.difficulty === difficulty).slice(0, reactionCount);
}

export function calculateWithReactions(
  ingredients: readonly IIngredient[],
  reactions: readonly IReaction[],
): ICauldronValues {
  return reactions
    .filter((reaction) => reaction.isActive(ingredients))
    .reduce<ICauldronValues>(
      (values, reaction) => reaction.apply(values),
      calculateCauldron(ingredients),
    );
}

export function findFiredReactions(
  reactions: readonly IReaction[],
  before: readonly IIngredient[],
  after: readonly IIngredient[],
): IReaction[] {
  return reactions.filter((reaction) => !reaction.isActive(before) && reaction.isActive(after));
}

export function summarizeEffects(fired: readonly IReaction[]): IEffectTotals {
  return {
    timePenaltyMs: fired.reduce((sum, reaction) => sum + (reaction.timePenaltyMs ?? 0), 0),
    lifeLoss: fired.reduce((sum, reaction) => sum + (reaction.lifeLoss ?? 0), 0),
    clearsCauldron: fired.some((reaction) => reaction.clearsCauldron === true),
  };
}