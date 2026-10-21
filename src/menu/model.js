export const money = (amount) => amount === null ? '' : `$${amount.toFixed(2)}`;

export function filterDishes(
  items,
  {
    category = 'All dishes',
    onlySaved = false,
    saved = new Set(),
    query = '',
  } = {},
) {
  const search = query.trim().toLocaleLowerCase();
  return items.filter(
    (dish) =>
      (category === 'All dishes' || dish.category === category) &&
      (!onlySaved || saved.has(dish.id)) &&
      `${dish.name} ${dish.description} ${dish.category}`
        .toLocaleLowerCase()
        .includes(search),
  );
}

export function validateMenu(data) {
  if (!Array.isArray(data)) throw new TypeError('Menu must be an array');
  const ids = new Set();
  for (const dish of data) {
    if (
      !dish ||
      typeof dish.id !== 'string' ||
      !dish.id.trim() ||
      ids.has(dish.id) ||
      typeof dish.name !== 'string' ||
      !dish.name.trim() ||
      typeof dish.category !== 'string' ||
      !dish.category.trim() ||
      typeof dish.description !== 'string' ||
      (dish.glassPrice !== undefined &&
        (!Number.isFinite(dish.glassPrice) || dish.glassPrice < 0)) ||
      (!(dish.category === 'Cocktails' && dish.price === null) &&
        (!Number.isFinite(dish.price) || dish.price < 0))
    ) {
      throw new TypeError('Menu contains an invalid or duplicate dish');
    }
    ids.add(dish.id);
  }
  return data;
}
