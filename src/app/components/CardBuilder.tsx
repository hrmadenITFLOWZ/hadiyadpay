'use client';

import React, { useState, useEffect } from 'react';
import { cardOptions, CardOption } from '../data/cardOptions';
import CheckoutModal from './CheckoutModal';

interface CardBuilderProps {
  currentLanguage: string;
}

export default function CardBuilder({ currentLanguage }: CardBuilderProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedCardForModal, setSelectedCardForModal] = useState<CardOption | null>(null);
  
  const langKey = (currentLanguage === 'so' ? 'so' : 'en') as 'so' | 'en';

  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageScale, setImageScale] = useState<number>(1);
  const [imagePos, setImagePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const filteredCards = activeCategory === 'all' 
    ? cardOptions 
    : cardOptions.filter((card) => card.category === activeCategory);

  const handleOpenCustomize = (card: CardOption) => {
    setSelectedCardForModal(card);
    setRecipientName(card.defaultRecipient[langKey] || card.defaultRecipient['en']);
    setSenderName(card.defaultSender[langKey] || card.defaultSender['en']);
    setMessage(card.defaultMessage[langKey] || card.defaultMessage['en']);
    setUploadedImage(null);
  };

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
    if (!selectedCardForModal) return;
    const payload = {
      c: selectedCardForModal.id,
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
        backgroundImage: `linear-gradient(to bottom, rgba(20,15,10,0.15), rgba(15,10,5,0.7)), url(${card.bgImage})`,
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
    <div className="w-full max-w-[1500px] mx-auto px-4 lg:px-10 flex flex-col gap-8 pb-20">
      
      {/* Greenvelope-stijl Header & Categorie Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            {currentLanguage === 'so' ? 'Ururinta Kaarka Salaanta' : 'Curated E-Card Collection'}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {currentLanguage === 'so' 
              ? 'Kaarar qurux badan oo loogu talagalay munaasabadahaaga gaarka ah.' 
              : 'Stunning cultural designs crafted for your most cherished moments.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Cards' },
            { id: 'dhaqan', label: '🌸 Wedding & Celebrations' },
            { id: 'cities', label: '🐪 Nomadic & Homeland' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Greenvelope-stijl Breed Raster (4 kolommen van prachtige e-cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleOpenCustomize(card)}
            className="group cursor-pointer bg-white rounded-3xl p-5 border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between"
          >
            <div className="w-full h-80 rounded-2xl overflow-hidden relative shadow-md transition-transform duration-300 group-hover:scale-[1.02] flex flex-col justify-between p-6 text-white"
                 style={getCardStyle(card)}>
              <div className="flex justify-between items-center z-10">
                <span className="text-[9px] font-black px-2.5 py-1 rounded-md bg-black/60 text-amber-300 uppercase shadow">
                  {card.badge[langKey] || card.badge['en']}
                </span>
                <span className="w-7 h-7 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-xs shadow">
                  ✨
                </span>
              </div>

              <div className="text-center z-10 my-auto">
                <p className="text-[10px] uppercase tracking-widest text-amber-200 font-bold drop-shadow">HADIYADPAY</p>
                <h3 className="text-lg font-black mt-2 drop-shadow-lg text-white">
                  {card.title[langKey] || card.title['en']}
                </h3>
              </div>

              <div className="text-center z-10 pt-2 border-t border-white/20">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-black/40 px-3 py-1 rounded-full">
                  Customize & Send →
                </span>
              </div>
            </div>

            <div className="w-full mt-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-stone-900 group-hover:text-amber-700 transition">
                  {card.title[langKey] || card.title['en']}
                </h4>
                <p className="text-[11px] text-stone-400 font-medium">Digital E-Card • €2.00</p>
              </div>
              <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black group-hover:bg-amber-600 group-hover:text-white transition">
                +
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Greenvelope-stijl Aanpas-Modal wanneer op een kaart geklikt wordt */}
      {selectedCardForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl relative border border-stone-200 my-8 flex flex-col lg:flex-row gap-8">
            
            <button
              onClick={() => setSelectedCardForModal(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-black flex items-center justify-center transition cursor-pointer z-20"
            >
              ✕
            </button>

            {/* Linkerkant van Modal: Live Preview */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-stone-800 uppercase tracking-wider">Live Card Preview</span>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-bold">
                  {selectedCardForModal.badge[langKey] || selectedCardForModal.badge['en']}
                </span>
              </div>

              <div 
                className="w-full p-6 sm:p-8 rounded-2xl text-white shadow-xl flex flex-col justify-between min-h-[380px] relative overflow-hidden transition-all duration-500 border border-white/20"
                style={getCardStyle(selectedCardForModal)}
              >
                <div className="flex justify-between items-center z-10">
                  <span className="text-[10px] tracking-widest uppercase bg-black/60 px-3 py-1 rounded-lg font-black text-amber-300 shadow">
                    HADIYADPAY
                  </span>
                  <span className="text-lg">✨🌸</span>
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

              <div className="grid grid-cols-2 gap-3">
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

            {/* Rechterkant van Modal: Formulier & Checkout */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-black text-stone-900 tracking-tight">
                  {currentLanguage === 'so' ? '✍️ Shakhsiyeey Kaarkaaga' : 'Personalize Your Card'}
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
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 bg-stone-50 font-medium"
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
                    className="w-full text-xs text-stone-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-amber-50 file:text-amber-700 cursor-pointer bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-4 px-4 font-black rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm text-white bg-amber-600 hover:bg-amber-700 shadow-amber-600/25 cursor-pointer uppercase tracking-wider mt-4"
              >
                🚀 {currentLanguage === 'so' ? 'Bixi €2.00 oo Dir Hadiyadda' : 'Pay €2.00 & Send Card'}
              </button>
            </div>

          </div>
        </div>
      )}

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedOccasion={selectedCardForModal || cardOptions[0]}
        recipientName={recipientName}
        senderName={senderName}
        message={message}
        cardPrice={2.00}
        initialLanguage={currentLanguage}
      />
    </div>
  );
}