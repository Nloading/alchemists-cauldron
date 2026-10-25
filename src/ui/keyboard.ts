import { resolveShortcut, type ShortcutAction } from '../logic/shortcuts';
import type { GameStatus } from '../types';

export interface IKeyboardOptions {
  getStatus: () => GameStatus;
  getShelfSize: () => number;
  onShortcut: (action: ShortcutAction) => void;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT'
  );
}

export function attachKeyboard(options: Readonly<IKeyboardOptions>): void {
  document.addEventListener('keydown', (event) => {
    if (
      event.repeat ||
      event.ctrlKey ||
      event.altKey ||
      event.metaKey ||
      isTypingTarget(event.target)
    ) {
      return;
    }

    const action = resolveShortcut(event.code, options.getStatus(), options.getShelfSize());

    if (action === null) {
      return;
    }

    event.preventDefault();
    options.onShortcut(action);
  });
}