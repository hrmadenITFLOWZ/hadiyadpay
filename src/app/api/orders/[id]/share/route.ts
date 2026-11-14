import { randomUUID } from 'node:crypto';

import {
  NextResponse,
  type NextRequest,
} from 'next/server';

import { getDatabasePool } from '../../../../../lib/server/database';
import { getOrderForGuest } from '../../../../../lib/server/order-access';
import { verifyAndRecordPaidOrder } from '../../../../../lib/server/payment-confirmation';

import {
  createShareToken,
  hashShareToken,
} from '../../../../../lib/server/share-token';

export const runtime = 'nodejs';

function getRequestOrigin(
  request: NextRequest,
): string | null {
  const originHeader =
    request.headers.get('origin');

  if (!originHeader) {
    return null;
  }

  try {
    const browserOrigin =
      new URL(originHeader).origin;

    if (
      browserOrigin !==
      request.nextUrl.origin
    ) {
      return null;
    }

    return browserOrigin;
  } catch {
    return null;
  }
}

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  const { id } =
    await context.params;

  const requestOrigin =
    getRequestOrigin(request);

  if (!requestOrigin) {
    return NextResponse.json(
      {
        error:
          'Request origin is not allowed',
      },
      {
        status: 403,
        headers: {
          'Cache-Control':
            'no-store',
        },
      },
    );
  }

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
      'Unable to load share order',
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
          'Sharing is temporarily unavailable',
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

  if (!order) {
    return NextResponse.json(
      {
        error: 'Order not found',
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

  let paymentVerified =
    order.status === 'paid';

  if (!paymentVerified) {
    try {
      paymentVerified =
        await verifyAndRecordPaidOrder(
          order,
        );
    } catch (error) {
      console.error(
        'Unable to verify share entitlement',
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
          headers: {
            'Cache-Control':
              'no-store',
          },
        },
      );
    }
  }

  if (!paymentVerified) {
    return NextResponse.json(
      {
        error:
          'A verified payment is required to share this card',
      },
      {
        status: 403,
        headers: {
          'Cache-Control':
            'no-store',
        },
      },
    );
  }

  const shareId =
    randomUUID();

  const shareToken =
    createShareToken();

  const tokenHash =
    hashShareToken(
      shareToken,
    );

  const pool =
    getDatabasePool();

  const client =
    await pool.connect();

  try {
    await client.query(
      'BEGIN',
    );

    /*
     * One active recipient link per order.
     *
     * Creating a new link securely revokes the old one,
     * because only token hashes are stored in the database.
     */
    await client.query(
      `UPDATE card_order_shares
       SET
         revoked_at = NOW(),
         updated_at = NOW()
       WHERE
         order_id = $1
         AND revoked_at IS NULL`,
      [
        id,
      ],
    );

    await client.query(
      `INSERT INTO card_order_shares
        (
          id,
          order_id,
          token_hash
        )
       VALUES (
          $1,
          $2,
          $3
       )`,
      [
        shareId,
        id,
        tokenHash,
      ],
    );

    await client.query(
      'COMMIT',
    );
  } catch (error) {
    try {
      await client.query(
        'ROLLBACK',
      );
    } catch {
      // The original database error is logged below.
    }

    console.error(
      'Unable to create recipient share',
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
          'The recipient link could not be created',
      },
      {
        status: 503,
        headers: {
          'Cache-Control':
            'no-store',
        },
      },
    );
  } finally {
    client.release();
  }

  const shareUrl =
    new URL(
      `/h/${shareToken}`,
      requestOrigin,
    );

  return NextResponse.json(
    {
      shareUrl:
        shareUrl.toString(),
    },
    {
      status: 201,
      headers: {
        'Cache-Control':
          'no-store',
      },
    },
  );
}