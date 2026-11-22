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
} from '../../../../../lib/card-composition';

import {
  getOrderForShareToken,
} from '../../../../../lib/server/share-access';

export const runtime =
  'nodejs';

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

function createDataUrl(
  mimeType: string,
  content: Buffer,
): string {
  return `data:${mimeType};base64,${content.toString(
    'base64',
  )}`;
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

  /*
   * Resolve the card artwork using the language
   * stored with the paid order.
   *
   * This ensures that Somali orders use
   * localizedSrc.so when one is available.
   */
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

    const hasInsidePhoto =
      sharedOrder.photo_inside !==
      null;

    /*
     * The current editor stores customization
     * on the inside of the card.
     *
     * The fourth argument represents whether
     * there is a front photo.
     *
     * The fifth argument represents whether
     * there is an inside photo.
     */
    const draft =
      parseOrderDraft(
        sharedOrder.customization,
        card,
        sharedOrder.language,
        false,
        hasInsidePhoto,
      );

    const photoDataUrl =
      sharedOrder.photo_inside &&
      sharedOrder.photo_inside_mime
        ? createDataUrl(
            sharedOrder.photo_inside_mime,
            sharedOrder.photo_inside,
          )
        : undefined;

    /*
     * Render the personalized inside card,
     * not the legacy front-only card.
     */
    const svg =
      renderCardSvg(
        card,
        sharedOrder.language,
        'inside',
        draft.inside,
        artworkDataUrl,
        photoDataUrl,
      );

    const shouldDownload =
      request.nextUrl.searchParams.get(
        'download',
      ) ===
      '1';

    const filename =
      `${card.slug}-hadiyadpay-kaart.svg`;

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