function createTurningSheet(page) {
  const layer = document.createElement('div');
  layer.className = 'page-turn-layer';
  layer.setAttribute('aria-hidden', 'true');
  layer.inert = true;
  const sheet = page.cloneNode(true);
  sheet.classList.remove('page-turning');
  sheet.classList.add('page-turn-sheet');
  // The snapshot is visual only; leave IDs and accessible controls on the live page.
  sheet.removeAttribute('id');
  sheet
    .querySelectorAll('[id]')
    .forEach((element) => element.removeAttribute('id'));
  const dishes = page.querySelector('#dishes');
  const snapshotDishes = sheet.querySelector('.dish-grid');
  if (dishes && snapshotDishes) {
    snapshotDishes.style.flex = '1';
    snapshotDishes.style.minHeight = '0';
    snapshotDishes.style.overflowY = 'auto';
    snapshotDishes.style.scrollbarGutter = 'stable';
  }
  layer.append(sheet);
  page.parentElement.append(layer);
  if (dishes && snapshotDishes) snapshotDishes.scrollTop = dishes.scrollTop;
  return {
    animate: (frames, options) => sheet.animate(frames, options),
    remove: () => layer.remove(),
  };
}

// Forward turns lift the old sheet; backward turns lay the previous page down.
export function createPageTurn(
  page,
  {
    reducedMotion = () =>
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    createSheet = createTurningSheet,
  } = {},
) {
  let pending = null;
  let running = false;

  async function flush() {
    running = true;
    const wasInert = page.inert;
    page.inert = true;
    page.classList.add('page-turning');
    try {
      while (pending) {
        const { update, backwards } = pending;
        pending = null;
        if (reducedMotion() || typeof page.animate !== 'function') {
          update();
          continue;
        }
        const sheet = createSheet(page);
        let incomingSheet;
        let animation;
        try {
          update();
          // A returning page swings back onto the outgoing page from the spine.
          if (backwards) incomingSheet = createSheet(page);
          animation = (incomingSheet || sheet).animate(
            backwards
              ? [
                  { transform: 'rotateY(-100deg)', filter: 'brightness(.8)', opacity: 0 },
                  { transform: 'rotateY(-65deg)', filter: 'brightness(.88)', opacity: 1, offset: 0.35 },
                  { transform: 'rotateY(0deg)', filter: 'brightness(1)', opacity: 1 },
                ]
              : [
              {
                transform: 'rotateY(0deg)',
                filter: 'brightness(1)',
                opacity: 1,
              },
              {
                transform: 'rotateY(-65deg)',
                filter: 'brightness(.88)',
                opacity: 1,
                offset: 0.65,
              },
              {
                transform: 'rotateY(-100deg)',
                filter: 'brightness(.8)',
                opacity: 0,
              },
            ],
            {
              duration: 1050,
              easing: backwards
                ? 'cubic-bezier(.22, .05, .25, 1)'
                : 'cubic-bezier(.32, 0, .18, 1)',
              fill: 'forwards',
            },
          );
          await animation.finished;
        } catch {
          // The live page is already updated if an animation is cancelled.
        } finally {
          animation?.cancel();
          incomingSheet?.remove();
          sheet.remove();
        }
      }
    } finally {
      page.inert = wasInert;
      page.classList.remove('page-turning');
      running = false;
    }
  }

  return function turnPage(update, { backwards = false } = {}) {
    pending = { update, backwards };
    if (!running) return flush();
  };
}
