import {
  readFile,
} from 'node:fs/promises';

import {
  join,
} from 'node:path';

import {
  NextResponse,
  type NextRequest,
} from 'next/server';

import {
  cardOptions,
} from '../../../../data/cardOptions';

import {
  getCardArtworkSource,
  type CardArtworkSource,
} from '../../../../../lib/card-types';

import {
  parseOrderDraft,
} from '../../../../../lib/card-order';

import {
  renderCardSvg,
  renderInsidePhotoSvg,
} from '../../../../../lib/card-composition';

import {
  getCardProductionProfile,
} from '../../../../../lib/card-production';

import {
  getOrderForShareToken,
} from '../../../../../lib/server/share-access';

export const runtime =
  'nodejs';

type CardSide =
  | 'cover'
  | 'inside'
  | 'inside-photo'
  | 'complete';

function getArtworkMimeType(
  source:
    CardArtworkSource,
): string {
  if (
    source.endsWith(
      '.svg',
    )
  ) {
    return 'image/svg+xml';
  }

  if (
    source.endsWith(
      '.png',
    )
  ) {
    return 'image/png';
  }

  if (
    source.endsWith(
      '.webp',
    )
  ) {
    return 'image/webp';
  }

  if (
    source.endsWith(
      '.jpg',
    ) ||
    source.endsWith(
      '.jpeg',
    )
  ) {
    return 'image/jpeg';
  }

  return 'application/octet-stream';
}

function getArtworkExtension(
  source:
    CardArtworkSource,
): string {
  if (
    source.endsWith(
      '.svg',
    )
  ) {
    return 'svg';
  }

  if (
    source.endsWith(
      '.png',
    )
  ) {
    return 'png';
  }

  if (
    source.endsWith(
      '.webp',
    )
  ) {
    return 'webp';
  }

  if (
    source.endsWith(
      '.jpg',
    ) ||
    source.endsWith(
      '.jpeg',
    )
  ) {
    return 'jpg';
  }

  return 'bin';
}

function createDataUrl(
  mimeType: string,
  content:
    Buffer | string,
): string {
  const buffer =
    typeof content ===
      'string'
      ? Buffer.from(
          content,
          'utf8',
        )
      : content;

  return `data:${mimeType};base64,${buffer.toString(
    'base64',
  )}`;
}

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

function getRequestedSide(
  request:
    NextRequest,
): CardSide {
  const requestedSide =
    request.nextUrl.searchParams.get(
      'side',
    );

  if (
    requestedSide ===
    'cover'
  ) {
    return 'cover';
  }

  if (
    requestedSide ===
    'inside-photo'
  ) {
    return 'inside-photo';
  }

  if (
    requestedSide ===
    'complete'
  ) {
    return 'complete';
  }

  return 'inside';
}

function createSvgResponse(
  svg: string,
  filename: string,
  shouldDownload: boolean,
): Response {
  return new Response(
    svg,
    {
      status:
        200,

      headers: {
        'Content-Type':
          'image/svg+xml; charset=utf-8',

        'Content-Disposition':
          shouldDownload
            ? `attachment; filename="${filename}"`
            : `inline; filename="${filename}"`,

        'Cache-Control':
          'private, no-store, max-age=0',

        'X-Content-Type-Options':
          'nosniff',

        'Content-Security-Policy':
          "default-src 'none'; img-src data:; style-src 'unsafe-inline'",

        'Referrer-Policy':
          'no-referrer',
      },
    },
  );
}

function getCardDimensions(
  card:
    (typeof cardOptions)[number],
): {
  width: number;
  height: number;
} {
  const productionProfile =
    getCardProductionProfile(
      card.id,
    );

  return {
    width:
      productionProfile
        ?.digital.width ??
      1200,

    height:
      productionProfile
        ?.digital.height ??
      (
        card.orientation ===
          'portrait'
          ? 1464
          : 968
      ),
  };
}

function renderCompleteCardSvg({
  cardTitle,
  width,
  height,
  coverDataUrl,
  insidePhotoDataUrl,
  insideMessageDataUrl,
}: {
  cardTitle: string;
  width: number;
  height: number;
  coverDataUrl: string;
  insidePhotoDataUrl: string;
  insideMessageDataUrl: string;
}): string {
  const outerPadding =
    Math.max(
      60,
      Math.round(
        width *
          0.06,
      ),
    );

  const panelGap =
    Math.max(
      36,
      Math.round(
        width *
          0.035,
      ),
    );

  const headingHeight =
    Math.max(
      150,
      Math.round(
        height *
          0.12,
      ),
    );

  const footerHeight =
    Math.max(
      95,
      Math.round(
        height *
          0.075,
      ),
    );

  const panelWidth =
    width;

  const panelHeight =
    height;

  const totalWidth =
    outerPadding *
      2 +
    panelWidth *
      3 +
    panelGap *
      2;

  const totalHeight =
    outerPadding *
      2 +
    headingHeight +
    panelHeight +
    footerHeight;

  const panelY =
    outerPadding +
    headingHeight;

  const coverX =
    outerPadding;

  const insidePhotoX =
    coverX +
    panelWidth +
    panelGap;

  const insideMessageX =
    insidePhotoX +
    panelWidth +
    panelGap;

  const headingY =
    outerPadding +
    headingHeight *
      0.53;

  const footerY =
    panelY +
    panelHeight +
    footerHeight *
      0.7;

  const headingFontSize =
    Math.max(
      48,
      Math.round(
        width *
          0.06,
      ),
    );

  const labelFontSize =
    Math.max(
      25,
      Math.round(
        width *
          0.024,
      ),
    );

  const footerFontSize =
    Math.max(
      22,
      Math.round(
        width *
          0.021,
      ),
    );

  const panelRadius =
    Math.max(
      24,
      Math.round(
        width *
          0.028,
      ),
    );

  const safeTitle =
    escapeXml(
      cardTitle,
    );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',

    '<svg',

    ' xmlns="http://www.w3.org/2000/svg"',

    ` width="${totalWidth}"`,

    ` height="${totalHeight}"`,

    ` viewBox="0 0 ${totalWidth} ${totalHeight}"`,

    ' role="img"',

    ' aria-labelledby="complete-card-title"',

    '>',

    '<title id="complete-card-title">',

    safeTitle,

    '</title>',

    '<defs>',

    '<filter',

    ' id="complete-panel-shadow"',

    ' x="-20%"',

    ' y="-20%"',

    ' width="140%"',

    ' height="150%"',

    '>',

    '<feDropShadow',

    ' dx="0"',

    ' dy="22"',

    ' stdDeviation="24"',

    ' flood-color="#263e36"',

    ' flood-opacity=".18"',

    '/>',

    '</filter>',

    '<linearGradient',

    ' id="complete-background"',

    ' x1="0"',

    ' y1="0"',

    ' x2="1"',

    ' y2="1"',

    '>',

    '<stop',

    ' offset="0%"',

    ' stop-color="#fffaf0"',

    '/>',

    '<stop',

    ' offset="52%"',

    ' stop-color="#f4eddf"',

    '/>',

    '<stop',

    ' offset="100%"',

    ' stop-color="#e6d8bd"',

    '/>',

    '</linearGradient>',

    '<pattern',

    ' id="complete-background-pattern"',

    ' width="110"',

    ' height="110"',

    ' patternUnits="userSpaceOnUse"',

    ' patternTransform="rotate(30)"',

    '>',

    '<path',

    ' d="M0 55h110M55 0v110"',

    ' stroke="#b88c55"',

    ' stroke-opacity=".08"',

    ' stroke-width="3"',

    '/>',

    '</pattern>',

    '</defs>',

    '<rect',

    ` width="${totalWidth}"`,

    ` height="${totalHeight}"`,

    ' fill="url(#complete-background)"',

    '/>',

    '<rect',

    ` width="${totalWidth}"`,

    ` height="${totalHeight}"`,

    ' fill="url(#complete-background-pattern)"',

    '/>',

    '<text',

    ` x="${
      totalWidth /
      2
    }"`,

    ` y="${headingY}"`,

    ' text-anchor="middle"',

    ' dominant-baseline="middle"',

    ' fill="#285347"',

    ' font-family="Georgia, Times New Roman, serif"',

    ` font-size="${headingFontSize}"`,

    ' font-weight="400"',

    '>',

    safeTitle,

    '</text>',

    '<text',

    ` x="${
      coverX +
      panelWidth /
        2
    }"`,

    ` y="${
      panelY -
      labelFontSize
    }"`,

    ' text-anchor="middle"',

    ' fill="#9a7441"',

    ' font-family="Arial, Helvetica, sans-serif"',

    ` font-size="${labelFontSize}"`,

    ' font-weight="700"',

    ' letter-spacing="4"',

    '>',

    'COVER',

    '</text>',

    '<text',

    ` x="${
      insidePhotoX +
      panelWidth /
        2
    }"`,

    ` y="${
      panelY -
      labelFontSize
    }"`,

    ' text-anchor="middle"',

    ' fill="#9a7441"',

    ' font-family="Arial, Helvetica, sans-serif"',

    ` font-size="${labelFontSize}"`,

    ' font-weight="700"',

    ' letter-spacing="4"',

    '>',

    'INSIDE',

    '</text>',

    '<text',

    ` x="${
      insideMessageX +
      panelWidth /
        2
    }"`,

    ` y="${
      panelY -
      labelFontSize
    }"`,

    ' text-anchor="middle"',

    ' fill="#9a7441"',

    ' font-family="Arial, Helvetica, sans-serif"',

    ` font-size="${labelFontSize}"`,

    ' font-weight="700"',

    ' letter-spacing="4"',

    '>',

    'MESSAGE',

    '</text>',

    '<g',

    ' filter="url(#complete-panel-shadow)"',

    '>',

    '<rect',

    ` x="${coverX}"`,

    ` y="${panelY}"`,

    ` width="${panelWidth}"`,

    ` height="${panelHeight}"`,

    ` rx="${panelRadius}"`,

    ' fill="#fffdf8"',

    ' stroke="#ffffff"',

    ' stroke-width="14"',

    '/>',

    '<image',

    ` href="${escapeXml(
      coverDataUrl,
    )}"`,

    ` x="${coverX}"`,

    ` y="${panelY}"`,

    ` width="${panelWidth}"`,

    ` height="${panelHeight}"`,

    ' preserveAspectRatio="xMidYMid slice"',

    '/>',

    '</g>',

    '<g',

    ' filter="url(#complete-panel-shadow)"',

    '>',

    '<rect',

    ` x="${insidePhotoX}"`,

    ` y="${panelY}"`,

    ` width="${panelWidth}"`,

    ` height="${panelHeight}"`,

    ` rx="${panelRadius}"`,

    ' fill="#fffdf8"',

    ' stroke="#ffffff"',

    ' stroke-width="14"',

    '/>',

    '<image',

    ` href="${escapeXml(
      insidePhotoDataUrl,
    )}"`,

    ` x="${insidePhotoX}"`,

    ` y="${panelY}"`,

    ` width="${panelWidth}"`,

    ` height="${panelHeight}"`,

    ' preserveAspectRatio="xMidYMid meet"',

    '/>',

    '</g>',

    '<g',

    ' filter="url(#complete-panel-shadow)"',

    '>',

    '<rect',

    ` x="${insideMessageX}"`,

    ` y="${panelY}"`,

    ` width="${panelWidth}"`,

    ` height="${panelHeight}"`,

    ` rx="${panelRadius}"`,

    ' fill="#fffdf8"',

    ' stroke="#ffffff"',

    ' stroke-width="14"',

    '/>',

    '<image',

    ` href="${escapeXml(
      insideMessageDataUrl,
    )}"`,

    ` x="${insideMessageX}"`,

    ` y="${panelY}"`,

    ` width="${panelWidth}"`,

    ` height="${panelHeight}"`,

    ' preserveAspectRatio="xMidYMid meet"',

    '/>',

    '</g>',

    '<text',

    ` x="${
      totalWidth /
      2
    }"`,

    ` y="${footerY}"`,

    ' text-anchor="middle"',

    ' fill="#6f776f"',

    ' font-family="Arial, Helvetica, sans-serif"',

    ` font-size="${footerFontSize}"`,

    ' font-weight="600"',

    ' letter-spacing="2"',

    '>',

    'Created with HadiyadPay',

    '</text>',

    '</svg>',
  ].join('');
}

export async function GET(
  request:
    NextRequest,
  context: {
    params: Promise<{
      token: string;
    }>;
  },
) {
  const {
    token,
  } =
    await context.params;

  let sharedOrder:
    Awaited<
      ReturnType<
        typeof getOrderForShareToken
      >
    >;

  try {
    sharedOrder =
      await getOrderForShareToken(
        token,
      );
  } catch (error) {
    console.error(
      'Unable to load shared card delivery',
      {
        errorType:
          error instanceof Error
            ? error.name
            : 'unknown',

        errorMessage:
          error instanceof Error
            ? error.message
            : 'Unknown error',
      },
    );

    return NextResponse.json(
      {
        error:
          'The card is temporarily unavailable',
      },
      {
        status:
          503,

        headers: {
          'Cache-Control':
            'no-store',
        },
      },
    );
  }

  if (!sharedOrder) {
    return NextResponse.json(
      {
        error:
          'This card link is unavailable',
      },
      {
        status:
          404,

        headers: {
          'Cache-Control':
            'no-store',
        },
      },
    );
  }

  const card =
    cardOptions.find(
      (
        option,
      ) =>
        option.id ===
        sharedOrder.card_id,
    );

  if (!card) {
    console.error(
      'Shared card references an unknown card',
      {
        shareId:
          sharedOrder.share_id,

        cardId:
          sharedOrder.card_id,
      },
    );

    return NextResponse.json(
      {
        error:
          'The card cannot be displayed',
      },
      {
        status:
          500,

        headers: {
          'Cache-Control':
            'no-store',
        },
      },
    );
  }

  if (
    card.artwork.type !==
    'local-image'
  ) {
    return NextResponse.json(
      {
        error:
          'The card artwork is unavailable',
      },
      {
        status:
          500,

        headers: {
          'Cache-Control':
            'no-store',
        },
      },
    );
  }

  const artworkSource =
    getCardArtworkSource(
      card.artwork,
      sharedOrder.language,
    );

  if (!artworkSource) {
    return NextResponse.json(
      {
        error:
          'The card artwork is unavailable',
      },
      {
        status:
          500,

        headers: {
          'Cache-Control':
            'no-store',
        },
      },
    );
  }

  const requestedSide =
    getRequestedSide(
      request,
    );

  try {
    const artworkPath =
      join(
        process.cwd(),
        'public',
        artworkSource.slice(
          1,
        ),
      );

    const artworkBuffer =
      await readFile(
        artworkPath,
      );

    const artworkMimeType =
      getArtworkMimeType(
        artworkSource,
      );

    const artworkDataUrl =
      createDataUrl(
        artworkMimeType,
        artworkBuffer,
      );

    const shouldDownload =
      request.nextUrl.searchParams.get(
        'download',
      ) ===
      '1';

    if (
      requestedSide ===
      'cover'
    ) {
      const artworkExtension =
        getArtworkExtension(
          artworkSource,
        );

      const filename =
        `${card.slug}-hadiyadpay-cover.${artworkExtension}`;

      return new Response(
        artworkBuffer,
        {
          status:
            200,

          headers: {
            'Content-Type':
              artworkMimeType,

            'Content-Disposition':
              shouldDownload
                ? `attachment; filename="${filename}"`
                : `inline; filename="${filename}"`,

            'Cache-Control':
              'private, no-store, max-age=0',

            'X-Content-Type-Options':
              'nosniff',

            'Referrer-Policy':
              'no-referrer',
          },
        },
      );
    }

    const hasInsidePhoto =
      sharedOrder.photo_inside !==
      null;

    const draft =
      parseOrderDraft(
        sharedOrder.customization,
        card,
        sharedOrder.language,
        false,
        hasInsidePhoto,
        false,
      );

    const insidePhotoDataUrl =
      sharedOrder.photo_inside &&
      sharedOrder.photo_inside_mime
        ? createDataUrl(
            sharedOrder.photo_inside_mime,
            sharedOrder.photo_inside,
          )
        : undefined;

    const insidePhotoSvg =
      renderInsidePhotoSvg(
        card,
        sharedOrder.language,
        draft.inside,
        insidePhotoDataUrl,
      );

    if (
      requestedSide ===
      'inside-photo'
    ) {
      const filename =
        `${card.slug}-hadiyadpay-inside-photo.svg`;

      return createSvgResponse(
        insidePhotoSvg,
        filename,
        shouldDownload,
      );
    }

    const insideMessageSvg =
      renderCardSvg(
        card,
        sharedOrder.language,
        'inside',
        draft.inside,
        artworkDataUrl,
        undefined,
      );

    if (
      requestedSide ===
      'inside'
    ) {
      const filename =
        `${card.slug}-hadiyadpay-inside.svg`;

      return createSvgResponse(
        insideMessageSvg,
        filename,
        shouldDownload,
      );
    }

    const {
      width,
      height,
    } =
      getCardDimensions(
        card,
      );

    const completeSvg =
      renderCompleteCardSvg(
        {
          cardTitle:
            card.title[
              sharedOrder.language
            ],

          width,

          height,

          coverDataUrl:
            artworkDataUrl,

          insidePhotoDataUrl:
            createDataUrl(
              'image/svg+xml',
              insidePhotoSvg,
            ),

          insideMessageDataUrl:
            createDataUrl(
              'image/svg+xml',
              insideMessageSvg,
            ),
        },
      );

    const filename =
      `${card.slug}-complete-hadiyadpay-card.svg`;

    return createSvgResponse(
      completeSvg,
      filename,
      shouldDownload,
    );
  } catch (error) {
    console.error(
      'Unable to render shared card',
      {
        shareId:
          sharedOrder.share_id,

        orderId:
          sharedOrder.order_id,

        cardId:
          sharedOrder.card_id,

        language:
          sharedOrder.language,

        artworkSource,

        requestedSide,

        hasInsidePhoto:
          sharedOrder.photo_inside !==
          null,

        errorType:
          error instanceof Error
            ? error.name
            : 'unknown',

        errorMessage:
          error instanceof Error
            ? error.message
            : 'Unknown error',
      },
    );

    return NextResponse.json(
      {
        error:
          'The card could not be prepared',
      },
      {
        status:
          500,

        headers: {
          'Cache-Control':
            'no-store',
        },
      },
    );
  }
}