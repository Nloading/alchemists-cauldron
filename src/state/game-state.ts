import { LEVEL_1_SETTINGS } from '../data/difficulty';
import { getShelfIngredients } from '../data/ingredients';
import { RECIPES } from '../data/recipes';
import { createStock } from '../logic/stock';
import { pickRecipe } from '../logic/recipe-generator';
import type {
  BrewResult,
  GameOverReason,
  GameStatus,
  IIngredient,
  IRecipe,
  ShelfStock,
} from '../types';

export interface IGameState {
  status: GameStatus;
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

export function createMenuState(): IGameState {
  return {
    status: 'menu',
    cauldronIngredients: [],
    shelfStock: {},
    activeRecipe: pickRecipe(RECIPES, LEVEL_1_SETTINGS.difficulty),
    score: 0,
    lives: 0,
    lastBrew: null,
    timeLeft: 0,
    endTime: null,
    gameOverReason: null,
  };
}

export function createNewGameState(now: number = Date.now()): IGameState {
  return {
    ...createMenuState(),
    status: 'playing',
    shelfStock: createStock(getShelfIngredients(LEVEL_1_SETTINGS.shelfSize)),
    lives: LEVEL_1_SETTINGS.lives,
    timeLeft: LEVEL_1_SETTINGS.startTimeMs,
    endTime: now + LEVEL_1_SETTINGS.startTimeMs,
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