import type { IIngredient, ShelfStock } from '../types';

export interface IAddResult {
  cauldronIngredients: IIngredient[];
  shelfStock: ShelfStock;
}

export function isCauldronFull(cauldron: readonly IIngredient[], max: number): boolean {
  return cauldron.length >= max;
}

export function addIngredient(
  ingredient: IIngredient,
  cauldron: readonly IIngredient[],
  stock: Readonly<ShelfStock>,
  maxIngredients: number,
): IAddResult | null {
  const portionsLeft = stock[ingredient.id] ?? 0;

  if (isCauldronFull(cauldron, maxIngredients) || portionsLeft <= 0) {
    return null;
  }

  return {
    cauldronIngredients: [...cauldron, ingredient],
    shelfStock: { ...stock, [ingredient.id]: portionsLeft - 1 },
  };
}