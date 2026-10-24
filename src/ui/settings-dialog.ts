import { DIFFICULTIES, DIFFICULTY_SETTINGS } from '../data/difficulty';
import type { Difficulty } from '../types';
import { el } from './dom';

export interface ISettingsView {
  show: () => void;
  update: (selected: Difficulty) => void;
}

function describe(difficulty: Difficulty): string {
  const s = DIFFICULTY_SETTINGS[difficulty];

  return (
    String(s.shelfSize) +
    ' ingredients · ' +
    String(s.startTimeMs / 1000) +
    ' s · ±' +
    String(s.tolerance) +
    ' · ' +
    String(s.lives) +
    ' lives'
  );
}

export function createSettingsDialog(
  root: HTMLElement,
  onSelect: (difficulty: Difficulty) => void,
): ISettingsView {
  const overlay = el('div', 'dialog dialog--top');
  overlay.hidden = true;

  const box = el('div', 'dialog__box');
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-labelledby', 'settings-title');

  const title = el('h2', 'dialog__title', 'Settings');
  title.id = 'settings-title';
  const subtitle = el('p', 'dialog__message', 'Choose difficulty');

  const options = new Map<Difficulty, HTMLButtonElement>();
  const group = el('div', 'options');

  for (const difficulty of DIFFICULTIES) {
    const button = el('button', 'option');
    button.type = 'button';
    button.append(
      el('span', 'option__name', DIFFICULTY_SETTINGS[difficulty].label),
      el('span', 'option__info', describe(difficulty)),
    );
    button.addEventListener('click', () => {
      onSelect(difficulty);
    });
    options.set(difficulty, button);
    group.append(button);
  }

  const close = el('button', 'pause', 'Close');
  close.type = 'button';
  close.addEventListener('click', () => {
    overlay.hidden = true;
  });

  box.append(title, subtitle, group, close);
  overlay.append(box);
  root.append(overlay);

  return {
    show: (): void => {
      overlay.hidden = false;
      close.focus();
    },
    update: (selected): void => {
      for (const [difficulty, button] of options) {
        const isSelected = difficulty === selected;
        button.classList.toggle('option--selected', isSelected);
        button.setAttribute('aria-pressed', String(isSelected));
      }
    },
  };
}
