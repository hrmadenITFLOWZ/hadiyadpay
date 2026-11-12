import assert from 'node:assert/strict';
import test from 'node:test';
import { canDownloadOrder, isVerifiedPaidSession } from '../src/lib/server/payment-policy.ts';

const order = {
  id: '18aafe8f-37d1-4e56-9e45-8266309a4ce1',
  status: 'paid',
  amount_cents: 200,
  currency: 'eur',
  stripe_checkout_session_id: 'cs_test_valid',
};

const paidSession = {
  id: 'cs_test_valid',
  client_reference_id: order.id,
  metadata: { orderId: order.id },
  payment_status: 'paid',
  amount_total: 200,
  currency: 'eur',
};

test('download authorization requires a guest token and a verified paid order', () => {
  assert.equal(canDownloadOrder(order, true, true), true);
  assert.equal(canDownloadOrder(order, false, true), false);
  assert.equal(canDownloadOrder(order, true, false), false);

  for (const status of ['pending', 'canceled', 'failed', 'expired']) {
    assert.equal(canDownloadOrder({ status }, true, true), false);
  }
});

test('payment verification binds the paid session to the stored order and amount', () => {
  assert.equal(isVerifiedPaidSession(order, paidSession), true);
  assert.equal(isVerifiedPaidSession(order, { ...paidSession, id: 'cs_test_other' }), false);
  assert.equal(isVerifiedPaidSession(order, { ...paidSession, amount_total: 100 }), false);
  assert.equal(isVerifiedPaidSession(order, { ...paidSession, payment_status: 'unpaid' }), false);
});
