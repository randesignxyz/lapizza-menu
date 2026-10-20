export function isOpeningSwipe(start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return dx < -55 && Math.abs(dx) > Math.abs(dy) * 1.5;
}

export function initBookCover() {
  const dialog = document.getElementById('bookCover');
  const cover = document.getElementById('openBook');
  const heading = document.getElementById('categoryTitle');
  let opening = false;
  let touchStart = null;

  function openMenu() {
    if (opening || !dialog.open) return;
    opening = true;
    window.scrollTo({ top: 0, behavior: 'instant' });
    dialog.classList.add('is-opening');
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 0
      : 1050;
    window.setTimeout(() => {
      dialog.close();
      dialog.classList.remove('is-opening');
      opening = false;
      heading.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, delay);
  }

  cover.addEventListener('click', openMenu);
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    openMenu();
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      openMenu();
    }
  });
  cover.addEventListener(
    'touchstart',
    (event) => {
      const touch = event.changedTouches[0];
      touchStart = { x: touch.clientX, y: touch.clientY };
    },
    { passive: true },
  );
  cover.addEventListener(
    'touchend',
    (event) => {
      if (!touchStart) return;
      const touch = event.changedTouches[0];
      if (isOpeningSwipe(touchStart, { x: touch.clientX, y: touch.clientY }))
        openMenu();
      touchStart = null;
    },
    { passive: true },
  );
  cover.addEventListener(
    'touchcancel',
    () => {
      touchStart = null;
    },
    { passive: true },
  );
  dialog.showModal();
}
