import cauldronArt from '../assets/cauldron.svg?raw';
import type { IIngredient } from '../types';
import { el } from './dom';

export interface ICauldronView {
  update: (ingredients: readonly IIngredient[], reactionName: string | null) => void;
}

export function createCauldron(container: HTMLElement): ICauldronView {
  const title = el('h2', 'panel__title', 'Cauldron');
  const pot = el('div', 'cauldron__pot');
  pot.setAttribute('aria-hidden', 'true');
  const art = el('div', 'cauldron__art');
  art.innerHTML = cauldronArt;
  const floaters = el('div', 'cauldron__floaters');
  pot.append(art, floaters);
  const empty = el('p', 'cauldron__empty', 'The cauldron is empty');
  const list = el('ol', 'cauldron__list');
  const reaction = el('p', 'cauldron__reaction');
  reaction.setAttribute('role', 'status');

  container.replaceChildren(title, pot, empty, list, reaction);

  let renderedKey: string | null = null;

  return {
    update: (ingredients, reactionName): void => {
      const key = ingredients.map((ingredient) => ingredient.id).join(',');

      if (key !== renderedKey) {
        renderedKey = key;
        empty.hidden = ingredients.length > 0;
        list.replaceChildren(
          ...ingredients.map((ingredient) => {
            const item = el('li', 'cauldron__item');
            item.append(
              el('span', 'icon icon--' + ingredient.icon),
              el('span', undefined, ingredient.name),
            );
            return item;
          }),
        );
        floaters.replaceChildren(
          ...ingredients.map((ingredient, index) => {
            const floater = el('span', 'cauldron__floater');
            floater.style.setProperty('--i', String(index));
            floater.append(el('span', 'icon icon--' + ingredient.icon));
            return floater;
          }),
        );
      }

      reaction.textContent = reactionName === null ? '' : 'Reaction: ' + reactionName + '!';
    },
  };
}
