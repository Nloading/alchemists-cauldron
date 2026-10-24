import { formatDate } from '../logic/leaderboard';
import type { ILeaderboardEntry } from '../types';
import { el } from './dom';

export interface ILeaderboardHandlers {
  onClearRequest: () => void;
}

export interface ILeaderboardView {
  show: (entries: readonly ILeaderboardEntry[]) => void;
  hide: () => void;
}

function createRow(cells: readonly string[], tag: 'th' | 'td'): HTMLTableRowElement {
  const row = el('tr');
  for (const text of cells) {
    row.append(el(tag, undefined, text));
  }
  return row;
}

export function createLeaderboardDialog(
  root: HTMLElement,
  handlers: Readonly<ILeaderboardHandlers>,
): ILeaderboardView {
  const overlay = el('div', 'dialog dialog--top');
  overlay.hidden = true;

  const box = el('div', 'dialog__box dialog__box--wide');
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-labelledby', 'leaderboard-title');

  const title = el('h2', 'dialog__title', 'Top Alchemists');
  title.id = 'leaderboard-title';

  const empty = el('p', 'dialog__message', 'No results yet. Be the first!');
  const table = el('table', 'leaderboard');
  const head = el('thead');
  head.append(createRow(['Rank', 'Name', 'Score', 'Date'], 'th'));
  const body = el('tbody');
  table.append(head, body);

  const actions = el('div', 'dialog__actions');
  const clear = el('button', 'brew brew--danger', 'Clear Leaderboard');
  clear.type = 'button';
  clear.addEventListener('click', () => {
    handlers.onClearRequest();
  });
  const back = el('button', 'pause', 'Back');
  back.type = 'button';
  back.addEventListener('click', () => {
    overlay.hidden = true;
  });
  actions.append(clear, back);

  box.append(title, empty, table, actions);
  overlay.append(box);
  root.append(overlay);

  return {
    show: (entries): void => {
      body.replaceChildren(
        ...entries.map((entry, index) =>
          createRow(
            [String(index + 1), entry.name, String(entry.score), formatDate(entry.timestamp)],
            'td',
          ),
        ),
      );
      empty.hidden = entries.length > 0;
      table.hidden = entries.length === 0;
      clear.disabled = entries.length === 0;
      overlay.hidden = false;
      back.focus();
    },
    hide: (): void => {
      overlay.hidden = true;
    },
  };
}