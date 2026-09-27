'use client';

import React, { useState, useEffect } from 'react';
import { cardOptions, CardOption } from '../data/cardOptions';
import CheckoutModal from './CheckoutModal';

interface CardBuilderProps {
  currentLanguage: string;
}

export default function CardBuilder({ currentLanguage }: CardBuilderProps) {
  const [activeDeck, setActiveDeck] = useState<'dhaqan' | 'cities'>('dhaqan');
  const filteredCards = cardOptions.filter((card) => card.category === activeDeck);

  const [selectedCard, setSelectedCard] = useState<CardOption>(filteredCards[0]);
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState(selectedCard.defaultMessage[currentLanguage as 'so' | 'en'] || selectedCard.defaultMessage['en']);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const newFiltered = cardOptions.filter((c) => c.category === activeDeck);
    setSelectedCard(newFiltered[0]);
  }, [activeDeck]);

  useEffect(() => {
    setMessage(selectedCard.defaultMessage[currentLanguage as 'so' | 'en'] || selectedCard.defaultMessage['en']);
  }, [selectedCard, currentLanguage]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HadiyadPay E-Card',
          text: `E-card ku socota ${recipientName || 'Qaataha'}: "${message}"`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      alert(currentLanguage === 'so' ? 'Linkiga waa la guuriyey!' : 'Link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    alert(currentLanguage === 'so' ? 'Kaarka waa la keydiyey!' : 'Card saved successfully!');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-4">
      
      {/* Deck Switcher Knoppen */}
      <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-md border border-gray-100 flex gap-2 max-w-md mx-auto w-full">
        <button
          onClick={() => setActiveDeck('dhaqan')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeDeck === 'dhaqan'
              ? 'bg-rose-600 text-white shadow-lg scale-[1.02]'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ✨ Dhaqan Vibes ({cardOptions.filter(c => c.category === 'dhaqan').length})
        </button>
        <button
          onClick={() => setActiveDeck('cities')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeDeck === 'cities'
              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white shadow-lg scale-[1.02] ring-2 ring-amber-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🌍 Geel iyo Guri Vibes ({cardOptions.filter(c => c.category === 'cities').length})
        </button>
      </div>

      {/* Hoofdgrid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        
        {/* Linkerkolom: Besturing & Kaartselectie */}
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-gray-100 flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">
              {currentLanguage === 'so' ? 'Naqshadee Hadiyadadaada ✨' : 'Craft Your Hadiyad ✨'}
            </h2>
            <p className="text-sm text-gray-600">
              {currentLanguage === 'so'
                ? 'Xulo qaabka kaarka, ku dar fariin qiiro leh oo u dir si degdeg ah.'
                : 'Choose a card style, add a heartfelt message, and send instantly.'}
            </p>
          </div>

          {/* Catalogus Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
              {currentLanguage === 'so' ? 'XULO KAARKA WANAAGSAN' : 'CHOOSE YOUR CARD STYLE'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[340px] overflow-y-auto pr-1">
              {filteredCards.map((card) => {
                const isSelected = selectedCard.id === card.id;
                
                return (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    className={`text-left p-3 rounded-2xl transition-all duration-300 border relative overflow-hidden flex flex-col justify-between h-32 shadow-md group ${
                      isSelected ? 'ring-4 ring-emerald-500 scale-105 shadow-xl z-10' : 'opacity-90 hover:opacity-100 hover:scale-[1.02]'
                    }`}
                    style={{ background: card.gradient }}
                  >
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white/30 backdrop-blur-md text-white self-start shadow z-10">
                      {card.badge[currentLanguage as 'so' | 'en'] || card.badge['en']}
                    </span>
                    <span className="text-xs font-bold text-white line-clamp-2 drop-shadow-md z-10">
                      {card.title[currentLanguage as 'so' | 'en'] || card.title['en']}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Velden */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {currentLanguage === 'so' ? 'MAGACA QAATAHA' : 'RECIPIENT NAME'}
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Hooyo Macaan 🌸"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-gray-50 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {currentLanguage === 'so' ? 'MAGACA DIRAHA' : 'SENDER NAME'}
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Wiilkaada / Gabadhada ✨"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-gray-50 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {currentLanguage === 'so' ? 'FARRIINTA GAARKA AH' : 'PERSONALIZED MESSAGE'}
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-gray-50 font-medium"
              />
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-4 px-4 font-bold rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-base text-white hover:brightness-110 border border-white/20"
              style={{ background: selectedCard.gradient }}
            >
              <span>🚀 {currentLanguage === 'so' ? 'Dir Hadiyad iyo Xawilaad Degdeg ah' : 'Send Hadiyad & Instant Transfer'}</span>
            </button>
          </div>
        </div>

        {/* Rechterkolom: Live Preview Weergave */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 flex flex-col justify-between min-h-[500px] relative overflow-hidden">
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-gray-500 tracking-wider uppercase">
                  LIVE E-CARD PREVIEW 🎨
                </span>
              </div>
            </div>

            {/* Visuele Kaart met Stralende Gradiënt */}
            <div 
              className="w-full p-6 rounded-2xl text-white shadow-2xl flex flex-col justify-between flex-grow my-2 relative overflow-hidden transition-all duration-500"
              style={{ background: selectedCard.gradient }}
            >
              <div className="flex justify-between items-center z-10">
                <span className="text-[10px] tracking-widest uppercase bg-black/20 px-3 py-1 rounded-md backdrop-blur-md font-bold border border-white/20">
                  HADIYADPAY • {selectedCard.badge[currentLanguage as 'so' | 'en'] || selectedCard.badge['en']}
                </span>
                <span className="text-base animate-bounce">✨</span>
              </div>

              <div className="my-6 z-10">
                <p className="text-[10px] uppercase tracking-wider opacity-90 mb-1 font-semibold">
                  {currentLanguage === 'so' ? 'MAGACA QAATAHA:' : 'TO:'}
                </p>
                <h3 className="text-xl font-black tracking-wide drop-shadow-md">
                  {recipientName ? recipientName : 'Hooyo Macaan 🌸'}
                </h3>
              </div>

              <div className="bg-black/20 backdrop-blur-md p-4 rounded-xl border border-white/20 my-2 shadow-inner z-10">
                <p className="text-sm italic font-light leading-relaxed">
                  &ldquo;{message}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex justify-between items-end border-t border-white/20 pt-3 z-10">
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-90 font-semibold">
                    {currentLanguage === 'so' ? 'MAGACA DIRAHA:' : 'FROM:'}
                  </p>
                  <p className="text-xs font-bold">
                    {senderName ? senderName : 'Wiilkaada / Gabadhada ✨'}
                  </p>
                </div>
                <span className="text-[10px] opacity-90 font-bold bg-white/20 px-2 py-0.5 rounded">HADIYADPAY</span>
              </div>
            </div>

            {/* Download & Share Knoppen */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={handleDownload}
                className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                📥 {currentLanguage === 'so' ? 'Soo Degso Kaarka' : 'Download Card'}
              </button>
              <button
                onClick={handleShare}
                className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                🔗 {currentLanguage === 'so' ? 'La Wadaag' : 'Share Card'}
              </button>
            </div>

          </div>
        </div>

        {/* Checkout Modal Popup */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          selectedOccasion={selectedCard}
          recipientName={recipientName}
          senderName={senderName}
          message={message}
          cardPrice={10}
          initialLanguage={currentLanguage}
        />
      </div>
    </div>
  );
}