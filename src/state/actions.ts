import { LEVEL_1_SETTINGS } from '../data/difficulty';
import { INGREDIENTS } from '../data/ingredients';
import { RECIPES } from '../data/recipes';
import { addIngredient } from '../logic/add-ingredient';
import { isBrewSuccessful } from '../logic/brew-check';
import { calculateCauldron } from '../logic/calculate-cauldron';
import { getGameOverReason } from '../logic/game-over';
import { pickRecipe } from '../logic/recipe-generator';
import { addTimeBonus, computeTimeLeft } from '../logic/timer';
import { createNewGameState, getState, setState, type IGameState } from './game-state';

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

export function startGame(): void {
  setState(createNewGameState());
}

export function addIngredientToCauldron(id: string): void {
  const current = getState();

  if (current.status !== 'playing') {
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
    LEVEL_1_SETTINGS.maxCauldronIngredients,
  );

  if (!result) {
    return;
  }

  setState({ ...current, ...result, lastBrew: null });
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

  const now = Date.now();
  const values = calculateCauldron(current.cauldronIngredients);
  const success = isBrewSuccessful(values, current.activeRecipe, LEVEL_1_SETTINGS.tolerance);

  if (success) {
    const timeLeft = addTimeBonus(
      computeTimeLeft(current.endTime, now),
      LEVEL_1_SETTINGS.timeBonusMs,
      LEVEL_1_SETTINGS.startTimeMs,
    );
    setState(
      applyOutcome({
        ...current,
        cauldronIngredients: [],
        score: current.score + LEVEL_1_SETTINGS.scorePerBrew,
        activeRecipe: pickRecipe(RECIPES, LEVEL_1_SETTINGS.difficulty),
        lastBrew: 'success',
        timeLeft,
        endTime: now + timeLeft,
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