import 'server-only';
import { getDatabasePool } from './database';
import { getStripeClient } from './stripe';
import { isVerifiedPaidSession, type PayableOrder } from './payment-policy';

export async function verifyAndRecordPaidOrder(order: PayableOrder): Promise<boolean> {
  if (!order.stripe_checkout_session_id) return false;

  const session = await getStripeClient().checkout.sessions.retrieve(order.stripe_checkout_session_id);
  if (!isVerifiedPaidSession(order, session)) return false;

  await getDatabasePool().query(
    `UPDATE card_orders
     SET status = 'paid', paid_at = COALESCE(paid_at, NOW()), updated_at = NOW()
     WHERE id = $1`,
    [order.id],
  );
  return true;
}
