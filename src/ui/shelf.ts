import type { IIngredient, ShelfStock } from '../types';
import { el } from './dom';
import { formatSigned } from './format';

interface ISlot {
  button: HTMLButtonElement;
  badge: HTMLElement;
}

export interface IShelfView {
  setIngredients: (ingredients: readonly IIngredient[]) => void;
  update: (stock: Readonly<ShelfStock>, blocked: boolean) => void;
}

export function createShelf(container: HTMLElement, onAdd: (id: string) => void): IShelfView {
  const slots = new Map<string, ISlot>();
  const title = el('h2', 'panel__title', 'Ingredients');
  const list = el('ul', 'shelf');
  container.replaceChildren(title, list);

  function createItem(ingredient: IIngredient): HTMLLIElement {
    const item = el('li', 'shelf__item');
    const button = el('button', 'slot');
    button.type = 'button';
    button.setAttribute('aria-label', 'Add ' + ingredient.name);

    const icon = el('span', 'icon icon--' + ingredient.icon);
    const name = el('span', 'slot__name', ingredient.name);
    const stats = el('span', 'slot__stats');
    stats.append(
      el('span', 'stat stat--temp', 'T ' + formatSigned(ingredient.temperature)),
      el('span', 'stat stat--density', 'D ' + formatSigned(ingredient.density)),
      el('span', 'stat stat--magic', 'MP ' + formatSigned(ingredient.magicPower)),
    );
    const badge = el('span', 'slot__badge');

    button.append(icon, name, stats, badge);
    button.addEventListener('click', () => {
      onAdd(ingredient.id);
    });

    item.append(button);
    slots.set(ingredient.id, { button, badge });
    return item;
  }

  return {
    setIngredients: (ingredients): void => {
      slots.clear();
      list.replaceChildren(...ingredients.map((ingredient) => createItem(ingredient)));
    },
    update: (stock, blocked): void => {
      for (const [id, slot] of slots) {
        const portionsLeft = stock[id] ?? 0;
        const isEmpty = portionsLeft === 0;
        slot.badge.textContent = String(portionsLeft);
        slot.button.disabled = isEmpty || blocked;
        slot.button.classList.toggle('slot--empty', isEmpty);
      }
    },
  };
}