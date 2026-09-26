'type client';

import { useState } from 'react';
import { Occasion } from '../data/cardOptions';

interface CheckoutModalProps {
  selectedOccasion?: Occasion;
  recipientName: string;
  senderName: string;
  message: string;
  cardPrice: number;
  isOpen: boolean;
  onClose: () => void;
}

type Language = 'en' | 'nl';

export default function CheckoutModal({
  selectedOccasion,
  recipientName,
  senderName,
  message,
  cardPrice,
  isOpen,
  onClose,
}: CheckoutModalProps) {
  const [lang, setLang] = useState<Language>('en');
  const [mobileNumber, setMobileNumber] = useState('');
  const [provider, setProvider] = useState<'zaad' | 'edahab'>('zaad');
  const [transferAmount, setTransferAmount] = useState<number>(20);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Gebruik de echte geselecteerde kaart, met een veilige fallback voor noodgevallen
  const safeOccasion = selectedOccasion || {
    title: 'Hadiyad Card',
    bgGradient: 'from-emerald-600 to-teal-700',
    pattern: '🎁',
  };

  const t = {
    en: {
      title: 'Send Hadiyad & Money',
      selectedCard: 'SELECTED CARD PREVIEW',
      mobileLabel: 'RECIPIENT MOBILE NUMBER (SOMALILAND/SOMALIA)',
      providerLabel: 'MOBILE PROVIDER',
      amountLabel: 'TRANSFER AMOUNT ($ USD)',
      recipientGets: 'Recipient gets:',
      serviceFee: 'E-card service fee:',
      totalToPay: 'Total to pay (via iDEAL):',
      payBtn: 'Pay Now',
      zaad: 'Telesom ZAAD',
      edahab: 'Somafone eDahab',
    },
    nl: {
      title: 'Verstuur Hadiyad & Geld',
      selectedCard: 'VOORBEELD GEKOZEN KAART',
      mobileLabel: 'TELEFOONNUMMER ONTVANGER (SOMALILAND/SOMALIA)',
      providerLabel: 'MOBIABELE PROVIDER',
      amountLabel: 'OVERBOEKINGSBEDRAG ($ USD)',
      recipientGets: 'Ontvanger ontvangt:',
      serviceFee: 'E-card servicekosten:',
      totalToPay: 'Totaal te betalen (via iDEAL):',
      payBtn: 'Betaal Nu',
      zaad: 'Telesom ZAAD',
      edahab: 'Somafone eDahab',
    },
  };

  const ct = t[lang];
  const totalPayable = (transferAmount + cardPrice).toFixed(2);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardTitle: safeOccasion.title,
          cardPrice,
          mobileNumber,
          provider,
          transferAmount,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 relative text-gray-900 border border-emerald-50 animate-in fade-in zoom-in duration-200">
        
        {/* Sluiten & Taalselectie */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black tracking-tight">{ct.title}</h2>
          
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  lang === 'en' ? 'bg-emerald-600 text-white shadow' : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('nl')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  lang === 'nl' ? 'bg-emerald-600 text-white shadow' : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                NL
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Visuele Weergave Geselecteerde Kaart (Nu dynamisch gekoppeld aan safeOccasion) */}
        <div className="mb-6">
          <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest mb-2">{ct.selectedCard}</p>
          <div className={`w-full rounded-2xl p-5 text-white bg-gradient-to-br ${safeOccasion.bgGradient} shadow-lg relative overflow-hidden`}>
            <div className="absolute -right-4 -bottom-6 text-7xl opacity-10 select-none pointer-events-none font-black">
              {safeOccasion.pattern}
            </div>
            <div className="flex justify-between items-center mb-4 relative z-10">
              <span className="text-[9px] uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full font-extrabold">
                {safeOccasion.title}
              </span>
              <span className="text-sm font-black tracking-tighter opacity-90">HADIYAD</span>
            </div>
            <p className="text-[10px] text-white/70 uppercase font-semibold">To: {recipientName || '[Recipient]'}</p>
            <p className="text-xs italic my-2 text-white/95 truncate">"{message || 'Your message...'}"</p>
            <p className="text-[10px] text-white/70 uppercase font-semibold">From: {senderName || '[Sender]'}</p>
          </div>
        </div>

        {/* Formulier */}
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
              {ct.mobileLabel}
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-4 rounded-l-2xl border border-r-0 border-gray-200 bg-gray-50 text-gray-600 text-xs font-bold">
                +252
              </span>
              <input
                type="text"
                placeholder="63XXXXXXX of 61XXXXXXX"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-r-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
              {ct.providerLabel}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProvider('zaad')}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                  provider === 'zaad'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {ct.zaad}
              </button>
              <button
                type="button"
                onClick={() => setProvider('edahab')}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                  provider === 'edahab'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {ct.edahab}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
              {ct.amountLabel}
            </label>
            <input
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            />
          </div>

          {/* Overzicht kosten */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>{ct.recipientGets}</span>
              <span className="font-bold text-gray-900">${transferAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 border-b border-gray-200 pb-2">
              <span>{ct.serviceFee}</span>
              <span className="font-bold text-gray-900">€{cardPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm pt-1">
              <span className="font-bold text-gray-900">{ct.totalToPay}</span>
              <span className="font-black text-emerald-600 text-base">€{totalPayable}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleCheckout}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Processing...' : `${ct.payBtn} (€${totalPayable}) 🚀`}</span>
          </button>
        </div>

      </div>
    </div>
  );
}