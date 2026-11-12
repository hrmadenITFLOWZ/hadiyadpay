'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { CardLanguage } from '../../../lib/card-types';

type OrderStatusValue = 'pending' | 'paid' | 'failed' | 'expired' | 'canceled';
type StatusResult = OrderStatusValue | 'error';

function isOrderStatus(value: unknown): value is OrderStatusValue {
  return value === 'pending' || value === 'paid' || value === 'failed' || value === 'expired' || value === 'canceled';
}

const copy = {
  so: {
    title: 'Xaaladda dalabka',
    loading: 'Waxaan xaqiijinaynaa lacag-bixintaada…',
    pending: 'Lacag-bixinta weli lama xaqiijin. Soo dejintu way xiran tahay ilaa Stripe xaqiijiyo.',
    canceled: 'Lacag-bixinta waa la joojiyey. Kaarku weli wuu xiran yahay.',
    paid: 'Lacag-bixinta waa la xaqiijiyey. Hadda waad soo dejisan kartaa kaarkaaga.',
    failed: 'Lacag-bixinta lama dhammaystirin. Soo dejintu way xiran tahay.',
    expired: 'Fadhiga lacag-bixintu wuu dhammaaday. Soo dejintu way xiran tahay.',
    error: 'Xaaladda dalabka lama hubin karin. Mar kale isku day.',
    retry: 'Mar kale hubi',
    front: 'Soo dejiso dhinaca hore',
    inside: 'Soo dejiso gudaha',
    catalog: 'Ku noqo kaararka',
  },
  en: {
    title: 'Order status',
    loading: 'Verifying your payment…',
    pending: 'Payment has not been verified yet. Downloads remain locked until Stripe confirms it.',
    canceled: 'Checkout was canceled. The card remains locked.',
    paid: 'Payment is verified. You can now download your card.',
    failed: 'Payment was not completed. Downloads remain locked.',
    expired: 'The checkout session expired. Downloads remain locked.',
    error: 'We could not check this order. Please try again.',
    retry: 'Check again',
    front: 'Download front',
    inside: 'Download inside',
    catalog: 'Back to cards',
  },
  nl: {
    title: 'Bestelstatus',
    loading: 'We controleren je betaling…',
    pending: 'De betaling is nog niet bevestigd. Downloaden blijft vergrendeld totdat Stripe de betaling bevestigt.',
    canceled: 'De betaling is geannuleerd. De kaart blijft vergrendeld.',
    paid: 'De betaling is bevestigd. Je kunt je kaart nu downloaden.',
    failed: 'De betaling is niet voltooid. Downloaden blijft vergrendeld.',
    expired: 'De betaalsessie is verlopen. Downloaden blijft vergrendeld.',
    error: 'We konden de bestelling niet controleren. Probeer het opnieuw.',
    retry: 'Opnieuw controleren',
    front: 'Voorkant downloaden',
    inside: 'Binnenkant downloaden',
    catalog: 'Terug naar kaarten',
  },
} satisfies Record<CardLanguage, Record<string, string>>;

export default function OrderStatus({
  orderId,
  language,
  wasCancelled,
}: {
  orderId: string;
  language: CardLanguage;
  wasCancelled: boolean;
}) {
  const [status, setStatus] = useState<StatusResult | null>(null);
  const text = copy[language];
  const refreshStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Order status could not be verified');
      const result: unknown = await response.json();
      if (
        !result ||
        typeof result !== 'object' ||
        !('status' in result) ||
        !isOrderStatus(result.status)
      ) {
        throw new Error('Order status response was invalid');
      }
      setStatus(result.status);
    } catch {
      setStatus('error');
    }
  }, [orderId]);

  useEffect(() => {
    const timer = window.setTimeout(() => void refreshStatus(), 0);
    return () => window.clearTimeout(timer);
  }, [refreshStatus]);

  useEffect(() => {
    if (status !== 'pending') return;
    const timer = window.setTimeout(() => void refreshStatus(), 4000);
    return () => window.clearTimeout(timer);
  }, [refreshStatus, status]);

  const paid = status === 'paid';
  const message = status === null
    ? text.loading
    : status === 'error'
      ? text.error
      : status === 'pending' && wasCancelled
        ? text.canceled
        : text[status];

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center px-5 py-12">
      <section className="w-full rounded-3xl border border-[#e1e5df] bg-white p-6 shadow-sm sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#285347]">HadiyadPay</p>
        <h1 className="mt-3 font-serif text-3xl text-[#243d34]">{text.title}</h1>
        <p role="status" aria-live="polite" className={`mt-5 rounded-2xl p-4 text-sm leading-6 ${paid ? 'bg-emerald-50 text-emerald-900' : 'bg-stone-100 text-stone-800'}`}>
          {message}
        </p>

        {paid ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a href={`/api/orders/${orderId}/download?side=front`} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#285347] px-4 text-sm font-bold text-white hover:bg-[#1e4338] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">
              {text.front}
            </a>
            <a href={`/api/orders/${orderId}/download?side=inside`} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#285347] px-4 text-sm font-bold text-[#285347] hover:bg-[#285347]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">
              {text.inside}
            </a>
          </div>
        ) : status === 'error' ? (
          <button type="button" onClick={() => { setStatus(null); void refreshStatus(); }} className="mt-6 min-h-12 rounded-xl bg-[#285347] px-5 text-sm font-bold text-white hover:bg-[#1e4338] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">
            {text.retry}
          </button>
        ) : null}

        <Link href="/kaarten" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-[#285347] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">
          {text.catalog}
        </Link>
      </section>
    </main>
  );
}
