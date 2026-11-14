'use client';

import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import type { CardLanguage } from '../../../lib/card-types';

type OrderStatusValue =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'expired'
  | 'canceled';

type StatusResult =
  | OrderStatusValue
  | 'error';

type ShareState =
  | 'idle'
  | 'preparing'
  | 'shared'
  | 'downloaded'
  | 'error';

function isOrderStatus(
  value: unknown,
): value is OrderStatusValue {
  return (
    value === 'pending' ||
    value === 'paid' ||
    value === 'failed' ||
    value === 'expired' ||
    value === 'canceled'
  );
}

const copy = {
  so: {
    title: 'Xaaladda dalabka',
    loading:
      'Waxaan xaqiijinaynaa lacag-bixintaada…',
    pending:
      'Lacag-bixinta weli lama xaqiijin. Soo dejintu way xiran tahay ilaa lacag-bixinta la xaqiijiyo.',
    canceled:
      'Lacag-bixinta waa la joojiyey. Kaarku weli wuu xiran yahay.',
    paid:
      'Lacag-bixinta waa la xaqiijiyey. Hadda waad soo dejisan kartaa ama wadaagi kartaa kaarkaaga.',
    failed:
      'Lacag-bixinta lama dhammaystirin. Soo dejintu way xiran tahay.',
    expired:
      'Fadhiga lacag-bixintu wuu dhammaaday. Soo dejintu way xiran tahay.',
    error:
      'Xaaladda dalabka lama hubin karin. Mar kale isku day.',
    retry: 'Mar kale hubi',
    front: 'Soo dejiso dhinaca hore',
    inside: 'Soo dejiso gudaha',
    share: 'La wadaag kaarka',
    preparingShare:
      'Kaarka ayaa la diyaarinayaa…',
    shared:
      'Kaarka waa la wadaagay.',
    downloaded:
      'Qalabkani ma taageero wadaagista faylka. Kaarka waa la soo dejiyey.',
    shareError:
      'Kaarka lama wadaagi karin. Mar kale isku day.',
    shareTitle: 'Kaarka HadiyadPay',
    shareText:
      'Waxaan kuu soo dirayaa kaar dijitaal ah.',
    catalog: 'Ku noqo kaararka',
  },

  en: {
    title: 'Order status',
    loading:
      'Verifying your payment…',
    pending:
      'Payment has not been verified yet. Downloads remain locked until the payment is confirmed.',
    canceled:
      'Checkout was canceled. The card remains locked.',
    paid:
      'Payment is verified. You can now download or share your card.',
    failed:
      'Payment was not completed. Downloads remain locked.',
    expired:
      'The payment session expired. Downloads remain locked.',
    error:
      'We could not check this order. Please try again.',
    retry: 'Check again',
    front: 'Download front',
    inside: 'Download inside',
    share: 'Share card',
    preparingShare:
      'Preparing your card…',
    shared:
      'The card was shared.',
    downloaded:
      'File sharing is not supported on this device. The card was downloaded instead.',
    shareError:
      'The card could not be shared. Please try again.',
    shareTitle: 'HadiyadPay card',
    shareText:
      'I am sharing a digital card with you.',
    catalog: 'Back to cards',
  },

  nl: {
    title: 'Bestelstatus',
    loading:
      'We controleren je betaling…',
    pending:
      'De betaling is nog niet bevestigd. Downloaden blijft vergrendeld totdat de betaling is bevestigd.',
    canceled:
      'De betaling is geannuleerd. De kaart blijft vergrendeld.',
    paid:
      'De betaling is bevestigd. Je kunt je kaart nu downloaden of delen.',
    failed:
      'De betaling is niet voltooid. Downloaden blijft vergrendeld.',
    expired:
      'De betaalsessie is verlopen. Downloaden blijft vergrendeld.',
    error:
      'We konden de bestelling niet controleren. Probeer het opnieuw.',
    retry: 'Opnieuw controleren',
    front: 'Voorkant downloaden',
    inside: 'Binnenkant downloaden',
    share: 'Kaart delen',
    preparingShare:
      'Je kaart wordt voorbereid…',
    shared:
      'De kaart is gedeeld.',
    downloaded:
      'Bestanden delen wordt niet ondersteund op dit apparaat. De kaart is daarom gedownload.',
    shareError:
      'De kaart kon niet worden gedeeld. Probeer het opnieuw.',
    shareTitle: 'HadiyadPay-kaart',
    shareText:
      'Ik deel een digitale kaart met je.',
    catalog: 'Terug naar kaarten',
  },
} satisfies Record<
  CardLanguage,
  Record<string, string>
>;

function downloadBlob(
  blob: Blob,
  filename: string,
) {
  const objectUrl =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement('a');

  anchor.href = objectUrl;
  anchor.download = filename;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);
}

export default function OrderStatus({
  orderId,
  language,
  wasCancelled,
}: {
  orderId: string;
  language: CardLanguage;
  wasCancelled: boolean;
}) {
  const [status, setStatus] =
    useState<StatusResult | null>(null);

  const [shareState, setShareState] =
    useState<ShareState>('idle');

  const text = copy[language];

  const refreshStatus =
    useCallback(async () => {
      try {
        const response = await fetch(
          `/api/orders/${orderId}/status`,
          {
            cache: 'no-store',
          },
        );

        if (!response.ok) {
          throw new Error(
            'Order status could not be verified',
          );
        }

        const result: unknown =
          await response.json();

        if (
          !result ||
          typeof result !== 'object' ||
          !('status' in result) ||
          !isOrderStatus(result.status)
        ) {
          throw new Error(
            'Order status response was invalid',
          );
        }

        setStatus(result.status);
      } catch {
        setStatus('error');
      }
    }, [orderId]);

  useEffect(() => {
    const timer = window.setTimeout(
      () => void refreshStatus(),
      0,
    );

    return () =>
      window.clearTimeout(timer);
  }, [refreshStatus]);

  useEffect(() => {
    if (status !== 'pending') {
      return;
    }

    const timer = window.setTimeout(
      () => void refreshStatus(),
      4000,
    );

    return () =>
      window.clearTimeout(timer);
  }, [refreshStatus, status]);

  const handleShare = async () => {
    if (
      shareState === 'preparing'
    ) {
      return;
    }

    setShareState('preparing');

    try {
      const response = await fetch(
        `/api/orders/${orderId}/download?side=front`,
        {
          credentials: 'same-origin',
          cache: 'no-store',
        },
      );

      if (!response.ok) {
        throw new Error(
          'Card file could not be loaded',
        );
      }

      const blob = await response.blob();

      const file = new File(
        [blob],
        'hadiyadpay-card-front.svg',
        {
          type:
            'image/svg+xml',
        },
      );

      const shareData = {
        title: text.shareTitle,
        text: text.shareText,
        files: [file],
      };

      const canShareFile =
        typeof navigator.share ===
          'function' &&
        typeof navigator.canShare ===
          'function' &&
        navigator.canShare(shareData);

      if (canShareFile) {
        await navigator.share(shareData);

        setShareState('shared');
        return;
      }

      downloadBlob(
        blob,
        'hadiyadpay-card-front.svg',
      );

      setShareState('downloaded');
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        setShareState('idle');
        return;
      }

      setShareState('error');
    }
  };

  const paid = status === 'paid';

  const message =
    status === null
      ? text.loading
      : status === 'error'
        ? text.error
        : status === 'pending' &&
            wasCancelled
          ? text.canceled
          : text[status];

  const shareMessage =
    shareState === 'preparing'
      ? text.preparingShare
      : shareState === 'shared'
        ? text.shared
        : shareState === 'downloaded'
          ? text.downloaded
          : shareState === 'error'
            ? text.shareError
            : null;

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center px-5 py-12">
      <section className="w-full rounded-3xl border border-[#e1e5df] bg-white p-6 shadow-sm sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#285347]">
          HadiyadPay
        </p>

        <h1 className="mt-3 font-serif text-3xl text-[#243d34]">
          {text.title}
        </h1>

        <p
          role="status"
          aria-live="polite"
          className={`mt-5 rounded-2xl p-4 text-sm leading-6 ${
            paid
              ? 'bg-emerald-50 text-emerald-900'
              : 'bg-stone-100 text-stone-800'
          }`}
        >
          {message}
        </p>

        {paid ? (
          <>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href={`/api/orders/${orderId}/download?side=front`}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#285347] px-4 text-sm font-bold text-white hover:bg-[#1e4338] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
              >
                {text.front}
              </a>

              <a
                href={`/api/orders/${orderId}/download?side=inside`}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#285347] px-4 text-sm font-bold text-[#285347] hover:bg-[#285347]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
              >
                {text.inside}
              </a>
            </div>

            <button
              type="button"
              onClick={() =>
                void handleShare()
              }
              disabled={
                shareState ===
                'preparing'
              }
              className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#f0e4d0] px-4 text-sm font-bold text-[#29443a] transition hover:bg-[#e6d4b7] disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
            >
              {shareState ===
              'preparing'
                ? text.preparingShare
                : text.share}
            </button>

            {shareMessage && (
              <p
                role="status"
                aria-live="polite"
                className={`mt-3 rounded-xl p-3 text-sm ${
                  shareState ===
                  'error'
                    ? 'bg-rose-50 text-rose-800'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                {shareMessage}
              </p>
            )}
          </>
        ) : status === 'error' ? (
          <button
            type="button"
            onClick={() => {
              setStatus(null);
              void refreshStatus();
            }}
            className="mt-6 min-h-12 rounded-xl bg-[#285347] px-5 text-sm font-bold text-white hover:bg-[#1e4338] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
          >
            {text.retry}
          </button>
        ) : null}

        <Link
          href={`/kaarten?lang=${language}`}
          className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-[#285347] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
        >
          {text.catalog}
        </Link>
      </section>
    </main>
  );
}