'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cardOptions } from '../data/cardOptions';

interface ReceivedCardModalProps {
  currentLanguage: string;
}

export default function ReceivedCardModal({ currentLanguage }: ReceivedCardModalProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [cardData, setCardData] = useState<{
    to: string;
    from: string;
    msg: string;
    image: string | null;
    imageScale: number;
    imagePos: { x: number; y: number };
    cardObj: any;
  } | null>(null);

  useEffect(() => {
    const cardKey = searchParams.get('card');

    if (cardKey) {
      const savedDataJson = localStorage.getItem(cardKey);
      if (savedDataJson) {
        try {
          const parsed = JSON.parse(savedDataJson);
          const foundCard = cardOptions.find((c) => c.id === parsed.cardId) || cardOptions[0];
          
          setCardData({
            to: parsed.to,
            from: parsed.from,
            msg: parsed.msg,
            image: parsed.image || null,
            imageScale: parsed.imageScale || 1,
            imagePos: parsed.imagePos || { x: 0, y: 0 },
            cardObj: foundCard,
          });
          setIsOpen(true);
        } catch (e) {
          console.error('Fout bij parsen van opgeslagen kaartdata', e);
        }
      }
    }
  }, [searchParams]);

  const handleExploreWebsite = () => {
    setIsOpen(false);
    router.replace('/');
  };

  if (!isOpen || !cardData) return null;

  const getCardStyle = (card: any) => {
    if (card.bgImage) {
      return {
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.85)), url(${card.bgImage})`,
        backgroundColor: '#1f2937',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return {
      background: card.gradient || '#be185d'
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      {/* Kaart modal iets ruimer gemaakt (max-w-xl i.p.v. max-w-lg) voor perfecte weergave */}
      <div className="bg-gray-900 border border-white/10 rounded-3xl p-6 sm:p-10 max-w-xl w-full shadow-2xl flex flex-col items-center relative text-white max-h-[95vh] overflow-y-auto">
        
        {/* Header Badge */}
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 bg-rose-500/20 text-rose-400 text-xs font-bold rounded-full border border-rose-500/30 mb-2 uppercase tracking-widest">
            🎁 HadiyadPay Special Delivery
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {currentLanguage === 'so' ? 'Waa lagusoo diray Hadiyad gaar ah!' : 'You\'ve Received a Special Card!'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            {currentLanguage === 'so' ? 'Riix hoose si aad u dhex gasho ama u abuurto kaarkaaga.' : 'A thoughtful greeting card and surprise have been sent to you.'}
          </p>
        </div>

        {/* De Kaart Weergave */}
        <div 
          className="w-full p-6 sm:p-8 rounded-2xl text-white shadow-2xl flex flex-col justify-between my-2 relative overflow-hidden min-h-[420px] border border-white/20"
          style={getCardStyle(cardData.cardObj)}
        >
          <div className="flex justify-between items-center z-10">
            <span className="text-[10px] tracking-widest uppercase bg-black/40 px-3 py-1 rounded-md backdrop-blur-md font-bold border border-white/20">
              HADIYADPAY • {cardData.cardObj.badge[currentLanguage as 'so' | 'en'] || cardData.cardObj.badge['en']}
            </span>
            <span className="text-lg animate-bounce">✨</span>
          </div>

          <div className="my-4 z-10">
            <p className="text-[10px] uppercase tracking-wider text-white/70 mb-1 font-semibold">
              {currentLanguage === 'so' ? 'MAGACA QAATAHA:' : 'TO:'}
            </p>
            <h3 className="text-2xl sm:text-3xl font-black tracking-wide drop-shadow-md">
              {cardData.to}
            </h3>
          </div>

          {/* Exacte foto kader uit de builder inclusief opgeslagen zoom en positie */}
          {cardData.image && (
            <div className="my-3 rounded-xl overflow-hidden shadow-lg h-44 border border-white/20 z-10 bg-black/50 relative flex items-center justify-center">
              <img 
                src={cardData.image} 
                alt="Personal uploaded" 
                className="absolute max-w-none pointer-events-none"
                style={{
                  transform: `translate(${cardData.imagePos.x}px, ${cardData.imagePos.y}px) scale(${cardData.imageScale})`,
                  transformOrigin: 'center center',
                }}
              />
            </div>
          )}

          <div className="bg-black/40 backdrop-blur-md p-5 rounded-xl border border-white/20 my-2 shadow-inner z-10">
            <p className="text-sm sm:text-base italic font-light leading-relaxed">
              &ldquo;{cardData.msg}&rdquo;
            </p>
          </div>

          <div className="mt-6 flex justify-between items-end border-t border-white/20 pt-4 z-10">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/70 font-semibold">
                {currentLanguage === 'so' ? 'MAGACA DIRAHA:' : 'FROM:'}
              </p>
              <p className="text-sm font-bold">
                {cardData.from}
              </p>
            </div>
            <span className="text-[10px] opacity-90 font-bold bg-white/20 px-2.5 py-1 rounded">HADIYADPAY</span>
          </div>
        </div>

        {/* Actie Knoppen */}
        <div className="mt-6 w-full flex flex-col gap-3">
          <button
            onClick={handleExploreWebsite}
            className="w-full py-4 bg-gradient-to-r from-rose-600 to-orange-600 hover:brightness-110 text-white font-bold text-sm rounded-2xl shadow-xl transition flex items-center justify-center gap-2 border border-white/20 cursor-pointer"
          >
            🚀 {currentLanguage === 'so' ? 'Ka Fiiri Bogga Weyn ee HadiyadPay' : 'Explore HadiyadPay & Send Your Own'}
          </button>
        </div>

      </div>
    </div>
  );
}