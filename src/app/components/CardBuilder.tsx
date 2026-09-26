'use client';

import { useState } from 'react';
import { OCCASIONS, Occasion } from '../data/cardOptions';
import CheckoutModal from './CheckoutModal';

interface CardBuilderProps {
  currentLanguage?: 'en' | 'nl';
}

export default function CardBuilder({ currentLanguage = 'en' }: CardBuilderProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion>(OCCASIONS[0]);
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  
  const [messages, setMessages] = useState<{ [key: string]: string }>({
    [OCCASIONS[0].id]: OCCASIONS[0].defaultMessage,
  });

  const [amount] = useState<number>(1.99);

  const currentMessage = messages[selectedOccasion.id] ?? selectedOccasion.defaultMessage;

  const handleSelectOccasion = (occ: Occasion) => {
    setSelectedOccasion(occ);
    if (!messages[occ.id]) {
      setMessages((prev) => ({ ...prev, [occ.id]: occ.defaultMessage }));
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setMessages((prev) => ({ ...prev, [selectedOccasion.id]: val }));
  };

  const handleSend = () => {
    setIsCheckoutOpen(true);
  };

  const t = {
    en: {
      badge: 'Hadiyad & Farxad • Gifts & Joy',
      title: 'Craft Your Hadiyad',
      subtitle: 'Kudar farriin qiiro leh oo lama iloobaan ah. Share love back home instantly.',
      selectOccasion: 'Select Occasion',
      toRecipient: 'To Recipient',
      fromSender: 'From Sender',
      msgLabel: 'Personalized Message',
      previewTitle: 'Hadiyad & Joy E-Card Preview',
      toLabel: 'To:',
      fromLabel: 'From:',
      sendBtn: 'Send Hadiyad & Instant Transfer 🚀',
      disclaimer: 'Secure financial transfers handled in partnership with licensed payment operators.',
    },
    nl: {
      badge: 'Hadiyad & Farxad • Cadeaus & Vreugde',
      title: 'Ontwerp je Hadiyad',
      subtitle: 'Kudar farriin qiiro leh oo lama iloobaan ah. Deel direct liefde met huis.',
      selectOccasion: 'Kies Gelegenheid',
      toRecipient: 'Aan Ontvanger',
      fromSender: 'Van Afzender',
      msgLabel: 'Gepersonaliseerd Bericht',
      previewTitle: 'Hadiyad & Joy E-Card Preview',
      toLabel: 'Aan:',
      fromLabel: 'Van:',
      sendBtn: 'Verstuur Hadiyad & Directe Overboeking 🚀',
      disclaimer: 'Veilige financiële overdrachten in samenwerking met gelicentieerde betalingspartners.',
    },
  };

  const ct = t[currentLanguage] || t.en;

  return (
    <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-6 bg-white/80 backdrop-blur-xl p-7 rounded-3xl shadow-2xl border border-emerald-50/50 space-y-6 text-gray-900">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            {ct.badge}
          </span>
          <h2 className="text-2xl font-black mt-2 mb-1 tracking-tight">{ct.title}</h2>
          <p className="text-sm text-gray-600 font-medium">{ct.subtitle}</p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            {ct.selectOccasion}
          </label>
          <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin">
            {OCCASIONS.map((occ) => {
              const isSelected = selectedOccasion.id === occ.id;
              return (
                <div
                  key={occ.id}
                  onClick={() => handleSelectOccasion(occ)}
                  className={`min-w-[150px] flex-shrink-0 cursor-pointer rounded-2xl p-4 text-white bg-gradient-to-br ${occ.bgGradient} transition-all transform hover:-translate-y-1 shadow-md flex flex-col justify-between ${
                    isSelected ? 'ring-4 ring-emerald-500 ring-offset-2 scale-102 shadow-xl' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-2xl">{occ.pattern}</span>
                  </div>
                  <div className="mt-5">
                    <p className="text-[10px] uppercase tracking-wider text-white/90 font-bold">{occ.category}</p>
                    <p className="text-xs font-black truncate">{occ.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              {ct.toRecipient}
            </label>
            <input
              type="text"
              placeholder="e.g. Hooyo Macaan"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition font-medium text-gray-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              {ct.fromSender}
            </label>
            <input
              type="text"
              placeholder="e.g. Wiilkaada / Gabadhaada"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition font-medium text-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            {ct.msgLabel}
          </label>
          <textarea
            rows={4}
            value={currentMessage}
            onChange={handleMessageChange}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm leading-relaxed transition font-medium text-gray-900"
          />
        </div>

        <button
          type="button"
          onClick={handleSend}
          className={`w-full py-4 bg-gradient-to-br ${selectedOccasion.bgGradient} text-white font-bold rounded-2xl shadow-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer`}
        >
          <span>{ct.sendBtn}</span>
        </button>

        <p className="text-[11px] text-center text-gray-500 font-medium mt-2">
          {ct.disclaimer}
        </p>
      </div>

      <div className="lg:col-span-6 sticky top-8">
        <div className="bg-white/80 backdrop-blur-xl p-7 rounded-3xl shadow-2xl border border-emerald-50/50 flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-gray-600">
              {ct.previewTitle}
            </span>
          </div>

          <div className={`w-full max-w-md rounded-3xl p-8 text-white bg-gradient-to-br ${selectedOccasion.bgGradient} shadow-2xl relative overflow-hidden ring-1 ring-white/20`}>
            <div className="absolute -right-6 -bottom-8 text-9xl opacity-10 select-none pointer-events-none font-black">
              {selectedOccasion.pattern}
            </div>

            <div className="flex justify-between items-center mb-8 relative z-10">
              <span className="text-[10px] uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full font-extrabold border border-white/10">
                HadiyadPay • Salaam
              </span>
              <span className="text-xl font-black tracking-tighter opacity-90 drop-shadow">HADIYAD</span>
            </div>

            <div className="mb-6 relative z-10">
              <p className="text-[11px] text-white/70 uppercase tracking-widest font-semibold">{ct.toLabel}</p>
              <h3 className="text-2xl font-black tracking-tight truncate drop-shadow-sm">
                {recipientName || '[Recipient Name]'}
              </h3>
            </div>

            <div className="my-6 bg-black/10 backdrop-blur-xl p-5 rounded-2xl border border-white/15 relative z-10 min-h-[120px] flex items-center shadow-inner">
              <p className="text-base italic font-light leading-relaxed text-white/95">
                "{currentMessage || 'Your message will appear here...'}"
              </p>
            </div>

            <div className="flex justify-between items-end pt-4 border-t border-white/20 relative z-10">
              <div>
                <p className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">{ct.fromLabel}</p>
                <p className="font-bold text-sm truncate max-w-[200px] text-white">
                  {senderName || '[Sender Name]'}
                </p>
              </div>
              <div className="text-right text-[10px] font-bold text-white/60 tracking-widest uppercase">
                Made with ❤️
              </div>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal
        selectedOccasion={selectedOccasion}
        recipientName={recipientName}
        senderName={senderName}
        message={currentMessage}
        cardPrice={amount}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Tailwind safelist helper */}
      <div className="hidden from-emerald-700 via-teal-800 to-green-900 from-rose-600 via-pink-700 to-red-900 from-amber-600 via-orange-700 to-red-900 from-indigo-700 via-purple-800 to-slate-900 from-cyan-600 via-blue-700 to-indigo-900"></div>
    </div>
  );
}