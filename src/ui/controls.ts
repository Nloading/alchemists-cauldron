import type { BrewResult, GameStatus } from '../types';
import { el } from './dom';

const MESSAGES: Record<BrewResult, string> = {
  success: 'Perfect potion! Well brewed.',
  failure: 'The brew failed. You lost a life.',
};

export interface IControlsHandlers {
  onBrew: () => void;
  onStart: () => void;
}

export interface IControlsView {
  update: (status: GameStatus, canBrew: boolean, result: BrewResult | null) => void;
}

export function createControls(
  container: HTMLElement,
  handlers: Readonly<IControlsHandlers>,
): IControlsView {
  const start = el('button', 'brew brew--start', 'Start Game');
  start.type = 'button';
  start.addEventListener('click', () => {
    handlers.onStart();
  });

  const brewButton = el('button', 'brew', 'Brew');
  brewButton.type = 'button';
  brewButton.addEventListener('click', () => {
    handlers.onBrew();
  });

  const message = el('p', 'brew-message');
  message.setAttribute('role', 'status');

  container.replaceChildren(start, brewButton, message);

  return {
    update: (status, canBrew, result): void => {
      const inMenu = status === 'menu';
      start.hidden = !inMenu;
      brewButton.hidden = inMenu;
      brewButton.disabled = !canBrew || status !== 'playing';
      message.textContent = result === null || inMenu ? '' : MESSAGES[result];
      message.classList.toggle('brew-message--success', result === 'success');
      message.classList.toggle('brew-message--failure', result === 'failure');
    },
  };
}