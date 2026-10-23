import { el } from './dom';

export interface IPauseDialogHandlers {
  onResume: () => void;
  onExit: () => void;
}

export interface IPauseDialogView {
  update: (visible: boolean) => void;
}

export function createPauseDialog(
  root: HTMLElement,
  handlers: Readonly<IPauseDialogHandlers>,
): IPauseDialogView {
  const overlay = el('div', 'dialog');
  overlay.hidden = true;

  const box = el('div', 'dialog__box');
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-labelledby', 'pause-title');

  const title = el('h2', 'dialog__title', 'Game Paused');
  title.id = 'pause-title';

  const resume = el('button', 'brew', 'Resume');
  resume.type = 'button';
  resume.addEventListener('click', () => {
    handlers.onResume();
  });

  const exit = el('button', 'pause', 'Exit to Menu');
  exit.type = 'button';
  exit.addEventListener('click', () => {
    handlers.onExit();
  });

  box.append(title, resume, exit);
  overlay.append(box);
  root.append(overlay);

  return {
    update: (visible): void => {
      const wasHidden = overlay.hidden;
      overlay.hidden = !visible;
      if (visible && wasHidden) {
        resume.focus();
      }
    },
  };
}
