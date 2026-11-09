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
    <div className="w-full max-w-[1550px] mx-auto px-4 lg:px-8 flex flex-col gap-8">
      
      {/* Hallmark Top Pill Categories Bar */}
      <div className="w-full bg-white/90 backdrop-blur-xl p-3 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-start gap-3">
        {[
          { id: 'all', labelSo: 'All E-Cards', labelEn: 'All E-Cards' },
          { id: 'dhaqan', labelSo: '🌸 Wedding & Heritage', labelEn: 'Wedding & Heritage' },
          { id: 'cities', labelSo: '🏜️ Nomadic & Land', labelEn: 'Nomadic & Land' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {cat.labelEn}
          </button>
        ))}
      </div>

      {/* Hallmark Layout: Left Sidebar + Wide Natural Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        
        {/* Left Sidebar Filters (Hallmark Style) */}
        <div className="lg:col-span-3 bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-stone-200 shadow-sm hidden lg:flex flex-col gap-6 sticky top-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-3">
            Filters & Collections
          </h3>
          <div className="flex flex-col gap-3 text-xs text-stone-600 font-semibold">
            <span className="cursor-pointer hover:text-amber-600">Occasion ({filteredCards.length})</span>
            <span className="cursor-pointer hover:text-amber-600">Recipient (Family & Friends)</span>
            <span className="cursor-pointer hover:text-amber-600">Tone (Heartfelt & Warm)</span>
            <span className="cursor-pointer hover:text-amber-600">Personalize Photo</span>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl mt-4">
            <h4 className="text-xs font-bold text-amber-900 mb-1">✨ HadiyadPay Membership</h4>
            <p className="text-[11px] text-amber-800/80 leading-relaxed mb-3">
              Send unlimited digital greetings and instant money transfers worldwide.
            </p>
          </div>
        </div>

        {/* Right Content Area: Full Natural Store Grid & Studio */}
        <div className="lg:col-span-9 flex flex-col gap-8">
          
          {/* Store Grid Header */}
          <div className="bg-white/90 backdrop-blur-xl p-5 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between text-xs text-stone-600 font-semibold">
            <span>Showing <strong className="text-stone-900 font-black">{filteredCards.length}</strong> E-Cards</span>
            <span className="text-amber-600 font-bold uppercase tracking-wider">Sorted by Featured</span>
          </div>

          {/* Natural Expanded Phone Mockup Grid */}
          <div className="bg-white/95 backdrop-blur-2xl p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-xl">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                {currentLanguage === 'so' ? 'Kaarka Xulo (Select E-Card)' : 'Featured E-Cards Collection'}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Hover or tap any phone mockup below to preview and load it into your live studio.
              </p>
            </div>

            {/* Grid fills the space naturally */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    <div className={`w-36 h-64 rounded-[2.5rem] p-2.5 bg-stone-900 border-4 transition-all duration-500 shadow-xl relative flex flex-col justify-between group-hover:shadow-2xl group-hover:border-amber-500 ${
                      isSelected ? 'border-amber-500 ring-4 ring-amber-500/25 shadow-amber-500/30' : 'border-stone-800'
                    }`}>
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-black rounded-full z-20 flex items-center justify-center">
                        <div className="w-3 h-1 bg-stone-800 rounded-full"></div>
                      </div>

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
                          {isSelected ? '✨ Active' : 'Select'}
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

          {/* Personalization & Live Studio Section side-by-side or stacked naturally */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Form */}
            <div className="bg-white/95 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xl flex flex-col gap-5">
              <h3 className="text-xl font-black text-stone-900 tracking-tight">
                {currentLanguage === 'so' ? '✍️ Shakhsiyeey Kaarkaaga' : 'Personalize Your E-Card'}
              </h3>

              <div className="flex flex-col gap-4">
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
                      Remove
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