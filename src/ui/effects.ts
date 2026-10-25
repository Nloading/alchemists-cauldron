import type { BrewResult } from '../types';
import { el } from './dom';

const EFFECT_CLASSES = ['fx--success', 'fx--failure'] as const;
const SHAKE_CLASS = 'game--shake';

export interface IEffectsView {
  play: (result: BrewResult, bonusLabel: string) => void;
}

export function createEffects(game: HTMLElement, cauldronPanel: HTMLElement): IEffectsView {
  const fx = el('div', 'fx');
  fx.setAttribute('aria-hidden', 'true');
  const burst = el('div', 'fx__burst');
  const bonus = el('span', 'fx__bonus');
  fx.append(burst, bonus);
  cauldronPanel.append(fx);

  fx.addEventListener('animationend', () => {
    fx.classList.remove(...EFFECT_CLASSES);
  });
  game.addEventListener('animationend', (event) => {
    if (event.target === game) {
      game.classList.remove(SHAKE_CLASS);
    }
  });

  return {
    play: (result, bonusLabel): void => {
      fx.classList.remove(...EFFECT_CLASSES);
      game.classList.remove(SHAKE_CLASS);
      // Reading layout flushes the removal, so the animation restarts from the beginning.
      fx.getBoundingClientRect();

      if (result === 'success') {
        bonus.textContent = bonusLabel;
        fx.classList.add('fx--success');
        return;
      }

      fx.classList.add('fx--failure');
      game.classList.add(SHAKE_CLASS);
    },
  };
}
