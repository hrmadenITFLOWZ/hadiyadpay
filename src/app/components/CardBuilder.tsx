'use client';

import React, { useState, useEffect } from 'react';
import { cardOptions, CardOption } from '../data/cardOptions';
import CheckoutModal from './CheckoutModal';

interface CardBuilderProps {
  currentLanguage: string;
}

export default function CardBuilder({ currentLanguage }: CardBuilderProps) {
  const [selectedCard, setSelectedCard] = useState<CardOption>(cardOptions[0]);
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  
  const [message, setMessage] = useState(selectedCard.defaultMessage[currentLanguage] || selectedCard.defaultMessage['en']);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    setMessage(selectedCard.defaultMessage[currentLanguage] || selectedCard.defaultMessage['en']);
  }, [selectedCard, currentLanguage]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mx-auto p-4">
      {/* Linkerkolom: Besturing & Selectie */}
      <div className="bg-white/85 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-gray-100 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {currentLanguage === 'so' ? 'Naqshadee Hadiyadadaada ✨' : 'Craft Your Hadiyad ✨'}
          </h2>
          <p className="text-sm text-gray-600">
            {currentLanguage === 'so'
              ? 'Ku dar fariin qiiro leh oo lama ilooban ah. La wadaag jacaylka kuwa aad jeceshahay si degdeg ah.'
              : 'Kudar fariin qiiro leh oo lama ilooban ah. Share love with loved ones instantly.'}
          </p>
        </div>

        {/* Select Occasion */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            {currentLanguage === 'so' ? 'DOORO MUNAASABADA' : 'SELECT OCCASION'}
          </label>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
            {cardOptions.map((card) => {
              const isSelected = selectedCard.id === card.id;
              return (
                <button
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  className={`flex-shrink-0 text-left p-3 rounded-xl transition-all duration-200 border relative overflow-hidden flex flex-col justify-between w-36 h-24 bg-gradient-to-br ${card.gradient} text-white shadow-lg ${
                    isSelected ? 'ring-4 ring-emerald-400 scale-105' : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/30 backdrop-blur-sm self-start">
                    {card.badge[currentLanguage] || card.badge['en']}
                  </span>
                  <span className="text-xs font-semibold line-clamp-2 drop-shadow">
                    {card.title[currentLanguage] || card.title['en']}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Formulier Velden */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                {currentLanguage === 'so' ? 'QAATAHA (TO RECIPIENT)' : 'TO RECIPIENT'}
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Hooyo Macaan 🌸"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                {currentLanguage === 'so' ? 'DIRQAHA (FROM SENDER)' : 'FROM SENDER'}
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Wiilkaada / Gabadhada ✨"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              {currentLanguage === 'so' ? 'FARRIINTA GAARKA AH' : 'PERSONALIZED MESSAGE'}
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-gray-50"
            />
          </div>

          <button
            onClick={() => setIsCheckoutOpen(true)}
            className={`w-full py-3.5 px-4 bg-gradient-to-br ${selectedCard.gradient} hover:brightness-110 text-white font-semibold rounded-xl shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm`}
          >
            <span>🚀 {currentLanguage === 'so' ? 'Dir Hadiyad & Xawilaad Degdeg ah' : 'Send Hadiyad & Instant Transfer'}</span>
          </button>
        </div>
      </div>

      {/* Rechterkolom: Live Preview */}
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 flex flex-col justify-between min-h-[420px] relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">
                HADIYAD & JOY E-CARD PREVIEW 🎨
              </span>
            </div>
          </div>

          <div className={`w-full p-6 rounded-2xl bg-gradient-to-br ${selectedCard.gradient} text-white shadow-2xl flex flex-col justify-between flex-grow my-2 transition-all duration-500`}>
            <div className="flex justify-between items-center">
              <span className="text-[10px] tracking-widest uppercase bg-white/25 px-2.5 py-1 rounded-md backdrop-blur-sm font-bold shadow-sm">
                HADIYADPAY • {selectedCard.badge[currentLanguage] || selectedCard.badge['en']}
              </span>
              <span className="text-sm opacity-90">✨💖</span>
            </div>

            <div className="my-6">
              <p className="text-[11px] uppercase tracking-wider opacity-75 mb-1">
                {currentLanguage === 'so' ? 'KU SOO COCTA (TO):' : 'TO:'}
              </p>
              <h3 className="text-lg font-bold tracking-wide drop-shadow">
                {recipientName ? recipientName : 'Hooyo Macaan 🌸'}
              </h3>
            </div>

            <div className="bg-black/25 backdrop-blur-md p-4 rounded-xl border border-white/15 my-2 shadow-inner">
              <p className="text-sm italic font-light leading-relaxed">
                &ldquo;{message}&rdquo;
              </p>
            </div>

            <div className="mt-6 flex justify-between items-end border-t border-white/20 pt-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider opacity-75">
                  {currentLanguage === 'so' ? 'KA SOO DIRAY (FROM):' : 'FROM:'}
                </p>
                <p className="text-xs font-bold">
                  {senderName ? senderName : 'Wiilkaada / Gabadhada ✨'}
                </p>
              </div>
              <span className="text-[10px] opacity-80 font-medium">MADE WITH ❤️</span>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-[11px] text-gray-400">
              {currentLanguage === 'so'
                ? 'Xawilaadaha lacagta ee nabdoon waxaa lagu fuliyaa iyadoo la kaashanaysa shirkado bixiye oo sharciaysan.'
                : 'Secure financial transfers handled in partnership with licensed payment operators.'}
            </p>
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
        initialLanguage={currentLanguage === 'so' ? 'so' : 'en'}
      />
    </div>
  );
}