import type { IBarScale } from '../types';

export type StatKey = 'temperature' | 'density' | 'magicPower';

export interface IBarConfig {
  key: StatKey;
  label: string;
  modifier: string;
  scale: IBarScale;
}

export const BARS: readonly IBarConfig[] = [
  { key: 'temperature', label: 'Temperature', modifier: 'temp', scale: { min: -100, max: 100 } },
  { key: 'density', label: 'Density', modifier: 'density', scale: { min: -60, max: 60 } },
  { key: 'magicPower', label: 'Magic Power', modifier: 'magic', scale: { min: -80, max: 80 } },
];