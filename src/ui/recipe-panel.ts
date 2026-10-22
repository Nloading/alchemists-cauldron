import { BARS, type StatKey } from '../data/bars';
import type { IRecipe } from '../types';
import { el } from './dom';

interface IRangeRow {
  key: StatKey;
  value: HTMLElement;
}

export interface IRecipePanelView {
  update: (recipe: Readonly<IRecipe>, added: number, max: number) => void;
}

export function createRecipePanel(container: HTMLElement): IRecipePanelView {
  const title = el('h2', 'panel__title', 'Current recipe');
  const name = el('p', 'recipe__name');
  const counter = el('p', 'recipe__counter');
  const list = el('ul', 'recipe__ranges');

  const rows: IRangeRow[] = BARS.map((config) => {
    const item = el('li', 'recipe__range');
    const value = el('span', 'recipe__range-value');
    item.append(el('span', undefined, config.label), value);
    list.append(item);
    return { key: config.key, value };
  });

  container.replaceChildren(title, name, counter, list);

  return {
    update: (recipe, added, max): void => {
      name.textContent = recipe.name;
      counter.textContent = 'Ingredients: ' + String(added) + ' / ' + String(max);
        counter.classList.toggle('recipe__counter--full', added >= max);
      for (const row of rows) {
        const range = recipe[row.key];
        row.value.textContent = String(range.min) + '..' + String(range.max);
      }
    },
  };
}
