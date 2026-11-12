CREATE TABLE IF NOT EXISTS card_orders (
  id UUID PRIMARY KEY,
  guest_token_hash CHAR(64) NOT NULL,
  card_id TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('so', 'en', 'nl')),
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  currency CHAR(3) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'canceled', 'failed', 'expired')),
  stripe_checkout_session_id TEXT UNIQUE,
  customization JSONB NOT NULL,
  photo_front BYTEA,
  photo_front_mime TEXT,
  photo_inside BYTEA,
  photo_inside_mime TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS card_orders_status_created_at_idx
  ON card_orders (status, created_at);

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
