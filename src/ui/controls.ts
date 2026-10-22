import type { BrewResult } from '../types';
import { el } from './dom';

const MESSAGES: Record<BrewResult, string> = {
  success: 'Perfect potion! Well brewed.',
  failure: 'The brew failed. You lost a life.',
};

export interface IControlsView {
  update: (canBrew: boolean, result: BrewResult | null) => void;
}

export function createControls(container: HTMLElement, onBrew: () => void): IControlsView {
  const button = el('button', 'brew', 'Brew');
  button.type = 'button';
  button.addEventListener('click', () => {
    onBrew();
  });

  const message = el('p', 'brew-message');
  message.setAttribute('role', 'status');

  container.replaceChildren(button, message);

  return {
    update: (canBrew, result): void => {
      button.disabled = !canBrew;
      message.textContent = result === null ? '' : MESSAGES[result];
      message.classList.toggle('brew-message--success', result === 'success');
      message.classList.toggle('brew-message--failure', result === 'failure');
    },
  };
}