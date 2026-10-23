import { LEVEL_1_SETTINGS } from '../data/difficulty';
import { INGREDIENTS } from '../data/ingredients';
import { RECIPES } from '../data/recipes';
import { addIngredient } from '../logic/add-ingredient';
import { isBrewSuccessful } from '../logic/brew-check';
import { calculateCauldron } from '../logic/calculate-cauldron';
import { getGameOverReason } from '../logic/game-over';
import { pickRecipe } from '../logic/recipe-generator';
import { computeTimeLeft } from '../logic/timer';
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

  if (current.status !== 'playing' || current.cauldronIngredients.length === 0) {
    return;
  }

  const values = calculateCauldron(current.cauldronIngredients);
  const success = isBrewSuccessful(values, current.activeRecipe, LEVEL_1_SETTINGS.tolerance);
  const timeLeft =
    current.endTime === null ? current.timeLeft : computeTimeLeft(current.endTime, Date.now());

  if (success) {
    setState(
      applyOutcome({
        ...current,
        cauldronIngredients: [],
        score: current.score + LEVEL_1_SETTINGS.scorePerBrew,
        activeRecipe: pickRecipe(RECIPES, LEVEL_1_SETTINGS.difficulty),
        lastBrew: 'success',
        timeLeft,
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
      timeLeft,
    }),
  );
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

  setState({
    ...current,
    status: 'playing',
    endTime: Date.now() + current.timeLeft,
  });
}

export function exitToMenu(): void {
  setState(createMenuState());
}
