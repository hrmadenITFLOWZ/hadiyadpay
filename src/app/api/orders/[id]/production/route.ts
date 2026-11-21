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
  renderProductionCardSvg,
} from '../../../../../lib/card-production-renderer';

import {
  getCardProductionProfile,
} from '../../../../../lib/card-production';

import {
  getOrderForGuest,
} from '../../../../../lib/server/order-access';

import {
  canDownloadOrder,
} from '../../../../../lib/server/payment-policy';

import {
  verifyAndRecordPaidOrder,
} from '../../../../../lib/server/payment-confirmation';

export const runtime =
  'nodejs';

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  const { id } =
    await context.params;

  let order: Awaited<
    ReturnType<
      typeof getOrderForGuest
    >
  >;

  try {
    order =
      await getOrderForGuest(
        request,
        id,
      );
  } catch (error) {
    console.error(
      'Unable to load production order',
      {
        orderId:
          id,

        errorType:
          error instanceof Error
            ? error.name
            : 'unknown',
      },
    );

    return NextResponse.json(
      {
        error:
          'Production file is temporarily unavailable',
      },
      {
        status:
          503,
      },
    );
  }

  if (!order) {
    return NextResponse.json(
      {
        error:
          'Order not found',
      },
      {
        status:
          404,
      },
    );
  }

  let paymentVerified =
    false;

  let paidOrder =
    order;

  try {
    paymentVerified =
      await verifyAndRecordPaidOrder(
        order,
      );

    if (paymentVerified) {
      paidOrder =
        (
          await getOrderForGuest(
            request,
            id,
          )
        ) ??
        order;
    }
  } catch (error) {
    console.error(
      'Unable to verify production entitlement',
      {
        orderId:
          id,

        errorType:
          error instanceof Error
            ? error.name
            : 'unknown',
      },
    );

    return NextResponse.json(
      {
        error:
          'Payment verification is temporarily unavailable',
      },
      {
        status:
          503,
      },
    );
  }

  if (
    !canDownloadOrder(
      paidOrder,
      true,
      paymentVerified,
    )
  ) {
    return NextResponse.json(
      {
        error:
          'A verified payment is required to prepare this production file',
      },
      {
        status:
          403,
      },
    );
  }

  const card =
    cardOptions.find(
      (option) =>
        option.id ===
        paidOrder.card_id,
    );

  if (!card) {
    return NextResponse.json(
      {
        error:
          'Card design was not found',
      },
      {
        status:
          404,
      },
    );
  }

  const productionProfile =
    getCardProductionProfile(
      card.id,
    );

  if (!productionProfile) {
    return NextResponse.json(
      {
        error:
          'This card does not currently support physical production',
      },
      {
        status:
          400,
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
          'This card artwork cannot currently be prepared for production',
      },
      {
        status:
          400,
      },
    );
  }

  try {
    const artworkPath =
      join(
        process.cwd(),
        'public',
        card.artwork.src.slice(
          1,
        ),
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
        paidOrder.customization,
        card,
        paidOrder.language,
        paidOrder.photo_front !==
          null,
        paidOrder.photo_inside !==
          null,
      );

    const selectedSide =
      draft.front;

    const photo =
      paidOrder.photo_front;

    const photoMime =
      paidOrder.photo_front_mime;

    const photoDataUrl =
      photo &&
      photoMime
        ? `data:${photoMime};base64,${photo.toString('base64')}`
        : undefined;

    const svg =
      renderProductionCardSvg(
        card,
        paidOrder.language,
        selectedSide,
        artworkDataUrl,
        photoDataUrl,
      );

    const filename =
      `${card.slug}-hadiyadpay-production-${productionProfile.productionMaster.width}x${productionProfile.productionMaster.height}.svg`;

    return new Response(
      svg,
      {
        status:
          200,

        headers: {
          'Content-Type':
            'image/svg+xml; charset=utf-8',

          'Content-Disposition':
            `attachment; filename="${filename}"`,

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
      'Unable to render production card',
      {
        orderId:
          id,

        cardId:
          card.id,

        errorType:
          error instanceof Error
            ? error.name
            : 'unknown',
      },
    );

    return NextResponse.json(
      {
        error:
          'Production file could not be prepared',
      },
      {
        status:
          500,
      },
    );
  }
}