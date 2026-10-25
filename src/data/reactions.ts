import type { IIngredient, IReaction } from '../types';

function hasAll(...ids: string[]): (ingredients: readonly IIngredient[]) => boolean {
  return (ingredients) => ids.every((id) => ingredients.some((item) => item.id === id));
}

function scale(value: number, percent: number): number {
  return Math.round((value * (100 + percent)) / 100);
}

export const REACTIONS: readonly IReaction[] = [
  {
    id: 'bubbling',
    name: 'Bubbling',
    difficulty: 'medium',
    isActive: hasAll('fairy-dust', 'caustic-acid'),
    apply: (values) => ({ ...values, magicPower: scale(values.magicPower, 50) }),
    timePenaltyMs: 10_000,
  },
  {
    id: 'solar-frost',
    name: 'Solar Frost',
    difficulty: 'medium',
    isActive: hasAll('dragon-tears', 'frost-lotus'),
    apply: (values) => ({ ...values, temperature: 0, density: scale(values.density, 20) }),
  },
  {
    id: 'volatile-mix',
    name: 'Volatile Mix',
    difficulty: 'hard',
    isActive: hasAll('phoenix-feather', 'essence-of-the-void'),
    apply: (values) => values,
    lifeLoss: 1,
    clearsCauldron: true,
  },
  {
    id: 'rooted-steam',
    name: 'Rooted Steam',
    difficulty: 'hard',
    isActive: hasAll('mandrake-root', 'toad-slime'),
    apply: (values) => ({
      ...values,
      density: scale(values.density, 25),
      magicPower: scale(values.magicPower, -10),
    }),
  },
  {
    id: 'ashen-bloom',
    name: 'Ashen Bloom',
    difficulty: 'hard',
    isActive: hasAll('phoenix-feather', 'fairy-dust'),
    apply: (values) => ({
      ...values,
      temperature: values.temperature + 10,
      magicPower: scale(values.magicPower, 25),
    }),
  },
];
