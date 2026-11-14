import { randomUUID } from 'node:crypto';

import {
  NextResponse,
  type NextRequest,
} from 'next/server';

import type {
  PoolClient,
} from 'pg';

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
      new URL(
        originHeader,
      ).origin;

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
    getRequestOrigin(
      request,
    );

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
        error:
          'Order not found',
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

  let client:
    | PoolClient
    | undefined;

  try {
    client =
      await pool.connect();

    await client.query(
      'BEGIN',
    );

    /*
     * One active Hadiyad Reveal link per order.
     *
     * Creating a new link revokes the previous active
     * link before the new token hash is stored.
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
    if (client) {
      try {
        await client.query(
          'ROLLBACK',
        );
      } catch (
        rollbackError
      ) {
        console.error(
          'Unable to rollback recipient share transaction',
          {
            orderId: id,

            errorType:
              rollbackError instanceof Error
                ? rollbackError.name
                : 'unknown',
          },
        );
      }
    }

    console.error(
      'Unable to create recipient share',
      {
        orderId: id,

        errorType:
          error instanceof Error
            ? error.name
            : 'unknown',

        errorCode:
          error &&
          typeof error ===
            'object' &&
          'code' in error
            ? String(
                error.code,
              )
            : 'unknown',

        errorMessage:
          error instanceof Error
            ? error.message
            : 'unknown',

        constraint:
          error &&
          typeof error ===
            'object' &&
          'constraint' in
            error &&
          error.constraint
            ? String(
                error.constraint,
              )
            : 'unknown',

        detail:
          error &&
          typeof error ===
            'object' &&
          'detail' in error &&
          error.detail
            ? String(
                error.detail,
              )
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
    if (client) {
      client.release();
    }
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