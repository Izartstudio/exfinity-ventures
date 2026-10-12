import test from 'node:test';
import assert from 'node:assert/strict';
import { founderSlot } from '../types/homepage.ts';

for (const [layout, count, visibleCount] of [['three', 3, 3], ['three', 4, 3], ['five', 5, 5], ['five', 6, 5], ['five', 8, 5]]) {
  test(`${layout} layout keeps ${visibleCount} visible slots while rotating ${count} founders`, () => {
    const seen = new Set();
    for (let active = 0; active < count * 2; active++) {
      const slots = Array.from({ length: count }, (_, index) => ({ index, ...founderSlot(index, active % count, count, layout) }));
      const visible = slots.filter(slot => slot.visible);
      assert.equal(visible.length, visibleCount);
      assert.equal(new Set(visible.map(slot => slot.offset)).size, visibleCount);
      assert.equal(slots[active % count].offset, 0);
      for (const slot of visible) seen.add(slot.index);
    }
    assert.equal(seen.size, count);
  });
}
