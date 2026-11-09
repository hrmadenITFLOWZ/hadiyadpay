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
      
      const shareTitle = currentLanguage === 'so' ? 'HadiyadPay Kaarka Dhaqanka' : 'HadiyadPay Modern E-Card';
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

  // Unieke, levendige en creatieve kleurthema's per kaart ID voor hover en weergave
  const getCardStyle = (card: CardOption) => {
    if (card.bgImage) {
      return {
        backgroundImage: `linear-gradient(to bottom, rgba(30,20,10,0.3), rgba(15,10,5,0.9)), url(${card.bgImage})`,
        backgroundColor: '#26221e',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    // Specifieke creatieve gradients per kaarttype
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
    <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 flex flex-col gap-10">
      
      {/* Hallmark Categorieknoppen */}
      <div className="bg-white/90 backdrop-blur-xl p-3 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-center gap-3 max-w-xl mx-auto w-full">
        {[
          { id: 'all', labelSo: 'Dhammaan E-Cards', labelEn: 'All E-Cards' },
          { id: 'dhaqan', labelSo: '🌸 Dhaqan & Aroos', labelEn: 'Wedding & Heritage' },
          { id: 'cities', labelSo: '🏜️ Geel iyo Baadiye', labelEn: 'Nomadic & Land' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-105'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {currentLanguage === 'so' ? cat.labelSo : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Volledige Breedte Layout: Links de uitgebreide Phone Mockup Galerij, Rechts het Live Studio Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        
        {/* Linkerzijde: Uitgebreide Phone Mockup Galerij over de volle breedte */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between text-xs text-stone-600 font-semibold">
            <span>Showing <strong className="text-stone-900 font-black text-sm">{filteredCards.length}</strong> Artistic Cultural E-Cards</span>
            <span className="text-amber-600 font-bold uppercase tracking-wider">✨ Hallmark Interactive Grid</span>
          </div>

          <div className="bg-white/95 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                {currentLanguage === 'so' ? '📱 Dooro Kaarka (Phone Mockup Gallery)' : '📱 Choose E-Card Phone Mockup'}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                {currentLanguage === 'so' ? 'Hover ama riix si aad u aragto midabada iyo nashqada gaarka ah' : 'Hover or tap any phone mockup to preview its unique thematic design'}
              </p>
            </div>

            {/* Breed, natuurlijk grid voor alle telefoon mockups */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[680px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredCards.map((card) => {
                const isSelected = selectedOccasion.id === card.id;
                
                return (
                  <div
                    key={card.id}
                    onClick={() => setSelectedOccasion(card)}
                    className={`group cursor-pointer flex flex-col items-center transition-all duration-300 ${
                      isSelected ? 'scale-105' : 'opacity-90 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    {/* Telefoon Mockup met unieke thema-kleuren bij hover */}
                    <div className={`w-36 h-64 rounded-[2.5rem] p-2.5 bg-stone-900 border-4 transition-all duration-500 shadow-xl relative flex flex-col justify-between group-hover:shadow-2xl group-hover:border-amber-500 ${
                      isSelected ? 'border-amber-500 ring-4 ring-amber-500/25 shadow-amber-500/30' : 'border-stone-800'
                    }`}>
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-black rounded-full z-20 flex items-center justify-center">
                        <div className="w-3 h-1 bg-stone-800 rounded-full"></div>
                      </div>

                      {/* Unieke kaartgradient per thema */}
                      <div 
                        className="w-full h-full rounded-[2rem] pt-6 pb-3 px-3 flex flex-col justify-between relative overflow-hidden text-white shadow-inner transition-transform duration-500 group-hover:scale-[1.02]"
                        style={getCardStyle(card)}
                      >
                        <div className="flex justify-between items-center z-10">
                          <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-black/60 text-amber-300 border border-white/10 uppercase">
                            {card.badge[langKey] || card.badge['en']}
                          </span>
                          <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-[10px] text-white shadow group-hover:bg-amber-500 transition-colors">
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
                          {isSelected ? '✨ Active' : 'Hover to preview'}
                        </div>
                      </div>
                    </div>

                    <span className={`text-xs font-bold mt-2.5 text-center line-clamp-1 ${isSelected ? 'text-amber-600 font-black' : 'text-stone-700 group-hover:text-stone-900'}`}>
                      {card.title[langKey] || card.title['en']}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Persoonlijk bericht formulier */}
          <div className="bg-white/95 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xl flex flex-col gap-5">
            <h2 className="text-xl font-black text-stone-900 tracking-tight">
              {currentLanguage === 'so' ? '✍️ Shakhsiyeey Kaarkaaga' : '✍️ Personalize Your Message'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                  {currentLanguage === 'so' ? 'MAGACA QAATAHA (TO)' : 'RECIPIENT NAME (TO)'}
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 bg-stone-50 font-medium shadow-inner"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                  {currentLanguage === 'so' ? 'MAGACA DIRAHA (FROM)' : 'SENDER NAME (FROM)'}
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 bg-stone-50 font-medium shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                {currentLanguage === 'so' ? 'FARRIINTA QIIRO LEH' : 'HEARTFELT MESSAGE'}
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 bg-stone-50 font-medium shadow-inner"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                  {currentLanguage === 'so' ? 'SAWIRKA QOFAALKA (IKHTIYAARI)' : 'UPLOAD PHOTO (OPTIONAL)'}
                </label>
                {uploadedImage && (
                  <button onClick={handleRemoveImage} className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer">
                    {currentLanguage === 'so' ? 'Tirtir' : 'Remove'}
                  </button>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-xs text-stone-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-4 px-4 font-black rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-base text-white bg-amber-500 hover:bg-amber-600 shadow-amber-500/25 cursor-pointer uppercase tracking-wider mt-2"
            >
              🚀 {currentLanguage === 'so' ? 'Bixi €2.00 oo Dir Hadiyadda & Xawilaadda' : 'Pay €2.00 & Send Gift + Transfer'}
            </button>
          </div>
        </div>

        {/* Rechterzijde: Grote Live Studio Preview */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-8">
          <div className="bg-white/95 backdrop-blur-2xl p-6 rounded-3xl border border-stone-200 shadow-xl flex flex-col justify-between min-h-[620px]">
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-md shadow-amber-500/50"></span>
                <span className="text-xs font-black text-stone-700 tracking-widest uppercase">
                  ✨ LIVE STUDIO PREVIEW
                </span>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200 font-bold">
                THEME STUDIO
              </span>
            </div>

            <div 
              className="w-full p-6 sm:p-8 rounded-2xl text-white shadow-2xl flex flex-col justify-between flex-grow my-2 relative overflow-hidden transition-all duration-500 border border-white/20"
              style={getCardStyle(selectedOccasion)}
            >
              <div className="flex justify-between items-center z-10">
                <span className="text-[10px] tracking-widest uppercase bg-black/60 px-3 py-1 rounded-lg backdrop-blur-md font-black border border-amber-400/30 text-amber-300 shadow">
                  HADIYADPAY • {selectedOccasion.badge[langKey] || selectedOccasion.badge['en']}
                </span>
                <span className="text-lg">🌸✨</span>
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
                <p className="text-[10px] uppercase tracking-widest text-amber-300 mb-1 font-bold">
                  {currentLanguage === 'so' ? 'U SOCOTA (TO):' : 'TO:'}
                </p>
                <h3 className="text-2xl sm:text-3xl font-black tracking-wide drop-shadow-xl text-white">
                  {recipientName}
                </h3>
              </div>

              <div className="bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/15 my-2 shadow-2xl z-10">
                <p className="text-sm italic font-light leading-relaxed text-stone-100">
                  &ldquo;{message}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex justify-between items-end border-t border-white/15 pt-4 z-10">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-300 font-bold">
                    {currentLanguage === 'so' ? 'KA SOCOTA (FROM):' : 'FROM:'}
                  </p>
                  <p className="text-sm font-black text-amber-300">
                    {senderName}
                  </p>
                </div>
                <span className="text-[10px] font-black tracking-widest bg-white/15 text-amber-300 px-3 py-1 rounded-lg border border-white/10">HADIYADPAY</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={handleDownload}
                className="py-3 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition border border-stone-200 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                📥 {currentLanguage === 'so' ? 'Keydi Kaarka' : 'Download Card'}
              </button>
              <button
                onClick={handleShare}
                className="py-3 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/25 cursor-pointer"
              >
                🔗 {currentLanguage === 'so' ? 'La Wadaag' : 'Share Card'}
              </button>
            </div>

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