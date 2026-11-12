'use client';

import type { CardOption } from '../data/cardOptions';
import useDialogAccessibility from '../hooks/useDialogAccessibility';
import type { CardLanguage } from '../../lib/card-types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOccasion: CardOption;
  recipientName: string;
  senderName: string;
  message: string;
  cardPrice: number;
  initialLanguage: CardLanguage;
  isSubmitting: boolean;
  error: string | null;
  onPay: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  selectedOccasion,
  recipientName,
  senderName,
  message,
  cardPrice,
  initialLanguage,
  isSubmitting,
  error,
  onPay,
}: CheckoutModalProps) {
  const dialogRef = useDialogAccessibility<HTMLElement>(isOpen, onClose);

  if (!isOpen) return null;

  const lang = initialLanguage;
  const content = {
    so: {
      title: 'Dhammee Hadiyadada',
      description: 'Hubi faahfaahinta kaarkaaga. Lacag-bixinta waxaa si ammaan ah u maamusha Stripe.',
      card: 'Kaarka',
      recipient: 'Qaataha',
      sender: 'Diraha',
      message: 'Fariinta',
      price: 'Qiimaha kaarka',
      pay: 'U gudub lacag-bixinta',
      waiting: 'Diyaarinta lacag-bixinta…',
      unavailable: 'Lacag-bixinta si ku-meel-gaar ah looma heli karo.',
      close: 'Xir',
    },
    en: {
      title: 'Review your e-card',
      description: 'Review your card details. Payment is securely handled by Stripe.',
      card: 'Card',
      recipient: 'Recipient',
      sender: 'Sender',
      message: 'Message',
      price: 'Card price',
      pay: 'Continue to payment',
      waiting: 'Preparing secure checkout…',
      unavailable: 'Secure checkout is temporarily unavailable.',
      close: 'Close',
    },
    nl: {
      title: 'Controleer je kaart',
      description: 'Controleer je kaartgegevens. Stripe verwerkt de betaling veilig.',
      card: 'Kaart',
      recipient: 'Ontvanger',
      sender: 'Verzender',
      message: 'Bericht',
      price: 'Prijs van de kaart',
      pay: 'Verder naar betalen',
      waiting: 'Veilige betaling voorbereiden…',
      unavailable: 'Veilig afrekenen is tijdelijk niet beschikbaar.',
      close: 'Sluiten',
    },
  }[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        aria-describedby="checkout-description"
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 id="checkout-title" className="text-xl font-black text-gray-900">
              {content.title}
            </h2>
            <p id="checkout-description" className="text-xs text-gray-500 mt-1">
              {content.description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label={content.close}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
          >
            ✕
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto text-sm text-gray-700">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">{content.card}</p>
            <p className="font-semibold text-gray-900">{selectedOccasion.title[lang]}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">{content.recipient}</p>
            <p className="text-gray-900">{recipientName}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">{content.sender}</p>
            <p className="text-gray-900">{senderName}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">{content.message}</p>
            <p className="text-gray-900 whitespace-pre-wrap">{message}</p>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-3 font-bold text-gray-900">
            <span>{content.price}</span>
            <span>€{cardPrice.toFixed(2)}</span>
          </div>
          {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-rose-800">{error}</p>}
          <button
            type="button"
            onClick={onPay}
            disabled={isSubmitting}
            className="min-h-12 w-full rounded-2xl bg-[#285347] px-4 py-3 font-bold text-white transition-colors hover:bg-[#1e4338] disabled:cursor-wait disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
          >
            {isSubmitting ? content.waiting : content.pay}
          </button>
        </div>
      </section>
    </div>
  );
}