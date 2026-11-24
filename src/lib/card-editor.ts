import type { CardLanguage, CardOption } from "./card-types";

import { getCardComposition } from "./card-composition";

export const DRAFT_STORAGE_VERSION = 8;

export const DRAFT_STORAGE_PREFIX = "hadiyadpay:editor-draft";

export const PHOTO_SCALE_MIN = 1;

export const PHOTO_SCALE_MAX = 3;

export const STICKER_SCALE_MIN = 0.25;

export const STICKER_SCALE_MAX = 3;

export const STICKER_ROTATION_MIN = -180;

export const STICKER_ROTATION_MAX = 180;

export const MAX_STICKERS_PER_SIDE = 20;

export type EditorSide = "front" | "inside";

export type EditorTextLayer = "recipient" | "sender" | "message";

export type EditorTextAlign = "left" | "center" | "right";

export type EditorTextFontFamily = "sans" | "serif" | "mono";

export type EditorPreviewMode = "edit" | "clean" | "full";

export type EditorPhotoFrameSize = "small" | "medium" | "large";

export const PHOTO_FRAME_SIZES: Record<EditorPhotoFrameSize, number> = {
  small: 58,

  medium: 76,

  large: 92,
};

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

export interface EditorPhotoLayer {
  src?: string;
  requiresReselection?: boolean;
  width: number;
  height: number;
  scale: number;
  x: number;
  y: number;
  rotation: number;
  frameSize: EditorPhotoFrameSize;
}

export interface EditorSticker {
  /*
   * Unieke ID voor deze stickerinstantie.
   *
   * Dezelfde asset kan meerdere keren op
   * dezelfde kaart worden toegevoegd.
   */
  id: string;

  /*
   * Verwijst naar een gecontroleerde asset
   * uit src/app/data/stickers.ts.
   */
  assetId: string;

  /*
   * Publiek pad naar de stickerafbeelding.
   *
   * Bijvoorbeeld:
   * /stickers/wedding-henna/gold-rings-01.png
   */
  src: string;

  /*
   * Positie als percentage van het canvas.
   *
   * Hierdoor blijft de compositie bruikbaar
   * voor browser-, download- en printformaten.
   */
  x: number;
  y: number;

  /*
   * Basiskader als percentage van de
   * canvasbreedte.
   */
  width: number;

  /*
   * Schaal en rotatie van de sticker.
   */
  scale: number;
  rotation: number;

  /*
   * Bepaalt welke sticker voor of achter
   * andere stickerlagen staat.
   */
  zIndex: number;

  /*
   * Toegankelijke naam van de asset.
   */
  label?: string;
}

export type EditorStickerChanges = Partial<
  Pick<EditorSticker, "x" | "y" | "width" | "scale" | "rotation" | "zIndex">
>;

export interface EditorSideState {
  recipient: string;
  sender: string;
  message: string;

  /*
   * Legacy stijlveld.
   *
   * Dit blijft aanwezig voor bestaande
   * drafts en opgeslagen bestellingen.
   */
  textStyle: EditorTextStyle;

  textStyles: Record<EditorTextLayer, EditorTextStyle>;

  textPositions: Record<EditorTextLayer, EditorPosition>;

  photo: EditorPhotoLayer | null;

  stickers: EditorSticker[];
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
  frameSize: EditorPhotoFrameSize;
}

interface StoredEditorSide extends Omit<EditorSideState, "photo"> {
  photo: StoredEditorPhoto | null;
}

interface StoredEditorDraftData extends Omit<EditorDraft, "front" | "inside"> {
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
  | {
      type: "SET_SIDE";

      side: EditorSide;
    }
  | {
      type: "SET_FIELD";

      field: "recipient" | "sender" | "message";

      value: string;
    }
  | {
      type: "SET_TEXT_STYLE";

      layer: EditorTextLayer;

      style: Partial<EditorTextStyle>;
    }
  | {
      type: "SET_TEXT_POSITION";

      layer: EditorTextLayer;

      position: EditorPosition;

      recordHistory?: boolean;
    }
  | {
      type: "SET_TEXT_FORMAT";

      layer: EditorTextLayer;

      field: "family" | "bold" | "italic" | "underline";

      value: string | boolean;
    }
  | {
      type: "RESET_TEXT_STYLE";

      layer: EditorTextLayer;
    }
  | {
      type: "SET_PREVIEW_MODE";

      mode: EditorPreviewMode;
    }
  | {
      type: "UPLOAD_PHOTO";

      photo: EditorPhotoLayer;
    }
  | {
      type: "REMOVE_PHOTO";
    }
  | {
      type: "ADJUST_PHOTO";

      changes: Partial<
        Pick<EditorPhotoLayer, "scale" | "x" | "y" | "rotation" | "frameSize">
      >;

      recordHistory?: boolean;
    }
  | {
      type: "RESET_PHOTO_TRANSFORM";

      position?: EditorPosition;
    }
  | {
      type: "ADD_STICKER";

      sticker: EditorSticker;
    }
  | {
      type: "UPDATE_STICKER";

      stickerId: string;

      changes: EditorStickerChanges;

      recordHistory?: boolean;
    }
  | {
      type: "REMOVE_STICKER";

      stickerId: string;
    }
  | {
      type: "DUPLICATE_STICKER";

      stickerId: string;

      newStickerId: string;
    }
  | {
      type: "BRING_STICKER_FORWARD";

      stickerId: string;
    }
  | {
      type: "SEND_STICKER_BACKWARD";

      stickerId: string;
    }
  | {
      type: "BRING_STICKER_TO_FRONT";

      stickerId: string;
    }
  | {
      type: "SEND_STICKER_TO_BACK";

      stickerId: string;
    }
  | {
      type: "CLEAR_STICKERS";
    }
  | {
      type: "UNDO";
    }
  | {
      type: "REDO";
    }
  | {
      type: "COMMIT_DRAFT";
    }
  | {
      type: "RESET_ACTIVE_SIDE";

      card: CardOption;

      currentLanguage: CardLanguage;
    }
  | {
      type: "RESET_CARD";

      card: CardOption;

      currentLanguage: CardLanguage;
    }
  | {
      type: "LOAD_DRAFT";

      draft: EditorDraft;
    };

export const editorColorOptions = [
  "#fef3c7",
  "#f9fafb",
  "#cfe4d7",
  "#d8d0ff",
  "#f7d4d4",
  "#f7b267",
];

export const editorAlignmentOptions: EditorTextAlign[] = [
  "left",
  "center",
  "right",
];

export const editorFontOptions: EditorTextFontFamily[] = [
  "sans",
  "serif",
  "mono",
];

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const clampFinite = (
  value: number,
  min: number,
  max: number,
  fallback: number,
): number => clamp(Number.isFinite(value) ? value : fallback, min, max);

const clampPosition = (value: number): number => clampFinite(value, 0, 100, 50);

const clampStickerWidth = (value: number): number =>
  clampFinite(value, 4, 60, 20);

const clampStickerZIndex = (value: number): number =>
  Math.round(clampFinite(value, 1, 1000, 1));

function normalizePhotoFrameSize(value: unknown): EditorPhotoFrameSize {
  if (value === "small" || value === "medium") {
    return value;
  }

  return "large";
}

const createDefaultTextStyle = (color = "#fef3c7"): EditorTextStyle => ({
  color,

  align: "left",

  size: 30,

  family: "sans",

  bold: false,

  italic: false,

  underline: false,
});

function normalizeSticker(
  rawSticker: unknown,
  fallbackZIndex: number,
): EditorSticker | null {
  if (
    !rawSticker ||
    typeof rawSticker !== "object" ||
    Array.isArray(rawSticker)
  ) {
    return null;
  }

  const candidate = rawSticker as Partial<EditorSticker>;

  if (
    typeof candidate.id !== "string" ||
    candidate.id.length === 0 ||
    candidate.id.length > 120 ||
    typeof candidate.assetId !== "string" ||
    candidate.assetId.length === 0 ||
    candidate.assetId.length > 120 ||
    typeof candidate.src !== "string" ||
    candidate.src.length === 0 ||
    candidate.src.length > 500
  ) {
    return null;
  }

  /*
   * Draftassets mogen alleen lokale publieke
   * paden gebruiken.
   *
   * Hiermee voorkomen we dat willekeurige
   * externe URLs onderdeel van drafts worden.
   */
  if (!candidate.src.startsWith("/stickers/")) {
    return null;
  }

  return {
    id: candidate.id,

    assetId: candidate.assetId,

    src: candidate.src,

    x: clampPosition(Number(candidate.x ?? 50)),

    y: clampPosition(Number(candidate.y ?? 50)),

    width: clampStickerWidth(Number(candidate.width ?? 20)),

    scale: clampFinite(
      Number(candidate.scale ?? 1),
      STICKER_SCALE_MIN,
      STICKER_SCALE_MAX,
      1,
    ),

    rotation: clampFinite(
      Number(candidate.rotation ?? 0),
      STICKER_ROTATION_MIN,
      STICKER_ROTATION_MAX,
      0,
    ),

    zIndex: clampStickerZIndex(Number(candidate.zIndex ?? fallbackZIndex)),

    label:
      typeof candidate.label === "string"
        ? candidate.label.slice(0, 120)
        : undefined,
  };
}

function normalizeStickers(rawStickers: unknown): EditorSticker[] {
  if (!Array.isArray(rawStickers)) {
    return [];
  }

  const normalized: EditorSticker[] = [];

  const usedIds = new Set<string>();

  for (const rawSticker of rawStickers.slice(0, MAX_STICKERS_PER_SIDE)) {
    const sticker = normalizeSticker(rawSticker, normalized.length + 1);

    if (!sticker || usedIds.has(sticker.id)) {
      continue;
    }

    usedIds.add(sticker.id);

    normalized.push(sticker);
  }

  return normalized;
}

const createSideState = (
  card: CardOption,
  currentLanguage: CardLanguage,
  side: EditorSide,
): EditorSideState => {
  const layout = getCardComposition(card, side);

  const defaultAlignment: EditorTextAlign = layout.protectsBirthdayArtwork
    ? "center"
    : "left";

  const createSideTextStyle = (): EditorTextStyle => ({
    ...createDefaultTextStyle(layout.defaultTextColor),

    align: defaultAlignment,
  });

  const defaultStyle = createSideTextStyle();

  return {
    recipient: card.defaultRecipient[currentLanguage],

    sender: card.defaultSender[currentLanguage],

    message: card.defaultMessage[currentLanguage],

    textStyle: defaultStyle,

    textStyles: {
      recipient: createSideTextStyle(),

      sender: createSideTextStyle(),

      message: createSideTextStyle(),
    },

    textPositions: {
      recipient: {
        ...layout.defaultTextPositions.recipient,
      },

      sender: {
        ...layout.defaultTextPositions.sender,
      },

      message: {
        ...layout.defaultTextPositions.message,
      },
    },

    photo: null,

    stickers: [],
  };
};

function getSideState(draft: EditorDraft, side: EditorSide): EditorSideState {
  return side === "front" ? draft.front : draft.inside;
}

function setSideState(
  draft: EditorDraft,
  side: EditorSide,
  nextSideState: Partial<EditorSideState>,
): EditorDraft {
  if (side === "front") {
    return {
      ...draft,

      front: {
        ...draft.front,
        ...nextSideState,
      },
    };
  }

  return {
    ...draft,

    inside: {
      ...draft.inside,
      ...nextSideState,
    },
  };
}

function pushHistory(
  state: EditorRuntimeState,
  nextDraft: EditorDraft,
): EditorRuntimeState {
  const trimmedHistory = state.history.slice(0, state.historyIndex + 1);

  const nextHistory = [...trimmedHistory, nextDraft].slice(-30);

  return {
    draft: nextDraft,

    history: nextHistory,

    historyIndex: nextHistory.length - 1,
  };
}

function withSideTextPositionUpdate(
  state: EditorRuntimeState,
  layer: EditorTextLayer,
  position: EditorPosition,
  recordHistory = true,
): EditorRuntimeState {
  const currentState = getSideState(state.draft, state.draft.side);

  const nextTextPositions = {
    ...currentState.textPositions,
  };

  nextTextPositions[layer] = {
    x: clampPosition(position.x),

    y: clampPosition(position.y),
  };

  const nextDraft = setSideState(state.draft, state.draft.side, {
    textPositions: nextTextPositions,
  });

  return recordHistory
    ? pushHistory(state, nextDraft)
    : {
        ...state,

        draft: nextDraft,
      };
}

function normalizeTextStyle(
  style: unknown,
  fallback: EditorTextStyle,
  migrateDefaultTextColor: boolean,
): EditorTextStyle {
  const safeStyle =
    style && typeof style === "object"
      ? (style as Partial<EditorTextStyle>)
      : {};

  const familyValue: EditorTextFontFamily =
    safeStyle.family === "serif" || safeStyle.family === "mono"
      ? safeStyle.family
      : "sans";

  return {
    color:
      typeof safeStyle.color === "string" &&
      !(migrateDefaultTextColor && safeStyle.color === "#fef3c7")
        ? safeStyle.color
        : fallback.color,

    align:
      safeStyle.align === "center" || safeStyle.align === "right"
        ? safeStyle.align
        : "left",

    size: clampFinite(
      Number(safeStyle.size ?? fallback.size),
      18,
      52,
      fallback.size,
    ),

    family: familyValue,

    bold: Boolean(safeStyle.bold),

    italic: Boolean(safeStyle.italic),

    underline: Boolean(safeStyle.underline),
  };
}

function normalizePhoto(
  rawPhoto: unknown,
  storageVersion: number,
): EditorPhotoLayer | null {
  if (!rawPhoto || typeof rawPhoto !== "object" || Array.isArray(rawPhoto)) {
    return null;
  }

  const candidate = rawPhoto as Partial<EditorPhotoLayer>;

  const hasStoredSource =
    typeof candidate.src === "string" && candidate.src.length > 0;

  const hasTransform =
    candidate.scale !== undefined ||
    candidate.x !== undefined ||
    candidate.y !== undefined ||
    candidate.rotation !== undefined ||
    candidate.frameSize !== undefined;

  if (
    !hasStoredSource &&
    !hasTransform &&
    candidate.requiresReselection !== true
  ) {
    return null;
  }

  const isLegacyCirclePhoto = storageVersion < 7;

  const legacyX = clampFinite(Number(candidate.x ?? 0), -1000, 1000, 0);

  const legacyY = clampFinite(Number(candidate.y ?? 0), -1000, 1000, 0);

  const migratedX =
    storageVersion < 4 ? 50 + legacyX / 4 : Number(candidate.x ?? 50);

  const migratedY =
    storageVersion < 4 ? 50 + legacyY / 3.6 : Number(candidate.y ?? 50);

  return {
    requiresReselection: true,

    width: clampFinite(Number(candidate.width ?? 768), 1, 12000, 768),

    height: clampFinite(Number(candidate.height ?? 768), 1, 12000, 768),

    scale: isLegacyCirclePhoto
      ? 1
      : clampFinite(
          Number(candidate.scale ?? 1),
          PHOTO_SCALE_MIN,
          PHOTO_SCALE_MAX,
          1,
        ),

    x: isLegacyCirclePhoto ? 50 : clampPosition(migratedX),

    y: isLegacyCirclePhoto ? 50 : clampPosition(migratedY),

    rotation: isLegacyCirclePhoto
      ? 0
      : clampFinite(Number(candidate.rotation ?? 0), -30, 30, 0),

    frameSize: isLegacyCirclePhoto
      ? "large"
      : normalizePhotoFrameSize(candidate.frameSize),
  };
}

function normalizeSideState(
  rawSideState: unknown,
  card: CardOption,
  currentLanguage: CardLanguage,
  storageVersion: number,
  side: EditorSide,
): EditorSideState {
  const fallback = createSideState(card, currentLanguage, side);

  if (!rawSideState || typeof rawSideState !== "object") {
    return fallback;
  }

  const candidate = rawSideState as Partial<EditorSideState>;

  const migrateDefaultTextColor =
    storageVersion < DRAFT_STORAGE_VERSION &&
    fallback.textStyle.color !== "#fef3c7";

  const legacyPositions: Record<EditorTextLayer, EditorPosition> = {
    recipient: {
      x: 50,

      y: 14,
    },

    message: {
      x: 50,

      y: 70,
    },

    sender: {
      x: 50,

      y: 92,
    },
  };

  const legacyStyle = normalizeTextStyle(
    candidate.textStyle,
    fallback.textStyle,
    migrateDefaultTextColor,
  );

  const candidateStyles =
    candidate.textStyles && typeof candidate.textStyles === "object"
      ? (candidate.textStyles as Partial<
          Record<EditorTextLayer, EditorTextStyle>
        >)
      : {};

  const getLayerStyle = (layer: EditorTextLayer): EditorTextStyle =>
    normalizeTextStyle(
      candidateStyles[layer] ?? candidate.textStyle,

      fallback.textStyles[layer] ?? legacyStyle,

      migrateDefaultTextColor,
    );

  const candidatePositions = candidate.textPositions;

  const textPositions = (["recipient", "sender", "message"] as const).reduce(
    (positions, layer) => {
      const position = candidatePositions?.[layer];

      const savedPosition = {
        x: Number(position?.x ?? fallback.textPositions[layer].x),

        y: Number(position?.y ?? fallback.textPositions[layer].y),
      };

      const wasDefaultPosition =
        savedPosition.x === legacyPositions[layer].x &&
        savedPosition.y === legacyPositions[layer].y;

      const normalizedPosition =
        storageVersion < DRAFT_STORAGE_VERSION && wasDefaultPosition
          ? fallback.textPositions[layer]
          : savedPosition;

      positions[layer] = {
        x: clampPosition(normalizedPosition.x),

        y: clampPosition(normalizedPosition.y),
      };

      return positions;
    },

    {} as Record<EditorTextLayer, EditorPosition>,
  );

  return {
    recipient:
      typeof candidate.recipient === "string"
        ? candidate.recipient
        : fallback.recipient,

    sender:
      typeof candidate.sender === "string" ? candidate.sender : fallback.sender,

    message:
      typeof candidate.message === "string"
        ? candidate.message
        : fallback.message,

    textStyle: legacyStyle,

    textStyles: {
      recipient: getLayerStyle("recipient"),

      sender: getLayerStyle("sender"),

      message: getLayerStyle("message"),
    },

    textPositions,

    photo: normalizePhoto(candidate.photo, storageVersion),

    /*
     * Versie 7 en ouder bevatten nog geen
     * stickers. normalizeStickers geeft dan
     * automatisch een lege array terug.
     */
    stickers: normalizeStickers(candidate.stickers),
  };
}

function normalizeDraft(
  rawDraft: unknown,
  card: CardOption,
  currentLanguage: CardLanguage,
  storageVersion: number,
): EditorDraft {
  const fallback: EditorDraft = {
    side: "front",

    previewMode: "edit",

    front: createSideState(card, currentLanguage, "front"),

    inside: createSideState(card, currentLanguage, "inside"),
  };

  if (!rawDraft || typeof rawDraft !== "object") {
    return fallback;
  }

  const candidate = rawDraft as Partial<EditorDraft>;

  return {
    side: candidate.side === "inside" ? "inside" : "front",

    previewMode:
      candidate.previewMode === "clean" || candidate.previewMode === "full"
        ? candidate.previewMode
        : "edit",

    front: normalizeSideState(
      candidate.front,
      card,
      currentLanguage,
      storageVersion,
      "front",
    ),

    inside: normalizeSideState(
      candidate.inside,
      card,
      currentLanguage,
      storageVersion,
      "inside",
    ),
  };
}

export function createEditorRuntimeState(
  card: CardOption,
  currentLanguage: CardLanguage,
): EditorRuntimeState {
  const draft: EditorDraft = {
    side: "front",

    previewMode: "edit",

    front: createSideState(card, currentLanguage, "front"),

    inside: createSideState(card, currentLanguage, "inside"),
  };

  return {
    draft,

    history: [draft],

    historyIndex: 0,
  };
}

function withSideFieldUpdate(
  state: EditorRuntimeState,
  field: "recipient" | "sender" | "message",
  value: string,
): EditorRuntimeState {
  const updates: Partial<EditorSideState> = {};

  updates[field] = value;

  const nextDraft = setSideState(state.draft, state.draft.side, updates);

  return pushHistory(state, nextDraft);
}

function withSideTextStyleUpdate(
  state: EditorRuntimeState,
  layer: EditorTextLayer,
  style: Partial<EditorTextStyle>,
): EditorRuntimeState {
  const currentState = getSideState(state.draft, state.draft.side);

  const nextTextStyles = {
    ...currentState.textStyles,
  };

  nextTextStyles[layer] = {
    ...currentState.textStyles[layer],

    ...style,
  };

  const nextDraft = setSideState(state.draft, state.draft.side, {
    textStyles: nextTextStyles,
  });

  return pushHistory(state, nextDraft);
}

function withSidePhotoUpdate(
  state: EditorRuntimeState,
  photo: EditorPhotoLayer,
): EditorRuntimeState {
  const nextDraft = setSideState(state.draft, state.draft.side, {
    photo: {
      ...photo,

      requiresReselection: false,

      scale: clampFinite(
        Number(photo.scale ?? 1),
        PHOTO_SCALE_MIN,
        PHOTO_SCALE_MAX,
        1,
      ),

      x: clampPosition(Number(photo.x ?? 50)),

      y: clampPosition(Number(photo.y ?? 50)),

      rotation: clampFinite(Number(photo.rotation ?? 0), -30, 30, 0),

      frameSize: normalizePhotoFrameSize(photo.frameSize),
    },
  });

  return pushHistory(state, nextDraft);
}

function updateStickerCollection(
  state: EditorRuntimeState,
  stickers: EditorSticker[],
  recordHistory = true,
): EditorRuntimeState {
  const nextDraft = setSideState(state.draft, state.draft.side, {
    stickers,
  });

  return recordHistory
    ? pushHistory(state, nextDraft)
    : {
        ...state,

        draft: nextDraft,
      };
}

function getHighestStickerZIndex(stickers: EditorSticker[]): number {
  return stickers.reduce(
    (highest, sticker) => Math.max(highest, sticker.zIndex),
    0,
  );
}

function getLowestStickerZIndex(stickers: EditorSticker[]): number {
  if (stickers.length === 0) {
    return 1;
  }

  return stickers.reduce(
    (lowest, sticker) => Math.min(lowest, sticker.zIndex),
    stickers[0].zIndex,
  );
}

function normalizeStickerOrdering(stickers: EditorSticker[]): EditorSticker[] {
  return [...stickers]
    .sort((first, second) => first.zIndex - second.zIndex)
    .map((sticker, index) => ({
      ...sticker,

      zIndex: index + 1,
    }));
}

export function editorReducer(
  state: EditorRuntimeState,
  action: EditorAction,
): EditorRuntimeState {
  switch (action.type) {
    case "SET_SIDE": {
      return pushHistory(state, {
        ...state.draft,

        side: action.side,
      });
    }

    case "SET_FIELD": {
      return withSideFieldUpdate(state, action.field, action.value);
    }

    case "SET_TEXT_STYLE": {
      return withSideTextStyleUpdate(state, action.layer, action.style);
    }

    case "SET_TEXT_POSITION": {
      return withSideTextPositionUpdate(
        state,
        action.layer,
        action.position,
        action.recordHistory,
      );
    }

    case "SET_TEXT_FORMAT": {
      const currentState = getSideState(state.draft, state.draft.side);

      const nextTextStyle: EditorTextStyle = {
        ...currentState.textStyles[action.layer],
      };

      if (action.field === "family") {
        nextTextStyle.family =
          action.value === "serif" || action.value === "mono"
            ? action.value
            : "sans";
      } else if (action.field === "bold") {
        nextTextStyle.bold = Boolean(action.value);
      } else if (action.field === "italic") {
        nextTextStyle.italic = Boolean(action.value);
      } else {
        nextTextStyle.underline = Boolean(action.value);
      }

      const nextTextStyles = {
        ...currentState.textStyles,
      };

      nextTextStyles[action.layer] = nextTextStyle;

      const nextDraft = setSideState(state.draft, state.draft.side, {
        textStyles: nextTextStyles,
      });

      return pushHistory(state, nextDraft);
    }

    case "RESET_TEXT_STYLE": {
      const currentState = getSideState(state.draft, state.draft.side);

      const currentStyle = currentState.textStyles[action.layer];

      const nextTextStyles = {
        ...currentState.textStyles,
      };

      nextTextStyles[action.layer] = {
        ...createDefaultTextStyle(currentStyle.color),

        align: currentStyle.align,
      };

      const nextDraft = setSideState(state.draft, state.draft.side, {
        textStyles: nextTextStyles,
      });

      return pushHistory(state, nextDraft);
    }

    case "SET_PREVIEW_MODE": {
      return pushHistory(state, {
        ...state.draft,

        previewMode: action.mode,
      });
    }

    case "UPLOAD_PHOTO": {
      return withSidePhotoUpdate(state, action.photo);
    }

    case "REMOVE_PHOTO": {
      const nextDraft = setSideState(state.draft, state.draft.side, {
        photo: null,
      });

      return pushHistory(state, nextDraft);
    }

    case "ADJUST_PHOTO": {
      const currentState = getSideState(state.draft, state.draft.side);

      if (!currentState.photo) {
        return state;
      }

      const updatedPhoto: EditorPhotoLayer = {
        ...currentState.photo,
        ...action.changes,

        scale: clampFinite(
          Number(action.changes.scale ?? currentState.photo.scale),
          PHOTO_SCALE_MIN,
          PHOTO_SCALE_MAX,
          1,
        ),

        x: clampPosition(Number(action.changes.x ?? currentState.photo.x)),

        y: clampPosition(Number(action.changes.y ?? currentState.photo.y)),

        rotation: clampFinite(
          Number(action.changes.rotation ?? currentState.photo.rotation),
          -30,
          30,
          0,
        ),

        frameSize: normalizePhotoFrameSize(
          action.changes.frameSize ?? currentState.photo.frameSize,
        ),
      };

      const nextDraft = setSideState(state.draft, state.draft.side, {
        photo: updatedPhoto,
      });

      return action.recordHistory === false
        ? {
            ...state,

            draft: nextDraft,
          }
        : pushHistory(state, nextDraft);
    }

    case "RESET_PHOTO_TRANSFORM": {
      const currentState = getSideState(state.draft, state.draft.side);

      if (!currentState.photo) {
        return state;
      }

      const nextDraft = setSideState(state.draft, state.draft.side, {
        photo: {
          ...currentState.photo,

          x: clampPosition(action.position?.x ?? 50),

          y: clampPosition(action.position?.y ?? 50),

          scale: 1,

          rotation: 0,

          frameSize: "large",
        },
      });

      return pushHistory(state, nextDraft);
    }

    case "ADD_STICKER": {
      const currentState = getSideState(state.draft, state.draft.side);

      if (currentState.stickers.length >= MAX_STICKERS_PER_SIDE) {
        return state;
      }

      if (
        currentState.stickers.some(
          (sticker) => sticker.id === action.sticker.id,
        )
      ) {
        return state;
      }

      const normalizedSticker = normalizeSticker(
        {
          ...action.sticker,

          zIndex: getHighestStickerZIndex(currentState.stickers) + 1,
        },
        currentState.stickers.length + 1,
      );

      if (!normalizedSticker) {
        return state;
      }

      return updateStickerCollection(state, [
        ...currentState.stickers,
        normalizedSticker,
      ]);
    }

    case "UPDATE_STICKER": {
      const currentState = getSideState(state.draft, state.draft.side);

      const stickerIndex = currentState.stickers.findIndex(
        (sticker) => sticker.id === action.stickerId,
      );

      if (stickerIndex < 0) {
        return state;
      }

      const currentSticker = currentState.stickers[stickerIndex];

      const updatedSticker: EditorSticker = {
        ...currentSticker,
        ...action.changes,

        x: clampPosition(Number(action.changes.x ?? currentSticker.x)),

        y: clampPosition(Number(action.changes.y ?? currentSticker.y)),

        width: clampStickerWidth(
          Number(action.changes.width ?? currentSticker.width),
        ),

        scale: clampFinite(
          Number(action.changes.scale ?? currentSticker.scale),
          STICKER_SCALE_MIN,
          STICKER_SCALE_MAX,
          1,
        ),

        rotation: clampFinite(
          Number(action.changes.rotation ?? currentSticker.rotation),
          STICKER_ROTATION_MIN,
          STICKER_ROTATION_MAX,
          0,
        ),

        zIndex: clampStickerZIndex(
          Number(action.changes.zIndex ?? currentSticker.zIndex),
        ),
      };

      const nextStickers = [...currentState.stickers];

      nextStickers[stickerIndex] = updatedSticker;

      return updateStickerCollection(
        state,
        nextStickers,
        action.recordHistory !== false,
      );
    }

    case "REMOVE_STICKER": {
      const currentState = getSideState(state.draft, state.draft.side);

      const nextStickers = currentState.stickers.filter(
        (sticker) => sticker.id !== action.stickerId,
      );

      if (nextStickers.length === currentState.stickers.length) {
        return state;
      }

      return updateStickerCollection(
        state,
        normalizeStickerOrdering(nextStickers),
      );
    }

    case "DUPLICATE_STICKER": {
      const currentState = getSideState(state.draft, state.draft.side);

      if (
        currentState.stickers.length >= MAX_STICKERS_PER_SIDE ||
        currentState.stickers.some(
          (sticker) => sticker.id === action.newStickerId,
        )
      ) {
        return state;
      }

      const sourceSticker = currentState.stickers.find(
        (sticker) => sticker.id === action.stickerId,
      );

      if (!sourceSticker) {
        return state;
      }

      const duplicate: EditorSticker = {
        ...sourceSticker,

        id: action.newStickerId,

        x: clampPosition(sourceSticker.x + 5),

        y: clampPosition(sourceSticker.y + 5),

        zIndex: getHighestStickerZIndex(currentState.stickers) + 1,
      };

      return updateStickerCollection(state, [
        ...currentState.stickers,
        duplicate,
      ]);
    }

    case "BRING_STICKER_FORWARD": {
      const currentState = getSideState(state.draft, state.draft.side);

      const ordered = normalizeStickerOrdering(currentState.stickers);

      const index = ordered.findIndex(
        (sticker) => sticker.id === action.stickerId,
      );

      if (index < 0 || index === ordered.length - 1) {
        return state;
      }

      const current = ordered[index];

      const next = ordered[index + 1];

      ordered[index] = {
        ...next,

        zIndex: current.zIndex,
      };

      ordered[index + 1] = {
        ...current,

        zIndex: next.zIndex,
      };

      return updateStickerCollection(state, ordered);
    }

    case "SEND_STICKER_BACKWARD": {
      const currentState = getSideState(state.draft, state.draft.side);

      const ordered = normalizeStickerOrdering(currentState.stickers);

      const index = ordered.findIndex(
        (sticker) => sticker.id === action.stickerId,
      );

      if (index <= 0) {
        return state;
      }

      const current = ordered[index];

      const previous = ordered[index - 1];

      ordered[index] = {
        ...previous,

        zIndex: current.zIndex,
      };

      ordered[index - 1] = {
        ...current,

        zIndex: previous.zIndex,
      };

      return updateStickerCollection(state, ordered);
    }

    case "BRING_STICKER_TO_FRONT": {
      const currentState = getSideState(state.draft, state.draft.side);

      const target = currentState.stickers.find(
        (sticker) => sticker.id === action.stickerId,
      );

      if (!target) {
        return state;
      }

      const highest = getHighestStickerZIndex(currentState.stickers);

      if (target.zIndex === highest) {
        return state;
      }

      const nextStickers = currentState.stickers.map((sticker) =>
        sticker.id === action.stickerId
          ? {
              ...sticker,

              zIndex: highest + 1,
            }
          : sticker,
      );

      return updateStickerCollection(
        state,
        normalizeStickerOrdering(nextStickers),
      );
    }

    case "SEND_STICKER_TO_BACK": {
      const currentState = getSideState(state.draft, state.draft.side);

      const target = currentState.stickers.find(
        (sticker) => sticker.id === action.stickerId,
      );

      if (!target) {
        return state;
      }

      const lowest = getLowestStickerZIndex(currentState.stickers);

      if (target.zIndex === lowest) {
        return state;
      }

      const nextStickers = currentState.stickers.map((sticker) =>
        sticker.id === action.stickerId
          ? {
              ...sticker,

              zIndex: 0,
            }
          : sticker,
      );

      return updateStickerCollection(
        state,
        normalizeStickerOrdering(nextStickers),
      );
    }

    case "CLEAR_STICKERS": {
      const currentState = getSideState(state.draft, state.draft.side);

      if (currentState.stickers.length === 0) {
        return state;
      }

      return updateStickerCollection(state, []);
    }

    case "UNDO": {
      if (state.historyIndex <= 0) {
        return state;
      }

      const nextIndex = state.historyIndex - 1;

      return {
        draft: state.history[nextIndex],

        history: state.history,

        historyIndex: nextIndex,
      };
    }

    case "REDO": {
      if (state.historyIndex >= state.history.length - 1) {
        return state;
      }

      const nextIndex = state.historyIndex + 1;

      return {
        draft: state.history[nextIndex],

        history: state.history,

        historyIndex: nextIndex,
      };
    }

    case "COMMIT_DRAFT": {
      const currentSnapshot = state.history[state.historyIndex];

      if (currentSnapshot === state.draft) {
        return state;
      }

      return pushHistory(state, state.draft);
    }

    case "RESET_ACTIVE_SIDE": {
      const nextSide = createSideState(
        action.card,
        action.currentLanguage,
        state.draft.side,
      );

      const nextDraft = setSideState(state.draft, state.draft.side, nextSide);

      return pushHistory(state, nextDraft);
    }

    case "RESET_CARD": {
      return createEditorRuntimeState(action.card, action.currentLanguage);
    }

    case "LOAD_DRAFT": {
      return {
        draft: action.draft,

        history: [action.draft],

        historyIndex: 0,
      };
    }

    default:
      return state;
  }
}

export function loadDraftFromStorage(
  card: CardOption,
  currentLanguage: CardLanguage,
): EditorDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  const key = `${DRAFT_STORAGE_PREFIX}:${card.id}`;

  const saved = window.sessionStorage.getItem(key);

  if (!saved) {
    return null;
  }

  try {
    const parsed = JSON.parse(saved) as unknown;

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const record = parsed as Partial<StoredEditorDraft>;

    const supportedVersion =
      record.version === DRAFT_STORAGE_VERSION ||
      record.version === 7 ||
      record.version === 6 ||
      record.version === 5 ||
      record.version === 4 ||
      record.version === 3;

    if (
      !supportedVersion ||
      record.cardId !== card.id ||
      !record.draft ||
      typeof record.version !== "number"
    ) {
      return null;
    }

    return normalizeDraft(record.draft, card, currentLanguage, record.version);
  } catch {
    return null;
  }
}

export function saveDraftToStorage(card: CardOption, draft: EditorDraft) {
  if (typeof window === "undefined") {
    return;
  }

  const toStoredPhoto = (
    photo: EditorPhotoLayer | null,
  ): StoredEditorPhoto | null =>
    photo
      ? {
          requiresReselection: true,

          scale: clampFinite(
            Number(photo.scale ?? 1),
            PHOTO_SCALE_MIN,
            PHOTO_SCALE_MAX,
            1,
          ),

          x: clampPosition(Number(photo.x ?? 50)),

          y: clampPosition(Number(photo.y ?? 50)),

          rotation: clampFinite(Number(photo.rotation ?? 0), -30, 30, 0),

          frameSize: normalizePhotoFrameSize(photo.frameSize),
        }
      : null;

  const storageDraft: StoredEditorDraft = {
    version: DRAFT_STORAGE_VERSION,

    cardId: card.id,

    draft: {
      side: draft.side,

      previewMode: draft.previewMode,

      front: {
        ...draft.front,

        stickers: normalizeStickers(draft.front.stickers),

        photo: toStoredPhoto(draft.front.photo),
      },

      inside: {
        ...draft.inside,

        stickers: normalizeStickers(draft.inside.stickers),

        photo: toStoredPhoto(draft.inside.photo),
      },
    },
  };

  const key = `${DRAFT_STORAGE_PREFIX}:${card.id}`;

  window.sessionStorage.setItem(key, JSON.stringify(storageDraft));
}

export function getActiveSideData(draft: EditorDraft): EditorSideState {
  return draft.side === "front" ? draft.front : draft.inside;
}

export function getTextStyleForSide(
  draft: EditorDraft,
  layer: EditorTextLayer = "message",
): EditorTextStyle {
  return getActiveSideData(draft).textStyles[layer];
}

export function getStickerById(
  side: EditorSideState,
  stickerId: string | null,
): EditorSticker | null {
  if (!stickerId) {
    return null;
  }

  return side.stickers.find((sticker) => sticker.id === stickerId) ?? null;
}

export function createStickerInstance(
  asset: {
    id: string;
    src: string;
    label?: string;
    defaultWidth?: number;
    defaultScale?: number;
    defaultRotation?: number;
  },
  existingStickers: EditorSticker[] = [],
): EditorSticker {
  const randomPart =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return {
    id: `sticker-${randomPart}`,

    assetId: asset.id,

    src: asset.src,

    x: 50,

    y: 50,

    width: clampStickerWidth(Number(asset.defaultWidth ?? 20)),

    scale: clampFinite(
      Number(asset.defaultScale ?? 1),
      STICKER_SCALE_MIN,
      STICKER_SCALE_MAX,
      1,
    ),

    rotation: clampFinite(
      Number(asset.defaultRotation ?? 0),
      STICKER_ROTATION_MIN,
      STICKER_ROTATION_MAX,
      0,
    ),

    zIndex: getHighestStickerZIndex(existingStickers) + 1,

    label: asset.label,
  };
}
