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
    const cardDataToSave = {
      cardId: selectedCard.id,
      to: recipientName,
      from: senderName,
      msg: message,
      image: uploadedImage,
      imageScale: imageScale,
      imagePos: imagePos,
    };

    try {
      // Zet de data om naar JSON en comprimeer/encodeer het zodat het veilig in de URL past
      const jsonString = JSON.stringify(cardDataToSave);
      const encodedData = btoa(encodeURIComponent(jsonString));

      const baseUrl = window.location.origin + window.location.pathname;
      const shareUrl = `${baseUrl}?data=${encodedData}&lang=${currentLanguage}`;
      
      const shareTitle = langKey === 'so' ? 'HadiyadPay Kaarka Salaanta' : 'HadiyadPay E-Card';
      const shareText = langKey === 'so'
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
      alert(
        langKey === 'so'
          ? 'Linkiga waxaa la guuriyey klembord-ka!'
          : 'Link copied to clipboard!'
      );
    } catch (e) {
      console.error('Fout bij genereren share link', e);
      alert('Kon de link niet genereren. Mogelijk is de afbeelding te groot.');
    }
  };

  const handleDownload = () => {
    alert(langKey === 'so' ? 'Kaarka waa la keydiyey!' : 'Card saved successfully!');
  };

  const getCardStyle = (card: CardOption) => {
    if (card.bgImage) {
      return {
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.8)), url(${card.bgImage})`,
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
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-4">
      
      <div className="bg-white/85 backdrop-blur-md p-2 rounded-2xl shadow-md border border-gray-100 flex gap-2 max-w-md mx-auto w-full">
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
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg scale-[1.02] ring-2 ring-amber-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🌍 Geel iyo Guri Vibes ({cardOptions.filter(c => c.category === 'cities').length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-gray-100 flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">
              {langKey === 'so' ? 'Naqshadee Hadiyadadaada ✨' : 'Craft Your Hadiyad ✨'}
            </h2>
            <p className="text-sm text-gray-600">
              {langKey === 'so'
                ? 'Xulo qaabka kaarka, ku dar fariin qiiro leh oo u dir si degdeg ah.'
                : 'Choose a card style, add a heartfelt message, and send instantly.'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
              {langKey === 'so' ? 'XULO KAARKA WANAAGSAN' : 'CHOOSE YOUR CARD STYLE'}
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
                    style={getCardStyle(card)}
                  >
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-black/30 backdrop-blur-md text-white self-start shadow z-10">
                      {card.badge[langKey] || card.badge['en']}
                    </span>
                    <span className="text-xs font-bold text-white line-clamp-2 drop-shadow-md z-10">
                      {card.title[langKey] || card.title['en']}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {langKey === 'so' ? 'MAGACA QAATAHA' : 'RECIPIENT NAME'}
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-gray-50 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {langKey === 'so' ? 'MAGACA DIRAHA' : 'SENDER NAME'}
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-gray-50 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                {langKey === 'so' ? 'FARRIINTA GAARKA AH' : 'PERSONALIZED MESSAGE'}
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 bg-gray-50 font-medium"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  {langKey === 'so' ? 'KU DAR SAWIR GAAR AH (IKHTIYAARI)' : 'ADD PERSONAL PHOTO (OPTIONAL)'}
                </label>
                {uploadedImage && (
                  <button 
                    onClick={handleRemoveImage}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                  >
                    {langKey === 'so' ? 'Tirtir sawirka' : 'Remove photo'}
                  </button>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-4 px-4 font-bold rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-base text-white hover:brightness-110 border border-white/20 cursor-pointer"
              style={getCardStyle(selectedCard)}
            >
              <span className="z-10">🚀 {langKey === 'so' ? 'Dir Hadiyad iyo Xawilaad Degdeg ah' : 'Send Hadiyad & Instant Transfer'}</span>
            </button>
          </div>
        </div>

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

            <div 
              className="w-full p-6 rounded-2xl text-white shadow-2xl flex flex-col justify-between flex-grow my-2 relative overflow-hidden transition-all duration-500"
              style={getCardStyle(selectedCard)}
            >
              <div className="flex justify-between items-center z-10">
                <span className="text-[10px] tracking-widest uppercase bg-black/30 px-3 py-1 rounded-md backdrop-blur-md font-bold border border-white/20">
                  HADIYADPAY • {selectedCard.badge[langKey] || selectedCard.badge['en']}
                </span>
                <span className="text-base animate-bounce">✨</span>
              </div>

              {uploadedImage && (
                <div 
                  className="my-3 rounded-xl overflow-hidden shadow-md h-36 border border-white/20 z-10 relative bg-black/50 cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
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
                  <div className="absolute bottom-1 right-1 bg-black/60 text-[9px] px-1.5 py-0.5 rounded text-white/80 pointer-events-none backdrop-blur-sm z-20">
                    🔍 Drag & Scroll
                  </div>
                </div>
              )}

              <div className="my-4 z-10">
                <p className="text-[10px] uppercase tracking-wider opacity-90 mb-1 font-semibold">
                  {langKey === 'so' ? 'MAGACA QAATAHA:' : 'TO:'}
                </p>
                <h3 className="text-xl font-black tracking-wide drop-shadow-md">
                  {recipientName}
                </h3>
              </div>

              <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/20 my-2 shadow-inner z-10">
                <p className="text-sm italic font-light leading-relaxed">
                  &ldquo;{message}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex justify-between items-end border-t border-white/20 pt-3 z-10">
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-90 font-semibold">
                    {langKey === 'so' ? 'MAGACA DIRAHA:' : 'FROM:'}
                  </p>
                  <p className="text-xs font-bold">
                    {senderName}
                  </p>
                </div>
                <span className="text-[10px] opacity-90 font-bold bg-white/20 px-2 py-0.5 rounded">HADIYADPAY</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={handleDownload}
                className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                📥 {langKey === 'so' ? 'Soo Degso Kaarka' : 'Download Card'}
              </button>
              <button
                onClick={handleShare}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/30 cursor-pointer"
              >
                🔗 {langKey === 'so' ? 'La Wadaag' : 'Share Card'}
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