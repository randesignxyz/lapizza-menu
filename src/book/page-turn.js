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
  layer.append(sheet);
  page.parentElement.append(layer);
  return {
    animate: (frames, options) => sheet.animate(frames, options),
    remove: () => layer.remove(),
  };
}

// The new page renders underneath a snapshot of the previous sheet.
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
        let animation;
        try {
          update();
          // Keep the incoming page visible throughout the slower turn.
          animation = sheet.animate(
            [
              {
                transform: 'rotateY(0deg)',
                filter: 'brightness(1)',
                opacity: 1,
              },
              {
                transform: `rotateY(${backwards ? 65 : -65}deg)`,
                filter: 'brightness(.88)',
                opacity: 1,
                offset: 0.65,
              },
              {
                transform: `rotateY(${backwards ? 100 : -100}deg)`,
                filter: 'brightness(.8)',
                opacity: 0,
              },
            ],
            {
              duration: 1050,
              easing: 'cubic-bezier(.32, 0, .18, 1)',
              fill: 'forwards',
            },
          );
          await animation.finished;
        } catch {
          // The live page is already updated if an animation is cancelled.
        } finally {
          animation?.cancel();
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
