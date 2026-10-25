import type { IIngredient } from '../types';
import { el } from './dom';

export interface ICauldronView {
  update: (ingredients: readonly IIngredient[], reactionName: string | null) => void;
}

export function createCauldron(container: HTMLElement): ICauldronView {
  const title = el('h2', 'panel__title', 'Cauldron');
  const list = el('ol', 'cauldron__list');
  const empty = el('p', 'cauldron__empty', 'The cauldron is empty');
  const reaction = el('p', 'cauldron__reaction');
  reaction.setAttribute('role', 'status');

  container.replaceChildren(title, empty, list, reaction);

  return {
    update: (ingredients, reactionName): void => {
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
      reaction.textContent = reactionName === null ? '' : 'Reaction: ' + reactionName + '!';
    },
  };
}