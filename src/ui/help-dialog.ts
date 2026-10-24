import { LEVEL_1_SETTINGS } from '../data/difficulty';
import { el } from './dom';

export interface IHelpView {
  show: () => void;
}

export function createHelpDialog(root: HTMLElement): IHelpView {
  const overlay = el('div', 'dialog dialog--top');
  overlay.hidden = true;

  const box = el('div', 'dialog__box dialog__box--wide dialog__box--left');
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-labelledby', 'help-title');

  const title = el('h2', 'dialog__title', 'How to play');
  title.id = 'help-title';

  const rules: readonly string[] = [
    'Click Start Game. You get one recipe with three target ranges: Temperature, Density and Magic Power.',
    'Click ingredients on the shelf to add them to the cauldron (at most ' +
      String(LEVEL_1_SETTINGS.maxCauldronIngredients) +
      ').',
    'The three bars show the sum of all added ingredients. Get every value into its green zone.',
    'Click Brew to check the mix. Each value may be off by ±' +
      String(LEVEL_1_SETTINGS.tolerance) +
      ' from the recipe range.',
    'Success: +' +
      String(LEVEL_1_SETTINGS.scorePerBrew) +
      ' score, +' +
      String(LEVEL_1_SETTINGS.timeBonusMs / 1000) +
      ' seconds, and a new recipe. Failure: you lose 1 life.',
    'Every ingredient has limited stock. Used ingredients are spent, even after a failed brew.',
    'The game ends when time runs out, you lose all lives, or the ingredients run out.',
  ];

  const list = el('ol', 'help__list');
  list.append(...rules.map((text) => el('li', undefined, text)));

  const close = el('button', 'pause', 'Close');
  close.type = 'button';
  close.addEventListener('click', () => {
    overlay.hidden = true;
  });

  box.append(title, list, close);
  overlay.append(box);
  root.append(overlay);

  return {
    show: (): void => {
      overlay.hidden = false;
      close.focus();
    },
  };
}