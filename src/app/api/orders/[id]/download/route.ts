import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  NextResponse,
  type NextRequest,
} from 'next/server';

import { cardOptions } from '../../../../data/cardOptions';
import { parseOrderDraft } from '../../../../../lib/card-order';
import { renderCardSvg } from '../../../../../lib/card-composition';
import { getOrderForGuest } from '../../../../../lib/server/order-access';
import { canDownloadOrder } from '../../../../../lib/server/payment-policy';
import { verifyAndRecordPaidOrder } from '../../../../../lib/server/payment-confirmation';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  const { id } = await context.params;

  let order: Awaited<
    ReturnType<typeof getOrderForGuest>
  >;

  try {
    order = await getOrderForGuest(
      request,
      id,
    );
  } catch (error) {
    console.error(
      'Unable to load card delivery order',
      {
        orderId: id,
        errorType:
          error instanceof Error
            ? error.name
            : 'unknown',
      },
    );

    return NextResponse.json(
      {
        error:
          'Card delivery is temporarily unavailable',
      },
      {
        status: 503,
      },
    );
  }

  if (!order) {
    return NextResponse.json(
      {
        error: 'Order not found',
      },
      {
        status: 404,
      },
    );
  }

  /*
   * HadiyadPay cards are delivered as one complete
   * single-sided digital card.
   *
   * Existing ?side=front links remain compatible.
   * The inside side is no longer available through
   * the customer delivery flow.
   */
  const requestedSide =
    request.nextUrl.searchParams.get(
      'side',
    );

  if (
    requestedSide !== null &&
    requestedSide !== 'front'
  ) {
    return NextResponse.json(
      {
        error:
          'This card is available as one complete digital card',
      },
      {
        status: 400,
      },
    );
  }

  const sideName = 'front' as const;

  let paymentVerified = false;
  let paidOrder = order;

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
        ) ?? order;
    }
  } catch (error) {
    console.error(
      'Unable to verify card delivery entitlement',
      {
        orderId: id,
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
        status: 503,
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
          'A verified payment is required to access this card',
      },
      {
        status: 403,
      },
    );
  }

  const card = cardOptions.find(
    (option) =>
      option.id === paidOrder.card_id,
  );

  if (
    !card ||
    card.artwork.type !== 'local-image'
  ) {
    console.error(
      'Card artwork is unavailable for a paid order',
      {
        orderId: id,
      },
    );

    return NextResponse.json(
      {
        error:
          'Card delivery is unavailable',
      },
      {
        status: 500,
      },
    );
  }

  try {
    const artworkPath = join(
      process.cwd(),
      'public',
      card.artwork.src.slice(1),
    );

    const artwork =
      await readFile(artworkPath);

    const artworkMime =
      card.artwork.src.endsWith('.svg')
        ? 'image/svg+xml'
        : card.artwork.src.endsWith(
              '.webp',
            )
          ? 'image/webp'
          : 'image/jpeg';

    const artworkDataUrl =
      `data:${artworkMime};base64,${artwork.toString('base64')}`;

    const draft = parseOrderDraft(
      paidOrder.customization,
      card,
      paidOrder.language,
      paidOrder.photo_front !== null,
      paidOrder.photo_inside !== null,
    );

    const selectedSide =
      draft.front;

    const photo =
      paidOrder.photo_front;

    const photoMime =
      paidOrder.photo_front_mime;

    const photoDataUrl =
      photo && photoMime
        ? `data:${photoMime};base64,${photo.toString('base64')}`
        : undefined;

    const svg = renderCardSvg(
      card,
      paidOrder.language,
      sideName,
      selectedSide,
      artworkDataUrl,
      photoDataUrl,
    );

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
      'Unable to render paid card',
      {
        orderId: id,
        errorType:
          error instanceof Error
            ? error.name
            : 'unknown',
      },
    );

    return NextResponse.json(
      {
        error:
          'Card could not be prepared',
      },
      {
        status: 500,
      },
    );
  }
}