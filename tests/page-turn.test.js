import test from 'node:test';
import assert from 'node:assert/strict';
import { createPageTurn } from '../src/book/page-turn.js';

const createSheet = (page) => ({ animate: page.animate, remove() {} });

function mockPage(animate) {
  const classes = new Set();
  return {
    inert: false,
    classList: {
      add: (value) => classes.add(value),
      remove: (value) => classes.delete(value),
    },
    animate,
    classes,
  };
}

test('reduced motion switches immediately and restores interaction', async () => {
  const page = mockPage(() => {
    throw Error('should not animate');
  });
  let updates = 0;
  await createPageTurn(page, { reducedMotion: () => true })(() => {
    updates++;
  });
  assert.equal(updates, 1);
  assert.equal(page.inert, false);
  assert.equal(page.classes.size, 0);
});

test('rapid category selections keep only the latest pending request', async () => {
  let finishFirst;
  let calls = 0;
  const page = mockPage(() => ({
    finished:
      ++calls === 1
        ? new Promise((resolve) => {
            finishFirst = resolve;
          })
        : Promise.resolve(),
    cancel() {},
  }));
  const turn = createPageTurn(page, {
    reducedMotion: () => false,
    createSheet,
  });
  const updates = [];
  const done = turn(() => updates.push('Pasta'));
  turn(() => updates.push('Pizza'));
  turn(() => updates.push('Desserts'));
  assert.equal(page.inert, true);
  assert.deepEqual(
    updates,
    ['Pasta'],
    'incoming page is rendered before the turn finishes',
  );
  finishFirst();
  await done;
  assert.deepEqual(updates, ['Pasta', 'Desserts']);
  assert.equal(page.inert, false);
  assert.equal(page.classes.size, 0);
});

test('cancelled browser animations still commit the category and release the page', async () => {
  const page = mockPage(() => ({
    finished: Promise.reject(Error('cancelled')),
    cancel() {},
  }));
  let updated = false;
  await createPageTurn(page, { reducedMotion: () => false, createSheet })(
    () => {
      updated = true;
    },
  );
  assert.equal(updated, true);
  assert.equal(page.inert, false);
});
