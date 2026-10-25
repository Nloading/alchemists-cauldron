import { DIFFICULTIES, DIFFICULTY_SETTINGS } from '../data/difficulty';
import { el } from './dom';

export interface IHelpView {
  show: () => void;
}

const RULES: readonly string[] = [
  'Open Settings to choose Easy, Medium or Hard, then click Start Game. You get one recipe with three target ranges: Temperature, Density and Magic Power.',
  'Click ingredients on the shelf to add them to the cauldron. The recipe panel shows how many fit.',
  'The three bars show the sum of all added ingredients. Get every value into its green zone.',
  'Click Brew to check the mix. Each value may be off from the recipe range by the difficulty tolerance.',
  'Success gives score, bonus seconds and a new recipe. Failure costs 1 life.',
  'Every ingredient has limited stock. Used ingredients are spent, even after a failed brew.',
  'The game ends when time runs out, you lose all lives, or the ingredients run out.',
  'Your game is saved automatically. Use Continue Game on the start screen after a reload.',
  'Drag an ingredient card into the cauldron, or click it. Hover a card to see its Temperature, Density and Magic Power.',
  'Some ingredient pairs react on Medium and Hard (for example Fairy Dust + Caustic Acid). A reaction changes the values and can cost time or a life.',
  'Pour Out clears the cauldron for 10 seconds and no life. The ingredients are not returned.',
  'Keyboard: 1–8 add the ingredient at that shelf position, B brews, O pours out, P or Esc pauses and resumes.',
];

export function createHelpDialog(root: HTMLElement): IHelpView {
  const overlay = el('div', 'dialog dialog--top');
  overlay.hidden = true;

  const box = el('div', 'dialog__box dialog__box--wide dialog__box--left');
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-labelledby', 'help-title');

  const title = el('h2', 'dialog__title', 'How to play');
  title.id = 'help-title';

  const list = el('ol', 'help__list');
  list.append(...RULES.map((text) => el('li', undefined, text)));

  const subtitle = el('h3', 'help__subtitle', 'Difficulty');
  const levels = el('ul', 'help__list');
  levels.append(
    ...DIFFICULTIES.map((difficulty) => {
      const s = DIFFICULTY_SETTINGS[difficulty];
      return el(
        'li',
        undefined,
        s.label +
          ': ' +
          String(s.shelfSize) +
          ' ingredients on the shelf, up to ' +
          String(s.maxCauldronIngredients) +
          ' in the cauldron, ' +
          String(s.startTimeMs / 1000) +
          ' s, tolerance ±' +
          String(s.tolerance) +
          ', ' +
          String(s.lives) +
          ' lives, +' +
          String(s.scorePerBrew) +
          ' score and +' +
          String(s.timeBonusMs / 1000) +
          ' s per brew.',
      );
    }),
  );

  const close = el('button', 'pause', 'Close');
  close.type = 'button';
  close.addEventListener('click', () => {
    overlay.hidden = true;
  });

  box.append(title, list, subtitle, levels, close);
  overlay.append(box);
  root.append(overlay);

  return {
    show: (): void => {
      overlay.hidden = false;
      close.focus();
    },
  };
}
