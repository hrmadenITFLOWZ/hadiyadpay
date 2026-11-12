import 'server-only';
import type { NextRequest } from 'next/server';
import type { QueryResultRow } from 'pg';
import { getDatabasePool } from './database';
import { matchesGuestOrderToken, readGuestOrderToken } from './guest-order';
import type { PayableOrder } from './payment-policy';

export interface StoredCardOrder extends PayableOrder, QueryResultRow {
  guest_token_hash: string;
  card_id: string;
  language: 'so' | 'en' | 'nl';
  customization: unknown;
  photo_front: Buffer | null;
  photo_front_mime: string | null;
  photo_inside: Buffer | null;
  photo_inside_mime: string | null;
}

export async function getOrderForGuest(
  request: NextRequest,
  orderId: string,
): Promise<StoredCardOrder | null> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId)) {
    return null;
  }

  const result = await getDatabasePool().query<StoredCardOrder>(
    `SELECT id, guest_token_hash, card_id, language, amount_cents, currency, status,
            stripe_checkout_session_id, customization, photo_front, photo_front_mime,
            photo_inside, photo_inside_mime
     FROM card_orders WHERE id = $1`,
    [orderId],
  );
  const order = result.rows[0];
  if (!order) return null;

  const token = readGuestOrderToken(request, orderId);
  return matchesGuestOrderToken(token, order.guest_token_hash) ? order : null;
}
