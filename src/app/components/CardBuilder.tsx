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
      
      const shareTitle = currentLanguage === 'so' ? 'HadiyadPay Kaarka Dhaqanka' : 'HadiyadPay E-Card';
      const shareText = currentLanguage === 'so'
        ? `Waa lagusoo diray HadiyadPay kaar gaar ah oo ku socota ${recipientName}! 🌸✨ Riix halkan:`
        : `You've received a special HadiyadPay e-card for ${recipientName}! 🌸✨ Click here:`;

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

  const getCardStyle = (card: CardOption) => {
    if (card.bgImage) {
      return {
        backgroundImage: `linear-gradient(to bottom, rgba(40,30,20,0.2), rgba(20,15,10,0.85)), url(${card.bgImage})`,
        backgroundColor: '#26221e',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    const gradients: Record<string, string> = {
      'dhalasho': 'linear-gradient(135deg, #f43f5e 0%, #fb7185 50%, #fda4af 100%)',
      'aroos': 'linear-gradient(135deg, #d97706 0%, #b45309 50%, #78350f 100%)',
      'eid': 'linear-gradient(135deg, #059669 0%, #10b981 50%, #047857 100%)',
      'guul': 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #6d28d9 100%)',
      'jacayl': 'linear-gradient(135deg, #e11d48 0%, #f43f5e 50%, #be123c 100%)',
      'mahadsanid': 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #b45309 100%)',
    };
    return {
      background: card.gradient || gradients[card.id] || 'linear-gradient(135deg, #d97706 0%, #9a3412 100%)'
    };
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-8">
      
      {/* Clean Category Navigation Tabs */}
      <div className="flex justify-center border-b border-stone-200 pb-4 gap-3">
        {[
          { id: 'all', label: 'All E-Cards' },
          { id: 'dhaqan', label: '🌸 Wedding & Heritage' },
          { id: 'cities', label: '🏜️ Nomadic & Cities' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Clean Hallmark Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start w-full">
        
        {/* Left Column: Phone Mockups Natural Store Grid (No scrollbar box, pure grid) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-stone-900 tracking-tight">
              {currentLanguage === 'so' ? 'Dooro Kaarka (Select E-Card)' : 'Select an E-Card'}
            </h2>
            <span className="text-xs text-stone-500 font-medium">
              {filteredCards.length} Design options
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
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
                  <div className={`w-36 h-64 rounded-[2.5rem] p-2.5 bg-stone-950 border-4 transition-all duration-300 shadow-lg relative flex flex-col justify-between ${
                    isSelected ? 'border-amber-500 ring-4 ring-amber-500/20 shadow-amber-500/30' : 'border-stone-800 hover:border-amber-400'
                  }`}>
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-black rounded-full z-20 flex items-center justify-center">
                      <div className="w-3 h-1 bg-stone-800 rounded-full"></div>
                    </div>

                    <div 
                      className="w-full h-full rounded-[2rem] pt-6 pb-3 px-3 flex flex-col justify-between relative overflow-hidden text-white"
                      style={getCardStyle(card)}
                    >
                      <div className="flex justify-between items-center z-10">
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-black/60 text-amber-300 uppercase">
                          {card.badge[langKey] || card.badge['en']}
                        </span>
                        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[9px]">
                          ▶
                        </span>
                      </div>

                      <div className="text-center z-10 my-auto">
                        <p className="text-[8px] uppercase tracking-wider text-amber-200 font-bold">HadiyadPay</p>
                        <h4 className="text-xs font-black line-clamp-2 mt-0.5 drop-shadow">
                          {card.title[langKey] || card.title['en']}
                        </h4>
                      </div>

                      <div className="text-[8px] text-center text-stone-200 z-10 border-t border-white/15 pt-1 font-semibold">
                        {isSelected ? '✓ Selected' : 'Tap to customize'}
                      </div>
                    </div>
                  </div>

                  <span className={`text-xs font-bold mt-2.5 text-center line-clamp-1 ${isSelected ? 'text-amber-600 font-black' : 'text-stone-700'}`}>
                    {card.title[langKey] || card.title['en']}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Studio Preview & Customization (Sticky) */}
        <div className="lg:col-span-5 sticky top-6 flex flex-col gap-6">
          
          {/* Live Hallmark Card Preview */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xl flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-stone-800 tracking-wider uppercase">
                ✨ Live Studio Preview
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold">
                {selectedOccasion.badge[langKey] || selectedOccasion.badge['en']}
              </span>
            </div>

            <div 
              className="w-full p-6 sm:p-7 rounded-2xl text-white shadow-xl flex flex-col justify-between min-h-[340px] relative overflow-hidden transition-all duration-500 border border-white/20"
              style={getCardStyle(selectedOccasion)}
            >
              <div className="flex justify-between items-center z-10">
                <span className="text-[10px] tracking-widest uppercase bg-black/60 px-3 py-1 rounded-lg font-black text-amber-300">
                  HADIYADPAY
                </span>
                <span className="text-base">🌸✨</span>
              </div>

              {uploadedImage && (
                <div 
                  className="my-3 rounded-xl overflow-hidden shadow-2xl h-36 border border-white/20 z-10 relative bg-black/70 cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
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
                <p className="text-[10px] uppercase tracking-widest text-amber-300 mb-1 font-bold">TO:</p>
                <h3 className="text-2xl font-black tracking-wide drop-shadow-xl text-white">{recipientName}</h3>
              </div>

              <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/15 my-2 shadow-lg z-10">
                <p className="text-xs italic font-light leading-relaxed text-stone-100">&ldquo;{message}&rdquo;</p>
              </div>

              <div className="mt-4 flex justify-between items-end border-t border-white/15 pt-3 z-10">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-300 font-bold">FROM:</p>
                  <p className="text-xs font-black text-amber-300">{senderName}</p>
                </div>
                <span className="text-[10px] font-black tracking-widest bg-white/15 text-amber-300 px-2 py-0.5 rounded">HADIYADPAY</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                onClick={handleDownload}
                className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition border border-stone-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                📥 Download
              </button>
              <button
                onClick={handleShare}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                🔗 Share Card
              </button>
            </div>
          </div>

          {/* Clean Input Form */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xl flex flex-col gap-4">
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
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 bg-stone-50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">From (Sender)</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 bg-stone-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Message</label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 bg-stone-50"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-bold text-stone-600 uppercase">Photo (Optional)</label>
                {uploadedImage && (
                  <button onClick={handleRemoveImage} className="text-[10px] text-rose-600 font-semibold cursor-pointer">Remove</button>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-[10px] text-stone-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-amber-50 file:text-amber-700 cursor-pointer bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-3.5 px-4 font-black rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm text-white bg-amber-500 hover:bg-amber-600 shadow-amber-500/25 cursor-pointer uppercase tracking-wider"
            >
              🚀 {currentLanguage === 'so' ? 'Bixi €2.00 oo Dir Hadiyadda' : 'Pay €2.00 & Send Card'}
            </button>
          </div>

        </div>

        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          selectedOccasion={selectedOccasion}
          recipientName={recipientName}
          senderName={senderName}
          message={message}
          cardPrice={2.00}
          initialLanguage={currentLanguage}
        />
      </div>
    </div>
  );
}