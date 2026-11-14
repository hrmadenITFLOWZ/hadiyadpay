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
  parseOrderDraft,
} from '../../../../../lib/card-order';

import {
  renderCardSvg,
} from '../../../../../lib/card-composition';

import {
  getOrderForShareToken,
} from '../../../../../lib/server/share-access';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      token: string;
    }>;
  },
) {
  const { token } =
    await context.params;

  let sharedOrder: Awaited<
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
      },
    );

    return NextResponse.json(
      {
        error:
          'The card is temporarily unavailable',
      },
      {
        status: 503,
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
        status: 404,
        headers: {
          'Cache-Control':
            'no-store',
        },
      },
    );
  }

  const card =
    cardOptions.find(
      (option) =>
        option.id ===
        sharedOrder.card_id,
    );

  if (
    !card ||
    card.artwork.type !==
      'local-image'
  ) {
    return NextResponse.json(
      {
        error:
          'The card cannot be displayed',
      },
      {
        status: 500,
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
        card.artwork.src.slice(1),
      );

    const artwork =
      await readFile(
        artworkPath,
      );

    const artworkMime =
      card.artwork.src.endsWith(
        '.svg',
      )
        ? 'image/svg+xml'
        : card.artwork.src.endsWith(
              '.webp',
            )
          ? 'image/webp'
          : 'image/jpeg';

    const artworkDataUrl =
      `data:${artworkMime};base64,${artwork.toString('base64')}`;

    const draft =
      parseOrderDraft(
        sharedOrder.customization,
        card,
        sharedOrder.language,
        sharedOrder.photo_front !==
          null,
        false,
      );

    const photoDataUrl =
      sharedOrder.photo_front &&
      sharedOrder.photo_front_mime
        ? `data:${sharedOrder.photo_front_mime};base64,${sharedOrder.photo_front.toString('base64')}`
        : undefined;

    const svg =
      renderCardSvg(
        card,
        sharedOrder.language,
        'front',
        draft.front,
        artworkDataUrl,
        photoDataUrl,
      );

    const shouldDownload =
      request.nextUrl.searchParams.get(
        'download',
      ) === '1';

    const filename =
      `${card.slug}-hadiyadpay-kaart.svg`;

    return new Response(
      svg,
      {
        status: 200,

        headers: {
          'Content-Type':
            'image/svg+xml; charset=utf-8',

          'Content-Disposition':
            shouldDownload
              ? `attachment; filename="${filename}"`
              : `inline; filename="${filename}"`,

          'Cache-Control':
            'private, no-store',

          'X-Content-Type-Options':
            'nosniff',

          'Content-Security-Policy':
            "default-src 'none'; img-src data:; style-src 'unsafe-inline'",
        },
      },
    );
  } catch (error) {
    console.error(
      'Unable to render shared card',
      {
        shareId:
          sharedOrder.share_id,
        errorType:
          error instanceof Error
            ? error.name
            : 'unknown',
      },
    );

    return NextResponse.json(
      {
        error:
          'The card could not be prepared',
      },
      {
        status: 500,
        headers: {
          'Cache-Control':
            'no-store',
        },
      },
    );
  }
}
