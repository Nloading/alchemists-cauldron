import type { IIngredient, ShelfStock } from '../types';
import { el } from './dom';
import { formatSigned } from './format';
import { INGREDIENT_MIME } from './drop-zone';

interface ISlot {
  item: HTMLElement;
  button: HTMLButtonElement;
  badge: HTMLElement;
}

export interface IShelfView {
  setIngredients: (ingredients: readonly IIngredient[]) => void;
  update: (stock: Readonly<ShelfStock>, blocked: boolean) => void;
}

function createTooltipRow(label: string, value: number): HTMLElement {
  const row = el('div', 'tooltip__row');
  const modifier = value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral';
  row.append(
    el('span', undefined, label),
    el('span', 'tooltip__value tooltip__value--' + modifier, formatSigned(value)),
  );
  return row;
}

function createTooltip(ingredient: IIngredient): HTMLElement {
  const tooltip = el('div', 'tooltip');
  tooltip.id = 'tip-' + ingredient.id;
  tooltip.setAttribute('role', 'tooltip');
  tooltip.append(
    el('strong', 'tooltip__title', ingredient.name),
    createTooltipRow('Temperature', ingredient.temperature),
    createTooltipRow('Density', ingredient.density),
    createTooltipRow('Magic Power', ingredient.magicPower),
  );
  return tooltip;
}

function placeTooltip(tooltip: HTMLElement): void {
  tooltip.classList.remove('tooltip--left', 'tooltip--up');
  const rect = tooltip.getBoundingClientRect();
  tooltip.classList.toggle('tooltip--left', rect.right > window.innerWidth);
  tooltip.classList.toggle('tooltip--up', rect.bottom > window.innerHeight);
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

    const tooltip = createTooltip(ingredient);
    button.setAttribute('aria-describedby', tooltip.id);

    const icon = el('span', 'icon icon--' + ingredient.icon);
    const name = el('span', 'slot__name', ingredient.name);
    const badge = el('span', 'slot__badge');

    button.append(icon, name, badge);
    button.addEventListener('click', () => {
      onAdd(ingredient.id);
    });
    item.addEventListener('mouseenter', () => {
      placeTooltip(tooltip);
    });
    item.addEventListener('focusin', () => {
      placeTooltip(tooltip);
    });
    item.addEventListener('dragstart', (event) => {
      if (button.disabled || event.dataTransfer === null) {
        event.preventDefault();
        return;
      }

      event.dataTransfer.setData(INGREDIENT_MIME, ingredient.id);
      event.dataTransfer.effectAllowed = 'copy';
      item.classList.add('shelf__item--dragging');
    });
    item.addEventListener('dragend', () => {
      item.classList.remove('shelf__item--dragging');
    });

    item.append(button, tooltip);
    slots.set(ingredient.id, { item, button, badge });
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
        slot.item.classList.toggle('shelf__item--empty', isEmpty);
        slot.item.draggable = !isEmpty && !blocked;
      }
    },
  };
}
