import { DEFAULT_DIFFICULTY, DIFFICULTY_SETTINGS } from '../data/difficulty';
import { getShelfIngredients, INGREDIENTS } from '../data/ingredients';
import { RECIPES } from '../data/recipes';
import { pickRecipe } from '../logic/recipe-generator';
import { createStock } from '../logic/stock';
import type {
  BrewResult,
  Difficulty,
  GameOverReason,
  GameStatus,
  IIngredient,
  IRecipe,
  ShelfStock,
  ISaveData,
} from '../types';

export interface IGameState {
  status: GameStatus;
  difficulty: Difficulty;
  cauldronIngredients: IIngredient[];
  shelfStock: ShelfStock;
  activeRecipe: IRecipe;
  score: number;
  lives: number;
  lastBrew: BrewResult | null;
  timeLeft: number;
  endTime: number | null;
  gameOverReason: GameOverReason | null;
}

type Listener = () => void;

export function createMenuState(difficulty: Difficulty = DEFAULT_DIFFICULTY): IGameState {
  return {
    status: 'menu',
    difficulty,
    cauldronIngredients: [],
    shelfStock: {},
    activeRecipe: pickRecipe(RECIPES, difficulty),
    score: 0,
    lives: 0,
    lastBrew: null,
    timeLeft: 0,
    endTime: null,
    gameOverReason: null,
  };
}

export function createNewGameState(difficulty: Difficulty, now: number = Date.now()): IGameState {
  const settings = DIFFICULTY_SETTINGS[difficulty];

  return {
    ...createMenuState(difficulty),
    status: 'playing',
    shelfStock: createStock(getShelfIngredients(settings.shelfSize)),
    lives: settings.lives,
    timeLeft: settings.startTimeMs,
    endTime: now + settings.startTimeMs,
  };
}

let state: IGameState = createMenuState();
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

export function createRestoredState(save: ISaveData): IGameState | null {
  const activeRecipe = RECIPES.find((recipe) => recipe.id === save.activeRecipe.id);
  const cauldronIngredients: IIngredient[] = [];

  for (const saved of save.cauldronIngredients) {
    const ingredient = INGREDIENTS.find((item) => item.id === saved.id);

    if (ingredient === undefined) {
      return null;
    }
    cauldronIngredients.push(ingredient);
  }

  if (activeRecipe === undefined) {
    return null;
  }

  return {
    ...createMenuState(save.difficulty),
    status: 'paused',
    cauldronIngredients,
    shelfStock: { ...save.shelfStock },
    activeRecipe,
    score: save.score,
    lives: save.lives,
    timeLeft: save.timeLeft,
  };
}
