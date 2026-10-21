import { BARS, type IBarConfig } from '../data/bars';
import { isInRange, valueToPercent } from '../logic/bar-math';
import type { ICauldronValues, IRecipe } from '../types';
import { el } from './dom';
import { formatSigned } from './format';

interface IBarElements {
  config: IBarConfig;
  track: HTMLElement;
  zone: HTMLElement;
  fill: HTMLElement;
  marker: HTMLElement;
  value: HTMLElement;
  target: HTMLElement;
}

export interface IBarsView {
  update: (values: Readonly<ICauldronValues>, recipe: Readonly<IRecipe>) => void;
}

function setPercent(node: HTMLElement, left: number, width?: number): void {
  node.style.left = String(left) + '%';
  if (width !== undefined) {
    node.style.width = String(width) + '%';
  }
}

export function createBars(container: HTMLElement): IBarsView {
  const elements: IBarElements[] = BARS.map((config) => {
    const wrapper = el('div', 'bar');
    const head = el('div', 'bar__head');
    const label = el('span', 'bar__label', config.label);
    const target = el('span', 'bar__target');
    const value = el('span', 'bar__value');
    head.append(label, target, value);

    const track = el('div', 'bar__track bar__track--' + config.modifier);
    const zone = el('div', 'bar__zone');
    const fill = el('div', 'bar__fill');
    const zero = el('div', 'bar__zero');
    const marker = el('div', 'bar__marker');
    setPercent(zero, valueToPercent(0, config.scale));
    track.append(zone, fill, zero, marker);

    const scale = el('div', 'bar__scale');
    scale.append(
      el('span', undefined, String(config.scale.min)),
      el('span', undefined, '0'),
      el('span', undefined, String(config.scale.max)),
    );

    wrapper.append(head, track, scale);
    container.append(wrapper);
    return { config, track, zone, fill, marker, value, target };
  });

  container.replaceChildren(...elements.map((item) => item.track.parentElement ?? item.track));

  return {
    update: (values, recipe): void => {
      for (const bar of elements) {
        const { key, scale } = bar.config;
        const current = values[key];
        const range = recipe[key];

        const currentPct = valueToPercent(current, scale);
        const zeroPct = valueToPercent(0, scale);
        const zoneStart = valueToPercent(range.min, scale);
        const zoneEnd = valueToPercent(range.max, scale);

        setPercent(bar.zone, zoneStart, zoneEnd - zoneStart);
        setPercent(bar.fill, Math.min(zeroPct, currentPct), Math.abs(currentPct - zeroPct));
        setPercent(bar.marker, currentPct);

        bar.value.textContent = formatSigned(current);
        bar.target.textContent = 'Target ' + String(range.min) + '..' + String(range.max);
        bar.track.classList.toggle('bar__track--in-range', isInRange(current, range));
      }
    },
  };
}
