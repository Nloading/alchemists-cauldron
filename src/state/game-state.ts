import type { IIngredient, IRecipe, ShelfStock } from '../types';
import { RECIPES } from '../data/recipes';
import { pickRecipe } from '../logic/recipe-generator';
import { getShelfIngredients } from '../data/ingredients';
import { LEVEL_1_SETTINGS } from '../data/difficulty';
import { createStock } from '../logic/stock';

export interface IGameState {
  cauldronIngredients: IIngredient[];
  shelfStock: ShelfStock;
  activeRecipe: IRecipe;
}

type Listener = () => void;

export function createNewGameState(): IGameState {
  return {
    cauldronIngredients: [],
    shelfStock: createStock(getShelfIngredients(LEVEL_1_SETTINGS.shelfSize)),
        activeRecipe: pickRecipe(RECIPES, LEVEL_1_SETTINGS.difficulty),
  };
}

let state: IGameState = createNewGameState();
const listeners = new Set<Listener>();

export function getState(): IGameState {
  return state;
}

export function setState(next: IGameState): void {
  state = next;
  listeners.forEach((listener) => {
    listener();
  });
}

export function subscribe(listener: Listener): void {
  listeners.add(listener);
}
