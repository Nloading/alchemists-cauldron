import { DIFFICULTIES, DIFFICULTY_SETTINGS } from '../data/difficulty';
import { formatDate } from '../logic/leaderboard';
import type { Difficulty, ILeaderboardEntry } from '../types';
import { el } from './dom';

export interface ILeaderboardHandlers {
  onClearRequest: () => void;
  onSelect: (difficulty: Difficulty) => void;
}

export interface ILeaderboardView {
  show: (difficulty: Difficulty, entries: readonly ILeaderboardEntry[]) => void;
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

  const tabs = el('div', 'tabs');
  const tabButtons = new Map<Difficulty, HTMLButtonElement>();
  for (const difficulty of DIFFICULTIES) {
    const tab = el('button', 'tab', DIFFICULTY_SETTINGS[difficulty].label);
    tab.type = 'button';
    tab.addEventListener('click', () => {
      handlers.onSelect(difficulty);
    });
    tabButtons.set(difficulty, tab);
    tabs.append(tab);
  }

  const empty = el('p', 'dialog__message', 'No results yet. Be the first!');
  const table = el('table', 'leaderboard');
  const head = el('thead');
  head.append(createRow(['Rank', 'Name', 'Score', 'Difficulty', 'Date'], 'th'));
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

  box.append(title, tabs, empty, table, actions);
  overlay.append(box);
  root.append(overlay);

  return {
    show: (difficulty, entries): void => {
      const wasHidden = overlay.hidden;

      for (const [key, tab] of tabButtons) {
        const selected = key === difficulty;
        tab.classList.toggle('tab--selected', selected);
        tab.setAttribute('aria-pressed', String(selected));
      }

      body.replaceChildren(
        ...entries.map((entry, index) =>
          createRow(
            [
              String(index + 1),
              entry.name,
              String(entry.score),
              DIFFICULTY_SETTINGS[entry.difficulty].label,
              formatDate(entry.timestamp),
            ],
            'td',
          ),
        ),
      );
      empty.hidden = entries.length > 0;
      table.hidden = entries.length === 0;
      clear.disabled = entries.length === 0;
      overlay.hidden = false;

      if (wasHidden) {
        back.focus();
      }
    },
    hide: (): void => {
      overlay.hidden = true;
    },
  };
}