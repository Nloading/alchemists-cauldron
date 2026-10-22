import type { Difficulty, IRecipe } from '../types';

export function pickRecipe(
  recipes: readonly IRecipe[],
  difficulty: Difficulty,
  random: () => number = Math.random,
): IRecipe {
  const pool = recipes.filter((recipe) => recipe.difficulty === difficulty);
  const recipe = pool[Math.floor(random() * pool.length)];

  if (!recipe) {
    throw new Error('No recipes found for difficulty: ' + difficulty);
  }

  return recipe;
}
