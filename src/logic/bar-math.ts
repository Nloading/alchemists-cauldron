import type { IBarScale, IRecipeRange } from '../types';

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function valueToPercent(value: number, scale: IBarScale): number {
  const clamped = clamp(value, scale.min, scale.max);
  return ((clamped - scale.min) / (scale.max - scale.min)) * 100;
}

export function isInRange(value: number, range: IRecipeRange): boolean {
  return value >= range.min && value <= range.max;
}
