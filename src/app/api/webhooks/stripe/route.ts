import Stripe from 'stripe';
import { NextResponse, type NextRequest } from 'next/server';
import type { PoolClient } from 'pg';
import { getDatabasePool } from '../../../../lib/server/database';
import { getStripeClient } from '../../../../lib/server/stripe';
import { isVerifiedPaidSession } from '../../../../lib/server/payment-policy';

export const runtime = 'nodejs';

const handledEvents = new Set([
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
  'checkout.session.async_payment_failed',
  'checkout.session.expired',
]);

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Webhook configuration is unavailable' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    event = getStripeClient().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.warn('Stripe webhook signature verification failed', {
      errorType: error instanceof Error ? error.name : 'unknown',
    });
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  if (!handledEvents.has(event.type)) return NextResponse.json({ received: true });

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    console.warn('Stripe checkout event did not include an order reference', { eventId: event.id });
    return NextResponse.json({ received: true });
  }

  let client: PoolClient;
  try {
    client = await getDatabasePool().connect();
  } catch (error) {
    console.error('Unable to connect for Stripe webhook', {
      eventId: event.id,
      errorType: error instanceof Error ? error.name : 'unknown',
    });
    return NextResponse.json({ error: 'Webhook processing is temporarily unavailable' }, { status: 503 });
  }

  try {
    await client.query('BEGIN');
    const insertedEvent = await client.query(
      `INSERT INTO stripe_webhook_events (id, event_type)
       VALUES ($1, $2)
       ON CONFLICT (id) DO NOTHING
       RETURNING id`,
      [event.id, event.type],
    );
    if (insertedEvent.rowCount === 0) {
      await client.query('COMMIT');
      return NextResponse.json({ received: true, duplicate: true });
    }

    const result = await client.query(
      `SELECT id, status, amount_cents, currency, stripe_checkout_session_id
       FROM card_orders WHERE id = $1 FOR UPDATE`,
      [orderId],
    );
    const order = result.rows[0];
    if (!order) throw new Error('Stripe checkout order was not found');

    const matchesOrder =
      session.id === order.stripe_checkout_session_id &&
      session.client_reference_id === order.id &&
      session.metadata?.orderId === order.id;

    if (!matchesOrder) {
      console.warn('Stripe checkout event did not match its stored order', {
        eventId: event.id,
        orderId,
        sessionId: session.id,
      });
    } else if (
      (event.type === 'checkout.session.completed' ||
        event.type === 'checkout.session.async_payment_succeeded') &&
      isVerifiedPaidSession(order, session)
    ) {
      await client.query(
        `UPDATE card_orders
         SET status = 'paid', paid_at = COALESCE(paid_at, NOW()), updated_at = NOW()
         WHERE id = $1`,
        [orderId],
      );
    } else if (event.type === 'checkout.session.async_payment_failed') {
      await client.query(
        `UPDATE card_orders SET status = 'failed', updated_at = NOW()
         WHERE id = $1 AND status = 'pending'`,
        [orderId],
      );
    } else if (event.type === 'checkout.session.expired') {
      await client.query(
        `UPDATE card_orders SET status = 'expired', updated_at = NOW()
         WHERE id = $1 AND status = 'pending'`,
        [orderId],
      );
    } else if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      console.warn('Stripe payment did not match the stored order', {
        eventId: event.id,
        orderId,
        sessionId: session.id,
      });
    }

    await client.query('COMMIT');
    return NextResponse.json({ received: true });
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Unable to roll back Stripe webhook transaction', {
        eventId: event.id,
        errorType: rollbackError instanceof Error ? rollbackError.name : 'unknown',
      });
    }
    console.error('Unable to process Stripe webhook', {
      eventId: event.id,
      errorType: error instanceof Error ? error.name : 'unknown',
    });
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  } finally {
    client.release();
  }
}
