import { el } from './dom';

export interface IConfirmDialogView {
  ask: (message: string, onConfirm: () => void) => void;
}

export function createConfirmDialog(root: HTMLElement): IConfirmDialogView {
  const overlay = el('div', 'dialog dialog--confirm');
  overlay.hidden = true;

  const box = el('div', 'dialog__box');
  box.setAttribute('role', 'alertdialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-labelledby', 'confirm-message');

  const message = el('p', 'dialog__message');
  message.id = 'confirm-message';

  const actions = el('div', 'dialog__actions');
  const cancel = el('button', 'pause', 'Cancel');
  cancel.type = 'button';
  const confirm = el('button', 'brew brew--danger', 'Confirm');
  confirm.type = 'button';
  actions.append(cancel, confirm);

  box.append(message, actions);
  overlay.append(box);
  root.append(overlay);

  let pending: (() => void) | null = null;

  function close(): void {
    overlay.hidden = true;
    pending = null;
  }

  cancel.addEventListener('click', close);
  confirm.addEventListener('click', () => {
    const action = pending;
    close();
    action?.();
  });

  return {
    ask: (text, onConfirm): void => {
      message.textContent = text;
      pending = onConfirm;
      overlay.hidden = false;
      cancel.focus();
    },
  };
}