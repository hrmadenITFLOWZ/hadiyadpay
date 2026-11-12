import type { CardLanguage, CardOption } from './card-types';

export const DRAFT_STORAGE_VERSION = 4;
export const DRAFT_STORAGE_PREFIX = 'hadiyadpay:editor-draft';

export type EditorSide = 'front' | 'inside';
export type EditorTextLayer = 'recipient' | 'sender' | 'message';
export type EditorTextAlign = 'left' | 'center' | 'right';
export type EditorTextFontFamily = 'sans' | 'serif' | 'mono';
export type EditorPreviewMode = 'edit' | 'clean' | 'full';

export interface EditorPosition {
  x: number;
  y: number;
}

export interface EditorTextStyle {
  color: string;
  align: EditorTextAlign;
  size: number;
  family: EditorTextFontFamily;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

function withSideTextPositionUpdate(
  state: EditorRuntimeState,
  layer: EditorTextLayer,
  position: EditorPosition,
  recordHistory = true,
): EditorRuntimeState {
  const currentState = getSideState(state.draft, state.draft.side);
  const nextDraft = setSideState(state.draft, state.draft.side, {
    ...currentState,
    textPositions: {
      ...currentState.textPositions,
      [layer]: {
        x: clampPosition(position.x),
        y: clampPosition(position.y),
      },
    },
  });

  return recordHistory ? pushHistory(state, nextDraft) : { ...state, draft: nextDraft };
}

export interface EditorPhotoLayer {
  src?: string;
  requiresReselection?: boolean;
  width: number;
  height: number;
  scale: number;
  x: number;
  y: number;
  rotation: number;
}

export interface EditorSideState {
  recipient: string;
  sender: string;
  message: string;
  textStyle: EditorTextStyle;
  textStyles: Record<EditorTextLayer, EditorTextStyle>;
  textPositions: Record<EditorTextLayer, EditorPosition>;
  photo: EditorPhotoLayer | null;
}

export interface EditorDraft {
  side: EditorSide;
  previewMode: EditorPreviewMode;
  front: EditorSideState;
  inside: EditorSideState;
}

interface StoredEditorPhoto {
  requiresReselection: true;
  scale: number;
  x: number;
  y: number;
  rotation: number;
}

interface StoredEditorSide extends Omit<EditorSideState, 'photo'> {
  photo: StoredEditorPhoto | null;
}

interface StoredEditorDraftData extends Omit<EditorDraft, 'front' | 'inside'> {
  front: StoredEditorSide;
  inside: StoredEditorSide;
}

interface StoredEditorDraft {
  version: number;
  cardId: string;
  draft: StoredEditorDraftData;
}

export interface EditorRuntimeState {
  draft: EditorDraft;
  history: EditorDraft[];
  historyIndex: number;
}

export type EditorAction =
  | { type: 'SET_SIDE'; side: EditorSide }
  | { type: 'SET_FIELD'; field: 'recipient' | 'sender' | 'message'; value: string }
  | { type: 'SET_TEXT_STYLE'; layer: EditorTextLayer; style: Partial<EditorTextStyle> }
  | { type: 'SET_TEXT_POSITION'; layer: EditorTextLayer; position: EditorPosition; recordHistory?: boolean }
  | { type: 'SET_TEXT_FORMAT'; layer: EditorTextLayer; field: 'family' | 'bold' | 'italic' | 'underline'; value: string | boolean }
  | { type: 'RESET_TEXT_STYLE'; layer: EditorTextLayer }
  | { type: 'SET_PREVIEW_MODE'; mode: EditorPreviewMode }
  | { type: 'UPLOAD_PHOTO'; photo: EditorPhotoLayer }
  | { type: 'REMOVE_PHOTO' }
  | { type: 'ADJUST_PHOTO'; changes: Partial<Pick<EditorPhotoLayer, 'scale' | 'x' | 'y' | 'rotation'>>; recordHistory?: boolean }
  | { type: 'RESET_PHOTO_TRANSFORM' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'COMMIT_DRAFT' }
  | { type: 'RESET_ACTIVE_SIDE'; card: CardOption; currentLanguage: CardLanguage }
  | { type: 'RESET_CARD'; card: CardOption; currentLanguage: CardLanguage }
  | { type: 'LOAD_DRAFT'; draft: EditorDraft };

export const editorColorOptions = ['#fef3c7', '#f9fafb', '#cfe4d7', '#d8d0ff', '#f7d4d4', '#f7b267'];
export const editorAlignmentOptions: EditorTextAlign[] = ['left', 'center', 'right'];
export const editorFontOptions: EditorTextFontFamily[] = ['sans', 'serif', 'mono'];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const clampFinite = (value: number, min: number, max: number, fallback: number) =>
  clamp(Number.isFinite(value) ? value : fallback, min, max);
const clampPosition = (value: number) => clampFinite(value, 0, 100, 50);

const createDefaultTextStyle = (): EditorTextStyle => ({
  color: '#fef3c7',
  align: 'left',
  size: 30,
  family: 'sans',
  bold: false,
  italic: false,
  underline: false,
});

const createSideState = (card: CardOption, currentLanguage: CardLanguage): EditorSideState => ({
  recipient: card.defaultRecipient[currentLanguage],
  sender: card.defaultSender[currentLanguage],
  message: card.defaultMessage[currentLanguage],
  textStyle: createDefaultTextStyle(),
  textStyles: {
    recipient: createDefaultTextStyle(),
    sender: createDefaultTextStyle(),
    message: createDefaultTextStyle(),
  },
  textPositions: {
    recipient: { x: 50, y: 14 },
    message: { x: 50, y: 70 },
    sender: { x: 50, y: 92 },
  },
  photo: null,
});

function getSideState(draft: EditorDraft, side: EditorSide): EditorSideState {
  return side === 'front' ? draft.front : draft.inside;
}

function setSideState(draft: EditorDraft, side: EditorSide, nextSideState: Partial<EditorSideState>): EditorDraft {
  const key = side === 'front' ? 'front' : 'inside';
  return {
    ...draft,
    [key]: { ...getSideState(draft, side), ...nextSideState },
  } as EditorDraft;
}

function normalizeTextStyle(style: unknown, fallback: EditorTextStyle): EditorTextStyle {
  const safeStyle = style && typeof style === 'object' ? (style as Partial<EditorTextStyle>) : {};
  const familyValue = safeStyle.family === 'serif' || safeStyle.family === 'mono' ? safeStyle.family : 'sans';

  return {
    color: typeof safeStyle.color === 'string' ? safeStyle.color : fallback.color,
    align: safeStyle.align === 'center' || safeStyle.align === 'right' ? safeStyle.align : 'left',
    size: clamp(Number(safeStyle.size ?? fallback.size), 18, 52),
    family: familyValue,
    bold: Boolean(safeStyle.bold),
    italic: Boolean(safeStyle.italic),
    underline: Boolean(safeStyle.underline),
  };
}

function normalizePhoto(rawPhoto: unknown, storageVersion: number): EditorPhotoLayer | null {
  if (!rawPhoto || typeof rawPhoto !== 'object' || Array.isArray(rawPhoto)) return null;

  const candidate = rawPhoto as Partial<EditorPhotoLayer>;
  const hasStoredSource = typeof candidate.src === 'string' && candidate.src.length > 0;
  const hasTransform = candidate.scale !== undefined || candidate.x !== undefined || candidate.y !== undefined || candidate.rotation !== undefined;

  if (!hasStoredSource && !hasTransform && candidate.requiresReselection !== true) return null;

  const legacyX = clampFinite(Number(candidate.x ?? 0), -1000, 1000, 0);
  const legacyY = clampFinite(Number(candidate.y ?? 0), -1000, 1000, 0);
  const x = storageVersion < DRAFT_STORAGE_VERSION ? 50 + legacyX / 4 : Number(candidate.x ?? 50);
  const y = storageVersion < DRAFT_STORAGE_VERSION ? 50 + legacyY / 3.6 : Number(candidate.y ?? 50);

  return {
    requiresReselection: true,
    width: clampFinite(Number(candidate.width ?? 768), 1, 5000, 768),
    height: clampFinite(Number(candidate.height ?? 768), 1, 5000, 768),
    scale: clampFinite(Number(candidate.scale ?? 1), 0.5, 3, 1),
    x: clampPosition(x),
    y: clampPosition(y),
    rotation: clampFinite(Number(candidate.rotation ?? 0), -180, 180, 0),
  };
}

function normalizeSideState(
  rawSideState: unknown,
  card: CardOption,
  currentLanguage: CardLanguage,
  storageVersion: number,
): EditorSideState {
  const fallback = createSideState(card, currentLanguage);
  if (!rawSideState || typeof rawSideState !== 'object') return fallback;

  const candidate = rawSideState as Partial<EditorSideState>;
  const legacyStyle = normalizeTextStyle(candidate.textStyle, fallback.textStyle);
  const candidateStyles = candidate.textStyles;
  const textStyle = (layer: EditorTextLayer) =>
    normalizeTextStyle(
      candidateStyles && typeof candidateStyles === 'object'
        ? (candidateStyles as Partial<Record<EditorTextLayer, EditorTextStyle>>)[layer]
        : candidate.textStyle,
      legacyStyle,
    );
  const candidatePositions = candidate.textPositions;
  const textPositions = (['recipient', 'sender', 'message'] as const).reduce(
    (positions, layer) => {
      const position = candidatePositions?.[layer];
      positions[layer] = {
        x: clampPosition(Number(position?.x ?? fallback.textPositions[layer].x)),
        y: clampPosition(Number(position?.y ?? fallback.textPositions[layer].y)),
      };
      return positions;
    },
    {} as Record<EditorTextLayer, EditorPosition>,
  );

  return {
    recipient: typeof candidate.recipient === 'string' ? candidate.recipient : fallback.recipient,
    sender: typeof candidate.sender === 'string' ? candidate.sender : fallback.sender,
    message: typeof candidate.message === 'string' ? candidate.message : fallback.message,
    textStyle: legacyStyle,
    textStyles: {
      recipient: textStyle('recipient'),
      sender: textStyle('sender'),
      message: textStyle('message'),
    },
    textPositions,
    photo: normalizePhoto(candidate.photo, storageVersion),
  };
}

function normalizeDraft(
  rawDraft: unknown,
  card: CardOption,
  currentLanguage: CardLanguage,
  storageVersion: number,
): EditorDraft {
  const fallbackSide = createSideState(card, currentLanguage);
  const fallback: EditorDraft = {
    side: 'front',
    previewMode: 'edit',
    front: fallbackSide,
    inside: fallbackSide,
  };

  if (!rawDraft || typeof rawDraft !== 'object') return fallback;

  const candidate = rawDraft as Partial<EditorDraft>;
  const sideValue = candidate.side === 'inside' ? 'inside' : 'front';
  const frontState = normalizeSideState(candidate.front, card, currentLanguage, storageVersion);
  const insideState = normalizeSideState(candidate.inside, card, currentLanguage, storageVersion);

  return {
    side: sideValue,
    previewMode: candidate.previewMode === 'clean' || candidate.previewMode === 'full' ? candidate.previewMode : 'edit',
    front: frontState,
    inside: insideState,
  };
}

export function createEditorRuntimeState(card: CardOption, currentLanguage: CardLanguage): EditorRuntimeState {
  const draft: EditorDraft = {
    side: 'front',
    previewMode: 'edit',
    front: createSideState(card, currentLanguage),
    inside: createSideState(card, currentLanguage),
  };

  return {
    draft,
    history: [draft],
    historyIndex: 0,
  };
}

function pushHistory(state: EditorRuntimeState, nextDraft: EditorDraft): EditorRuntimeState {
  const trimmedHistory = state.history.slice(0, state.historyIndex + 1);
  const nextHistory = [...trimmedHistory, nextDraft].slice(-30);
  return {
    draft: nextDraft,
    history: nextHistory,
    historyIndex: nextHistory.length - 1,
  };
}

function withSideFieldUpdate(state: EditorRuntimeState, field: 'recipient' | 'sender' | 'message', value: string): EditorRuntimeState {
  const currentState = getSideState(state.draft, state.draft.side);
  const nextDraft = setSideState(state.draft, state.draft.side, {
    ...currentState,
    [field]: value,
  });

  return pushHistory(state, nextDraft);
}

function withSideTextStyleUpdate(
  state: EditorRuntimeState,
  layer: EditorTextLayer,
  style: Partial<EditorTextStyle>,
): EditorRuntimeState {
  const currentState = getSideState(state.draft, state.draft.side);
  const nextDraft = setSideState(state.draft, state.draft.side, {
    ...currentState,
    textStyles: {
      ...currentState.textStyles,
      [layer]: {
        ...currentState.textStyles[layer],
        ...style,
      },
    },
  });

  return pushHistory(state, nextDraft);
}

function withSidePhotoUpdate(state: EditorRuntimeState, photo: EditorPhotoLayer): EditorRuntimeState {
  const currentState = getSideState(state.draft, state.draft.side);
  const nextDraft = setSideState(state.draft, state.draft.side, {
    ...currentState,
    photo: {
      ...photo,
      requiresReselection: false,
      scale: clampFinite(Number(photo.scale ?? 1), 0.5, 3, 1),
      x: clampPosition(Number(photo.x ?? 50)),
      y: clampPosition(Number(photo.y ?? 50)),
      rotation: clampFinite(Number(photo.rotation ?? 0), -180, 180, 0),
    },
  });
  return pushHistory(state, nextDraft);
}

export function editorReducer(state: EditorRuntimeState, action: EditorAction): EditorRuntimeState {
  switch (action.type) {
    case 'SET_SIDE': {
      const nextDraft = { ...state.draft, side: action.side };
      return pushHistory(state, nextDraft);
    }
    case 'SET_FIELD': {
      return withSideFieldUpdate(state, action.field, action.value);
    }
    case 'SET_TEXT_STYLE': {
      return withSideTextStyleUpdate(state, action.layer, action.style);
    }
    case 'SET_TEXT_POSITION': {
      return withSideTextPositionUpdate(state, action.layer, action.position, action.recordHistory);
    }
    case 'SET_TEXT_FORMAT': {
      const currentState = getSideState(state.draft, state.draft.side);
      const nextTextStyle = { ...currentState.textStyles[action.layer] };
      if (action.field === 'family') {
        nextTextStyle.family = action.value === 'serif' || action.value === 'mono' ? action.value : 'sans';
      } else if (action.field === 'bold') {
        nextTextStyle.bold = Boolean(action.value);
      } else if (action.field === 'italic') {
        nextTextStyle.italic = Boolean(action.value);
      } else if (action.field === 'underline') {
        nextTextStyle.underline = Boolean(action.value);
      }

      const nextDraft = setSideState(state.draft, state.draft.side, {
        ...currentState,
        textStyles: {
          ...currentState.textStyles,
          [action.layer]: nextTextStyle,
        },
      });
      return pushHistory(state, nextDraft);
    }
    case 'RESET_TEXT_STYLE': {
      const currentState = getSideState(state.draft, state.draft.side);
      const nextDraft = setSideState(state.draft, state.draft.side, {
        ...currentState,
        textStyles: {
          ...currentState.textStyles,
          [action.layer]: createDefaultTextStyle(),
        },
      });
      return pushHistory(state, nextDraft);
    }
    case 'SET_PREVIEW_MODE': {
      return pushHistory(state, { ...state.draft, previewMode: action.mode });
    }
    case 'UPLOAD_PHOTO': {
      return withSidePhotoUpdate(state, action.photo);
    }
    case 'REMOVE_PHOTO': {
      const currentState = getSideState(state.draft, state.draft.side);
      const nextDraft = setSideState(state.draft, state.draft.side, {
        ...currentState,
        photo: null,
      });
      return pushHistory(state, nextDraft);
    }
    case 'ADJUST_PHOTO': {
      const currentState = getSideState(state.draft, state.draft.side);
      if (!currentState.photo) return state;
      const updatedPhoto = {
        ...currentState.photo,
        ...action.changes,
        scale: clampFinite(Number(action.changes.scale ?? currentState.photo.scale), 0.5, 3, 1),
        x: clampPosition(Number(action.changes.x ?? currentState.photo.x)),
        y: clampPosition(Number(action.changes.y ?? currentState.photo.y)),
        rotation: clampFinite(Number(action.changes.rotation ?? currentState.photo.rotation), -180, 180, 0),
      };
      const nextDraft = setSideState(state.draft, state.draft.side, {
        ...currentState,
        photo: updatedPhoto,
      });
      return action.recordHistory === false ? { ...state, draft: nextDraft } : pushHistory(state, nextDraft);
    }
    case 'RESET_PHOTO_TRANSFORM': {
      const currentState = getSideState(state.draft, state.draft.side);
      if (!currentState.photo) return state;
      const nextDraft = setSideState(state.draft, state.draft.side, {
        ...currentState,
        photo: {
          ...currentState.photo,
          x: 84,
          y: 80,
          scale: 1,
          rotation: 0,
        },
      });
      return pushHistory(state, nextDraft);
    }
    case 'UNDO': {
      if (state.historyIndex <= 0) return state;
      const nextIndex = state.historyIndex - 1;
      return {
        draft: state.history[nextIndex],
        history: state.history,
        historyIndex: nextIndex,
      };
    }
    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const nextIndex = state.historyIndex + 1;
      return {
        draft: state.history[nextIndex],
        history: state.history,
        historyIndex: nextIndex,
      };
    }
    case 'COMMIT_DRAFT': {
      return pushHistory(state, state.draft);
    }
    case 'RESET_ACTIVE_SIDE': {
      const nextDraft = {
        ...state.draft,
        [state.draft.side]: createSideState(action.card, action.currentLanguage),
      } as EditorDraft;
      return pushHistory(state, nextDraft);
    }
    case 'RESET_CARD': {
      return createEditorRuntimeState(action.card, action.currentLanguage);
    }
    case 'LOAD_DRAFT': {
      const nextDraft = action.draft;
      return {
        draft: nextDraft,
        history: [nextDraft],
        historyIndex: 0,
      };
    }
    default:
      return state;
  }
}

export function loadDraftFromStorage(card: CardOption, currentLanguage: CardLanguage): EditorDraft | null {
  if (typeof window === 'undefined') return null;

  const key = `${DRAFT_STORAGE_PREFIX}:${card.id}`;
  const saved = window.sessionStorage.getItem(key);
  if (!saved) return null;

  try {
    const parsed = JSON.parse(saved) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;

    const record = parsed as Partial<StoredEditorDraft>;
    if (
      (record.version !== DRAFT_STORAGE_VERSION && record.version !== 3) ||
      record.cardId !== card.id ||
      !record.draft
    ) {
      return null;
    }

    return normalizeDraft(record.draft, card, currentLanguage, record.version);
  } catch {
    return null;
  }
}

export function saveDraftToStorage(card: CardOption, draft: EditorDraft) {
  if (typeof window === 'undefined') return;

  const toStoredPhoto = (photo: EditorPhotoLayer | null): StoredEditorPhoto | null =>
    photo
      ? {
          requiresReselection: true,
          scale: clampFinite(Number(photo.scale ?? 1), 0.5, 3, 1),
          x: clampPosition(Number(photo.x ?? 50)),
          y: clampPosition(Number(photo.y ?? 50)),
          rotation: clampFinite(Number(photo.rotation ?? 0), -180, 180, 0),
        }
      : null;

  const storageDraft: StoredEditorDraft = {
    version: DRAFT_STORAGE_VERSION,
    cardId: card.id,
    draft: {
      ...draft,
      front: {
        ...draft.front,
        photo: toStoredPhoto(draft.front.photo),
      },
      inside: {
        ...draft.inside,
        photo: toStoredPhoto(draft.inside.photo),
      },
    },
  };

  const key = `${DRAFT_STORAGE_PREFIX}:${card.id}`;
  window.sessionStorage.setItem(key, JSON.stringify(storageDraft));
}

export function getActiveSideData(draft: EditorDraft): EditorSideState {
  return draft.side === 'front' ? draft.front : draft.inside;
}

export function getTextStyleForSide(draft: EditorDraft, layer: EditorTextLayer = 'message'): EditorTextStyle {
  return getActiveSideData(draft).textStyles[layer];
}
