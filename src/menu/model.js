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

// Serving entries share the original ID, photo and favourite state.
export function groupWines(items) {
  const wines = items.filter((dish) => dish.category === 'Wine');
  const serving = (wine, unit) => ({
    ...wine,
    serving: unit,
    servingPrice: unit === 'glass' ? wine.glassPrice : wine.price,
  });
  const byType = (type, unit) => wines
    .filter((wine) => wine.wineType === type &&
      (unit !== 'glass' || wine.glassPrice !== undefined))
    .map((wine) => serving(wine, unit));
  return [
    { name: 'Red Wine by the Glass', items: byType('red', 'glass') },
    { name: 'White Wine by the Glass', items: byType('white', 'glass') },
    { name: 'Rosé Wine', items: wines.filter((wine) => wine.wineType === 'rose')
      .flatMap((wine) => [
        ...(wine.glassPrice === undefined ? [] : [serving(wine, 'glass')]),
        serving(wine, 'bottle'),
      ]) },
    { name: 'Red Wine by the Bottle', items: byType('red', 'bottle') },
    { name: 'White Wine by the Bottle', items: byType('white', 'bottle') },
  ].filter((group) => group.items.length);
}
