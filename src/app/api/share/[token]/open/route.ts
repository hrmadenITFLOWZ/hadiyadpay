import {
  NextResponse,
} from 'next/server';

import {
  getOrderForShareToken,
  recordShareOpen,
} from '../../../../../lib/server/share-access';

export const runtime = 'nodejs';

export async function POST(
  _request: Request,
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
      'Unable to load recipient share',
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

  try {
    await recordShareOpen(
      sharedOrder.share_id,
    );
  } catch (error) {
    console.error(
      'Unable to record recipient share open',
      {
        shareId:
          sharedOrder.share_id,
        errorType:
          error instanceof Error
            ? error.name
            : 'unknown',
      },
    );
  }

  return NextResponse.json(
    {
      opened: true,
    },
    {
      status: 200,
      headers: {
        'Cache-Control':
          'no-store',
      },
    },
  );
}
