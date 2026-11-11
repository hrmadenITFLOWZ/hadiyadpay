import type { CardLanguage, CardOption } from './card-types';

export type EditorSide = 'front' | 'inside';
export type EditorTextAlign = 'left' | 'center' | 'right';

export interface EditorTextStyle {
  color: string;
  align: EditorTextAlign;
  size: number;
}

export interface EditorPhotoLayer {
  src: string;
  width: number;
  height: number;
  scale: number;
  x: number;
  y: number;
}

export interface EditorDraft {
  recipient: string;
  sender: string;
  message: string;
  side: EditorSide;
  textStyle: EditorTextStyle;
  photo: EditorPhotoLayer | null;
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
  | { type: 'UPLOAD_PHOTO'; photo: EditorPhotoLayer }
  | { type: 'REMOVE_PHOTO' }
  | { type: 'ADJUST_PHOTO'; changes: Partial<Pick<EditorPhotoLayer, 'scale' | 'x' | 'y'>> }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET'; card: CardOption; currentLanguage: CardLanguage }
  | { type: 'LOAD_DRAFT'; draft: EditorDraft };

export const editorColorOptions = ['#fef3c7', '#f9fafb', '#cfe4d7', '#d8d0ff', '#f7d4d4', '#f7b267'];
export const editorAlignmentOptions: EditorTextAlign[] = ['left', 'center', 'right'];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function normalizeDraft(rawDraft: unknown, card: CardOption, currentLanguage: CardLanguage): EditorDraft {
  const fallback: EditorDraft = {
    recipient: card.defaultRecipient[currentLanguage],
    sender: card.defaultSender[currentLanguage],
    message: card.defaultMessage[currentLanguage],
    side: 'front',
    textStyle: { color: '#fef3c7', align: 'left', size: 30 },
    photo: null,
  };

  if (!rawDraft || typeof rawDraft !== 'object') return fallback;

  const candidate = rawDraft as Partial<EditorDraft>;
  return {
    recipient: typeof candidate.recipient === 'string' ? candidate.recipient : fallback.recipient,
    sender: typeof candidate.sender === 'string' ? candidate.sender : fallback.sender,
    message: typeof candidate.message === 'string' ? candidate.message : fallback.message,
    side: candidate.side === 'inside' ? 'inside' : 'front',
    textStyle: {
      color: typeof candidate.textStyle?.color === 'string' ? candidate.textStyle.color : fallback.textStyle.color,
      align: candidate.textStyle?.align === 'center' || candidate.textStyle?.align === 'right' ? candidate.textStyle.align : 'left',
      size: clamp(Number(candidate.textStyle?.size ?? 30), 18, 52),
    },
    photo:
      candidate.photo && typeof candidate.photo.src === 'string'
        ? {
            src: candidate.photo.src,
            width: clamp(Number(candidate.photo.width ?? 768), 1, 5000),
            height: clamp(Number(candidate.photo.height ?? 768), 1, 5000),
            scale: clamp(Number(candidate.photo.scale ?? 1), 0.5, 3),
            x: Number(candidate.photo.x ?? 0),
            y: Number(candidate.photo.y ?? 0),
          }
        : null,
  };
}

export function createEditorRuntimeState(card: CardOption, currentLanguage: CardLanguage): EditorRuntimeState {
  const draft = {
    recipient: card.defaultRecipient[currentLanguage],
    sender: card.defaultSender[currentLanguage],
    message: card.defaultMessage[currentLanguage],
    side: 'front' as const,
    textStyle: { color: '#fef3c7', align: 'left' as const, size: 30 },
    photo: null,
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

export function editorReducer(state: EditorRuntimeState, action: EditorAction): EditorRuntimeState {
  switch (action.type) {
    case 'SET_SIDE': {
      const nextDraft = { ...state.draft, side: action.side };
      return pushHistory(state, nextDraft);
    }
    case 'SET_FIELD': {
      const nextDraft = { ...state.draft, [action.field]: action.value };
      return pushHistory(state, nextDraft);
    }
    case 'SET_TEXT_STYLE': {
      const nextDraft = {
        ...state.draft,
        textStyle: {
          ...state.draft.textStyle,
          ...action.style,
        },
      };
      return pushHistory(state, nextDraft);
    }
    case 'UPLOAD_PHOTO': {
      const nextDraft = {
        ...state.draft,
        photo: {
          ...action.photo,
          scale: clamp(action.photo.scale, 0.5, 3),
          x: Number(action.photo.x ?? 0),
          y: Number(action.photo.y ?? 0),
        },
      };
      return pushHistory(state, nextDraft);
    }
    case 'REMOVE_PHOTO': {
      const nextDraft = { ...state.draft, photo: null };
      return pushHistory(state, nextDraft);
    }
    case 'ADJUST_PHOTO': {
      if (!state.draft.photo) return state;
      const updatedPhoto = {
        ...state.draft.photo,
        ...action.changes,
        scale: clamp(Number(action.changes.scale ?? state.draft.photo.scale), 0.5, 3),
        x: Number(action.changes.x ?? state.draft.photo.x),
        y: Number(action.changes.y ?? state.draft.photo.y),
      };
      const nextDraft = { ...state.draft, photo: updatedPhoto };
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
    case 'RESET': {
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

  const saved = window.sessionStorage.getItem(`hadiyadpay-card-draft-${card.id}`);
  if (!saved) return null;

  try {
    const parsed = JSON.parse(saved) as unknown;
    return normalizeDraft(parsed, card, currentLanguage);
  } catch {
    return null;
  }
}

export function saveDraftToStorage(card: CardOption, draft: EditorDraft) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(`hadiyadpay-card-draft-${card.id}`, JSON.stringify(draft));
}
