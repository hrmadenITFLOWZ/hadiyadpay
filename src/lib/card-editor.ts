import type { CardLanguage, CardOption } from './card-types';

export const DRAFT_STORAGE_VERSION = 3;
export const DRAFT_STORAGE_PREFIX = 'hadiyadpay:editor-draft';

export type EditorSide = 'front' | 'inside';
export type EditorTextAlign = 'left' | 'center' | 'right';
export type EditorTextFontFamily = 'sans' | 'serif' | 'mono';
export type EditorPreviewMode = 'edit' | 'clean' | 'full';

export interface EditorTextStyle {
  color: string;
  align: EditorTextAlign;
  size: number;
  family: EditorTextFontFamily;
  bold: boolean;
  italic: boolean;
  underline: boolean;
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
  photo: EditorPhotoLayer | null;
}

export interface EditorDraft {
  side: EditorSide;
  previewMode: EditorPreviewMode;
  front: EditorSideState;
  inside: EditorSideState;
}

interface StoredEditorDraft {
  version: number;
  cardId: string;
  draft: EditorDraft;
}

export interface EditorRuntimeState {
  draft: EditorDraft;
  history: EditorDraft[];
  historyIndex: number;
}

export type EditorAction =
  | { type: 'SET_SIDE'; side: EditorSide }
  | { type: 'SET_FIELD'; field: 'recipient' | 'sender' | 'message'; value: string }
  | { type: 'SET_TEXT_STYLE'; style: Partial<EditorTextStyle> }
  | { type: 'SET_TEXT_FORMAT'; field: 'family' | 'bold' | 'italic' | 'underline'; value: string | boolean }
  | { type: 'RESET_TEXT_STYLE' }
  | { type: 'SET_PREVIEW_MODE'; mode: EditorPreviewMode }
  | { type: 'UPLOAD_PHOTO'; photo: EditorPhotoLayer }
  | { type: 'REMOVE_PHOTO' }
  | { type: 'ADJUST_PHOTO'; changes: Partial<Pick<EditorPhotoLayer, 'scale' | 'x' | 'y' | 'rotation'>> }
  | { type: 'RESET_PHOTO_TRANSFORM' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET_ACTIVE_SIDE'; card: CardOption; currentLanguage: CardLanguage }
  | { type: 'RESET_CARD'; card: CardOption; currentLanguage: CardLanguage }
  | { type: 'LOAD_DRAFT'; draft: EditorDraft };

export const editorColorOptions = ['#fef3c7', '#f9fafb', '#cfe4d7', '#d8d0ff', '#f7d4d4', '#f7b267'];
export const editorAlignmentOptions: EditorTextAlign[] = ['left', 'center', 'right'];
export const editorFontOptions: EditorTextFontFamily[] = ['sans', 'serif', 'mono'];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const createSideState = (card: CardOption, currentLanguage: CardLanguage): EditorSideState => ({
  recipient: card.defaultRecipient[currentLanguage],
  sender: card.defaultSender[currentLanguage],
  message: card.defaultMessage[currentLanguage],
  textStyle: {
    color: '#fef3c7',
    align: 'left',
    size: 30,
    family: 'sans',
    bold: false,
    italic: false,
    underline: false,
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

function normalizePhoto(rawPhoto: unknown): EditorPhotoLayer | null {
  if (!rawPhoto || typeof rawPhoto !== 'object') return null;

  const candidate = rawPhoto as Partial<EditorPhotoLayer>;
  const hasBlobSource = typeof candidate.src === 'string' && candidate.src.startsWith('blob:');
  const hasTransform = candidate.scale !== undefined || candidate.x !== undefined || candidate.y !== undefined || candidate.rotation !== undefined;

  if (!hasBlobSource && !hasTransform && !candidate.requiresReselection) return null;

  return {
    src: hasBlobSource ? candidate.src : undefined,
    requiresReselection: Boolean(candidate.requiresReselection),
    width: clamp(Number(candidate.width ?? 768), 1, 5000),
    height: clamp(Number(candidate.height ?? 768), 1, 5000),
    scale: clamp(Number(candidate.scale ?? 1), 0.5, 3),
    x: Number(candidate.x ?? 0),
    y: Number(candidate.y ?? 0),
    rotation: clamp(Number(candidate.rotation ?? 0), -180, 180),
  };
}

function normalizeSideState(rawSideState: unknown, card: CardOption, currentLanguage: CardLanguage): EditorSideState {
  const fallback = createSideState(card, currentLanguage);
  if (!rawSideState || typeof rawSideState !== 'object') return fallback;

  const candidate = rawSideState as Partial<EditorSideState>;
  const textStyle = normalizeTextStyle(candidate.textStyle, fallback.textStyle);

  return {
    recipient: typeof candidate.recipient === 'string' ? candidate.recipient : fallback.recipient,
    sender: typeof candidate.sender === 'string' ? candidate.sender : fallback.sender,
    message: typeof candidate.message === 'string' ? candidate.message : fallback.message,
    textStyle,
    photo: normalizePhoto(candidate.photo),
  };
}

function normalizeDraft(rawDraft: unknown, card: CardOption, currentLanguage: CardLanguage): EditorDraft {
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
  const frontState = normalizeSideState(candidate.front, card, currentLanguage);
  const insideState = normalizeSideState(candidate.inside, card, currentLanguage);

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

function withSideTextStyleUpdate(state: EditorRuntimeState, style: Partial<EditorTextStyle>): EditorRuntimeState {
  const currentState = getSideState(state.draft, state.draft.side);
  const nextDraft = setSideState(state.draft, state.draft.side, {
    ...currentState,
    textStyle: {
      ...currentState.textStyle,
      ...style,
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
      scale: clamp(Number(photo.scale ?? 1), 0.5, 3),
      x: Number(photo.x ?? 0),
      y: Number(photo.y ?? 0),
      rotation: clamp(Number(photo.rotation ?? 0), -180, 180),
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
      return withSideTextStyleUpdate(state, action.style);
    }
    case 'SET_TEXT_FORMAT': {
      const currentState = getSideState(state.draft, state.draft.side);
      const nextTextStyle = { ...currentState.textStyle };
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
        textStyle: nextTextStyle,
      });
      return pushHistory(state, nextDraft);
    }
    case 'RESET_TEXT_STYLE': {
      const currentState = getSideState(state.draft, state.draft.side);
      const nextDraft = setSideState(state.draft, state.draft.side, {
        ...currentState,
        textStyle: {
          ...currentState.textStyle,
          family: 'sans',
          bold: false,
          italic: false,
          underline: false,
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
        scale: clamp(Number(action.changes.scale ?? currentState.photo.scale), 0.5, 3),
        x: Number(action.changes.x ?? currentState.photo.x),
        y: Number(action.changes.y ?? currentState.photo.y),
        rotation: clamp(Number(action.changes.rotation ?? currentState.photo.rotation), -180, 180),
      };
      const nextDraft = setSideState(state.draft, state.draft.side, {
        ...currentState,
        photo: updatedPhoto,
      });
      return pushHistory(state, nextDraft);
    }
    case 'RESET_PHOTO_TRANSFORM': {
      const currentState = getSideState(state.draft, state.draft.side);
      if (!currentState.photo) return state;
      const nextDraft = setSideState(state.draft, state.draft.side, {
        ...currentState,
        photo: {
          ...currentState.photo,
          x: 0,
          y: 0,
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
    if (record.version !== DRAFT_STORAGE_VERSION || record.cardId !== card.id || !record.draft) {
      return null;
    }

    const storedDraft = normalizeDraft(record.draft, card, currentLanguage);
    if (storedDraft.front.photo && storedDraft.front.photo.requiresReselection === false && storedDraft.front.photo.src) {
      storedDraft.front.photo = { ...storedDraft.front.photo, src: undefined, requiresReselection: true };
    }
    if (storedDraft.inside.photo && storedDraft.inside.photo.requiresReselection === false && storedDraft.inside.photo.src) {
      storedDraft.inside.photo = { ...storedDraft.inside.photo, src: undefined, requiresReselection: true };
    }

    return storedDraft;
  } catch {
    return null;
  }
}

export function saveDraftToStorage(card: CardOption, draft: EditorDraft) {
  if (typeof window === 'undefined') return;

  const persistableDraft: EditorDraft = {
    ...draft,
    front: {
      ...draft.front,
      photo: draft.front.photo
        ? {
            requiresReselection: Boolean(draft.front.photo.requiresReselection),
            width: clamp(Number(draft.front.photo.width ?? 768), 1, 5000),
            height: clamp(Number(draft.front.photo.height ?? 768), 1, 5000),
            scale: clamp(Number(draft.front.photo.scale ?? 1), 0.5, 3),
            x: Number(draft.front.photo.x ?? 0),
            y: Number(draft.front.photo.y ?? 0),
            rotation: clamp(Number(draft.front.photo.rotation ?? 0), -180, 180),
          }
        : null,
    },
    inside: {
      ...draft.inside,
      photo: draft.inside.photo
        ? {
            requiresReselection: Boolean(draft.inside.photo.requiresReselection),
            width: clamp(Number(draft.inside.photo.width ?? 768), 1, 5000),
            height: clamp(Number(draft.inside.photo.height ?? 768), 1, 5000),
            scale: clamp(Number(draft.inside.photo.scale ?? 1), 0.5, 3),
            x: Number(draft.inside.photo.x ?? 0),
            y: Number(draft.inside.photo.y ?? 0),
            rotation: clamp(Number(draft.inside.photo.rotation ?? 0), -180, 180),
          }
        : null,
    },
  };

  const storageDraft: StoredEditorDraft = {
    version: DRAFT_STORAGE_VERSION,
    cardId: card.id,
    draft: persistableDraft,
  };

  const key = `${DRAFT_STORAGE_PREFIX}:${card.id}`;
  window.sessionStorage.setItem(key, JSON.stringify(storageDraft));
}

export function getActiveSideData(draft: EditorDraft): EditorSideState {
  return draft.side === 'front' ? draft.front : draft.inside;
}

export function getTextStyleForSide(draft: EditorDraft): EditorTextStyle {
  return getActiveSideData(draft).textStyle;
}
