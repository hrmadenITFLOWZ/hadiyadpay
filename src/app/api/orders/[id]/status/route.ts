import { NextResponse, type NextRequest } from 'next/server';
import { getOrderForGuest } from '../../../../../lib/server/order-access';
import { verifyAndRecordPaidOrder } from '../../../../../lib/server/payment-confirmation';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  let order: Awaited<ReturnType<typeof getOrderForGuest>>;
  try {
    order = await getOrderForGuest(request, id);
  } catch (error) {
    console.error('Unable to load card order status', {
      orderId: id,
      errorType: error instanceof Error ? error.name : 'unknown',
    });
    return NextResponse.json({ error: 'Order status is temporarily unavailable' }, { status: 503 });
  }
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  let status = order.status;
  if (status !== 'paid' && order.stripe_checkout_session_id) {
    try {
      if (await verifyAndRecordPaidOrder(order)) status = 'paid';
    } catch (error) {
      console.error('Unable to verify card order status', {
        orderId: id,
        errorType: error instanceof Error ? error.name : 'unknown',
      });
      return NextResponse.json({ error: 'Payment verification is temporarily unavailable' }, { status: 503 });
    }
  }

  const response = NextResponse.json({ status });
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
