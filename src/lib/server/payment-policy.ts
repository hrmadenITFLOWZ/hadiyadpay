import type Stripe from 'stripe';

export interface PayableOrder {
  id: string;
  status: string;
  amount_cents: number;
  currency: string;
  stripe_checkout_session_id: string | null;
}

export function isVerifiedPaidSession(
  order: PayableOrder,
  session: Stripe.Checkout.Session,
): boolean {
  return (
    session.id === order.stripe_checkout_session_id &&
    session.metadata?.orderId === order.id &&
    session.client_reference_id === order.id &&
    session.payment_status === 'paid' &&
    session.amount_total === order.amount_cents &&
    session.currency?.toLowerCase() === order.currency.toLowerCase()
  );
}

export function canDownloadOrder(
  order: Pick<PayableOrder, 'status'>,
  guestTokenMatches: boolean,
  paymentVerified: boolean,
): boolean {
  return order.status === 'paid' && guestTokenMatches && paymentVerified;
}
