import { randomUUID } from 'node:crypto';

import { NextResponse, type NextRequest } from 'next/server';
import type { Pool } from 'pg';

import { cardOptions } from '../../data/cardOptions';
import {
  parseOrderDraft,
  serializeEditorDraft,
} from '../../../lib/card-order';
import type { CardLanguage } from '../../../lib/card-types';
import { getSiteUrl } from '../../../lib/seo';
import { getDatabasePool } from '../../../lib/server/database';
import {
  createGuestOrderToken,
  guestOrderCookie,
  hashGuestOrderToken,
} from '../../../lib/server/guest-order';
import { getStripeClient } from '../../../lib/server/stripe';

export const runtime = 'nodejs';

const CARD_PRICE_CENTS = 200;
const MAX_ORDER_DRAFT_BYTES = 24 * 1024;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const MAX_IMAGES_BYTES = 4 * 1024 * 1024;
const MAX_MULTIPART_BYTES =
  MAX_IMAGES_BYTES + 128 * 1024;

function isDevelopmentTestMode(): boolean {
  return process.env.NODE_ENV === 'development';
}

function isLanguage(
  value: string,
): value is CardLanguage {
  return (
    value === 'so' ||
    value === 'en' ||
    value === 'nl'
  );
}

function hasValidImageSignature(
  type: string,
  bytes: Uint8Array,
): boolean {
  if (type === 'image/jpeg') {
    return (
      bytes.length >= 3 &&
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff
    );
  }

  if (type === 'image/png') {
    return (
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    );
  }

  if (type === 'image/webp') {
    return (
      bytes.length >= 12 &&
      String.fromCharCode(
        ...bytes.slice(0, 4),
      ) === 'RIFF' &&
      String.fromCharCode(
        ...bytes.slice(8, 12),
      ) === 'WEBP'
    );
  }

  return false;
}

async function getPhoto(
  formData: FormData,
  key: string,
): Promise<{
  buffer: Buffer;
  type: string;
} | null> {
  const entry = formData.get(key);

  if (
    entry === null ||
    typeof entry === 'string' ||
    entry.size === 0
  ) {
    return null;
  }

  if (entry.size > MAX_IMAGE_BYTES) {
    throw new Error('Photo is too large');
  }

  const type = entry.type.toLowerCase();

  if (
    ![
      'image/jpeg',
      'image/png',
      'image/webp',
    ].includes(type)
  ) {
    throw new Error('Unsupported photo type');
  }

  const buffer = Buffer.from(
    await entry.arrayBuffer(),
  );

  if (!hasValidImageSignature(type, buffer)) {
    throw new Error('Invalid photo data');
  }

  return {
    buffer,
    type,
  };
}

export async function POST(
  request: NextRequest,
) {
  const contentLength =
    request.headers.get('content-length');

  if (
    contentLength &&
    (
      !/^\d+$/.test(contentLength) ||
      Number(contentLength) >
        MAX_MULTIPART_BYTES
    )
  ) {
    return NextResponse.json(
      {
        error:
          'Order request is too large',
      },
      {
        status: 413,
      },
    );
  }

  const origin = request.headers.get('origin');

  try {
    if (
      !origin ||
      new URL(origin).origin !==
        request.nextUrl.origin
    ) {
      return NextResponse.json(
        {
          error:
            'Request origin is not allowed',
        },
        {
          status: 403,
        },
      );
    }
  } catch {
    return NextResponse.json(
      {
        error:
          'Request origin is not allowed',
      },
      {
        status: 403,
      },
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      {
        error: 'Invalid order request',
      },
      {
        status: 400,
      },
    );
  }

  const cardId = formData.get('cardId');
  const languageValue =
    formData.get('language');
  const draftValue = formData.get('draft');

  if (
    typeof cardId !== 'string' ||
    typeof languageValue !== 'string' ||
    !isLanguage(languageValue) ||
    typeof draftValue !== 'string' ||
    Buffer.byteLength(
      draftValue,
      'utf8',
    ) > MAX_ORDER_DRAFT_BYTES
  ) {
    return NextResponse.json(
      {
        error: 'Invalid order details',
      },
      {
        status: 400,
      },
    );
  }

  const card = cardOptions.find(
    (option) => option.id === cardId,
  );

  if (!card) {
    return NextResponse.json(
      {
        error: 'Card is unavailable',
      },
      {
        status: 400,
      },
    );
  }

  let photoFront: Awaited<
    ReturnType<typeof getPhoto>
  >;

  let photoInside: Awaited<
    ReturnType<typeof getPhoto>
  >;

  let draft: ReturnType<
    typeof parseOrderDraft
  >;

  try {
    [photoFront, photoInside] =
      await Promise.all([
        getPhoto(formData, 'photoFront'),
        getPhoto(formData, 'photoInside'),
      ]);

    const combinedPhotoSize =
      (photoFront?.buffer.length ?? 0) +
      (photoInside?.buffer.length ?? 0);

    if (
      combinedPhotoSize >
      MAX_IMAGES_BYTES
    ) {
      return NextResponse.json(
        {
          error:
            'Card photos exceed the combined size limit',
        },
        {
          status: 400,
        },
      );
    }

    draft = parseOrderDraft(
      JSON.parse(draftValue) as unknown,
      card,
      languageValue,
      photoFront !== null,
      photoInside !== null,
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Invalid card details',
      },
      {
        status: 400,
      },
    );
  }

  const developmentMode =
    isDevelopmentTestMode();

  const orderId = randomUUID();
  const guestToken =
    createGuestOrderToken();

  let pool: Pool | undefined;
  let checkoutSessionId:
    | string
    | null = null;

  let orderCreated = false;

  try {
    pool = getDatabasePool();

    /*
     * Local development orders are stored as paid.
     * Production orders always start as pending.
     */
    const initialStatus =
      developmentMode
        ? 'paid'
        : 'pending';

    await pool.query(
      `INSERT INTO card_orders
        (
          id,
          guest_token_hash,
          card_id,
          language,
          amount_cents,
          currency,
          status,
          customization,
          photo_front,
          photo_front_mime,
          photo_inside,
          photo_inside_mime
        )
       VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          'eur',
          $6,
          $7::jsonb,
          $8,
          $9,
          $10,
          $11
       )`,
      [
        orderId,
        hashGuestOrderToken(guestToken),
        card.id,
        languageValue,
        CARD_PRICE_CENTS,
        initialStatus,
        JSON.stringify(
          serializeEditorDraft(draft),
        ),
        photoFront?.buffer ?? null,
        photoFront?.type ?? null,
        photoInside?.buffer ?? null,
        photoInside?.type ?? null,
      ],
    );

    orderCreated = true;

    /*
     * Development mode skips Stripe and redirects directly
     * to the existing order-status/download page.
     */
    if (developmentMode) {
      const developmentUrl = new URL(
        `/bestelling/${orderId}`,
        request.nextUrl.origin,
      );

      developmentUrl.searchParams.set(
        'language',
        languageValue,
      );

      developmentUrl.searchParams.set(
        'dev',
        '1',
      );

      const response = NextResponse.json(
        {
          checkoutUrl:
            developmentUrl.toString(),
          developmentMode: true,
          orderId,
        },
        {
          status: 201,
        },
      );

      response.headers.set(
        'Cache-Control',
        'no-store',
      );

      response.headers.append(
        'Set-Cookie',
        guestOrderCookie(
          guestToken,
          orderId,
        ),
      );

      return response;
    }

    /*
     * Production still requires Stripe.
     */
    const stripe = getStripeClient();
    const siteUrl = getSiteUrl();

    const session =
      await stripe.checkout.sessions.create(
        {
          mode: 'payment',
          client_reference_id: orderId,

          metadata: {
            orderId,
            cardId: card.id,
          },

          line_items: [
            {
              quantity: 1,

              price_data: {
                currency: 'eur',
                unit_amount:
                  CARD_PRICE_CENTS,

                product_data: {
                  name:
                    card.title[
                      languageValue
                    ],

                  description:
                    'Personalized digital greeting card',
                },
              },
            },
          ],

          success_url: new URL(
            `/bestelling/${orderId}?language=${languageValue}&session_id={CHECKOUT_SESSION_ID}`,
            siteUrl,
          ).toString(),

          cancel_url: new URL(
            `/bestelling/${orderId}?language=${languageValue}&cancelled=1`,
            siteUrl,
          ).toString(),

          expires_at:
            Math.floor(
              Date.now() / 1000,
            ) +
            30 * 60,
        },
        {
          idempotencyKey:
            `card-order-${orderId}`,
        },
      );

    if (!session.url) {
      throw new Error(
        'Stripe did not return a checkout URL',
      );
    }

    checkoutSessionId = session.id;

    const savedSession =
      await pool.query(
        `UPDATE card_orders
         SET
           stripe_checkout_session_id = $2,
           updated_at = NOW()
         WHERE
           id = $1
           AND status = 'pending'`,
        [
          orderId,
          checkoutSessionId,
        ],
      );

    if (savedSession.rowCount !== 1) {
      throw new Error(
        'Stripe checkout session could not be attached to its order',
      );
    }

    const response = NextResponse.json(
      {
        checkoutUrl: session.url,
        developmentMode: false,
        orderId,
      },
      {
        status: 201,
      },
    );

    response.headers.set(
      'Cache-Control',
      'no-store',
    );

    response.headers.append(
      'Set-Cookie',
      guestOrderCookie(
        guestToken,
        orderId,
      ),
    );

    return response;
  } catch (error) {
    if (pool && orderCreated) {
      try {
        await pool.query(
          `UPDATE card_orders
           SET
             status = 'failed',
             stripe_checkout_session_id =
               COALESCE(
                 $2,
                 stripe_checkout_session_id
               ),
             updated_at = NOW()
           WHERE
             id = $1
             AND status = 'pending'`,
          [
            orderId,
            checkoutSessionId,
          ],
        );
      } catch (cleanupError) {
        console.error(
          'Unable to close failed card order',
          {
            orderId,
            errorType:
              cleanupError instanceof Error
                ? cleanupError.name
                : 'unknown',
          },
        );
      }
    }

    console.error(
      'Unable to create card checkout',
      {
        orderId,
        developmentMode,
        errorType:
          error instanceof Error
            ? error.name
            : 'unknown',
      },
    );

    return NextResponse.json(
      {
        error: developmentMode
          ? 'Development test order could not be created. Check the local database connection.'
          : 'Checkout could not be started. Please try again later.',
      },
      {
        status: 503,
      },
    );
  }
}