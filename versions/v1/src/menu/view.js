import { money } from './model.js';

function make(tag, cls, text) {
  let e = document.createElement(tag);
  e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}
export function createDishCard(d, { saved, onToggle, onDetail }) {
  let c = make('article', 'dish'),
    top = make('div', 'dish-top'),
    label = make('span', 'category-label', d.category),
    s = make('button', 'save', saved.has(d.id) ? '♥' : '♡');
  s.type = 'button';
  s.setAttribute(
    'aria-label',
    `${saved.has(d.id) ? 'Remove' : 'Save'} ${d.name}${saved.has(d.id) ? ' from favourites' : ' to favourites'}`,
  );
  s.setAttribute('aria-pressed', String(saved.has(d.id)));
  s.onclick = () => onToggle(d.id);
  top.append(label, s);
  let title = make('button', 'dish-name', d.name);
  title.onclick = () => onDetail(d);
  let desc = make('p', '', d.description || 'Ask our team for more details.');
  let bottom = make('div', 'dish-bottom');
  bottom.append(
    make('span', 'price', money(d.price)),
    make('span', 'view', 'View dish ↗'),
  );
  const imageButton = make('button', 'dish-image-button');
  imageButton.type = 'button';
  imageButton.setAttribute('aria-label', `View ${d.name}`);
  imageButton.onclick = () => onDetail(d);
  const image = document.createElement('img');
  image.className = 'dish-image';
  image.width = 800;
  image.height = 600;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.alt = d.imageAlt || d.name;
  const fallback = new URL(
    '../../assets/images/dish-placeholder.svg',
    import.meta.url,
  ).href;
  image.addEventListener(
    'error',
    () => {
      image.srcset = '';
      image.src = fallback;
      image.alt = 'La Pizza — photo unavailable';
    },
    { once: true },
  );
  image.src = d.image || fallback;
  imageButton.append(image);
  const content = make('div', 'dish-content');
  content.append(top, title, desc, bottom);
  c.append(imageButton, content);
  return c;
}
