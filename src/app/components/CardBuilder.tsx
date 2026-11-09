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
  
  const langKey = (currentLanguage === 'so' ? 'so' : 'en') as 'so' | 'en';

  const [recipientName, setRecipientName] = useState(
    selectedCard.defaultRecipient[langKey] || selectedCard.defaultRecipient['en']
  );
  const [senderName, setSenderName] = useState(
    selectedCard.defaultSender[langKey] || selectedCard.defaultSender['en']
  );
  const [message, setMessage] = useState(
    selectedCard.defaultMessage[langKey] || selectedCard.defaultMessage['en']
  );
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageScale, setImageScale] = useState<number>(1);
  const [imagePos, setImagePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const newFiltered = cardOptions.filter((c) => c.category === activeDeck);
    if (newFiltered.length > 0) {
      setSelectedCard(newFiltered[0]);
    }
  }, [activeDeck]);

  useEffect(() => {
    setRecipientName(selectedCard.defaultRecipient[langKey] || selectedCard.defaultRecipient['en']);
    setSenderName(selectedCard.defaultSender[langKey] || selectedCard.defaultSender['en']);
    setMessage(selectedCard.defaultMessage[langKey] || selectedCard.defaultMessage['en']);
  }, [selectedCard, langKey]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setImageScale(1);
        setImagePos({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImageScale(1);
    setImagePos({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.1 : -0.1;
    setImageScale((prev) => Math.min(Math.max(0.5, prev + zoomFactor), 3));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - imagePos.x, y: e.clientY - imagePos.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setImagePos({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleShare = async () => {
    const payload = {
      c: selectedCard.id,
      t: recipientName,
      f: senderName,
      m: message,
    };

    try {
      const jsonStr = JSON.stringify(payload);
      const encoded = btoa(encodeURIComponent(jsonStr));

      const baseUrl = window.location.origin + window.location.pathname;
      const shareUrl = `${baseUrl}?data=${encoded}&lang=${currentLanguage}`;
      
      const shareTitle = currentLanguage === 'so' ? 'HadiyadPay Kaarka Salaanta' : 'HadiyadPay E-Card';
      const shareText = currentLanguage === 'so'
        ? `Waa lagusoo diray HadiyadPay kaar gaar ah oo ku socota ${recipientName}! 🎁 Riix halkan si aad u aragto kaarkaaga:`
        : `You've received a special HadiyadPay e-card for ${recipientName}! 🎁 Click here to view your card:`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareUrl,
          });
          return;
        } catch (err) {
          console.log('Delen geannuleerd', err);
        }
      }

      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert(currentLanguage === 'so' ? 'Linkiga waxaa la guuriyey klembord-ka! 📋' : 'Link copied to clipboard! 📋');
    } catch (e) {
      console.error('Fout bij genereren share link', e);
      alert('Kon de link niet genereren.');
    }
  };

  const handleDownload = () => {
    alert(currentLanguage === 'so' ? 'Kaarka waa la keydiyey! 📥' : 'Card saved successfully! 📥');
  };

  const getCardStyle = (card: CardOption) => {
    if (card.bgImage) {
      return {
        backgroundImage: `linear-gradient(to bottom, rgba(7,9,14,0.4), rgba(7,9,14,0.85)), url(${card.bgImage})`,
        backgroundColor: '#0c1017',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return {
      background: card.gradient || 'linear-gradient(135deg, #1e1b4b 0%, #064e3b 100%)'
    };
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      
      {/* Hallmark Category Selector Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="inline-flex bg-[#0d121f]/90 p-1.5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
          <button
            onClick={() => setActiveDeck('dhaqan')}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeDeck === 'dhaqan'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/25 scale-[1.02]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            ✨ Dhaqan Collection ({cardOptions.filter(c => c.category === 'dhaqan').length})
          </button>
          <button
            onClick={() => setActiveDeck('cities')}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeDeck === 'cities'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            🌍 Geel iyo Guri Vibes ({cardOptions.filter(c => c.category === 'cities').length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Hallmark E-Card Visual Gallery & Personalization Form */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Card Gallery Grid */}
          <div className="bg-[#0d121f]/80 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  {currentLanguage === 'so' ? '1. Xulo Naqshadda Kaarka 🎨' : '1. Choose E-Card Design 🎨'}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {currentLanguage === 'so' ? 'Riix kaarka aad rabto si aad u eegto' : 'Tap any card below to preview & customize'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredCards.map((card) => {
                const isSelected = selectedCard.id === card.id;
                
                return (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    className={`text-left p-4 rounded-2xl transition-all duration-300 border relative overflow-hidden flex flex-col justify-between h-40 shadow-xl group cursor-pointer ${
                      isSelected 
                        ? 'ring-2 ring-amber-400 border-amber-400 scale-[1.03] shadow-amber-500/20 shadow-2xl z-10' 
                        : 'border-white/10 opacity-70 hover:opacity-100 hover:scale-[1.02] bg-black/40'
                    }`}
                    style={getCardStyle(card)}
                  >
                    <div className="flex justify-between items-start z-10">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/30">
                        {card.badge[langKey] || card.badge['en']}
                      </span>
                      {isSelected && <span className="text-amber-400 text-xs">✓</span>}
                    </div>
                    <span className="text-sm font-extrabold text-white leading-snug drop-shadow-md z-10">
                      {card.title[langKey] || card.title['en']}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Form Panel */}
          <div className="bg-[#0d121f]/80 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-5">
            <h2 className="text-xl font-black text-white tracking-tight">
              {currentLanguage === 'so' ? '2. Geli Fariintaada ✍️' : '2. Personalize Your Card ✍️'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                  {currentLanguage === 'so' ? 'MAGACA QAATAHA (TO)' : 'RECIPIENT NAME (TO)'}
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white bg-black/40 font-medium placeholder-gray-600 shadow-inner"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                  {currentLanguage === 'so' ? 'MAGACA DIRAHA (FROM)' : 'SENDER NAME (FROM)'}
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white bg-black/40 font-medium placeholder-gray-600 shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                {currentLanguage === 'so' ? 'FARRIINTA WANAAGSAN' : 'PERSONAL MESSAGE'}
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white bg-black/40 font-medium placeholder-gray-600 shadow-inner"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                  {currentLanguage === 'so' ? 'SAWIR GAAR AH (IKHTIYAARI)' : 'ADD PHOTO (OPTIONAL)'}
                </label>
                {uploadedImage && (
                  <button 
                    onClick={handleRemoveImage}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                  >
                    {currentLanguage === 'so' ? 'Tirtir sawirka' : 'Remove photo'}
                  </button>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-xs text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-400/10 file:text-amber-400 hover:file:bg-amber-400/20 cursor-pointer bg-black/40 border border-white/10 rounded-xl"
              />
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-4 px-4 font-black rounded-2xl shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 text-base text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 shadow-amber-500/20 cursor-pointer uppercase tracking-wider mt-2"
            >
              🚀 {currentLanguage === 'so' ? 'Dir Kaarka iyo Hadiyadda (€2.00)' : 'Send E-Card & Gift (€2.00)'}
            </button>
          </div>
        </div>

        {/* Right Side: Showcase Preview Card (Hallmark Visual Style) */}
        <div className="lg:col-span-5 sticky top-8">
          <div className="bg-[#0d121f]/90 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between min-h-[560px]">
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-xs font-black text-gray-400 tracking-widest uppercase">
                  LIVE HALLMARK PREVIEW ✨
                </span>
              </div>
            </div>

            <div 
              className="w-full p-6 sm:p-8 rounded-2xl text-white shadow-2xl flex flex-col justify-between flex-grow my-2 relative overflow-hidden transition-all duration-500 border border-white/15"
              style={getCardStyle(selectedCard)}
            >
              <div className="flex justify-between items-center z-10">
                <span className="text-[10px] tracking-widest uppercase bg-black/60 px-3 py-1 rounded-lg backdrop-blur-md font-black border border-amber-400/30 text-amber-300 shadow">
                  HADIYADPAY • {selectedCard.badge[langKey] || selectedCard.badge['en']}
                </span>
                <span className="text-lg">✨</span>
              </div>

              {uploadedImage && (
                <div 
                  className="my-3 rounded-xl overflow-hidden shadow-2xl h-44 border border-white/20 z-10 relative bg-black/70 cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
                  onWheel={handleWheel}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <img 
                    src={uploadedImage} 
                    alt="Preview" 
                    className="absolute max-w-none pointer-events-none"
                    style={{
                      transform: `translate(${imagePos.x}px, ${imagePos.y}px) scale(${imageScale})`,
                      transformOrigin: 'center center',
                    }}
                  />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-[9px] px-2 py-0.5 rounded text-white/90 pointer-events-none backdrop-blur-md z-20 font-semibold border border-white/10">
                    🔍 Drag & Scroll
                  </div>
                </div>
              )}

              <div className="my-6 z-10">
                <p className="text-[10px] uppercase tracking-widest text-amber-300/90 mb-1 font-bold">
                  {currentLanguage === 'so' ? 'U SOCOTA (TO):' : 'TO:'}
                </p>
                <h3 className="text-2xl sm:text-3xl font-black tracking-wide drop-shadow-xl text-white">
                  {recipientName}
                </h3>
              </div>

              <div className="bg-black/50 backdrop-blur-md p-5 rounded-2xl border border-white/15 my-2 shadow-2xl z-10">
                <p className="text-sm italic font-light leading-relaxed text-gray-100">
                  &ldquo;{message}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex justify-between items-end border-t border-white/15 pt-4 z-10">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                    {currentLanguage === 'so' ? 'KA SOCOTA (FROM):' : 'FROM:'}
                  </p>
                  <p className="text-sm font-black text-amber-300">
                    {senderName}
                  </p>
                </div>
                <span className="text-[10px] font-black tracking-widest bg-white/10 text-amber-300 px-3 py-1 rounded-lg border border-white/10">HADIYADPAY</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={handleDownload}
                className="py-3 px-3 bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-bold rounded-xl transition border border-white/10 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                📥 {currentLanguage === 'so' ? 'Keydi Kaarka' : 'Download Card'}
              </button>
              <button
                onClick={handleShare}
                className="py-3 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/40 cursor-pointer border border-white/20"
              >
                🔗 {currentLanguage === 'so' ? 'La Wadaag' : 'Share Card'}
              </button>
            </div>

          </div>
        </div>

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