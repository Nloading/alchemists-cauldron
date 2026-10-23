import type { GameOverReason, ShelfStock } from '../types';

export interface IGameOverInput {
  lives: number;
  timeLeft: number;
  shelfStock: Readonly<ShelfStock>;
  cauldronCount: number;
}

export function getGameOverReason(input: IGameOverInput): GameOverReason | null {
  if (input.lives <= 0) {
    return 'lives';
  }
  if (input.timeLeft <= 0) {
    return 'time';
  }
  const shelfEmpty = Object.values(input.shelfStock).every((portions) => portions === 0);
  if (shelfEmpty && input.cauldronCount === 0) {
    return 'ingredients';
  }
  return null;
}
