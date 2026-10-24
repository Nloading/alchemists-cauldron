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

export type GameOverReason = 'lives' | 'time' | 'ingredients';
export type GameStatus = 'menu' | 'playing' | 'paused' | 'game-over';

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

export interface ILeaderboardEntry {
  name: string;
  score: number;
  timestamp: number;
  difficulty: Difficulty;
}

export interface ISaveData {
  difficulty: Difficulty;
  score: number;
  timeLeft: number;
  lives: number;
  activeRecipe: IRecipe;
  cauldronIngredients: IIngredient[];
  shelfStock: ShelfStock;
  status: 'playing' | 'paused';
}

export interface IReactionEffects {
  timePenaltyMs?: number;
  lifeLoss?: number;
  clearsCauldron?: boolean;
}

export interface IReaction extends IReactionEffects {
  id: string;
  name: string;
  difficulty: Exclude<Difficulty, 'easy'>;
  isActive: (ingredients: readonly IIngredient[]) => boolean;
  apply: (values: ICauldronValues) => ICauldronValues;
}
