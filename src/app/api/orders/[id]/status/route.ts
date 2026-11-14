import {
  NextResponse,
  type NextRequest,
} from 'next/server';

import { getOrderForGuest } from '../../../../../lib/server/order-access';
import { verifyAndRecordPaidOrder } from '../../../../../lib/server/payment-confirmation';

export const runtime = 'nodejs';

type SafeErrorDetails = {
  errorType: string;
  errorCode: string;
  errorMessage: string;
  databaseConfigured: boolean;
};

function getSafeErrorDetails(
  error: unknown,
): SafeErrorDetails {
  const databaseConfigured = Boolean(
    process.env.DATABASE_URL,
  );

  if (!(error instanceof Error)) {
    return {
      errorType: 'unknown',
      errorCode: 'unknown',
      errorMessage: 'Unknown server error',
      databaseConfigured,
    };
  }

  const errorWithCode = error as Error & {
    code?: unknown;
    errno?: unknown;
  };

  const rawMessage =
    typeof error.message === 'string'
      ? error.message
      : 'Unknown server error';

  /*
   * Keep diagnostic logs useful without ever printing:
   * - DATABASE_URL
   * - passwords
   * - database usernames
   * - guest tokens
   * - Stripe secrets
   */
  const safeMessage = rawMessage
    .replace(
      /postgres(?:ql)?:\/\/[^\s]+/gi,
      '[REDACTED_DATABASE_URL]',
    )
    .replace(
      /password\s*=\s*[^\s]+/gi,
      'password=[REDACTED]',
    )
    .slice(0, 500);

  return {
    errorType: error.name || 'Error',

    errorCode:
      typeof errorWithCode.code === 'string'
        ? errorWithCode.code
        : typeof errorWithCode.errno === 'string'
          ? errorWithCode.errno
          : 'unknown',

    errorMessage: safeMessage,

    databaseConfigured,
  };
}

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
      'Unable to load card order status',
      {
        orderId: id,
        ...getSafeErrorDetails(error),
      },
    );

    return NextResponse.json(
      {
        error:
          'Order status is temporarily unavailable',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store',
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
          'Cache-Control': 'no-store',
        },
      },
    );
  }

  let status = order.status;

  if (
    status !== 'paid' &&
    order.stripe_checkout_session_id
  ) {
    try {
      const paymentVerified =
        await verifyAndRecordPaidOrder(
          order,
        );

      if (paymentVerified) {
        status = 'paid';
      }
    } catch (error) {
      console.error(
        'Unable to verify card order status',
        {
          orderId: id,
          stripeSessionPresent: Boolean(
            order.stripe_checkout_session_id,
          ),
          ...getSafeErrorDetails(error),
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
            'Cache-Control': 'no-store',
          },
        },
      );
    }
  }

  console.info(
    'Card order status resolved',
    {
      orderId: id,
      status,
      stripeSessionPresent: Boolean(
        order.stripe_checkout_session_id,
      ),
    },
  );

  return NextResponse.json(
    {
      status,
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}