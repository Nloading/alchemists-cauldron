import { INGREDIENTS } from '../data/ingredients';
import { LEVEL_1_SETTINGS } from '../data/difficulty';
import { addIngredient } from '../logic/add-ingredient';
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

  setState({ ...current, ...result });
}
