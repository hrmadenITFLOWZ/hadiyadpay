'use client';

import React, { useState, useEffect } from 'react';
import { cardOptions, CardOption } from '../data/cardOptions';
import CheckoutModal from './CheckoutModal';

interface CardBuilderProps {
  currentLanguage: string;
}

export default function CardBuilder({ currentLanguage }: CardBuilderProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<CardOption>(cardOptions[0]);
  
  const langKey = (currentLanguage === 'so' ? 'so' : 'en') as 'so' | 'en';

  const [recipientName, setRecipientName] = useState(
    selectedOccasion.defaultRecipient[langKey] || selectedOccasion.defaultRecipient['en']
  );
  const [senderName, setSenderName] = useState(
    selectedOccasion.defaultSender[langKey] || selectedOccasion.defaultSender['en']
  );
  const [message, setMessage] = useState(
    selectedOccasion.defaultMessage[langKey] || selectedOccasion.defaultMessage['en']
  );
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageScale, setImageScale] = useState<number>(1);
  const [imagePos, setImagePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const filteredCards = activeCategory === 'all' 
    ? cardOptions 
    : cardOptions.filter((card) => card.category === activeCategory);

  useEffect(() => {
    if (filteredCards.length > 0 && !filteredCards.find(c => c.id === selectedOccasion.id)) {
      setSelectedOccasion(filteredCards[0]);
    }
  }, [activeCategory]);

  useEffect(() => {
    setRecipientName(selectedOccasion.defaultRecipient[langKey] || selectedOccasion.defaultRecipient['en']);
    setSenderName(selectedOccasion.defaultSender[langKey] || selectedOccasion.defaultSender['en']);
    setMessage(selectedOccasion.defaultMessage[langKey] || selectedOccasion.defaultMessage['en']);
  }, [selectedOccasion, langKey]);

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
      c: selectedOccasion.id,
      t: recipientName,
      f: senderName,
      m: message,
    };

    try {
      const jsonStr = JSON.stringify(payload);
      const encoded = btoa(encodeURIComponent(jsonStr));

      const baseUrl = window.location.origin + window.location.pathname;
      const shareUrl = `${baseUrl}?data=${encoded}&lang=${currentLanguage}`;
      
      const shareTitle = currentLanguage === 'so' ? 'HadiyadPay Kaarka Dhaqanka' : 'HadiyadPay African E-Card';
      const shareText = currentLanguage === 'so'
        ? `Waa lagusoo diray HadiyadPay kaar gaar ah oo ku socota ${recipientName}! 🌍✨ Riix halkan:`
        : `You've received a special HadiyadPay African heritage e-card for ${recipientName}! 🌍✨ Click here:`;

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
      alert(currentLanguage === 'so' ? 'Linkiga waxaa la guuriyey! 📋' : 'Link copied to clipboard! 📋');
    } catch (e) {
      console.error('Fout bij genereren share link', e);
      alert('Kon de link niet genereren.');
    }
  };

  const handleDownload = () => {
    alert(currentLanguage === 'so' ? 'Kaarka waa la keydiyey! 📥' : 'Card saved successfully! 📥');
  };

  // Zorgt voor heldere, rijke, kleurrijke weergave met lichte overlays zodat de afbeeldingen prachtig zichtbaar zijn
  const getCardStyle = (card: CardOption) => {
    if (card.bgImage) {
      return {
        backgroundImage: `linear-gradient(to bottom, rgba(20,15,10,0.15), rgba(15,10,5,0.75)), url(${card.bgImage})`,
        backgroundColor: '#261e16',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return {
      background: card.gradient || 'linear-gradient(135deg, #b45309 0%, #78350f 100%)'
    };
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-10 flex flex-col gap-8">
      
      {/* Categorie Navigatie Balk */}
      <div className="w-full bg-white/90 backdrop-blur-xl p-3.5 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-start gap-3">
        {[
          { id: 'all', label: 'All African Heritage Cards' },
          { id: 'dhaqan', label: '🏺 Wedding & Heritage' },
          { id: 'cities', label: '🐪 Nomadic & Homeland' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Hoofdlayout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start w-full">
        
        {/* Linkerzijde: 3-Koloms Raster met Kleurrijke Afrikaanse/Somalische Kaarten */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <div className="bg-white/95 backdrop-blur-2xl p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-xl">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                {currentLanguage === 'so' ? 'Hiddaha & Dhaqanka Soomaaliyeed' : 'African & Somali Heritage Collection'}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Click any phone mockup below to preview and customize your vibrant cultural greeting card.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredCards.map((card) => {
                const isSelected = selectedOccasion.id === card.id;
                
                return (
                  <div
                    key={card.id}
                    onClick={() => setSelectedOccasion(card)}
                    className={`group cursor-pointer flex flex-col items-center transition-all duration-300 ${
                      isSelected ? 'scale-105' : 'hover:scale-105'
                    }`}
                  >
                    <div className={`w-48 h-84 rounded-[3rem] p-3 bg-stone-950 border-4 transition-all duration-300 shadow-lg relative flex flex-col justify-between ${
                      isSelected ? 'border-amber-600 ring-4 ring-amber-500/25 shadow-amber-600/30' : 'border-stone-800 hover:border-amber-500'
                    }`}>
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full z-20 flex items-center justify-center">
                        <div className="w-4 h-1 bg-stone-800 rounded-full"></div>
                      </div>

                      <div 
                        className="w-full h-full rounded-[2.3rem] pt-7 pb-4 px-4 flex flex-col justify-between relative overflow-hidden text-white"
                        style={getCardStyle(card)}
                      >
                        <div className="flex justify-between items-center z-10">
                          <span className="text-[9px] font-black px-2 py-0.5 rounded bg-black/60 text-amber-300 uppercase">
                            {card.badge[langKey] || card.badge['en']}
                          </span>
                          <span className="w-6 h-6 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-[10px]">
                            🌍
                          </span>
                        </div>

                        <div className="text-center z-10 my-auto">
                          <p className="text-[9px] uppercase tracking-wider text-amber-200 font-bold drop-shadow-md">HadiyadPay</p>
                          <h4 className="text-sm font-black line-clamp-2 mt-1 drop-shadow-lg text-white">
                            {card.title[langKey] || card.title['en']}
                          </h4>
                        </div>

                        <div className="text-[9px] text-center text-amber-100 z-10 border-t border-white/20 pt-1.5 font-bold">
                          {isSelected ? '✓ Selected' : 'Tap to customize'}
                        </div>
                      </div>
                    </div>

                    <span className={`text-sm font-bold mt-3 text-center line-clamp-1 ${isSelected ? 'text-amber-700 font-black' : 'text-stone-800'}`}>
                      {card.title[langKey] || card.title['en']}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rechterzijde: Live Studio Preview & Formulier */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-6 flex flex-col gap-6">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xl flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-stone-800 tracking-wider uppercase">
                🌍 Live Studio Preview
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-bold">
                {selectedOccasion.badge[langKey] || selectedOccasion.badge['en']}
              </span>
            </div>

            <div 
              className="w-full p-6 sm:p-8 rounded-2xl text-white shadow-xl flex flex-col justify-between min-h-[360px] relative overflow-hidden transition-all duration-500 border border-white/20"
              style={getCardStyle(selectedOccasion)}
            >
              <div className="flex justify-between items-center z-10">
                <span className="text-[10px] tracking-widest uppercase bg-black/60 px-3 py-1 rounded-lg font-black text-amber-300">
                  HADIYADPAY
                </span>
                <span className="text-lg">🌍✨</span>
              </div>

              {uploadedImage && (
                <div 
                  className="my-3 rounded-xl overflow-hidden shadow-2xl h-40 border border-white/20 z-10 relative bg-black/70 cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
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
                </div>
              )}

              <div className="my-4 z-10">
                <p className="text-[10px] uppercase tracking-widest text-amber-300 mb-1 font-bold drop-shadow">TO:</p>
                <h3 className="text-2xl sm:text-3xl font-black tracking-wide drop-shadow-xl text-white">{recipientName}</h3>
              </div>

              <div className="bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/20 my-2 shadow-lg z-10">
                <p className="text-sm italic font-light leading-relaxed text-amber-50 drop-shadow">&ldquo;{message}&rdquo;</p>
              </div>

              <div className="mt-4 flex justify-between items-end border-t border-white/20 pt-3 z-10">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-amber-200 font-bold">FROM:</p>
                  <p className="text-xs font-black text-white">{senderName}</p>
                </div>
                <span className="text-[10px] font-black tracking-widest bg-white/20 text-amber-300 px-2.5 py-0.5 rounded">HADIYADPAY</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                onClick={handleDownload}
                className="py-3 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition border border-stone-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                📥 Download
              </button>
              <button
                onClick={handleShare}
                className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                🔗 Share Card
              </button>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xl flex flex-col gap-4">
            <h3 className="text-base font-black text-stone-900 tracking-tight">
              {currentLanguage === 'so' ? '✍️ Geli Fariintaada' : 'Personalize Your Card'}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">To (Recipient)</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 bg-stone-50 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">From (Sender)</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 bg-stone-50 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Message</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900