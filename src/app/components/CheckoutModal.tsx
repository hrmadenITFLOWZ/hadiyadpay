'use client';

import { useState } from 'react';

import type { CardOption } from '../data/cardOptions';
import useDialogAccessibility from '../hooks/useDialogAccessibility';
import type { CardLanguage } from '../../lib/card-types';
import type { EditorDraft } from '../../lib/card-editor';

import CardComposition from './CardComposition';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  selectedOccasion: CardOption;
  draft: EditorDraft;
  cardPrice: number;
  initialLanguage: CardLanguage;
  isSubmitting: boolean;
  error: string | null;
  onPay: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  onEdit,
  selectedOccasion,
  draft,
  cardPrice,
  initialLanguage,
  isSubmitting,
  error,
  onPay,
}: CheckoutModalProps) {
  const [previewSide, setPreviewSide] = useState<'front' | 'inside'>('front');

  const dialogRef = useDialogAccessibility<HTMLElement>(
    isOpen,
    onClose,
  );

  if (!isOpen) {
    return null;
  }

  const lang = initialLanguage;

  const content = {
    so: {
      title: 'Hubi kaarkaaga',
      description:
        'Eeg kaarkaaga gaarka ah ka hor intaadan u gudbin lacag-bixinta.',
      preview: 'Tusaalaha kaarka',
      front: 'Hordhaca',
      inside: 'Gudaha',
      card: 'Kaarka',
      recipient: 'Qaataha',
      sender: 'Diraha',
      message: 'Fariinta',
      price: 'Qiimaha kaarka',
      edit: 'Wax kale beddel',
      pay: 'Bixi',
      waiting: 'Lacag-bixinta diyaarinaysa…',
      close: 'Xir',
      empty: 'Lama gelin',
    },

    en: {
      title: 'Review your card',
      description:
        'Preview your personalized card before continuing to payment.',
      preview: 'Card preview',
      front: 'Front',
      inside: 'Inside',
      card: 'Card',
      recipient: 'Recipient',
      sender: 'Sender',
      message: 'Message',
      price: 'Card price',
      edit: 'Make another change',
      pay: 'Pay',
      waiting: 'Preparing payment…',
      close: 'Close',
      empty: 'Not added',
    },

    nl: {
      title: 'Controleer je kaart',
      description:
        'Bekijk je persoonlijke kaart voordat je verdergaat naar de betaling.',
      preview: 'Kaartvoorbeeld',
      front: 'Voorkant',
      inside: 'Binnenkant',
      card: 'Kaart',
      recipient: 'Ontvanger',
      sender: 'Verzender',
      message: 'Bericht',
      price: 'Kaartprijs',
      edit: 'Nog iets aanpassen',
      pay: 'Betalen',
      waiting: 'Betaling voorbereiden…',
      close: 'Sluiten',
      empty: 'Niet ingevuld',
    },
  }[lang];

  const preview =
    previewSide === 'front'
      ? draft.front
      : draft.inside;

  const formattedPrice = new Intl.NumberFormat(
    lang === 'nl'
      ? 'nl-NL'
      : lang === 'so'
        ? 'so-SO'
        : 'en-IE',
    {
      style: 'currency',
      currency: 'EUR',
    },
  ).format(cardPrice);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-5">
      <section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        aria-describedby="checkout-description"
        className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl overflow-y-auto rounded-3xl border border-gray-100 bg-white shadow-2xl sm:max-h-[calc(100dvh-2.5rem)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5 sm:p-6">
          <div>
            <h2
              id="checkout-title"
              className="text-xl font-black text-gray-900"
            >
              {content.title}
            </h2>

            <p
              id="checkout-description"
              className="mt-1 text-sm text-gray-600"
            >
              {content.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label={content.close}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-gray-200 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[minmax(190px,0.8fr)_minmax(0,1.2fr)]">
          <section
            aria-label={content.preview}
            className="mx-auto w-full max-w-[230px]"
          >
            <h3 className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
              {content.preview}
            </h3>

            <CardComposition
              card={selectedOccasion}
              language={lang}
              cardSide={previewSide}
              side={preview}
            />

            <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-stone-100 p-1">
              {(['front', 'inside'] as const).map((side) => (
                <button
                  key={side}
                  type="button"
                  aria-pressed={previewSide === side}
                  onClick={() => setPreviewSide(side)}
                  className={`min-h-10 rounded-lg px-2 text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#285347] ${
                    previewSide === side
                      ? 'bg-white text-[#285347] shadow-sm'
                      : 'text-stone-600'
                  }`}
                >
                  {content[side]}
                </button>
              ))}
            </div>
          </section>

          <div className="flex min-w-0 flex-col gap-4 text-sm text-gray-700">
            <div>
              <p className="text-xs font-bold uppercase text-gray-500">
                {content.card}
              </p>

              <p className="font-semibold text-gray-900">
                {selectedOccasion.title[lang]}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-gray-500">
                {content.recipient}
              </p>

              <p className="break-words text-gray-900">
                {preview.recipient.trim() || content.empty}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-gray-500">
                {content.sender}
              </p>

              <p className="break-words text-gray-900">
                {preview.sender.trim() || content.empty}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-gray-500">
                {content.message}
              </p>

              <p className="max-h-28 overflow-y-auto whitespace-pre-wrap break-words text-gray-900">
                {preview.message.trim() || content.empty}
              </p>
            </div>

            <div className="mt-auto flex justify-between border-t border-gray-200 pt-3 font-bold text-gray-900">
              <span>{content.price}</span>
              <span>{formattedPrice}</span>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-rose-50 p-3 text-rose-800"
              >
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={onEdit}
              disabled={isSubmitting}
              className="min-h-11 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 font-semibold text-stone-800 transition hover:bg-stone-50 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
            >
              {content.edit}
            </button>

            <button
              type="button"
              onClick={onPay}
              disabled={isSubmitting}
              className="min-h-12 w-full rounded-2xl bg-[#285347] px-4 py-3 font-bold text-white transition-colors hover:bg-[#1e4338] disabled:cursor-wait disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
            >
              {isSubmitting
                ? content.waiting
                : `${content.pay} · ${formattedPrice}`}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}