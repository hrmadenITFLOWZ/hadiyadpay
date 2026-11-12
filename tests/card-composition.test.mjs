import assert from 'node:assert/strict';
import test from 'node:test';
import { createEditorRuntimeState } from '../src/lib/card-editor.ts';
import { getCardComposition, renderCardSvg } from '../src/lib/card-composition.ts';

const localized = { so: 'Qaate', en: 'Recipient', nl: 'Ontvanger' };
const birthday = {
  id: 'dhalasho',
  slug: 'birthday-greeting',
  title: { so: 'Dhalasho', en: 'Birthday', nl: 'Verjaardag' },
  defaultRecipient: localized,
  defaultSender: { so: 'Diraha', en: 'Sender', nl: 'Verzender' },
  defaultMessage: { so: 'Fariin', en: 'Message', nl: 'Bericht' },
  orientation: 'portrait',
  artwork: {
    type: 'local-image',
    src: '/images/cards/birthday.svg',
    alt: localized,
    owner: 'hadiyadpay',
  },
};

test('birthday front reserves its lower text area and inside has its own layout', () => {
  const front = getCardComposition(birthday, 'front');
  const inside = getCardComposition(birthday, 'inside');
  const draft = createEditorRuntimeState(birthday, 'nl').draft;

  assert.equal(front.protectsBirthdayArtwork, true);
  assert.deepEqual(front.defaultTextPositions.message, { x: 50, y: 80 });
  assert.deepEqual(front.defaultPhotoPosition, { x: 89, y: 31 });
  assert.equal(front.textHeights.message, 23);
  assert.equal(inside.showArtwork, false);
  assert.deepEqual(inside.defaultTextPositions.message, { x: 50, y: 53 });

  const frontSvg = renderCardSvg(birthday, 'nl', 'front', draft.front, 'data:image/svg+xml;base64,Y2FrZQ==');
  const insideSvg = renderCardSvg(birthday, 'nl', 'inside', draft.inside, 'data:image/svg+xml;base64,Y2FrZQ==');

  assert.match(frontSvg, /data:image\/svg\+xml;base64,Y2FrZQ==/);
  assert.doesNotMatch(insideSvg, /data:image\/svg\+xml;base64,Y2FrZQ==/);
  assert.doesNotMatch(frontSvg, /fill-opacity="\.28"/);
  assert.match(insideSvg, /#fffaf0/);
});
