'use client';

import React, { useState, useEffect } from 'react';
import { cardOptions } from '../data/cardOptions';

interface ReceivedCardModalProps {
  currentLanguage: string;
}

export default function ReceivedCardModal({ currentLanguage: parentLanguage }: ReceivedCardModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cardData, setCardData] = useState<any>(null);
  const [cardLanguage, setCardLanguage] = useState<string>('so');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');
    const langParam = params.get('lang');

    if (langParam) {
      setCardLanguage(langParam);
    }

    if (dataParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(dataParam));
        setCardData(parsed);
        setIsOpen(true);
      } catch (e) {
        console.error('Fout bij decoderen kaartdata', e);
      }
    }
  }, []);

  if (!isOpen || !cardData) return null;

  const selectedCardOption = cardOptions.find((c) => c.id === cardData.card) || cardOptions[0];
  const langKey = (cardLanguage === 'so' ? 'so' : 'en') as 'so' | 'en';

  const getCardStyle = () => {
    if (selectedCardOption.bgImage) {
      return {
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.8)), url(${selectedCardOption.bgImage})`,
        backgroundColor: '#1f2937',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return {
      background: selectedCardOption.gradient || '#be185d',
    };
  };

  const handleClose = () => {
    setIsOpen(false);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-gray-900 border border-white/10 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center mb-6 mt-2">
          <span className="text-[10px] uppercase font-bold tracking-widest bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-full">
            {cardLanguage === 'so' ? '🎁 HADIYADPAY FARIIN GAAR AH' : '🎁 HADIYADPAY SPECIAL MESSAGE'}
          </span>
          <h2 className="text-2xl font-black text-white mt-3">
            {cardLanguage === 'so' ? 'Waa lagusoo diray Kaar Gaar ah!' : 'A Special Card Was Sent To You!'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {cardLanguage === 'so' 
              ? 'Kaar salaan iyo layaab leh ayaa lagusoo hagaajiyay.' 
              : 'A thoughtful greeting card has been delivered for you.'}
          </p>
        </div>

        <div 
          className="w-full p-6 rounded-2xl text-white shadow-2xl flex flex-col justify-between relative overflow-hidden min-h-[340px]"
          style={getCardStyle()}
        >
          <div className="flex justify-between items-center z-10">
            <span className="text-[10px] tracking-widest uppercase bg-black/30 px-3 py-1 rounded-md backdrop-blur-md font-bold border border-white/20">
              HADIYADPAY • {selectedCardOption.badge[langKey] || selectedCardOption.badge['en']}
            </span>
            <span className="text-base animate-bounce">✨</span>
          </div>

          <div className="my-3 z-10">
            <p className="text-[10px] uppercase tracking-wider opacity-90 mb-1 font-semibold">
              {cardLanguage === 'so' ? 'MAGACA QAATAHA:' : 'RECIPIENT:'}
            </p>
            <h3 className="text-xl font-black tracking-wide drop-shadow-md">
              {cardData.to}
            </h3>
          </div>

          <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/20 my-2 shadow-inner z-10">
            <p className="text-sm italic font-light leading-relaxed">
              &ldquo;{cardData.msg}&rdquo;
            </p>
          </div>

          <div className="mt-4 flex justify-between items-end border-t border-white/20 pt-3 z-10">
            <div>
              <p className="text-[10px] uppercase tracking-wider opacity-90 font-semibold">
                {cardLanguage === 'so' ? 'MAGACA DIRAHA:' : 'SENDER:'}
              </p>
              <p className="text-xs font-bold">
                {cardData.from}
              </p>
            </div>
            <span className="text-[10px] opacity-90 font-bold bg-white/20 px-2 py-0.5 rounded">HADIYADPAY</span>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="w-full mt-5 py-3.5 px-4 font-bold rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm text-white bg-gradient-to-r from-rose-600 to-orange-600 hover:brightness-110 cursor-pointer"
        >
          <span>{cardLanguage === 'so' ? '🚀 Abuur Kaarkaaga Xiga / Adeegso HadiyadPay' : '🚀 Create Your Own Card / Use HadiyadPay'}</span>
        </button>

      </div>
    </div>
  );
}