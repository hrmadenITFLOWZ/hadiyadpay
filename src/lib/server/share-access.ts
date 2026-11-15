import 'server-only';

import type {
  QueryResultRow,
} from 'pg';

import {
  getDatabasePool,
} from './database';

import {
  hashShareToken,
  isValidShareTokenFormat,
} from './share-token';

export interface SharedCardOrder
  extends QueryResultRow {
  share_id: string;
  order_id: string;
  card_id: string;
  language:
    | 'so'
    | 'en'
    | 'nl';
  status: string;
  customization: unknown;
  photo_front: Buffer | null;
  photo_front_mime:
    | string
    | null;
  opened_at: Date | null;
  open_count: number;
}

export async function getOrderForShareToken(
  token: string,
): Promise<SharedCardOrder | null> {
  /*
   * Token validation is centralized in share-token.ts.
   *
   * This supports the current compact Hadiyad links
   * while preserving compatibility with older,
   * longer share tokens.
   */
  if (
    !isValidShareTokenFormat(
      token,
    )
  ) {
    return null;
  }

  const tokenHash =
    hashShareToken(
      token,
    );

  const result =
    await getDatabasePool()
      .query<SharedCardOrder>(
        `SELECT
           shares.id AS share_id,
           orders.id AS order_id,
           orders.card_id,
           orders.language,
           orders.status,
           orders.customization,
           orders.photo_front,
           orders.photo_front_mime,
           shares.opened_at,
           shares.open_count
         FROM card_order_shares shares
         INNER JOIN card_orders orders
           ON orders.id = shares.order_id
         WHERE
           shares.token_hash = $1
           AND shares.revoked_at IS NULL
           AND orders.status = 'paid'
         LIMIT 1`,
        [
          tokenHash,
        ],
      );

  return (
    result.rows[0] ??
    null
  );
}

export async function recordShareOpen(
  shareId: string,
): Promise<void> {
  await getDatabasePool().query(
    `UPDATE card_order_shares
     SET
       opened_at =
         COALESCE(
           opened_at,
           NOW()
         ),
       open_count =
         open_count + 1,
       updated_at = NOW()
     WHERE
       id = $1
       AND revoked_at IS NULL`,
    [
      shareId,
    ],
  );
}