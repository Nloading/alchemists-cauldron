import { LEVEL_1_SETTINGS } from '../data/difficulty';
import { INGREDIENTS } from '../data/ingredients';
import { RECIPES } from '../data/recipes';
import { addIngredient } from '../logic/add-ingredient';
import { isBrewSuccessful } from '../logic/brew-check';
import { calculateCauldron } from '../logic/calculate-cauldron';
import { pickRecipe } from '../logic/recipe-generator';
import { getState, setState } from './game-state';

export function addIngredientToCauldron(id: string): void {
  const current = getState();
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

  if (current.cauldronIngredients.length === 0) {
    return;
  }

  const values = calculateCauldron(current.cauldronIngredients);
  const success = isBrewSuccessful(values, current.activeRecipe, LEVEL_1_SETTINGS.tolerance);

  if (success) {
    setState({
      ...current,
      cauldronIngredients: [],
      score: current.score + LEVEL_1_SETTINGS.scorePerBrew,
      activeRecipe: pickRecipe(RECIPES, LEVEL_1_SETTINGS.difficulty),
      lastBrew: 'success',
    });
    return;
  }

  setState({
    ...current,
    cauldronIngredients: [],
    lives: Math.max(0, current.lives - 1),
    lastBrew: 'failure',
  });
}