import assert from 'node:assert/strict';
import test from 'node:test';
import { createGuestOrderToken, hashGuestOrderToken, matchesGuestOrderToken } from '../src/lib/order-token.ts';

test('a guest order token only matches the hash stored for its own order', () => {
  const firstOrderToken = createGuestOrderToken();
  const secondOrderToken = createGuestOrderToken();
  const firstOrderHash = hashGuestOrderToken(firstOrderToken);

  assert.equal(matchesGuestOrderToken(firstOrderToken, firstOrderHash), true);
  assert.equal(matchesGuestOrderToken(secondOrderToken, firstOrderHash), false);
  assert.equal(matchesGuestOrderToken(undefined, firstOrderHash), false);
});
