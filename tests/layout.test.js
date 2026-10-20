import test from 'node:test';
import assert from 'node:assert/strict';
import { readMenuView } from '../src/menu/layout.js';

test('V2 opens in grid view unless the customer explicitly chose list', () => {
  for (const value of [null, 'grid', 'unexpected']) {
    assert.equal(readMenuView({ getItem: () => value }), 'grid');
  }
  assert.equal(readMenuView({ getItem: () => 'list' }), 'list');
  assert.equal(
    readMenuView({
      getItem() {
        throw Error('unavailable');
      },
    }),
    'grid',
  );
});

test('V1 view preference does not override the new V2 default', () => {
  assert.equal(
    readMenuView({
      getItem: (key) => (key === 'lapizza-menu-view' ? 'grid' : null),
    }),
    'grid',
  );
});
