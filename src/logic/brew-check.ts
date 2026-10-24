import type { ICauldronValues, IRecipe, IRecipeRange } from '../types';
import { isInRange } from './bar-math';

export function getCheckedRange(range: IRecipeRange, tolerance: number): IRecipeRange {
  return { min: range.min - tolerance, max: range.max + tolerance };
}

export function isBrewSuccessful(
  values: Readonly<ICauldronValues>,
  recipe: Readonly<IRecipe>,
  tolerance: number,
): boolean {
  return (
    isInRange(values.temperature, getCheckedRange(recipe.temperature, tolerance)) &&
    isInRange(values.density, getCheckedRange(recipe.density, tolerance)) &&
    isInRange(values.magicPower, getCheckedRange(recipe.magicPower, tolerance))
  );
}
