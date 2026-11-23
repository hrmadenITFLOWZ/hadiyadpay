import {
  editorColorOptions,
  createEditorRuntimeState,
  MAX_STICKERS_PER_SIDE,
  PHOTO_SCALE_MAX,
  PHOTO_SCALE_MIN,
  STICKER_ROTATION_MAX,
  STICKER_ROTATION_MIN,
  STICKER_SCALE_MAX,
  STICKER_SCALE_MIN,
  type EditorDraft,
  type EditorPhotoFrameSize,
  type EditorPhotoLayer,
  type EditorPosition,
  type EditorSideState,
  type EditorSticker,
  type EditorTextFontFamily,
  type EditorTextLayer,
  type EditorTextStyle,
} from './card-editor';

import type {
  CardLanguage,
  CardOption,
} from './card-types';

type SerializableEditorPhoto =
  Omit<
    EditorPhotoLayer,
    | 'src'
    | 'requiresReselection'
  >;

type SerializableEditorSide =
  Omit<
    EditorSideState,
    'photo'
  > & {
    photo:
      SerializableEditorPhoto | null;
  };

export interface SerializableOrderDraft
  extends Omit<
    EditorDraft,
    'front' | 'inside'
  > {
  front:
    SerializableEditorSide;

  inside:
    SerializableEditorSide;
}

function isRecord(
  value: unknown,
): value is Record<
  string,
  unknown
> {
  return (
    typeof value ===
      'object' &&
    value !==
      null &&
    !Array.isArray(
      value,
    )
  );
}

function boundedNumber(
  value: unknown,
  min: number,
  max: number,
  fallback: number,
): number {
  const parsed =
    Number(
      value,
    );

  return Number.isFinite(
    parsed,
  )
    ? Math.min(
        Math.max(
          parsed,
          min,
        ),
        max,
      )
    : fallback;
}

function boundedInteger(
  value: unknown,
  min: number,
  max: number,
  fallback: number,
): number {
  return Math.round(
    boundedNumber(
      value,
      min,
      max,
      fallback,
    ),
  );
}

function parsePhotoFrameSize(
  value: unknown,
): EditorPhotoFrameSize {
  if (
    value ===
      'small' ||
    value ===
      'medium'
  ) {
    return value;
  }

  return 'large';
}

function createFallbackPhotoLayer():
  EditorPhotoLayer {
  return {
    width:
      1200,

    height:
      1200,

    scale:
      1,

    x:
      50,

    y:
      50,

    rotation:
      0,

    frameSize:
      'large',

    requiresReselection:
      false,
  };
}

function parseStyle(
  value: unknown,
  fallback: EditorTextStyle,
): EditorTextStyle {
  if (
    !isRecord(
      value,
    )
  ) {
    return fallback;
  }

  const family:
    EditorTextFontFamily =
    value.family ===
      'serif' ||
    value.family ===
      'mono'
      ? value.family
      : 'sans';

  return {
    color:
      typeof value.color ===
        'string' &&
      editorColorOptions.includes(
        value.color,
      )
        ? value.color
        : fallback.color,

    align:
      value.align ===
        'left' ||
      value.align ===
        'right'
        ? value.align
        : 'center',

    size:
      boundedNumber(
        value.size,
        18,
        52,
        fallback.size,
      ),

    family,

    bold:
      value.bold ===
      true,

    italic:
      value.italic ===
      true,

    underline:
      value.underline ===
      true,
  };
}

function parsePosition(
  value: unknown,
  fallback: EditorPosition,
): EditorPosition {
  if (
    !isRecord(
      value,
    )
  ) {
    return fallback;
  }

  return {
    x:
      boundedNumber(
        value.x,
        0,
        100,
        fallback.x,
      ),

    y:
      boundedNumber(
        value.y,
        0,
        100,
        fallback.y,
      ),
  };
}

function isValidStickerPath(
  value: string,
): boolean {
  if (
    !value.startsWith(
      '/stickers/',
    )
  ) {
    return false;
  }

  if (
    value.includes(
      '..',
    ) ||
    value.includes(
      '\\',
    ) ||
    value.includes(
      '?',
    ) ||
    value.includes(
      '#',
    )
  ) {
    return false;
  }

  return /^\/stickers\/[a-zA-Z0-9/_-]+\.(png|webp|svg)$/i.test(
    value,
  );
}

function parseSticker(
  value: unknown,
  fallbackZIndex: number,
): EditorSticker | null {
  if (
    !isRecord(
      value,
    )
  ) {
    return null;
  }

  const id =
    value.id;

  const assetId =
    value.assetId;

  const src =
    value.src;

  if (
    typeof id !==
      'string' ||
    id.length ===
      0 ||
    id.length >
      120 ||
    typeof assetId !==
      'string' ||
    assetId.length ===
      0 ||
    assetId.length >
      120 ||
    typeof src !==
      'string' ||
    src.length ===
      0 ||
    src.length >
      500 ||
    !isValidStickerPath(
      src,
    )
  ) {
    return null;
  }

  return {
    id,

    assetId,

    src,

    x:
      boundedNumber(
        value.x,
        0,
        100,
        50,
      ),

    y:
      boundedNumber(
        value.y,
        0,
        100,
        50,
      ),

    width:
      boundedNumber(
        value.width,
        4,
        60,
        20,
      ),

    scale:
      boundedNumber(
        value.scale,
        STICKER_SCALE_MIN,
        STICKER_SCALE_MAX,
        1,
      ),

    rotation:
      boundedNumber(
        value.rotation,
        STICKER_ROTATION_MIN,
        STICKER_ROTATION_MAX,
        0,
      ),

    zIndex:
      boundedInteger(
        value.zIndex,
        1,
        1000,
        fallbackZIndex,
      ),

    label:
      typeof value.label ===
        'string'
        ? value.label.slice(
            0,
            120,
          )
        : undefined,
  };
}

function parseStickers(
  value: unknown,
): EditorSticker[] {
  /*
   * Bestaande orders bevatten nog geen
   * stickers. Een ontbrekend veld wordt
   * daarom veilig als lege array behandeld.
   */
  if (
    value ===
      unde*ined ||
    value ===
      null
 *) {
    return [];
  }

  if (
   *!Array.isArray(
      value,
    )*  ) {
    throw new Error(
      '*nvalid card stickers',
    );
  }
*  if (
    value.length >
    MAX_*TICKERS_PER_SIDE
  ) {
    throw n*w Error(
      `A maximum of ${MAX*STICKERS_PER_SIDE} stickers is all*wed per card side`,
    );
  }

  *onst stickers:
    EditorSticker[]*= [];

  const usedIds =
    new S*t<string>();

  for (
    const rawSticker of
    value
  ) {
    const sticker =
      parseSticker(
        rawSticker,
        stickers.length +
          1,
      );

    if (
      !sticker
    ) {
      throw new Error(
        'Invalid card sticker',
      );
    }

    if (
      usedIds.has(
        sticker.id,
      )
    ) {
      throw new Error(
        'Duplicate card sticker',
      );
    }

    usedIds.add(
      sticker.id,
    );

    stickers.push(
      sticker,
    );
  }

  /*
   * Houd de z-volgorde stabiel en compact.
   *
   * De opgeslagen volgorde wordt eerst op
   * zIndex gesorteerd en daarna opnieuw
   * genummerd vanaf 1.
   */
  return stickers
    .sort(
   *  (
        first,
        second,*      ) =>
        first.zIndex -
*       second.zIndex,
    )
    .m*p(
      (
        sticker,
      * index,
      ) => ({
        ...s*icker,

        zIndex:
          *ndex +
          1,
      }),
    *;
}

function parseSide(
  value: *nknown,
  fallback: EditorSideStat*,
  hasPhotoFile: boolean,
  stric*PhotoValidation: boolean,
): Edito*SideState {
  if (
    !isRecord(
*     value,
    )
  ) {
    throw *ew Error(
      'Invalid card side*,
    );
  }

  const recipient =
*   value.recipient;

  const sende* =
    value.sender;

  const mess*ge =
    value.message;

  if (
  * typeof recipient !==
      'strin*' ||
    recipient.length >
      *0 ||
    typeof sender !==
      '*tring' ||
    sender.length >
    * 80 ||
    typeof message !==
    * 'string' ||
    message.length >
*     800
  ) {
    throw new Error*
      'Invalid card text',
    );*  }

  const styles =
    isRecord*
      value.textStyles,
    )
   *  ? value.textStyles
      : {};

* const legacyStyle =
    parseStyl*(
      value.textStyle,
      fal*back.textStyle,
    );

  const te*tStyles = (
    [
      'recipient',
      'sender',
      'message',
    ] as const
  ).reduce(
    (
 *    result,
      layer,
    ) => *
      result[
        layer
      ] =
        parseStyle(
          *tyles[
            layer
          ],

          fallback
            .textStyles[
            layer
          ] ??
            legacyStyle,
        );

      return result;
    },

    {} as Record<
      EditorTextLayer,
      EditorTextStyle
    >,
  );

  const positions =
    isRecord(
      value.textPositions,
    )
      ? value.textPositions
      : {};

  const textPositions = (
    [
      'recipient',
      'sender',
      'message',
    ] as const
  ).reduce(
    (
      result,
      layer,
    ) => {
      result[
        layer
      ] =
        parsePosition(
          positions[
            layer
          ],

          fallback
            .textPositions[
            layer
          ],
        );

      return result;
    },

    {} as Record<
      EditorTextLayer,
      EditorPosition
    >,
  );

  const stickers =
    parseStickers(
      value.stickers,
    );

  let photo:
    EditorPhotoLayer | null =
    null;

  const hasSerializedPhoto =
    value.photo !==
      null &&
    value.photo !==
      undefined;

  if (
    hasSerializedPhoto &&
    hasPhotoFile
  ) {
    if (
      !isRecord(
        value.photo,
      )
    ) {
      if (
        strictPhotoValidation
      ) {
        throw new Error(
          'Reselect the card photo before checkout',
        );
      }

      photo =
        createFallbackPhotoLayer();
    } else {
      photo = {
        width:
          boundedNumber(
            value.photo.width,
            1,
            12000,
            1200,
          ),

        height:
          boundedNumber(
            value.photo.height,
            1,
            12000,
            1200,
          ),

        scale:
          boundedNumber(
            value.photo.scale,
            PHOTO_SCALE_MIN,
            PHOTO_SCALE_MAX,
            1,
          ),

        x:
          boundedNumber(
            value.photo.x,
            0,
            100,
            50,
          ),

        y:
          boundedNumber(
            value.photo.y,
            0,
            100,
            50,
          ),

        rotation:
          boundedNumber(
            value.photo.rotation,
            -30,
            30,
            0,
          ),

        frameSize:
          parsePhotoFrameSize(
            value.photo
              .frameSize,
          ),

        requiresReselection:
          false,
      };
    }
  } else if (
    hasSerializedPhoto &&
    !hasPhotoFile
  ) {
    if (
      strictPhotoValidation
    ) {
      throw new Error(
        'Reselect the card photo before checkout',
      );
    }

    photo =
      null;
  } else if (
    !hasSerializedPhoto &&
    hasPhotoFile
  ) {
    /*
     * Bestaande bestellingen kunnen een
     * werkelijk opgeslagen fotobestand
     * hebben zonder fotometadata.
     *
     * Tijdens checkout blijft dit ongeldig.
     * Tijdens share- en downloadrendering
     * gebruiken we veilige standaardwaarden.
     */
    if (
      strictPhotoValidation
    ) {
      throw new Error(
        'Unexpected card photo',
      );
    }

    photo =
      createFallbackPhotoLayer();
  }

  return {
    recipient,

    sender,

    message,

    textStyle:
      legacyStyle,

    textStyles,

    textPositions,

    photo,

    stickers,
  };
}

export function serializeEditorDraft(
  draft: EditorDraft,
): SerializableOrderDraft {
  const serializeSticker = (
    sticker: EditorSticker,
  ): EditorSticker => ({
    id:
      sticker.id,

    assetId:
      sticker.assetId,

    src:
      sticker.src,

    x:
      boundedNumber(
        sticker.x,
        0,
        100,
        50,
      ),

    y:
      boundedNumber(
        sticker.y,
        0,
        100,
        50,
      ),

    width:
      boundedNumber(
        sticker.width,
        4,
        60,
        20,
      ),

    scale:
      boundedNumber(
        sticker.scale,
        STICKER_SCALE_MIN,
        STICKER_SCALE_MAX,
        1,
      ),

    rotation:
      boundedNumber(
        sticker.rotation,
        STICKER_ROTATION_MIN,
        STICKER_ROTATION_MAX,
        0,
      ),

    zIndex:
      boundedInteger(
        sticker.zIndex,
        1,
        1000,
        1,
      ),

    label:
      typeof sticker.label ===
        'string'
        ? sticker.label.slice(
            0,
            120,
          )
        : undefined,
  });

  const serializeSide = (
    side: EditorSideState,
  ): SerializableEditorSide => ({
    recipient:
      side.recipient,

    sender:
      side.sender,

    message:
      side.message,

    textStyle:
      side.textStyle,

    textStyles:
      side.textStyles,

    textPositions:
      side.textPositions,

    stickers:
      side.stickers
        .slice(
          0,
          MAX_STICKERS_PER_SIDE,
        )
        .map(
          serializeSticker,
        ),

    photo:
      side.photo
        ? {
            width:
              side.photo.width,

            height:
              side.photo.height,

            scale:
              side.photo.scale,

            x:
              side.photo.x,

            y:
              side.photo.y,

            rotation:
              side.photo.rotation,

            frameSize:
              side.photo.frameSize,
          }
        : null,
  });

  return {
    side:
      draft.side,

    previewMode:
      draft.previewMode,

    front:
      serializeSide(
        draft.front,
      ),

    inside:
      serializeSide(
        draft.inside,
      ),
  };
}

export function parseOrderDraft(
  value: unknown,
  card: CardOption,
  language: CardLanguage,
  hasFrontPhoto: boolean,
  hasInsidePhoto: boolean,
  strictPhotoValidation =
    true,
): EditorDraft {
  if (
    !isRecord(
      value,
    )
  ) {
    throw new Error(
      'Invalid card draft',
    );
  }

  const defaults =
    createEditorRuntimeState(
      card,
      language,
    ).draft;

  return {
    side:
      value.side ===
        'inside'
        ? 'inside'
        : 'front',

    /*
     * Opgeslagen bestellingen worden altijd
     * schoon weergegeven, zonder editorguides.
     */
    previewMode:
      'clean',

    front:
      parseSide(
        value.front,
        defaults.front,
        hasFrontPhoto,
        strictPhotoValidation,
      ),

    inside:
      parseSide(
        value.inside,
        defaults.inside,
        hasInsidePhoto,
        strictPhotoValidation,
      ),
  };
}