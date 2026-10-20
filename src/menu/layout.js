const STORAGE_KEY = 'lapizza-v2-menu-view';

export function readMenuView(storage) {
  try {
    return (storage ?? globalThis.localStorage).getItem(STORAGE_KEY) === 'list'
      ? 'list'
      : 'grid';
  } catch {
    return 'grid';
  }
}

export function initMenuLayout({ dishes, controls }) {
  function apply(view) {
    dishes.classList.toggle('dish-list', view === 'list');
    controls.querySelectorAll('[data-menu-view]').forEach((button) => {
      button.setAttribute(
        'aria-pressed',
        String(button.dataset.menuView === view),
      );
    });
  }

  apply(readMenuView());
  controls.addEventListener('click', (event) => {
    const button = event.target.closest('[data-menu-view]');
    if (!button || !controls.contains(button)) return;
    const view = button.dataset.menuView;
    if (view !== 'grid' && view !== 'list') return;
    apply(view);
    try {
      globalThis.localStorage.setItem(STORAGE_KEY, view);
    } catch {
      // The selection still works when persistent storage is unavailable.
    }
  });
}
