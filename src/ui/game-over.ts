import type { GameOverReason } from '../types';
import { el } from './dom';

const REASON_MESSAGES: Record<GameOverReason, string> = {
  lives: 'You ran out of lives.',
  time: 'Time ran out.',
  ingredients: 'You ran out of ingredients.',
};

export interface IGameOverView {
  update: (visible: boolean, reason: GameOverReason | null, score: number) => void;
}

export function createGameOver(root: HTMLElement, onRestart: () => void): IGameOverView {
  const overlay = el('div', 'dialog');
  overlay.hidden = true;

  const box = el('div', 'dialog__box');
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-labelledby', 'game-over-title');

  const title = el('h2', 'dialog__title', 'Game Over');
  title.id = 'game-over-title';
  const reason = el('p', 'dialog__message');
  const score = el('p', 'dialog__score');
  const restart = el('button', 'brew', 'Play Again');
  restart.type = 'button';
  restart.addEventListener('click', onRestart);

  box.append(title, reason, score, restart);
  overlay.append(box);
  root.append(overlay);

  return {
    update: (visible, gameOverReason, finalScore): void => {
      const wasHidden = overlay.hidden;
      overlay.hidden = !visible;
      if (!visible) {
        return;
      }
      reason.textContent = gameOverReason === null ? '' : REASON_MESSAGES[gameOverReason];
      score.textContent = 'Final score: ' + String(finalScore);
      if (wasHidden) {
        restart.focus();
      }
    },
  };
}
