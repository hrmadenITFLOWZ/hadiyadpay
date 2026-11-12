import assert from 'node:assert/strict';
import test from 'node:test';
import { createEditorRuntimeState, editorReducer } from '../src/lib/card-editor.ts';

const localized = { so: 'Qaate', en: 'Recipient', nl: 'Ontvanger' };
const card = {
  id: 'test-card',
  defaultRecipient: localized,
  defaultSender: { so: 'Diraha', en: 'Sender', nl: 'Verzender' },
  defaultMessage: { so: 'Fariin', en: 'Message', nl: 'Bericht' },
};

test('dragged text positions are bounded, undoable, and redoable', () => {
  const initial = createEditorRuntimeState(card, 'en');
  const moved = editorReducer(initial, {
    type: 'SET_TEXT_POSITION',
    layer: 'message',
    position: { x: 120, y: -10 },
  });

  assert.deepEqual(moved.draft.front.textPositions.message, { x: 100, y: 0 });

  const undone = editorReducer(moved, { type: 'UNDO' });
  assert.deepEqual(undone.draft.front.textPositions.message, { x: 50, y: 70 });

  const redone = editorReducer(undone, { type: 'REDO' });
  assert.deepEqual(redone.draft.front.textPositions.message, { x: 100, y: 0 });
});

test('a pointer drag is stored as one undoable editor action', () => {
  const initial = createEditorRuntimeState(card, 'en');
  const preview = editorReducer(initial, {
    type: 'SET_TEXT_POSITION',
    layer: 'recipient',
    position: { x: 65, y: 30 },
    recordHistory: false,
  });
  const committed = editorReducer(preview, { type: 'COMMIT_DRAFT' });

  assert.equal(preview.history.length, 1);
  assert.equal(committed.history.length, 2);
  assert.deepEqual(editorReducer(committed, { type: 'UNDO' }).draft.front.textPositions.recipient, { x: 50, y: 14 });
});

test('photo movement and transforms stay within editor limits', () => {
  const initial = createEditorRuntimeState(card, 'en');
  const withPhoto = editorReducer(initial, {
    type: 'UPLOAD_PHOTO',
    photo: {
      src: 'blob:photo',
      width: 1200,
      height: 900,
      scale: 1,
      x: 50,
      y: 50,
      rotation: 0,
    },
  });
  const adjusted = editorReducer(withPhoto, {
    type: 'ADJUST_PHOTO',
    changes: { x: 120, y: -20, scale: 5, rotation: 270 },
  });

  assert.deepEqual(
    {
      x: adjusted.draft.front.photo?.x,
      y: adjusted.draft.front.photo?.y,
      scale: adjusted.draft.front.photo?.scale,
      rotation: adjusted.draft.front.photo?.rotation,
    },
    { x: 100, y: 0, scale: 3, rotation: 180 },
  );
});
