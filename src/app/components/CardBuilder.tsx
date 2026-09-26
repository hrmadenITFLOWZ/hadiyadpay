'use client';

import React, { useState } from 'react';
import { cardOptions, CardOption } from '../data/cardOptions';

interface CardBuilderProps {
  currentLanguage: string;
}

export default function CardBuilder({ currentLanguage }: CardBuilderProps) {
  const [selectedCard, setSelectedCard] = useState<CardOption>(cardOptions[0]);
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState(
    currentLanguage === 'nl'
      ? 'Dhalasho Wacan! 🌸 Waxaan kuu rajeynaysaa caafimaad, barako, iyo sannad ay ka buuxaan farxad iyo guul weyn. 💐✨'
      : 'Happy Birthday! Wishing you health, blessings, and a year full of joy and great success.'
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mx-auto p-4">
      {/* Linkerkolom: Besturing & Selectie */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {currentLanguage === 'nl' ? 'Kies jouw Hadiyad E-card' : 'Choose Your Hadiyad E-Card'}
          </h2>
          <p className="text-sm text-gray-600">
            {currentLanguage === 'nl'
              ? 'Selecteer een gratis of premium stijlvolle kaart voor jouw moment.'
              : 'Select a free or premium stylish card for your moment.'}
          </p>
        </div>

        {/* Kaartopties Knoppen / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
          {cardOptions.map((card) => {
            const isSelected = selectedCard.id === card.id;
            return (
              <button
                key={card.id}
                onClick={() => setSelectedCard(card)}
                className={`text-left p-3 rounded-xl transition-all duration-200 border relative overflow-hidden flex flex-col justify-between h-24 bg-gradient-to-r ${card.gradient} text-white shadow-md ${
                  isSelected ? 'ring-4 ring-emerald-500 scale-[1.02]' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm tracking-wider uppercase">
                    {card.badge[currentLanguage] || card.badge['en']}
                  </span>
                </div>
                <span className="text-xs font-semibold line-clamp-2 drop-shadow">
                  {card.title[currentLanguage] || card.title['en']}
                </span>
              </button>
            );
          })}
        </div>

        {/* Formulier Velden */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                {currentLanguage === 'nl' ? 'Ontvanger' : 'To Recipient'}
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder={currentLanguage === 'nl' ? 'bijv. Hooyo Macaan' : 'e.g. Dear Mother'}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                {currentLanguage === 'nl' ? 'Afzender' : 'From Sender'}
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder={currentLanguage === 'nl' ? 'bijv. Wiilkaada' : 'e.g. Your Son'}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              {currentLanguage === 'nl' ? 'Persoonlijk Bericht' : 'Personalized Message'}
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-gray-50"
            />
          </div>

          <button
            onClick={() => alert(currentLanguage === 'nl' ? 'Klaar voor betaalintegratie!' : 'Ready for payment integration!')}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white font-medium rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            <span>{currentLanguage === 'nl' ? 'Verstuur Hadiyad & Instant Transfer 🚀' : 'Send Hadiyad & Instant Transfer 🚀'}</span>
          </button>
        </div>
      </div>

      {/* Rechterkolom: Live Preview */}
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 flex flex-col justify-between min-h-[420px] relative overflow-hidden">
          {/* Decoratieve top-bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">
                Hadiyad & Joy Preview
              </span>
            </div>
            {!selectedCard.isFree && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {selectedCard.badge[currentLanguage] || selectedCard.badge['en']}
              </span>
            )}
          </div>

          {/* De E-card zelf met de geselecteerde gradient */}
          <div className={`w-full p-6 rounded-2xl bg-gradient-to-br ${selectedCard.gradient} text-white shadow-xl flex flex-col justify-between flex-grow my-2 transition-all duration-500`}>
            <div className="flex justify-between items-center">
              <span className="text-[10px] tracking-widest uppercase bg-white/20 px-2.5 py-1 rounded-md backdrop-blur-sm font-bold">
                HadiyadPay • E-Card
              </span>
              <span className="text-xs opacity-80">✨</span>
            </div>

            <div className="my-6">
              <p className="text-[11px] uppercase tracking-wider opacity-75 mb-1">
                {currentLanguage === 'nl' ? 'Aan:' : 'To:'}
              </p>
              <h3 className="text-lg font-bold tracking-wide drop-shadow">
                {recipientName ? recipientName : '[Recipient Name]'}
              </h3>
            </div>

            <div className="bg-black/20 backdrop-blur-md p-4 rounded-xl border border-white/10 my-2">
              <p className="text-sm italic font-light leading-relaxed">
                &ldquo;{message}&rdquo;
              </p>
            </div>

            <div className="mt-6 flex justify-between items-end border-t border-white/10 pt-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider opacity-75">
                  {currentLanguage === 'nl' ? 'Van:' : 'From:'}
                </p>
                <p className="text-xs font-bold">
                  {senderName ? senderName : '[Sender Name]'}
                </p>
              </div>
              <span className="text-[10px] opacity-75">MADE WITH ❤️</span>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-[11px] text-gray-400">
              {currentLanguage === 'nl'
                ? 'Veilige financiële overboeking gekoppeld aan jouw e-card.'
                : 'Secure financial transfer linked to your e-card.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}