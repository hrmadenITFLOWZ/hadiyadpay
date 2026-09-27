'use client';

import React, { useState } from 'react';
import { CardOption } from '../data/cardOptions';

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
  const [senderPhone, setSenderPhone] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [provider, setProvider] = useState<'zaad' | 'edahab'>('zaad');
  const [amount, setAmount] = useState('20');

  if (!isOpen) return null;

  const numericAmount = parseFloat(amount) || 0;
  const total = cardPrice + numericAmount;

  const lang = initialLanguage === 'so' || initialLanguage === 'en' ? initialLanguage : 'en';

  // Meertalige teksten voor de modal
  const content = {
    so: {
      title: 'Dhammee Hadiyadadaada',
      subtitle: 'Kaga bixi taleefanka gacanta oo u dir lacagta isla markiiba.',
      senderPhone: 'LAMBARKAAGA (BIXIYAHA)',
      recipientPhone: 'LAMBARKA QAATAHA',
      provider: 'XULO SHIRKADDA LACAGTA',
      amount: 'LACAGTA LA DIRAYO ($)',
      cardCost: 'Qiimaha Kaarka:',
      total: 'Wadarta Guud:',
      buttonText: (val: number) => `Bixi $${val} iyo Dir`,
      alert: 'Codsiga xawilaada waa la diray!',
    },
    en: {
      title: 'Complete Your Hadiyad',
      subtitle: 'Pay via mobile money and send funds instantly.',
      senderPhone: 'YOUR PHONE NUMBER (SENDER)',
      recipientPhone: 'RECIPIENT PHONE NUMBER',
      provider: 'SELECT PROVIDER',
      amount: 'TRANSFER AMOUNT ($)',
      cardCost: 'Card Fee:',
      total: 'Total:',
      buttonText: (val: number) => `Pay $${val} & Send`,
      alert: 'Transfer request sent!',
    },
  };

  const t = content[lang as 'so' | 'en'] || content.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-black text-gray-900">{t.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{t.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
          
          {/* Sender Phone */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              {t.senderPhone}
            </label>
            <input
              type="text"
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              placeholder="25263XXXXXXX"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 text-gray-900 font-medium"
            />
          </div>

          {/* Recipient Phone */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              {t.recipientPhone}
            </label>
            <input
              type="text"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              placeholder="25263XXXXXXX"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 text-gray-900 font-medium"
            />
          </div>

          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              {t.provider}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProvider('zaad')}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition ${
                  provider === 'zaad'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                ZAAD (Telesom)
              </button>
              <button
                type="button"
                onClick={() => setProvider('edahab')}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition ${
                  provider === 'edahab'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                E-Dahab (Somafone)
              </button>
            </div>
          </div>

          {/* Transfer Amount */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              {t.amount}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 text-gray-900 font-medium"
            />
          </div>

          {/* Cost breakdown */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col gap-2 text-xs text-gray-600 mt-2">
            <div className="flex justify-between">
              <span>{t.cardCost}</span>
              <span className="font-semibold text-gray-900">${cardPrice}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-bold text-gray-900">
              <span>{t.total}</span>
              <span>${total}</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => {
              alert(t.alert);
              onClose();
            }}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl transition duration-200 mt-2 text-sm flex items-center justify-center gap-2"
          >
            <span>{t.buttonText(total)}</span>
          </button>

        </div>
      </div>
    </div>
  );
}