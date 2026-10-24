import type { BrewResult, GameStatus } from '../types';
import { el } from './dom';

const MESSAGES: Record<BrewResult, string> = {
  success: 'Perfect potion! Well brewed.',
  failure: 'The brew failed. You lost a life.',
};

export interface IControlsHandlers {
  onBrew: () => void;
  onStart: () => void;
  onPause: () => void;
  onLeaderboard: () => void;
  onHelp: () => void;
  onSettings: () => void;
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

  const board = el('button', 'pause', 'Leaderboard');
  board.type = 'button';
  board.addEventListener('click', () => {
    handlers.onLeaderboard();
  });

  const help = el('button', 'pause', 'Help');
  help.type = 'button';
  help.addEventListener('click', () => {
    handlers.onHelp();
  });

  const settings = el('button', 'pause', 'Settings');
  settings.type = 'button';
  settings.addEventListener('click', () => {
    handlers.onSettings();
  });

  const brewButton = el('button', 'brew', 'Brew');
  brewButton.type = 'button';
  brewButton.addEventListener('click', () => {
    handlers.onBrew();
  });

  const pause = el('button', 'pause', 'Pause');
  pause.type = 'button';
  pause.addEventListener('click', () => {
    handlers.onPause();
  });

  const row = el('div', 'controls__row');
  row.append(brewButton, pause);

  const message = el('p', 'brew-message');
  message.setAttribute('role', 'status');

  container.replaceChildren(start, board, help, settings, row, message);

  return {
    update: (status, canBrew, result): void => {
      const inMenu = status === 'menu';
      const playing = status === 'playing';
      start.hidden = !inMenu;
      board.hidden = !inMenu;
      help.hidden = !inMenu;
      settings.hidden = !inMenu;
      row.hidden = inMenu;
      pause.hidden = !playing;
      brewButton.disabled = !canBrew || !playing;
      message.textContent = result === null || inMenu ? '' : MESSAGES[result];
      message.classList.toggle('brew-message--success', result === 'success');
      message.classList.toggle('brew-message--failure', result === 'failure');
    },
  };
}
