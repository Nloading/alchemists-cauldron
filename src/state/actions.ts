import { DIFFICULTY_SETTINGS } from '../data/difficulty';
import { INGREDIENTS } from '../data/ingredients';
import { RECIPES } from '../data/recipes';
import { addIngredient } from '../logic/add-ingredient';
import { isBrewSuccessful } from '../logic/brew-check';
import {
  calculateWithReactions,
  findFiredReactions,
  getActiveReactions,
  summarizeEffects,
} from '../logic/reactions';
import { getGameOverReason } from '../logic/game-over';
import { pickRecipe } from '../logic/recipe-generator';
import { addTimeBonus, computeTimeLeft } from '../logic/timer';
import type { Difficulty } from '../types';
import {
  createMenuState,
  createNewGameState,
  getState,
  setState,
  type IGameState,
} from './game-state';

function applyOutcome(next: IGameState): IGameState {
  const reason = getGameOverReason({
    lives: next.lives,
    timeLeft: next.timeLeft,
    shelfStock: next.shelfStock,
    cauldronCount: next.cauldronIngredients.length,
  });

  if (reason === null) {
    return next;
  }

  return { ...next, status: 'game-over', endTime: null, gameOverReason: reason };
}

export function selectDifficulty(difficulty: Difficulty): void {
  const current = getState();

  if (current.status !== 'menu') {
    return;
  }

  setState({ ...current, difficulty, activeRecipe: pickRecipe(RECIPES, difficulty) });
}

export function startGame(): void {
  setState(createNewGameState(getState().difficulty));
}

export function addIngredientToCauldron(id: string): void {
  const current = getState();

  if (current.status !== 'playing' || current.endTime === null) {
    return;
  }

  const ingredient = INGREDIENTS.find((item) => item.id === id);

  if (!ingredient) {
    return;
  }

  const result = addIngredient(
    ingredient,
    current.cauldronIngredients,
    current.shelfStock,
    DIFFICULTY_SETTINGS[current.difficulty].maxCauldronIngredients,
  );

  if (!result) {
    return;
  }

  const now = Date.now();
  const fired = findFiredReactions(
    getActiveReactions(current.difficulty),
    current.cauldronIngredients,
    result.cauldronIngredients,
  );
  const effects = summarizeEffects(fired);
  const timeLeft = Math.max(0, computeTimeLeft(current.endTime, now) - effects.timePenaltyMs);

  setState(
    applyOutcome({
      ...current,
      ...result,
      cauldronIngredients: effects.clearsCauldron ? [] : result.cauldronIngredients,
      lives: Math.max(0, current.lives - effects.lifeLoss),
      timeLeft,
      endTime: now + timeLeft,
      lastBrew: null,
      lastReactionId: fired[0]?.id ?? null,
    }),
  );
}

export function brew(): void {
  const current = getState();

  if (
    current.status !== 'playing' ||
    current.endTime === null ||
    current.cauldronIngredients.length === 0
  ) {
    return;
  }

  const settings = DIFFICULTY_SETTINGS[current.difficulty];
  const now = Date.now();
  const values = calculateWithReactions(
    current.cauldronIngredients,
    getActiveReactions(current.difficulty),
  );
  const success = isBrewSuccessful(values, current.activeRecipe, settings.tolerance);

  if (success) {
    const timeLeft = addTimeBonus(
      computeTimeLeft(current.endTime, now),
      settings.timeBonusMs,
      settings.startTimeMs,
    );
    setState(
      applyOutcome({
        ...current,
        cauldronIngredients: [],
        score: current.score + settings.scorePerBrew,
        activeRecipe: pickRecipe(RECIPES, current.difficulty),
        lastBrew: 'success',
        timeLeft,
        endTime: now + timeLeft,
        lastReactionId: null,
      }),
    );
    return;
  }

  setState(
    applyOutcome({
      ...current,
      cauldronIngredients: [],
      lives: Math.max(0, current.lives - 1),
      lastBrew: 'failure',
      lastReactionId: null,
      timeLeft: computeTimeLeft(current.endTime, now),
    }),
  );
}

export function tick(): void {
  const current = getState();

  if (current.status !== 'playing' || current.endTime === null) {
    return;
  }

  const timeLeft = computeTimeLeft(current.endTime, Date.now());
  const sameSecond = Math.ceil(timeLeft / 1000) === Math.ceil(current.timeLeft / 1000);

  if (timeLeft > 0 && sameSecond) {
    return;
  }

  setState(applyOutcome({ ...current, timeLeft }));
}

export function pauseGame(): void {
  const current = getState();

  if (current.status !== 'playing' || current.endTime === null) {
    return;
  }

  setState(
    applyOutcome({
      ...current,
      status: 'paused',
      timeLeft: computeTimeLeft(current.endTime, Date.now()),
      endTime: null,
    }),
  );
}

export function resumeGame(): void {
  const current = getState();

  if (current.status !== 'paused') {
    return;
  }

  setState({ ...current, status: 'playing', endTime: Date.now() + current.timeLeft });
}

export function exitToMenu(): void {
  setState(createMenuState(getState().difficulty));
}

export function restoreGame(restored: IGameState): void {
  if (getState().status !== 'menu') {
    return;
  }

  setState(restored);
}
