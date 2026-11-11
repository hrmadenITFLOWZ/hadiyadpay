'use client';

import type { CardOption } from '../data/cardOptions';
import useDialogAccessibility from '../hooks/useDialogAccessibility';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOccasion: CardOption;
  recipientName: string;
  senderName: string;
  message: string;
  cardPrice: number;
  initialLanguage?: string;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  selectedOccasion,
  recipientName,
  senderName,
  message,
  cardPrice,
  initialLanguage = 'so',
}: CheckoutModalProps) {
  const dialogRef = useDialogAccessibility<HTMLElement>(isOpen, onClose);

  if (!isOpen) return null;

  const lang = initialLanguage === 'so' ? 'so' : 'en';
  const content = {
    so: {
      title: 'Dhammee Hadiyadada',
      description: 'Hubi faahfaahinta kaarkaaga ka hor inta aan lacag-bixinta la heli karin.',
      card: 'Kaarka',
      recipient: 'Qaataha',
      sender: 'Diraha',
      message: 'Fariinta',
      price: 'Qiimaha kaarka',
      unavailable: 'Lacag-bixinta kaarka wali lama heli karo.',
      close: 'Xir',
    },
    en: {
      title: 'Review your e-card',
      description: 'Review your card details. E-card checkout is not available yet.',
      card: 'Card',
      recipient: 'Recipient',
      sender: 'Sender',
      message: 'Message',
      price: 'Card price',
      unavailable: 'E-card checkout is not available yet.',
      close: 'Close',
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
            aria-label={content.close}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
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
          <p role="status" className="rounded-xl bg-amber-50 p-3 text-amber-900">
            {content.unavailable}
          </p>
          <button
            type="button"
            disabled
            className="w-full py-4 bg-gray-300 text-gray-600 font-bold rounded-2xl cursor-not-allowed"
          >
            {content.unavailable}
          </button>
        </div>
      </section>
    </div>
  );
}