import { getNameError } from '../logic/leaderboard';
import type { GameOverReason } from '../types';
import { el } from './dom';

const REASONS: Record<GameOverReason, string> = {
  time: 'Time is up',
  lives: 'You ran out of lives',
  ingredients: 'Out of ingredients',
};

export interface IGameOverHandlers {
  onPlayAgain: () => void;
  onSubmit: (name: string) => void;
  onShowLeaderboard: () => void;
}

export interface IGameOverView {
  update: (
    visible: boolean,
    score: number,
    reason: GameOverReason | null,
    canSubmit: boolean,
  ) => void;
}

export function createGameOver(
  root: HTMLElement,
  handlers: Readonly<IGameOverHandlers>,
): IGameOverView {
  const overlay = el('div', 'dialog');
  overlay.hidden = true;

  const box = el('div', 'dialog__box');
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-labelledby', 'game-over-title');

  const title = el('h2', 'dialog__title', 'Game Over');
  title.id = 'game-over-title';
  const reason = el('p', 'dialog__reason');
  const score = el('p', 'dialog__score');

  const form = el('form', 'dialog__form');
  form.noValidate = true;
  const label = el('label', undefined, 'Enter your name (2–15 characters)');
  label.htmlFor = 'player-name';
  const input = el('input', 'dialog__input');
  input.id = 'player-name';
  input.type = 'text';
  input.maxLength = 15;
  input.autocomplete = 'off';
  const error = el('p', 'dialog__error');
  error.setAttribute('role', 'alert');
  const submit = el('button', 'brew', 'Submit Score');
  submit.type = 'submit';
  form.append(label, input, error, submit);

  const saved = el('p', 'dialog__saved', 'Score saved!');
  saved.hidden = true;

  const actions = el('div', 'dialog__actions');
  const playAgain = el('button', 'brew', 'Play again');
  playAgain.type = 'button';
  playAgain.addEventListener('click', () => {
    handlers.onPlayAgain();
  });
  const board = el('button', 'pause', 'Leaderboard');
  board.type = 'button';
  board.addEventListener('click', () => {
    handlers.onShowLeaderboard();
  });
  actions.append(playAgain, board);

  let submitted = false;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = getNameError(input.value);
    error.textContent = message ?? '';

    if (message !== null) {
      input.focus();
      return;
    }

    submitted = true;
    form.hidden = true;
    saved.hidden = false;
    handlers.onSubmit(input.value.trim());
    handlers.onShowLeaderboard();
  });

  box.append(title, reason, score, form, saved, actions);
  overlay.append(box);
  root.append(overlay);

  return {
    update: (visible, finalScore, why, canSubmit): void => {
      const wasHidden = overlay.hidden;
      overlay.hidden = !visible;

      if (!visible) {
        submitted = false;
        input.value = '';
        error.textContent = '';
        saved.hidden = true;
        return;
      }

      reason.textContent = why === null ? '' : REASONS[why];
      score.textContent = 'Final score: ' + String(finalScore);
      form.hidden = submitted || !canSubmit;

      if (wasHidden) {
        (form.hidden ? playAgain : input).focus();
      }
    },
  };
}
