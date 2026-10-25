export const INGREDIENT_MIME = 'application/x-alchemist-ingredient';

const ACTIVE_CLASS = 'panel--drop-active';

export interface IDropZoneOptions {
  canDrop: () => boolean;
  onDrop: (id: string) => void;
}

function isIngredientDrag(event: DragEvent): boolean {
  return event.dataTransfer?.types.includes(INGREDIENT_MIME) ?? false;
}

export function createDropZone(zone: HTMLElement, options: Readonly<IDropZoneOptions>): void {
  zone.addEventListener('dragover', (event) => {
    if (!isIngredientDrag(event) || !options.canDrop()) {
      zone.classList.remove(ACTIVE_CLASS);
      return;
    }

    event.preventDefault();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
    zone.classList.add(ACTIVE_CLASS);
  });

  zone.addEventListener('dragleave', (event) => {
    const next = event.relatedTarget;

    if (next instanceof Node && zone.contains(next)) {
      return;
    }
    zone.classList.remove(ACTIVE_CLASS);
  });

  zone.addEventListener('drop', (event) => {
    event.preventDefault();
    zone.classList.remove(ACTIVE_CLASS);

    if (!isIngredientDrag(event) || !options.canDrop()) {
      return;
    }

    const id = event.dataTransfer?.getData(INGREDIENT_MIME);

    if (id) {
      options.onDrop(id);
    }
  });
}