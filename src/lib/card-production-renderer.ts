import type {
  CardLanguage,
  CardOption,
} from './card-types';

import {
  PHOTO_FRAME_SIZES,
  type EditorSideState,
  type EditorTextLayer,
} from './card-editor';

import {
  getCardComposition,
} from './card-composition';

import {
  getCardProductionProfile,
} from './card-production';

const fontFamilies = {
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

function getSvgFontFamily(
  family: string,
): string {
  if (
    family in fontFamilies
  ) {
    return fontFamilies[
      family as keyof typeof fontFamilies
    ];
  }

  return fontFamilies.sans;
}

function renderProductionTextLayer(
  side: EditorSideState,
  layer: EditorTextLayer,
  canvasWidth: number,
  textHeightPercent: number,
): string {
  const value =
    side[layer].trim();

  if (!value) {
    return '';
  }

  const position =
    side.textPositions[layer];

  const style =
    side.textStyles[layer];

  const x =
    position.x - 43;

  const y =
    position.y -
    textHeightPercent / 2;

  const fontSize =
    (
      style.size *
      canvasWidth
    ) /
    400;

  const fontFamily =
    getSvgFontFamily(
      style.family,
    );

  const justifyContent =
    style.align === 'left'
      ? 'flex-start'
      : style.align === 'right'
        ? 'flex-end'
        : 'center';

  const safeAlignment =
    style.align === 'center' ||
    style.align === 'right'
      ? style.align
      : 'left';

  return [
    '<foreignObject',

    ` x="${x}%"`,

    ` y="${y}%"`,

    ' width="86%"',

    ` height="${textHeightPercent}%"`,

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

    'padding:0 2%;',

    `color:${escapeXml(
      style.color,
    )};`,

    `font-family:${escapeXml(
      fontFamily,
    )};`,

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

    'line-height:1.18;',

    'white-space:pre-wrap;',

    'overflow-wrap:anywhere;',

    '"',

    '>',

    escapeXml(
      value,
    ),

    '</div>',

    '</foreignObject>',
  ].join('');
}

function renderProductionPhotoLayer(
  side: EditorSideState,
  canvasWidth: number,
  canvasHeight: number,
  photoDataUrl?: string,
): string {
  const photo =
    side.photo;

  if (
    !photo ||
    !photoDataUrl
  ) {
    return '';
  }

  const framePercent =
    PHOTO_FRAME_SIZES[
      photo.frameSize
    ] ??
    PHOTO_FRAME_SIZES.large;

  const frameWidth =
    canvasWidth *
    (
      framePercent /
      100
    );

  const frameHeight =
    canvasHeight *
    (
      framePercent /
      100
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

  const zoom =
    Math.max(
      1,
      photo.scale,
    );

  const imageWidth =
    frameWidth *
    zoom;

  const imageHeight =
    frameHeight *
    zoom;

  const focusX =
    Math.min(
      100,
      Math.max(
        0,
        photo.x,
      ),
    ) /
    100;

  const focusY =
    Math.min(
      100,
      Math.max(
        0,
        photo.y,
      ),
    ) /
    100;

  const horizontalOverflow =
    Math.max(
      0,
      imageWidth -
        frameWidth,
    );

  const verticalOverflow =
    Math.max(
      0,
      imageHeight -
        frameHeight,
    );

  const imageX =
    frameX -
    horizontalOverflow *
      focusX;

  const imageY =
    frameY -
    verticalOverflow *
      focusY;

  const centerX =
    frameX +
    frameWidth / 2;

  const centerY =
    frameY +
    frameHeight / 2;

  const cornerRadius =
    Math.max(
      24,
      Math.min(
        frameWidth,
        frameHeight,
      ) *
        0.035,
    );

  return [
    '<defs>',

    '<clipPath id="production-photo-clip">',

    '<rect',

    ` x="${frameX}"`,

    ` y="${frameY}"`,

    ` width="${frameWidth}"`,

    ` height="${frameHeight}"`,

    ` rx="${cornerRadius}"`,

    ` ry="${cornerRadius}"`,

    '/>',

    '</clipPath>',

    '</defs>',

    '<rect',

    ` x="${frameX}"`,

    ` y="${frameY}"`,

    ` width="${frameWidth}"`,

    ` height="${frameHeight}"`,

    ` rx="${cornerRadius}"`,

    ` ry="${cornerRadius}"`,

    ' fill="#f6eddf"',

    ' stroke="#d8bd8d"',

    ' stroke-width="4"',

    '/>',

    '<image',

    ` href="${escapeXml(
      photoDataUrl,
    )}"`,

    ` x="${imageX}"`,

    ` y="${imageY}"`,

    ` width="${imageWidth}"`,

    ` height="${imageHeight}"`,

    ' preserveAspectRatio="xMidYMid slice"',

    ` transform="rotate(${
      photo.rotation
    } ${centerX} ${centerY})"`,

    ' clip-path="url(#production-photo-clip)"',

    '/>',

    '<rect',

    ` x="${frameX}"`,

    ` y="${frameY}"`,

    ` width="${frameWidth}"`,

    ` height="${frameHeight}"`,

    ` rx="${cornerRadius}"`,

    ` ry="${cornerRadius}"`,

    ' fill="none"',

    ' stroke="#ffffff"',

    ' stroke-opacity=".75"',

    ' stroke-width="6"',

    '/>',
  ].join('');
}

export function renderProductionCardSvg(
  card: CardOption,
  language: CardLanguage,
  side: EditorSideState,
  artworkDataUrl: string,
  photoDataUrl?: string,
): string {
  const productionProfile =
    getCardProductionProfile(
      card.id,
    );

  if (!productionProfile) {
    throw new Error(
      `Card "${card.id}" does not have a production profile`,
    );
  }

  const width =
    productionProfile
      .productionMaster
      .width;

  const height =
    productionProfile
      .productionMaster
      .height;

  const layout =
    getCardComposition(
      card,
      'front',
    );

  const photoMarkup =
    productionProfile
      .photo
      .allowed
      ? renderProductionPhotoLayer(
          side,
          width,
          height,
          photoDataUrl,
        )
      : '';

  const artwork =
    card.artwork.type ===
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
        ].join('');

  const recipient =
    renderProductionTextLayer(
      side,
      'recipient',
      width,
      layout.textHeights
        .recipient,
    );

  const message =
    renderProductionTextLayer(
      side,
      'message',
      width,
      layout.textHeights
        .message,
    );

  const sender =
    renderProductionTextLayer(
      side,
      'sender',
      width,
      layout.textHeights
        .sender,
    );

  const title =
    escapeXml(
      card.title[
        language
      ],
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

    ' aria-labelledby="production-card-title"',

    '>',

    '<title id="production-card-title">',

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