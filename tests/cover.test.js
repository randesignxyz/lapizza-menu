import test from 'node:test';
import assert from 'node:assert/strict';
import { isOpeningSwipe } from '../src/book/cover.js';

test('book opens with an intentional left swipe', () => {
  assert.equal(isOpeningSwipe({ x: 200, y: 100 }, { x: 100, y: 110 }), true);
  assert.equal(isOpeningSwipe({ x: 100, y: 100 }, { x: 200, y: 100 }), false);
  assert.equal(isOpeningSwipe({ x: 200, y: 100 }, { x: 180, y: 100 }), false);
  assert.equal(isOpeningSwipe({ x: 200, y: 100 }, { x: 120, y: 250 }), false);
});
