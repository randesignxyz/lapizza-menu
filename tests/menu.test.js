import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { filterDishes, validateMenu, money, groupWines } from '../src/menu/model.js';
import { readFavourites, writeFavourites } from '../src/menu/storage.js';

const menu = JSON.parse(
  await readFile(new URL('../menu.json', import.meta.url), 'utf8'),
);

test('production menu has valid unique dishes and prices', () => {
  assert.equal(validateMenu(menu), menu);
  assert.ok(menu.length > 0);
});

test('search combines category and favourites filters', () => {
  const saved = new Set(['pizza3', 'pasta0']);
  assert.deepEqual(
    filterDishes(menu, {
      category: 'Pizza',
      onlySaved: true,
      saved,
      query: ' BASIL ',
    }).map((dish) => dish.id),
    ['pizza3'],
  );
  assert.equal(
    filterDishes(menu, { query: 'nonexistent ingredient' }).length,
    0,
  );
  assert.equal(filterDishes(menu).length, menu.length);
  assert.equal(filterDishes(menu, { onlySaved: true }).length, 0);
});

test('invalid prices and duplicate ids fail at the data boundary', () => {
  for (const price of [-1, NaN, Infinity, '6']) {
    assert.throws(() => validateMenu([{ ...menu[0], price }]), TypeError);
  }
  assert.throws(() => validateMenu([menu[0], menu[0]]), TypeError);
  assert.throws(() => validateMenu({}), TypeError);
  assert.equal(money(6.5), '$6.50');
});

test('favourites survive round trips and tolerate corrupt or unavailable storage', () => {
  let value;
  const storage = {
    getItem: () => value,
    setItem: (key, next) => {
      value = next;
    },
  };
  writeFavourites(new Set(['pizza3']), storage);
  assert.deepEqual([...readFavourites(storage)], ['pizza3']);
  for (const invalid of ['{', '{}', 'null', '42']) {
    value = invalid;
    assert.equal(readFavourites(storage).size, 0);
  }
  value = '["pizza3",42,null]';
  assert.deepEqual([...readFavourites(storage)], ['pizza3']);
  const blocked = {
    getItem() {
      throw Error('blocked');
    },
    setItem() {
      throw Error('blocked');
    },
  };
  assert.equal(readFavourites(blocked).size, 0);
  assert.doesNotThrow(() => writeFavourites(new Set(), blocked));
});

test('cocktails can omit prices while food still requires a valid price', () => {
  const cocktail = menu.find((dish) => dish.category === 'Cocktails');
  assert.ok(cocktail);
  assert.equal(validateMenu([{ ...cocktail, price: null }]).length, 1);
  assert.throws(() => validateMenu([{ ...menu[0], price: null }]), TypeError);
  assert.throws(() => validateMenu([{ ...cocktail, price: -1 }]), TypeError);
});

test('wine supports bottle and glass prices with valid amounts', () => {
  const wine = menu.find((dish) => dish.id === 'wine0');
  assert.equal(wine.price, 25);
  assert.equal(wine.glassPrice, 5);
  assert.equal(validateMenu([wine]).length, 1);
  for (const glassPrice of [-1, NaN, '5']) {
    assert.throws(() => validateMenu([{ ...wine, glassPrice }]), TypeError);
  }
});

test('wine groups use the requested order, serving prices and original photos', () => {
  const groups = groupWines(menu);
  assert.deepEqual(groups.map((group) => group.name), [
    'Red Wine by the Glass', 'White Wine by the Glass', 'Rosé Wine',
    'Red Wine by the Bottle', 'White Wine by the Bottle',
  ]);
  const glass = groups[0].items.find((wine) => wine.id === 'wine0');
  const bottle = groups[3].items.find((wine) => wine.id === 'wine0');
  assert.equal(glass.servingPrice, 5);
  assert.equal(bottle.servingPrice, 25);
  assert.equal(glass.image, bottle.image);
  for (const wine of menu.filter((dish) => dish.category === 'Wine')) {
    const entries = groups.flatMap((group) => group.items)
      .filter((entry) => entry.id === wine.id);
    assert.equal(entries.length, wine.glassPrice === undefined ? 1 : 2);
    assert.ok(entries.every((entry) => entry.image === wine.image));
  }
  assert.equal(groupWines(filterDishes(menu, { query: 'Montepulciano' })).length, 2);
});
