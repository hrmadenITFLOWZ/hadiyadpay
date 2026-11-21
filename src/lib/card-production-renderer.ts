import type {
  CardLanguage,
  CardOption,
} from './card-types';

import type {
  EditorSideState,
  EditorTextLayer,
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
      family as keyof
        typeof fontFamilies
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
    side.textPositions[
      layer
    ];

  const style =
    side.textStyles[
      layer
    ];

  const x =
    position.x - 43;

  const y =
    position.y -
    textHeightPercent / 2;

  /*
   * The digital renderer uses:
   *
   * style.size * 1200 / 400
   *
   * By tying typography to canvasWidth,
   * the same visual scale is preserved
   * when moving from 1200px to 4800px.
   */
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

  const photo =
    side.photo;

  const photoWidthPercent =
    productionProfile
      .photo
      .widthPercent;

  const photoSize =
    width *
    (
      photoWidthPercent /
      100
    ) *
    (
      photo?.scale ??
      1
    );

  const photoCenterX =
    (
      (
        photo?.x ??
        productionProfile
          .photo
          .defaultPosition
          .x
      ) /
      100
    ) *
    width;

  const photoCenterY =
    (
      (
        photo?.y ??
        productionProfile
          .photo
          .defaultPosition
          .y
      ) /
      100
    ) *
    height;

  const photoRadius =
    width *
    (
      photoWidthPercent /
      200
    );

  const photoMarkup =
    productionProfile
      .photo
      .allowed &&
    photo &&
    photoDataUrl
      ? [
          '<defs>',

          '<clipPath id="production-photo-clip">',

          '<circle',

          ` cx="${photoCenterX}"`,

          ` cy="${photoCenterY}"`,

          ` r="${photoRadius}"`,

          '/>',

          '</clipPath>',

          '</defs>',

          '<circle',

          ` cx="${photoCenterX}"`,

          ` cy="${photoCenterY}"`,

          ` r="${photoRadius}"`,

          ' fill="#fffefa"',

          ' opacity=".96"',

          '/>',

          '<image',

          ` href="${escapeXml(
            photoDataUrl,
          )}"`,

          ` x="${
            photoCenterX -
            photoSize / 2
          }"`,

          ` y="${
            photoCenterY -
            photoSize / 2
          }"`,

          ` width="${photoSize}"`,

          ` height="${photoSize}"`,

          ' preserveAspectRatio="xMidYMid slice"',

          ` transform="rotate(${
            photo.rotation ??
            0
          } ${photoCenterX} ${photoCenterY})"`,

          ' clip-path="url(#production-photo-clip)"',

          '/>',
        ].join('')
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
            card.artwork
              .background,
          )}"`,

          '/>',
        ].join('');

  const recipient =
    renderProductionTextLayer(
      side,
      'recipient',
      width,
      layout
        .textHeights
        .recipient,
    );

  const message =
    renderProductionTextLayer(
      side,
      'message',
      width,
      layout
        .textHeights
        .message,
    );

  const sender =
    renderProductionTextLayer(
      side,
      'sender',
      width,
      layout
        .textHeights
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