CREATE TABLE IF NOT EXISTS card_order_shares (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES card_orders(id) ON DELETE CASCADE,
  token_hash CHAR(64) NOT NULL UNIQUE,
  opened_at TIMESTAMPTZ,
  open_count INTEGER NOT NULL DEFAULT 0 CHECK (open_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS card_order_shares_order_id_idx
  ON card_order_shares (order_id);

CREATE INDEX IF NOT EXISTS card_order_shares_token_hash_idx
  ON card_order_shares (token_hash);

CREATE UNIQUE INDEX IF NOT EXISTS card_order_shares_active_order_idx
  ON card_order_shares (order_id)
  WHERE revoked_at IS NULL;