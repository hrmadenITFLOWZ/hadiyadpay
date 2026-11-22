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
  getOrderForShareToken,
} from '../../../../../lib/server/share-access';

export const runtime =
  'nodejs';

type CardSide =
  | 'cover'
  | 'inside'
  | 'inside-photo';

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
  content: Buffer,
): string {
  return `data:${mimeType};base64,${content.toString(
    'base64',
  )}`;
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

    const shouldDownload =
      request.nextUrl.searchParams.get(
        'download',
      ) ===
      '1';

    /*
     * COVER
     *
     * Return the actual selected/localized
     * artwork directly.
     */
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

    /*
     * LEFT INSIDE PAGE
     *
     * This creates the separate left-hand
     * inside page.
     *
     * If an inside photo exists, the
     * renderInsidePhotoSvg function renders
     * the saved photo using the saved editor
     * state.
     *
     * If there is no photo, that function
     * produces the HadiyadPay fallback.
     */
    if (
      requestedSide ===
      'inside-photo'
    ) {
      const svg =
        renderInsidePhotoSvg(
          card,
          sharedOrder.language,
          draft.inside,
          insidePhotoDataUrl,
        );

      const filename =
        `${card.slug}-hadiyadpay-inside-photo.svg`;

      return createSvgResponse(
        svg,
        filename,
        shouldDownload,
      );
    }

    /*
     * RIGHT INSIDE PAGE
     *
     * Recipient + message + sender only.
     *
     * The photo is deliberately NOT passed
     * to renderCardSvg here anymore because
     * the photo belongs to the separate
     * left-hand inside page.
     */
    const artworkDataUrl =
      createDataUrl(
        artworkMimeType,
        artworkBuffer,
      );

    const svg =
      renderCardSvg(
        card,
        sharedOrder.language,
        'inside',
        draft.inside,
        artworkDataUrl,
        undefined,
      );

    const filename =
      `${card.slug}-hadiyadpay-kaart.svg`;

    return createSvgResponse(
      svg,
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