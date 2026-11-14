'use client';

import Image from 'next/image';
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

type CardActionState =
  | 'idle'
  | 'sharing'
  | 'saving'
  | 'shared'
  | 'saved'
  | 'copied'
  | 'error';

interface CardFile {
  blob: Blob;
  filename: string;
}

interface ShareResult {
  shareUrl: string;
}

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

function isShareResult(
  value: unknown,
): value is ShareResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    'shareUrl' in value &&
    typeof value.shareUrl === 'string'
  );
}

const copy = {
  so: {
    brandLabel: 'Kaar dijitaal ah',
    loadingTitle:
      'Waxaan hubinaynaa dalabkaaga',
    loading:
      'Xaqiijintu waxay qaadan kartaa dhowr ilbiriqsi.',
    pendingTitle:
      'Waxaan sugaynaa xaqiijinta',
    pending:
      'Lacag-bixinta wali waa la xaqiijinayaa. Boggan si toos ah ayuu u cusboonaysiinayaa.',
    canceledTitle:
      'Lacag-bixinta waa la joojiyey',
    canceled:
      'Kaarkaagu wali waa kaydsan yahay. Waxaad dib ugu noqon kartaa kaararka.',
    paidTitle:
      'Kaarkaagu waa diyaar',
    paid:
      'Lacag-bixinta waa la xaqiijiyey. Kaarkaaga gaarka ah waa diyaar inaad la wadaagto.',
    failedTitle:
      'Lacag-bixintu ma dhammaan',
    failed:
      'Dalabka lama dhammaystirin. Waxaad dib ugu noqon kartaa kaararka oo mar kale isku dayi kartaa.',
    expiredTitle:
      'Fadhigu wuu dhammaaday',
    expired:
      'Fadhiga lacag-bixintu wuu dhammaaday. Kaarkaaga mar kale ka fur ururinta.',
    errorTitle:
      'Dalabka lama xaqiijin',
    error:
      'Xaqiijinta wali lama heli karo. Sug dhowr ilbiriqsi ka dibna mar kale isku day.',
    retry:
      'Mar kale hubi',
    share:
      'La wadaag kaarka',
    save:
      'Kaydi kaarka',
    preparingShare:
      'Linkiga gaarka ah ayaa la diyaarinayaa…',
    preparingSave:
      'Kaarka ayaa la kaydinayaa…',
    shared:
      'Linkiga Hadiyadda waa la wadaagay.',
    copied:
      'Linkiga Hadiyadda waa la koobiyey.',
    saved:
      'Kaarka waxaa lagu kaydiyey qalabkaaga.',
    actionError:
      'Ficilka lama dhamaystiri karin. Mar kale isku day.',
    shareTitle:
      'Hadiyad gaar ah ayaa kuu diyaar ah ✨',
    shareText:
      'Waxaan kuu soo dirayaa Hadiyad gaar ah. Fur kaarkaaga halkan:',
    catalog:
      'Ku noqo kaararka',
  },

  en: {
    brandLabel:
      'Digital card',
    loadingTitle:
      'We are checking your order',
    loading:
      'Confirmation can take a few seconds.',
    pendingTitle:
      'Waiting for confirmation',
    pending:
      'Your payment is still being confirmed. This page refreshes automatically.',
    canceledTitle:
      'Payment was cancelled',
    canceled:
      'Your card is still saved. You can return to the collection whenever you are ready.',
    paidTitle:
      'Your card is ready',
    paid:
      'Payment is confirmed. Your personal card is ready to share.',
    failedTitle:
      'Payment was not completed',
    failed:
      'The order was not completed. Return to the collection and try again when you are ready.',
    expiredTitle:
      'The session has expired',
    expired:
      'The payment session expired. Open your card again from the collection.',
    errorTitle:
      'We could not confirm your order',
    error:
      'Confirmation is not available yet. Wait a few seconds and try again.',
    retry:
      'Check again',
    share:
      'Share card',
    save:
      'Save card',
    preparingShare:
      'Preparing your private Hadiyad link…',
    preparingSave:
      'Saving your card…',
    shared:
      'Your Hadiyad link was shared.',
    copied:
      'Your Hadiyad link was copied.',
    saved:
      'Your card was saved to your device.',
    actionError:
      'The action could not be completed. Please try again.',
    shareTitle:
      'A special Hadiyad is waiting for you ✨',
    shareText:
      'I sent you a personal Hadiyad. Open your card here:',
    catalog:
      'Back to the cards',
  },

  nl: {
    brandLabel:
      'Digitale kaart',
    loadingTitle:
      'We controleren je bestelling',
    loading:
      'De bevestiging kan enkele seconden duren.',
    pendingTitle:
      'We wachten op bevestiging',
    pending:
      'Je betaling wordt nog bevestigd. Deze pagina wordt automatisch bijgewerkt.',
    canceledTitle:
      'De betaling is geannuleerd',
    canceled:
      'Je kaart is nog bewaard. Je kunt teruggaan naar de collectie wanneer je er klaar voor bent.',
    paidTitle:
      'Je kaart is klaar',
    paid:
      'De betaling is bevestigd. Je persoonlijke kaart staat klaar om te delen.',
    failedTitle:
      'De betaling is niet voltooid',
    failed:
      'De bestelling is niet afgerond. Ga terug naar de collectie en probeer het opnieuw wanneer je er klaar voor bent.',
    expiredTitle:
      'De sessie is verlopen',
    expired:
      'De betaalsessie is verlopen. Open je kaart opnieuw vanuit de collectie.',
    errorTitle:
      'We konden je bestelling niet bevestigen',
    error:
      'De bevestiging is nog niet beschikbaar. Wacht enkele seconden en probeer het opnieuw.',
    retry:
      'Opnieuw controleren',
    share:
      'Kaart delen',
    save:
      'Kaart bewaren',
    preparingShare:
      'Je persoonlijke Hadiyad-link wordt klaargemaakt…',
    preparingSave:
      'Je kaart wordt bewaard…',
    shared:
      'Je Hadiyad-link is gedeeld.',
    copied:
      'Je Hadiyad-link is gekopieerd.',
    saved:
      'Je kaart is op je apparaat bewaard.',
    actionError:
      'De actie kon niet worden voltooid. Probeer het opnieuw.',
    shareTitle:
      'Er staat een bijzondere Hadiyad voor je klaar ✨',
    shareText:
      'Ik heb een persoonlijke Hadiyad voor je. Open je kaart hier:',
    catalog:
      'Terug naar de kaarten',
  },
} satisfies Record<
  CardLanguage,
  Record<string, string>
>;

async function loadCardFile(
  orderId: string,
): Promise<CardFile> {
  const response = await fetch(
    `/api/orders/${orderId}/download`,
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

  const blob =
    await response.blob();

  return {
    blob,
    filename:
      'hadiyadpay-kaart.svg',
  };
}

async function createShareLink(
  orderId: string,
): Promise<string> {
  const response = await fetch(
    `/api/orders/${orderId}/share`,
    {
      method: 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
    },
  );

  const result: unknown =
    await response
      .json()
      .catch(() => null);

  if (
    !response.ok ||
    !isShareResult(result)
  ) {
    throw new Error(
      'Share link could not be created',
    );
  }

  const shareUrl =
    new URL(result.shareUrl);

  const isSecureUrl =
    shareUrl.protocol === 'https:';

  const isLocalDevelopmentUrl =
    shareUrl.protocol === 'http:' &&
    (
      shareUrl.hostname === 'localhost' ||
      shareUrl.hostname === '127.0.0.1'
    );

  if (
    shareUrl.origin !==
      window.location.origin ||
    (
      !isSecureUrl &&
      !isLocalDevelopmentUrl
    )
  ) {
    throw new Error(
      'Share link was not valid',
    );
  }

  return shareUrl.toString();
}

function saveBlob(
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
    URL.revokeObjectURL(
      objectUrl,
    );
  }, 1500);
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
  const [
    status,
    setStatus,
  ] = useState<
    StatusResult | null
  >(null);

  const [
    actionState,
    setActionState,
  ] = useState<CardActionState>(
    'idle',
  );

  const text =
    copy[language];

  const refreshStatus =
    useCallback(async () => {
      try {
        const response =
          await fetch(
            `/api/orders/${orderId}/status`,
            {
              credentials:
                'same-origin',
              cache:
                'no-store',
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
          typeof result !==
            'object' ||
          !('status' in result) ||
          !isOrderStatus(
            result.status,
          )
        ) {
          throw new Error(
            'Order status response was invalid',
          );
        }

        setStatus(
          result.status,
        );
      } catch {
        setStatus('error');
      }
    }, [orderId]);

  useEffect(() => {
    void refreshStatus();
  }, [refreshStatus]);

  useEffect(() => {
    if (status !== 'pending') {
      return;
    }

    const timer =
      window.setInterval(() => {
        void refreshStatus();
      }, 4000);

    return () => {
      window.clearInterval(timer);
    };
  }, [refreshStatus, status]);

  const handleSave =
    async () => {
      if (
        actionState ===
          'saving' ||
        actionState ===
          'sharing'
      ) {
        return;
      }

      setActionState(
        'saving',
      );

      try {
        const cardFile =
          await loadCardFile(
            orderId,
          );

        saveBlob(
          cardFile.blob,
          cardFile.filename,
        );

        setActionState(
          'saved',
        );
      } catch {
        setActionState(
          'error',
        );
      }
    };

  const handleShare =
    async () => {
      if (
        actionState ===
          'sharing' ||
        actionState ===
          'saving'
      ) {
        return;
      }

      setActionState(
        'sharing',
      );

      try {
        const shareUrl =
          await createShareLink(
            orderId,
          );

        const shareData = {
          title:
            text.shareTitle,

          text:
            text.shareText,

          url:
            shareUrl,
        };

        if (
          typeof navigator.share ===
          'function'
        ) {
          try {
            await navigator.share(
              shareData,
            );

            setActionState(
              'shared',
            );

            return;
          } catch (error) {
            if (
              error instanceof
                DOMException &&
              error.name ===
                'AbortError'
            ) {
              setActionState(
                'idle',
              );

              return;
            }

            /*
             * Some browsers expose navigator.share but reject
             * particular share-data combinations. In that case,
             * continue to the clipboard fallback below.
             */
          }
        }

        if (
          navigator.clipboard &&
          typeof navigator
            .clipboard
            .writeText ===
            'function'
        ) {
          await navigator
            .clipboard
            .writeText(
              `${text.shareText}\n${shareUrl}`,
            );

          setActionState(
            'copied',
          );

          return;
        }

        throw new Error(
          'Sharing is not supported',
        );
      } catch {
        setActionState(
          'error',
        );
      }
    };

  const paid =
    status === 'paid';

  const heading =
    status === null
      ? text.loadingTitle
      : status === 'paid'
        ? text.paidTitle
        : status === 'pending' &&
            wasCancelled
          ? text.canceledTitle
          : status === 'pending'
            ? text.pendingTitle
            : status === 'failed'
              ? text.failedTitle
              : status === 'expired'
                ? text.expiredTitle
                : status === 'canceled'
                  ? text.canceledTitle
                  : text.errorTitle;

  const message =
    status === null
      ? text.loading
      : status === 'paid'
        ? text.paid
        : status === 'pending' &&
            wasCancelled
          ? text.canceled
          : status === 'pending'
            ? text.pending
            : status === 'failed'
              ? text.failed
              : status === 'expired'
                ? text.expired
                : status === 'canceled'
                  ? text.canceled
                  : text.error;

  const actionMessage =
    actionState === 'sharing'
      ? text.preparingShare
      : actionState === 'saving'
        ? text.preparingSave
        : actionState === 'shared'
          ? text.shared
          : actionState === 'copied'
            ? text.copied
            : actionState === 'saved'
              ? text.saved
              : actionState === 'error'
                ? text.actionError
                : null;

  const statusSymbol =
    paid
      ? '✓'
      : status === 'failed' ||
          status === 'expired' ||
          status === 'canceled' ||
          status === 'error'
        ? '!'
        : '…';

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f2ea] px-5 py-12">
      <div
        aria-hidden="true"
        className="absolute -left-28 top-10 h-72 w-72 rounded-full bg-[#d9e5de]/70 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#eadcc5]/70 blur-3xl"
      />

      <section className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-[#dce2dc] bg-[#fffdf8] shadow-[0_24px_80px_rgba(34,61,52,0.12)]">
        <header className="flex items-center gap-4 border-b border-[#e6e3db] px-6 py-5 sm:px-9">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-[#d9ddd8] bg-white shadow-sm">
            <Image
              src="/images/logo.jpg"
              alt="HadiyadPay"
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
          </div>

          <div>
            <p className="font-serif text-xl text-[#263e36]">
              HadiyadPay
            </p>

            <p className="mt-0.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#8b8178]">
              {text.brandLabel}
            </p>
          </div>
        </header>

        <div className="px-6 py-8 sm:px-10 sm:py-11">
          <div
            aria-hidden="true"
            className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold ${
              paid
                ? 'bg-[#dcece2] text-[#1f6848]'
                : status === 'failed' ||
                    status === 'expired' ||
                    status === 'canceled' ||
                    status === 'error'
                  ? 'bg-[#f7e3dc] text-[#9b4e3e]'
                  : 'bg-[#eee8db] text-[#745d3f]'
            }`}
          >
            {statusSymbol}
          </div>

          <h1 className="mt-6 max-w-xl font-serif text-3xl leading-tight text-[#243d34] sm:text-4xl">
            {heading}
          </h1>

          <p
            role="status"
            aria-live="polite"
            className="mt-4 max-w-xl text-sm leading-7 text-[#68756f] sm:text-base"
          >
            {message}
          </p>

          {paid ? (
            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={() =>
                  void handleShare()
                }
                disabled={
                  actionState ===
                    'sharing' ||
                  actionState ===
                    'saving'
                }
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#285347] px-5 text-sm font-bold text-white shadow-lg shadow-[#285347]/15 transition hover:-translate-y-0.5 hover:bg-[#1e4338] disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#285347]"
              >
                {actionState ===
                'sharing'
                  ? text.preparingShare
                  : text.share}

                <span aria-hidden="true">
                  ↗
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  void handleSave()
                }
                disabled={
                  actionState ===
                    'sharing' ||
                  actionState ===
                    'saving'
                }
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-[#b9c7c0] bg-white px-5 text-sm font-bold text-[#285347] transition hover:border-[#285347] hover:bg-[#f3f7f4] disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#285347]"
              >
                {actionState ===
                'saving'
                  ? text.preparingSave
                  : text.save}

                <span aria-hidden="true">
                  ↓
                </span>
              </button>

              {actionMessage && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`rounded-xl px-4 py-3 text-sm leading-6 ${
                    actionState ===
                    'error'
                      ? 'bg-rose-50 text-rose-800'
                      : 'bg-[#f1f4f1] text-[#52615b]'
                  }`}
                >
                  {actionMessage}
                </p>
              )}
            </div>
          ) : status === 'error' ? (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setStatus(null);
                  void refreshStatus();
                }}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#285347] px-5 text-sm font-bold text-white transition hover:bg-[#1e4338] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#285347]"
              >
                {text.retry}
              </button>

              <Link
                href={`/kaarten?lang=${language}`}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#b9c7c0] bg-white px-5 text-center text-sm font-bold text-[#285347] transition hover:border-[#285347] hover:bg-[#f3f7f4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#285347]"
              >
                {text.catalog}
              </Link>
            </div>
          ) : null}

          {(paid ||
            status !== 'error') && (
            <div className="mt-8 border-t border-[#e4e5df] pt-6">
              <Link
                href={`/kaarten?lang=${language}`}
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#285347] transition hover:text-[#1e4338] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#285347]"
              >
                <span aria-hidden="true">
                  ←
                </span>

                {text.catalog}
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}