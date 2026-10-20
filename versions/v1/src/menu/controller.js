import { initMenuLayout } from './layout.js';
import { createDishCard } from './view.js';
import { filterDishes, money } from './model.js';
import { loadMenu } from './repository.js';
import { readFavourites, writeFavourites } from './storage.js';

export async function initMenu() {
  let loaded = false;
  let items = [],
    category = 'All dishes',
    onlySaved = false,
    activeDish = null;
  const categories = [
    'All dishes',
    'Starters',
    'Pasta',
    'Pizza',
    'Main courses',
    'Desserts',
  ];
  const saved = readFavourites();
  const $ = (id) => document.getElementById(id);
  initMenuLayout({ dishes: $('dishes'), controls: $('menuView') });
  let toastTimer;
  function toast(s) {
    $('toast').textContent = s;
    $('toast').classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('toast').classList.remove('show'), 2200);
  }
  function store() {
    writeFavourites(saved);
  }
  function toggle(id) {
    saved.has(id) ? saved.delete(id) : saved.add(id);
    store();
    render();
    if (activeDish) syncDetail();
    toast(
      saved.has(id) ? 'Saved to your favourites' : 'Removed from favourites',
    );
  }
  function render() {
    if (!loaded) return;
    let q = $('search').value.trim().toLocaleLowerCase(),
      filtered = filterDishes(items, { category, onlySaved, saved, query: q });
    $('categories')
      .querySelectorAll('button')
      .forEach((button) => {
        const active = button.textContent === category;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    $('categoryTitle').textContent = onlySaved
      ? 'Your favourites'
      : q
        ? 'Search results'
        : category;
    $('resultCount').textContent =
      `${filtered.length} ${filtered.length === 1 ? 'dish' : 'dishes'}`;
    $('dishes').replaceChildren(
      ...filtered.map((dish) =>
        createDishCard(dish, { saved, onToggle: toggle, onDetail: detail }),
      ),
    );
    $('empty').hidden = filtered.length > 0;
    $('savedCount').textContent = items.filter((d) => saved.has(d.id)).length;
    $('favourites').setAttribute('aria-pressed', String(onlySaved));
    $('favourites').textContent = onlySaved
      ? '♥ Saved dishes'
      : '♡ Saved dishes';
  }
  function syncDetail() {
    let d = activeDish;
    $('detailSave').textContent = saved.has(d.id) ? '♥ Saved' : '♡ Save dish';
    $('detailSave').setAttribute('aria-pressed', String(saved.has(d.id)));
  }
  function detail(d) {
    activeDish = d;
    $('detailCategory').textContent = d.category;
    $('detailName').textContent = d.name;
    $('detailDescription').textContent =
      d.description ||
      'Please ask our team for the ingredients and preparation details.';
    $('detailPrice').textContent = money(d.price);
    syncDetail();
    $('detail').showModal();
  }
  $('search').oninput = render;
  $('favourites').onclick = () => {
    onlySaved = !onlySaved;
    render();
  };
  $('savedTop').onclick = () => {
    onlySaved = true;
    category = 'All dishes';
    $('search').value = '';
    render();
    $('menu').scrollIntoView();
  };
  $('reset').onclick = () => {
    category = 'All dishes';
    onlySaved = false;
    $('search').value = '';
    render();
  };
  document.querySelector('.close').onclick = () => $('detail').close();
  $('detail').onclick = (e) => {
    if (e.target === $('detail')) {
      let r = $('detail').getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        $('detail').close();
    }
  };
  $('detailSave').onclick = () => toggle(activeDish.id);
  document.addEventListener('keydown', (e) => {
    if (
      e.key === '/' &&
      !['INPUT', 'TEXTAREA', 'SELECT'].includes(
        document.activeElement.tagName,
      ) &&
      !document.activeElement.isContentEditable &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      !$('detail').open
    ) {
      e.preventDefault();
      $('search').focus();
    }
  });
  function selectCategory(name) {
    category = name;
    onlySaved = false;
    $('search').value = '';
    render();
  }
  $('categories').replaceChildren(
    ...categories.map((name) => {
      const b = document.createElement('button');
      b.textContent = name;
      b.classList.toggle('active', category === name);
      b.setAttribute('aria-pressed', String(category === name));
      b.onclick = () => {
        category = name;
        render();
      };
      return b;
    }),
  );
  $('dishes').setAttribute('aria-busy', 'true');
  $('resultCount').textContent = 'Loading menu…';
  try {
    items = await loadMenu();
    loaded = true;
    render();
  } catch (error) {
    $('resultCount').textContent = 'Menu unavailable';
    $('dishes').textContent =
      'We couldn’t load the menu. Please refresh the page or ask our team for a menu.';
    console.error('Unable to load menu:', error);
  } finally {
    $('dishes').setAttribute('aria-busy', 'false');
  }
  return { selectCategory };
}
