import type { IIngredient, ShelfStock } from '../types';

export const MIN_STOCK = 2;
export const MAX_STOCK = 15;

export function randomStock(): number {
  return Math.floor(Math.random() * (MAX_STOCK - MIN_STOCK + 1)) + MIN_STOCK;
}

export function createStock(ingredients: readonly IIngredient[]): ShelfStock {
  const stock: ShelfStock = {};
  for (const ingredient of ingredients) {
    stock[ingredient.id] = randomStock();
  }
  return stock;
}