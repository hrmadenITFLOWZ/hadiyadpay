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

  // Filter kaarten op basis van Hallmark-stijl categorie menu
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
      
      const shareTitle = currentLanguage === 'so' ? 'HadiyadPay Kaarka Dhaqanka' : 'HadiyadPay Cultural E-Card';
      const shareText = currentLanguage === 'so'
        ? `Waa lagusoo diray HadiyadPay kaar gaar ah oo ku socota ${recipientName}! 🐪✨ Riix halkan:`
        : `You've received a special HadiyadPay cultural e-card for ${recipientName}! 🐪✨ Click here:`;

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
        backgroundImage: `linear-gradient(to bottom, rgba(10,14,23,0.4), rgba(10,14,23,0.9)), url(${card.bgImage})`,
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
    <div className="w-full max-w-7xl mx-auto px-4 py-6 flex flex-col gap-8">
      
      {/* 1. Hallmark-Style Sub-Navigation Bar (Categories & Occasions) */}
      <div className="bg-[#0f1523]/90 backdrop-blur-xl p-3 rounded-2xl border border-amber-500/20 shadow-2xl flex flex-wrap items-center justify-center gap-2">
        {[
          { id: 'all', labelSo: 'Dhammaan (All)', labelEn: 'All E-Cards' },
          { id: 'dhaqan', labelSo: '✨ Dhaqan & Aroos', labelEn: '✨ Dhaqan & Wedding' },
          { id: 'cities', labelSo: '🌍 Geel iyo Guri', labelEn: '🌍 Cities & Nomadic' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/30 scale-105'
                : 'text-gray-300 hover:text-white hover:bg-white/5 border border-white/5'
            }`}
          >
            {currentLanguage === 'so' ? cat.labelSo : cat.labelEn}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 2. Left Column: Hallmark Filter Sidebar & Phone Mockup Grid Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Filter Sidebar Mockup (Hallmark Style) */}
          <div className="bg-[#0f1523]/80 backdrop-blur-2xl p-5 rounded-3xl border border-white/10 shadow-2xl flex items-center justify-between text-xs text-gray-400">
            <span>Showing <strong className="text-amber-400">{filteredCards.length}</strong> Cultural Masterpieces</span>
            <span className="text-amber-400 font-bold uppercase tracking-wider">🐪 Somalische Hiddaha Hub</span>
          </div>

          {/* Phone Mockup Grid Gallery */}
          <div className="bg-[#0f1523]/90 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-amber-500/20 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-xl font-black text-white tracking-tight">
                {currentLanguage === 'so' ? '📱 Dooro Kaarkaaga (Phone Mockups)' : '📱 Choose E-Card Phone Gallery'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {currentLanguage === 'so' ? 'Riix si aad toos ugu aragto live preview-ga' : 'Tap any phone mockup to load into the live studio'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredCards.map((card) => {
                const isSelected = selectedOccasion.id === card.id;
                
                return (
                  <div
                    key={card.id}
                    onClick={() => setSelectedOccasion(card)}
                    className={`group cursor-pointer flex flex-col items-center transition-all duration-300 ${
                      isSelected ? 'scale-105' : 'opacity-80 hover:opacity-100 hover:scale-[1.02]'
                    }`}
                  >
                    {/* Realistic Phone Mockup */}
                    <div className={`w-36 h-64 rounded-[2.5rem] p-2.5 bg-gray-950 border-4 transition-all duration-300 shadow-2xl relative flex flex-col justify-between ${
                      isSelected ? 'border-amber-400 ring-4 ring-amber-400/40 shadow-amber-500/40' : 'border-gray-800 hover:border-amber-500/50'
                    }`}>
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-black rounded-full z-20 flex items-center justify-center">
                        <div className="w-3 h-1 bg-gray-900 rounded-full"></div>
                      </div>

                      <div 
                        className="w-full h-full rounded-[2rem] pt-6 pb-3 px-3 flex flex-col justify-between relative overflow-hidden text-white"
                        style={getCardStyle(card)}
                      >
                        <div className="flex justify-between items-center z-10">
                          <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-black/70 text-amber-300 border border-amber-400/30 uppercase">
                            {card.badge[langKey] || card.badge['en']}
                          </span>
                          <span className="w-6 h-6 rounded-full bg-amber-500/20 backdrop-blur-md flex items-center justify-center text-[10px] text-amber-400 shadow">
                            ▶
                          </span>
                        </div>

                        <div className="text-center z-10 my-auto">
                          <p className="text-[8px] uppercase tracking-wider text-amber-300 font-extrabold">HadiyadPay</p>
                          <h4 className="text-xs font-black line-clamp-2 mt-0.5 drop-shadow">
                            {card.title[langKey] || card.title['en']}
                          </h4>
                        </div>

                        <div className="text-[8px] text-center text-amber-300/80 z-10 border-t border-white/10 pt-1 font-bold">
                          {isSelected ? '✨ Active' : 'Select'}
                        </div>
                      </div>
                    </div>

                    <span className={`text-xs font-bold mt-2.5 text-center line-clamp-1 ${isSelected ? 'text-amber-400 font-black' : 'text-gray-300 group-hover:text-white'}`}>
                      {card.title[langKey] || card.title['en']}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customization Form */}
          <div className="bg-[#0f1523]/90 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-5">
            <h2 className="text-xl font-black text-white tracking-tight">
              {currentLanguage === 'so' ? '✍️ Shakhsiyeey Kaarkaaga' : '✍️ Personalize Your Message'}
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
                  className="w-full px-4 py-3 text-sm rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white bg-black/50 font-medium shadow-inner"
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
                  className="w-full px-4 py-3 text-sm rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white bg-black/50 font-medium shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                {currentLanguage === 'so' ? 'FARRIINTA QIIRO LEH' : 'HEARTFELT MESSAGE'}
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white bg-black/50 font-medium shadow-inner"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                  {currentLanguage === 'so' ? 'SAWIRKA QOFAALKA (IKHTIYAARI)' : 'UPLOAD PHOTO (OPTIONAL)'}
                </label>
                {uploadedImage && (
                  <button onClick={handleRemoveImage} className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer">
                    {currentLanguage === 'so' ? 'Tirtir' : 'Remove'}
                  </button>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-xs text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-400/20 file:text-amber-300 hover:file:bg-amber-400/30 cursor-pointer bg-black/50 border border-white/10 rounded-xl"
              />
            </div>

            {/* Hallmark Checkout Trigger Button */}
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-4 px-4 font-black rounded-2xl shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 text-base text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 shadow-amber-500/30 cursor-pointer uppercase tracking-wider mt-2"
            >
              🚀 {currentLanguage === 'so' ? 'Bixi €2.00 oo Dir Hadiyadda & Xawilaadda' : 'Pay €2.00 & Send Gift + Transfer'}
            </button>
          </div>
        </div>

        {/* 3. Right Column: Large Cinematic Hallmark Studio Preview */}
        <div className="lg:col-span-5 sticky top-8">
          <div className="bg-[#0f1523]/95 backdrop-blur-2xl p-6 rounded-3xl border border-amber-500/20 shadow-2xl flex flex-col justify-between min-h-[600px]">
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-lg shadow-amber-400/50"></span>
                <span className="text-xs font-black text-amber-300 tracking-widest uppercase">
                  ✨ LIVE STUDIO PREVIEW
                </span>
              </div>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/30 font-bold">
                HADIYADPAY EXCLUSIVE
              </span>
            </div>

            <div 
              className="w-full p-6 sm:p-8 rounded-2xl text-white shadow-2xl flex flex-col justify-between flex-grow my-2 relative overflow-hidden transition-all duration-500 border border-white/20"
              style={getCardStyle(selectedOccasion)}
            >
              <div className="flex justify-between items-center z-10">
                <span className="text-[10px] tracking-widest uppercase bg-black/70 px-3 py-1 rounded-lg backdrop-blur-md font-black border border-amber-400/40 text-amber-300 shadow">
                  HADIYADPAY • {selectedOccasion.badge[langKey] || selectedOccasion.badge['en']}
                </span>
                <span className="text-lg">🐪✨</span>
              </div>

              {uploadedImage && (
                <div 
                  className="my-3 rounded-xl overflow-hidden shadow-2xl h-44 border border-white/20 z-10 relative bg-black/80 cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
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

              <div className="bg-black/60 backdrop-blur-md p-5 rounded-2xl border border-white/15 my-2 shadow-2xl z-10">
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

        {/* 4. Fully Integrated Checkout Modal (Stripe + Remittance Deeplink Hand-off) */}
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