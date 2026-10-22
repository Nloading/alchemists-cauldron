export interface IIngredient {
  id: string;
  name: string;
  icon: string;
  temperature: number;
  density: number;
  magicPower: number;
}

export type ShelfStock = Record<string, number>;

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ICauldronValues {
  temperature: number;
  density: number;
  magicPower: number;
}

export interface IRecipeRange {
  min: number;
  max: number;
}

export interface IRecipe {
  id: string;
  name: string;
  difficulty: Difficulty;
  temperature: IRecipeRange;
  density: IRecipeRange;
  magicPower: IRecipeRange;
}

export interface IBarScale {
  min: number;
  max: number;
}

export type BrewResult = 'success' | 'failure';