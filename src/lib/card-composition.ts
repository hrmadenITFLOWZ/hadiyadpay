import type {
  CardLanguage,
  CardOption,
} from './card-types';

import {
  PHOTO_FRAME_SIZES,
  type EditorPosition,
  type EditorSideState,
  type EditorTextLayer,
} from './card-editor';

import {
  getCardProductionProfile,
} from './card-production';

export type CardSide =
  | 'front'
  | 'inside';

export interface CardCompositionLayout {
  showArtwork: boolean;
  showBrand: boolean;
  protectsBirthdayArtwork: boolean;
  defaultTextColor: string;

  textHeights: Record<
    EditorTextLayer,
    number
  >;

  defaultTextPositions: Record<
    EditorTextLayer,
    EditorPosition
  >;

  defaultPhotoPosition:
    EditorPosition;
}

export const cardInsideColors = {
  background:
    '#fffaf0',

  border:
    '#d8bd8d',

  ornament:
    '#b47855',

  text:
    '#31483e',
} as const;

const standardTextHeights: Record<
  EditorTextLayer,
  number
> = {
  recipient:
    18,

  message:
    28,

  sender:
    16,
};

const birthdayFrontTextHeights: Record<
  EditorTextLayer,
  number
> = {
  recipient:
    7,

  message:
    23,

  sender:
    7,
};

const insideTextHeights: Record<
  EditorTextLayer,
  number
> = {
  recipient:
    13,

  message:
    42,

  sender:
    13,
};

const standardFrontPositions: Record<
  EditorTextLayer,
  EditorPosition
> = {
  recipient: {
    x:
      50,

    y:
      14,
  },

  message: {
    x:
      50,

    y:
      70,
  },

  sender: {
    x:
      50,

    y:
      92,
  },
};

const birthdayFrontPositions: Record<
  EditorTextLayer,
  EditorPosition
> = {
  recipient: {
    x:
      50,

    y:
      65,
  },

  message: {
    x:
      50,

    y:
      80,
  },

  sender: {
    x:
      50,

    y:
      96,
  },
};

const insidePositions: Record<
  EditorTextLayer,
  EditorPosition
> = {
  recipient: {
    x:
      50,

    y:
      19,
  },

  message: {
    x:
      50,

    y:
      51,
  },

  sender: {
    x:
      50,

    y:
      83,
  },
};

export function getCardComposition(
  card: CardOption,
  side: CardSide,
): CardCompositionLayout {
  const isBirthdayFront =
    card.id ===
      'dhalasho' &&
    side ===
      'front';

  const productionProfile =
    getCardProductionProfile(
      card.id,
    );

  return {
    showArtwork:
      side ===
      'front',

    showBrand:
      false,

    protectsBirthdayArtwork:
      isBirthdayFront,

    defaultTextColor:
      side ===
        'inside'
        ? cardInsideColors.text
        : isBirthdayFront
          ? '#5a3129'
          : '#fef3c7',

    textHeights:
      isBirthdayFront
        ? birthdayFrontTextHeights
        : side ===
            'inside'
          ? insideTextHeights
          : standardTextHeights,

    defaultTextPositions:
      side ===
        'inside'
        ? insidePositions
        : isBirthdayFront
          ? birthdayFrontPositions
          : standardFrontPositions,

    defaultPhotoPosition:
      side ===
        'inside'
        ? {
            x:
              50,

            y:
              50,
          }
        : side ===
              'front' &&
            productionProfile
          ? productionProfile.photo
              .defaultPosition
          : isBirthdayFront
            ? {
                x:
                  89,

                y:
                  31,
              }
            : {
                x:
                  50,

                y:
                  50,
              },
  };
}

const fontFamilies = {
  fredoka:
    '"Fredoka", "Arial Rounded MT Bold", Arial, sans-serif',

  baloo:
    '"Baloo 2", "Arial Rounded MT Bold", Arial, sans-serif',

  nunito:
    '"Nunito", Arial, Helvetica, sans-serif',

  playfair:
    '"Playfair Display", Georgia, "Times New Roman", serif',

  sans:
    '"Nunito", Arial, Helvetica, sans-serif',

  serif:
    '"Playfair Display", Georgia, "Times New Roman", serif',

  mono:
    '"Nunito", Arial, Helvetica, sans-serif',
} as const;

function escapeXml(
  value: string,
): string {
  return value
    .replace(
      /&/g,
      '&amp;',
    )
    .replace(
      /</g,
      '&lt;',
    )
    .replace(
      />/g,
      '&gt;',
    )
    .replace(
      /"/g,
      '&quot;',
    )
    .replace(
      /'/g,
      '&apos;',
    );
}

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      value,
    ),
  );
}

function getSvgFontFamily(
  family: string,
): string {
  if (
    family in
    fontFamilies
  ) {
    return fontFamilies[
      family as keyof
        typeof fontFamilies
    ];
  }

  return fontFamilies.nunito;
}

function getTextLengthScale(
  value: string,
  layer: EditorTextLayer,
): number {
  const normalizedLength =
    value
      .replace(
        /\s+/g,
        ' ',
      )
      .trim()
      .length;

  if (
    layer ===
      'message'
  ) {
    if (
      normalizedLength >
      220
    ) {
      return 0.58;
    }

    if (
      normalizedLength >
      160
    ) {
      return 0.66;
    }

    if (
      normalizedLength >
      110
    ) {
      return 0.74;
    }

    if (
      normalizedLength >
      70
    ) {
      return 0.84;
    }

    return 1;
  }

  if (
    normalizedLength >
    38
  ) {
    return 0.58;
  }

  if (
    normalizedLength >
    30
  ) {
    return 0.68;
  }

  if (
    normalizedLength >
    22
  ) {
    return 0.78;
  }

  if (
    normalizedLength >
    16
  ) {
    return 0.88;
  }

  return 1;
}

function getSafeTextPosition(
  position: EditorPosition,
  layer: EditorTextLayer,
  cardSide: CardSide,
): EditorPosition {
  if (
    cardSide !==
    'inside'
  ) {
    return position;
  }

  const safeYRange: Record<
    EditorTextLayer,
    {
      minimum: number;
      maximum: number;
    }
  > = {
    recipient: {
      minimum:
        12,

      maximum:
        27,
    },

    message: {
      minimum:
        35,

      maximum:
        65,
    },

    sender: {
      minimum:
        75,

      maximum:
        88,
    },
  };

  return {
    x:
      clamp(
        position.x,
        46,
        54,
      ),

    y:
      clamp(
        position.y,
        safeYRange[
          layer
        ].minimum,
        safeYRange[
          layer
        ].maximum,
      ),
  };
}

function getSafeInsideFontSize(
  value: string,
  layer: EditorTextLayer,
  requestedFontSize: number,
  canvasWidth: number,
): number {
  const lengthScale =
    getTextLengthScale(
      value,
      layer,
    );

  const maximumFontSize =
    layer ===
      'message'
      ? canvasWidth *
        0.056
      : canvasWidth *
        0.052;

  const minimumFontSize =
    layer ===
      'message'
      ? canvasWidth *
        0.024
      : canvasWidth *
        0.026;

  return clamp(
    requestedFontSize *
      lengthScale,
    minimumFontSize,
    maximumFontSize,
  );
}

function renderTextLayer(
  side: EditorSideState,
  layer: EditorTextLayer,
  layout: CardCompositionLayout,
  canvasWidth: number,
  cardSide: CardSide,
): string {
  const value =
    side[layer].trim();

  if (!value) {
    return '';
  }

  const storedPosition =
    side.textPositions[
      layer
    ] ??
    layout.defaultTextPositions[
      layer
    ];

  const position =
    getSafeTextPosition(
      storedPosition,
      layer,
      cardSide,
    );

  const style =
    side.textStyles[
      layer
    ];

  const height =
    layout.textHeights[
      layer
    ];

  const x =
    cardSide ===
      'inside'
      ? 8
      : position.x -
        43;

  const y =
    clamp(
      position.y -
        height / 2,
      4,
      96 -
        height,
    );

  const requestedFontSize =
    layout.protectsBirthdayArtwork
      ? layer ===
          'message'
        ? Math.max(
            8,
            Math.min(
              (
                style.size *
                canvasWidth
              ) /
                550,

              canvasWidth *
                0.052,
            ),
          )
        : Math.min(
            (
              style.size *
              canvasWidth
            ) /
              500,

            canvasWidth *
              0.065,
          )
      : (
          style.size *
          canvasWidth
        ) /
        400;

  const fontSize =
    cardSide ===
      'inside'
      ? getSafeInsideFontSize(
          value,
          layer,
          requestedFontSize,
          canvasWidth,
        )
      : requestedFontSize;

  const lineHeight =
    cardSide ===
      'inside'
      ? layer ===
          'message'
        ? 1.22
        : 1.12
      : layout.protectsBirthdayArtwork
        ? 1.08
        : 1.18;

  const justifyContent =
    style.align ===
      'left'
      ? 'flex-start'
      : style.align ===
          'right'
        ? 'flex-end'
        : 'center';

  const textShadow =
    layout.showArtwork &&
    !layout.protectsBirthdayArtwork
      ? '0 2px 8px #000, 0 1px 2px #000'
      : 'none';

  const fontFamily =
    getSvgFontFamily(
      style.family,
    );

  const safeFontFamily =
    escapeXml(
      fontFamily,
    );

  const safeColor =
    escapeXml(
      style.color,
    );

  const safeAlignment =
    style.align ===
      'center' ||
    style.align ===
      'right'
      ? style.align
      : 'left';

  const width =
    cardSide ===
      'inside'
      ? 84
      : 86;

  const horizontalPadding =
    cardSide ===
      'inside'
      ? layer ===
          'message'
        ? 4
        : 3
      : 2;

  return [
    '<foreignObject',

    ` x="${x}%"`,

    ` y="${y}%"`,

    ` width="${width}%"`,

    ` height="${height}%"`,

    '>',

    '<div',

    ' xmlns="http://www.w3.org/1999/xhtml"',

    ' style="',

    'box-sizing:border-box;',
    'width:100%;',
    'height:100%;',
    'display:flex;',
    'align-items:center;',

    `justify-content:${justifyContent};`,

    'overflow:hidden;',

    `padding:0 ${horizontalPadding}%;`,

    'border:none;',
    'outline:none;',
    'background:transparent;',
    'box-shadow:none;',

    `color:${safeColor};`,

    `font-family:${safeFontFamily};`,

    `font-size:${fontSize}px;`,

    `font-weight:${
      style.bold
        ? 700
        : 400
    };`,

    `font-style:${
      style.italic
        ? 'italic'
        : 'normal'
    };`,

    `text-decoration:${
      style.underline
        ? 'underline'
        : 'none'
    };`,

    `text-align:${safeAlignment};`,

    `line-height:${lineHeight};`,

    'white-space:pre-wrap;',
    'overflow-wrap:anywhere;',
    'word-break:break-word;',

    `text-shadow:${textShadow};`,

    '"',

    '>',

    escapeXml(
      value,
    ),

    '</div>',

    '</foreignObject>',
  ].join('');
}

function getPhotoFrameDimensions(
  side: EditorSideState,
  canvasWidth: number,
  canvasHeight: number,
): {
  frameX: number;
  frameY: number;
  frameWidth: number;
  frameHeight: number;
  clipRadius: number;
} | null {
  const photo =
    side.photo;

  if (!photo) {
    return null;
  }

  const framePercent =
    PHOTO_FRAME_SIZES[
      photo.frameSize
    ] ??
    PHOTO_FRAME_SIZES.large;

  const availableWidth =
    canvasWidth *
    0.88;

  const availableHeight =
    canvasHeight *
    0.88;

  const requestedWidth =
    canvasWidth *
    (
      framePercent /
      100
    );

  const requestedHeight =
    canvasHeight *
    (
      framePercent /
      100
    );

  const frameWidth =
    Math.min(
      requestedWidth,
      availableWidth,
    );

  const frameHeight =
    Math.min(
      requestedHeight,
      availableHeight,
    );

  const frameX =
    (
      canvasWidth -
      frameWidth
    ) /
    2;

  const frameY =
    (
      canvasHeight -
      frameHeight
    ) /
    2;

  const clipRadius =
    Math.max(
      18,
      Math.min(
        frameWidth,
        frameHeight,
      ) *
        0.035,
    );

  return {
    frameX,
    frameY,
    frameWidth,
    frameHeight,
    clipRadius,
  };
}

function renderPhotoLayer(
  side: EditorSideState,
  canvasWidth: number,
  canvasHeight: number,
  photoDataUrl?: string,
  clipPathId =
    'photo-frame-clip',
): string {
  const photo =
    side.photo;

  if (
    !photo ||
    !photoDataUrl
  ) {
    return '';
  }

  const dimensions =
    getPhotoFrameDimensions(
      side,
      canvasWidth,
      canvasHeight,
    );

  if (!dimensions) {
    return '';
  }

  const {
    frameX,
    frameY,
    frameWidth,
    frameHeight,
    clipRadius,
  } =
    dimensions;

  const zoom =
    Math.max(
      1,
      photo.scale,
    );

  const scaledWidth =
    frameWidth *
    zoom;

  const scaledHeight =
    frameHeight *
    zoom;

  const focusX =
    clamp(
      photo.x,
      0,
      100,
    ) /
    100;

  const focusY =
    clamp(
      photo.y,
      0,
      100,
    ) /
    100;

  const overflowX =
    Math.max(
      0,
      scaledWidth -
        frameWidth,
    );

  const overflowY =
    Math.max(
      0,
      scaledHeight -
        frameHeight,
    );

  const imageX =
    frameX -
    overflowX *
      focusX;

  const imageY =
    frameY -
    overflowY *
      focusY;

  const centerX =
    frameX +
    frameWidth / 2;

  const centerY =
    frameY +
    frameHeight / 2;

  return [
    '<defs>',

    `<clipPath id="${clipPathId}">`,

    '<rect',

    ` x="${frameX}"`,

    ` y="${frameY}"`,

    ` width="${frameWidth}"`,

    ` height="${frameHeight}"`,

    ` rx="${clipRadius}"`,

    ` ry="${clipRadius}"`,

    '/>',

    '</clipPath>',

    '</defs>',

    '<rect',

    ` x="${frameX}"`,

    ` y="${frameY}"`,

    ` width="${frameWidth}"`,

    ` height="${frameHeight}"`,

    ` rx="${clipRadius}"`,

    ` ry="${clipRadius}"`,

    ' fill="#f6eddf"',

    ` stroke="${cardInsideColors.border}"`,

    ' stroke-width="3"',

    '/>',

    '<image',

    ` href="${escapeXml(
      photoDataUrl,
    )}"`,

    ` x="${imageX}"`,

    ` y="${imageY}"`,

    ` width="${scaledWidth}"`,

    ` height="${scaledHeight}"`,

    ' preserveAspectRatio="xMidYMid slice"',

    ` transform="rotate(${
      photo.rotation ??
      0
    } ${centerX} ${centerY})"`,

    ` clip-path="url(#${clipPathId})"`,

    '/>',

    '<rect',

    ` x="${frameX}"`,

    ` y="${frameY}"`,

    ` width="${frameWidth}"`,

    ` height="${frameHeight}"`,

    ` rx="${clipRadius}"`,

    ` ry="${clipRadius}"`,

    ' fill="none"',

    ' stroke="#ffffff"',

    ' stroke-opacity=".78"',

    ' stroke-width="5"',

    '/>',
  ].join('');
}

function renderInsideBackground(
  width: number,
  height: number,
): string {
  return [
    '<rect',

    ` width="${width}"`,

    ` height="${height}"`,

    ` fill="${cardInsideColors.background}"`,

    '/>',

    '<rect',

    ' x="28"',

    ' y="28"',

    ` width="${
      width -
      56
    }"`,

    ` height="${
      height -
      56
    }"`,

    ' rx="28"',

    ' fill="none"',

    ` stroke="${cardInsideColors.border}"`,

    ' stroke-width="4"',

    '/>',

    '<path',

    ` d="M92 150h270m476 0h270M92 ${
      height -
      150
    }h270m476 0h270"`,

    ` stroke="${cardInsideColors.border}"`,

    ' stroke-width="3"',

    '/>',

    '<circle',

    ` cx="${
      width /
      2
    }"`,

    ' cy="150"',

    ' r="13"',

    ` fill="${cardInsideColors.ornament}"`,

    '/>',

    '<circle',

    ` cx="${
      width /
      2
    }"`,

    ` cy="${
      height -
      150
    }"`,

    ' r="13"',

    ` fill="${cardInsideColors.ornament}"`,

    '/>',
  ].join('');
}

function renderInsidePhotoFallback(
  width: number,
  height: number,
): string {
  const centerX =
    width /
    2;

  const centerY =
    height /
    2;

  const markRadius =
    Math.min(
      width,
      height,
    ) *
    0.09;

  return [
    '<defs>',

    '<pattern',

    ' id="inside-photo-pattern"',

    ' width="96"',

    ' height="96"',

    ' patternUnits="userSpaceOnUse"',

    ' patternTransform="rotate(30)"',

    '>',

    '<path',

    ' d="M0 48h96M48 0v96"',

    ` stroke="${cardInsideColors.border}"`,

    ' stroke-opacity=".16"',

    ' stroke-width="3"',

    '/>',

    '</pattern>',

    '</defs>',

    '<rect',

    ` width="${width}"`,

    ` height="${height}"`,

    ` fill="${cardInsideColors.background}"`,

    '/>',

    '<rect',

    ` width="${width}"`,

    ` height="${height}"`,

    ' fill="url(#inside-photo-pattern)"',

    '/>',

    '<rect',

    ' x="28"',

    ' y="28"',

    ` width="${
      width -
      56
    }"`,

    ` height="${
      height -
      56
    }"`,

    ' rx="28"',

    ' fill="none"',

    ` stroke="${cardInsideColors.border}"`,

    ' stroke-width="4"',

    '/>',

    '<circle',

    ` cx="${centerX}"`,

    ` cy="${centerY}"`,

    ` r="${markRadius}"`,

    ' fill="#fffdf7"',

    ' fill-opacity=".86"',

    ` stroke="${cardInsideColors.border}"`,

    ' stroke-width="3"',

    '/>',

    '<text',

    ` x="${centerX}"`,

    ` y="${
      centerY +
      markRadius *
        0.3
    }"`,

    ' text-anchor="middle"',

    ` fill="${cardInsideColors.text}"`,

    ' font-family="Georgia, Times New Roman, serif"',

    ` font-size="${
      markRadius *
      0.9
    }"`,

    ' font-weight="700"',

    '>',

    'H',

    '</text>',
  ].join('');
}

function getCanvasDimensions(
  card: CardOption,
): {
  width: number;
  height: number;
} {
  const productionProfile =
    getCardProductionProfile(
      card.id,
    );

  const width =
    productionProfile
      ?.digital.width ??
    1200;

  const height =
    productionProfile
      ?.digital.height ??
    (
      card.orientation ===
        'portrait'
        ? 1464
        : 968
    );

  return {
    width,
    height,
  };
}

export function renderInsidePhotoSvg(
  card: CardOption,
  language: CardLanguage,
  side: EditorSideState,
  photoDataUrl?: string,
): string {
  const {
    width,
    height,
  } =
    getCanvasDimensions(
      card,
    );

  const title =
    escapeXml(
      card.title[
        language
      ],
    );

  const content =
    photoDataUrl &&
    side.photo
      ? [
          '<rect',

          ` width="${width}"`,

          ` height="${height}"`,

          ` fill="${cardInsideColors.background}"`,

          '/>',

          renderPhotoLayer(
            side,
            width,
            height,
            photoDataUrl,
            'inside-left-photo-clip',
          ),
        ].join('')
      : renderInsidePhotoFallback(
          width,
          height,
        );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',

    '<svg',

    ' xmlns="http://www.w3.org/2000/svg"',

    ' xmlns:xhtml="http://www.w3.org/1999/xhtml"',

    ` width="${width}"`,

    ` height="${height}"`,

    ` viewBox="0 0 ${width} ${height}"`,

    ' role="img"',

    ' aria-labelledby="inside-photo-title"',

    '>',

    '<title id="inside-photo-title">',

    title,

    '</title>',

    content,

    '</svg>',
  ].join('');
}

export function renderCardSvg(
  card: CardOption,
  language: CardLanguage,
  cardSide: CardSide,
  side: EditorSideState,
  artworkDataUrl: string,
  photoDataUrl?: string,
): string {
  const {
    width,
    height,
  } =
    getCanvasDimensions(
      card,
    );

  const layout =
    getCardComposition(
      card,
      cardSide,
    );

  const artwork =
    layout.showArtwork
      ? card.artwork.type ===
          'local-image'
        ? [
            '<image',

            ` href="${escapeXml(
              artworkDataUrl,
            )}"`,

            ' x="0"',

            ' y="0"',

            ` width="${width}"`,

            ` height="${height}"`,

            ' preserveAspectRatio="xMidYMid slice"',

            '/>',
          ].join('')
        : [
            '<rect',

            ` width="${width}"`,

            ` height="${height}"`,

            ` fill="${escapeXml(
              card.artwork.background,
            )}"`,

            '/>',
          ].join('')
      : renderInsideBackground(
          width,
          height,
        );

  const photoMarkup =
    cardSide ===
      'front'
      ? renderPhotoLayer(
          side,
          width,
          height,
          photoDataUrl,
          'front-photo-clip',
        )
      : '';

  const title =
    escapeXml(
      card.title[
        language
      ],
    );

  const recipient =
    renderTextLayer(
      side,
      'recipient',
      layout,
      width,
      cardSide,
    );

  const message =
    renderTextLayer(
      side,
      'message',
      layout,
      width,
      cardSide,
    );

  const sender =
    renderTextLayer(
      side,
      'sender',
      layout,
      width,
      cardSide,
    );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',

    '<svg',

    ' xmlns="http://www.w3.org/2000/svg"',

    ' xmlns:xhtml="http://www.w3.org/1999/xhtml"',

    ` width="${width}"`,

    ` height="${height}"`,

    ` viewBox="0 0 ${width} ${height}"`,

    ' role="img"',

    ' aria-labelledby="card-title"',

    '>',

    '<title id="card-title">',

    title,

    '</title>',

    artwork,

    photoMarkup,

    recipient,

    message,

    sender,

    '</svg>',
  ].join('');
}