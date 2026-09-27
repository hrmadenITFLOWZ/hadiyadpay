'use client';

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

// Helper om telefoonnummers automatisch te formatteren naar 252XXXXXXXXX
function formatPhone(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  if (!cleaned.startsWith('252')) {
    cleaned = '252' + cleaned;
  }
  return cleaned;
}

// Validatie: moet exact 12 cijfers zijn en starten met 252
function isValidPhone(phone: string): boolean {
  const formatted = formatPhone(phone);
  return formatted.length === 12 && formatted.startsWith('252');
}

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
  const [recipientPhone, setRecipientPhone] = useState('');
  const [provider, setProvider] = useState<'zaad' | 'edahab'>('zaad');
  const [transferAmount, setTransferAmount] = useState<number>(20);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const safeOccasion = selectedOccasion || {
    title: 'Hadiyad Card',
    bgGradient: 'from-emerald-600 to-teal-700',
    pattern: '🎁',
  };

  const handleWaaFiPayCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedSender = formatPhone(mobileNumber);
    const formattedRecipient = formatPhone(recipientPhone);

    if (!isValidPhone(formattedSender) || !isValidPhone(formattedRecipient)) {
      alert('Controleer de telefoonnummers. Elk nummer moet na opmaak uit 12 cijfers bestaan en starten met 252.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardTitle: safeOccasion.title,
          cardPrice: cardPrice,
          transferAmount: transferAmount,
          recipientPhone: formattedRecipient,
          senderPhone: formattedSender,
          provider: provider === 'zaad' ? 'MW_ZAAD' : 'MW_EDAHAB',
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(data.message);
        onClose();
      } else {
        alert('Fout: ' + (data.error || 'Er ging iets mis'));
      }
    } catch (err) {
      console.error(err);
      alert('Er is een netwerkfout opgetreden.');
    } finally {
      setLoading(false);
    }
  };

  // Helper voor dynamische randkleur (rood/groen)
  const getInputClass = (val: string) => {
    if (!val) return 'border-gray-300 focus:ring-emerald-500';
    return isValidPhone(val) 
      ? 'border-green-500 ring-1 ring-green-500 bg-green-50/30' 
      : 'border-red-500 ring-1 ring-red-500 bg-red-50/30';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          &times;
        </button>

        <h3 className="text-xl font-bold text-gray-800 mb-1">Voltooi je Hadiyad</h3>
        <p className="text-xs text-gray-500 mb-4">Betaal via mobiel en stuur direct geld mee.</p>

        <form onSubmit={handleWaaFiPayCheckout} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Jouw Telefoonnummer (Betaler)</label>
            <input
              type="text"
              required
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="25263XXXXXXX"
              className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-all ${getInputClass(mobileNumber)}`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Telefoonnummer Ontvanger</label>
            <input
              type="text"
              required
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              placeholder="25263XXXXXXX"
              className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-all ${getInputClass(recipientPhone)}`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Kies Provider</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProvider('zaad')}
                className={`py-2 text-sm font-semibold rounded-lg border ${
                  provider === 'zaad' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-700'
                }`}
              >
                ZAAD (Telesom)
              </button>
              <button
                type="button"
                onClick={() => setProvider('edahab')}
                className={`py-2 text-sm font-semibold rounded-lg border ${
                  provider === 'edahab' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-700'
                }`}
              >
                E-Dahab (Somafone)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Te verzenden bedrag ($)</label>
            <input
              type="number"
              min="1"
              value={transferAmount}
              onChange={(e) => setTransferAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none border-gray-300"
            />
          </div>

          <div className="pt-2 border-t text-xs text-gray-500 flex justify-between">
            <span>Kaartkosten: ${cardPrice}</span>
            <span className="font-bold text-gray-800">Totaal: ${cardPrice + Number(transferAmount)}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-md disabled:opacity-50 text-sm"
          >
            {loading ? 'Bezig met verwerken...' : `Betaal $${cardPrice + Number(transferAmount)} & Verstuur`}
          </button>
        </form>
      </div>
    </div>
  );
}