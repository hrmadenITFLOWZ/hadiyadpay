import {
  editorColorOptions,
  createEditorRuntimeState,
  PHOTO_SCALE_MAX,
  PHOTO_SCALE_MIN,
  type EditorDraft,
  type EditorPhotoLayer,
  type EditorPosition,
  type EditorSideState,
  type EditorTextFontFamily,
  type EditorTextLayer,
  type EditorTextStyle,
} from './card-editor';
import type { CardLanguage, CardOption } from './card-types';

export interface SerializableOrderDraft extends Omit<EditorDraft, 'front' | 'inside'> {
  front: Omit<EditorSideState, 'photo'> & { photo: Omit<EditorPhotoLayer, 'src' | 'requiresReselection'> | null };
  inside: Omit<EditorSideState, 'photo'> & { photo: Omit<EditorPhotoLayer, 'src' | 'requiresReselection'> | null };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function boundedNumber(value: unknown, min: number, max: number, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(Math.max(parsed, min), max) : fallback;
}

function parseStyle(value: unknown, fallback: EditorTextStyle): EditorTextStyle {
  if (!isRecord(value)) return fallback;
  const family: EditorTextFontFamily =
    value.family === 'serif' || value.family === 'mono' ? value.family : 'sans';

  return {
    color: typeof value.color === 'string' && editorColorOptions.includes(value.color)
      ? value.color
      : fallback.color,
    align: value.align === 'left' || value.align === 'right' ? value.align : 'center',
    size: boundedNumber(value.size, 18, 52, fallback.size),
    family,
    bold: value.bold === true,
    italic: value.italic === true,
    underline: value.underline === true,
  };
}

function parsePosition(value: unknown, fallback: EditorPosition): EditorPosition {
  if (!isRecord(value)) return fallback;
  return {
    x: boundedNumber(value.x, 0, 100, fallback.x),
    y: boundedNumber(value.y, 0, 100, fallback.y),
  };
}

function parseSide(
  value: unknown,
  fallback: EditorSideState,
  hasPhotoFile: boolean,
): EditorSideState {
  if (!isRecord(value)) throw new Error('Invalid card side');

  const recipient = value.recipient;
  const sender = value.sender;
  const message = value.message;
  if (
    typeof recipient !== 'string' ||
    recipient.length > 80 ||
    typeof sender !== 'string' ||
    sender.length > 80 ||
    typeof message !== 'string' ||
    message.length > 800
  ) throw new Error('Invalid card text');

  const styles = isRecord(value.textStyles) ? value.textStyles : {};
  const legacyStyle = parseStyle(value.textStyle, fallback.textStyle);
  const textStyles = (['recipient', 'sender', 'message'] as const).reduce(
    (result, layer) => {
      result[layer] = parseStyle(styles[layer], legacyStyle);
      return result;
    },
    {} as Record<EditorTextLayer, EditorTextStyle>,
  );
  const positions = isRecord(value.textPositions) ? value.textPositions : {};
  const textPositions = (['recipient', 'sender', 'message'] as const).reduce(
    (result, layer) => {
      result[layer] = parsePosition(positions[layer], fallback.textPositions[layer]);
      return result;
    },
    {} as Record<EditorTextLayer, EditorPosition>,
  );

  let photo: EditorPhotoLayer | null = null;
  if (value.photo !== null && value.photo !== undefined) {
    if (!isRecord(value.photo) || !hasPhotoFile) {
      throw new Error('Reselect the card photo before checkout');
    }
    photo = {
      width: boundedNumber(value.photo.width, 1, 5000, 768),
      height: boundedNumber(value.photo.height, 1, 5000, 768),
      scale: boundedNumber(value.photo.scale, PHOTO_SCALE_MIN, PHOTO_SCALE_MAX, 1),
      x: boundedNumber(value.photo.x, 0, 100, 50),
      y: boundedNumber(value.photo.y, 0, 100, 50),
      rotation: boundedNumber(value.photo.rotation, -180, 180, 0),
      requiresReselection: false,
    };
  } else if (hasPhotoFile) {
    throw new Error('Unexpected card photo');
  }

  return {
    recipient,
    sender,
    message,
    textStyle: legacyStyle,
    textStyles,
    textPositions,
    photo,
  };
}

export function serializeEditorDraft(draft: EditorDraft): SerializableOrderDraft {
  const serializeSide = (side: EditorSideState): SerializableOrderDraft['front'] => ({
    ...side,
    photo: side.photo
      ? {
          width: side.photo.width,
          height: side.photo.height,
          scale: side.photo.scale,
          x: side.photo.x,
          y: side.photo.y,
          rotation: side.photo.rotation,
        }
      : null,
  });

  return {
    side: draft.side,
    previewMode: draft.previewMode,
    front: serializeSide(draft.front),
    inside: serializeSide(draft.inside),
  };
}

export function parseOrderDraft(
  value: unknown,
  card: CardOption,
  language: CardLanguage,
  hasFrontPhoto: boolean,
  hasInsidePhoto: boolean,
): EditorDraft {
  if (!isRecord(value)) throw new Error('Invalid card draft');
  const defaults = createEditorRuntimeState(card, language).draft;
  return {
    side: value.side === 'inside' ? 'inside' : 'front',
    previewMode: 'clean',
    front: parseSide(value.front, defaults.front, hasFrontPhoto),
    inside: parseSide(value.inside, defaults.inside, hasInsidePhoto),
  };
}
