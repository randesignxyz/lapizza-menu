import test from 'node:test';
import assert from 'node:assert/strict';
import { readMenuView } from '../src/menu/layout.js';

test('V2 opens in book/list view unless the customer explicitly chose grid', () => {
  for (const value of [null, 'list', 'unexpected']) {
    assert.equal(readMenuView({ getItem: () => value }), 'list');
  }
  assert.equal(readMenuView({ getItem: () => 'grid' }), 'grid');
  assert.equal(
    readMenuView({
      getItem() {
        throw Error('unavailable');
      },
    }),
    'list',
  );
});

test('V1 view preference does not override the new V2 default', () => {
  assert.equal(
    readMenuView({
      getItem: (key) => (key === 'lapizza-menu-view' ? 'grid' : null),
    }),
    'list',
  );
});
