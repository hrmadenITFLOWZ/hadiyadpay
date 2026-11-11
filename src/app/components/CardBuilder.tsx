'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  cardOccasions,
  cardOptions,
  occasionLabels,
  type CardCategory,
  type CardOccasion,
  type CardOption,
} from '../data/cardOptions';
import CheckoutModal from './CheckoutModal';
import CardProductCard from './CardProductCard';
import CardCatalogControls, { type CardSort } from './CardCatalogControls';
import EditorialSections from './EditorialSections';
import OccasionNavigation from './OccasionNavigation';
import StorefrontHero from './StorefrontHero';
import useDialogAccessibility from '../hooks/useDialogAccessibility';

type Language = 'so' | 'en' | 'nl';
type CategoryFilter = 'all' | CardCategory;

function isCardCategory(value: string | null): value is CardCategory {
  return value === 'celebrations' || value === 'milestones';
}

function isCardOccasion(value: string | null): value is CardOccasion {
  return value !== null && cardOccasions.some((occasion) => occasion === value);
}

function isCardSort(value: string | null): value is CardSort {
  return value === 'featured' || value === 'name-asc' || value === 'name-desc';
}

function normalizeSearch(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim();
}

interface CardBuilderProps {
  currentLanguage: Language;
}

interface UploadedImage {
  src: string;
  width: number;
  height: number;
}

export default function CardBuilder({ currentLanguage }: CardBuilderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get('category');
  const rawOccasion = searchParams.get('occasion');
  const rawSort = searchParams.get('sort');
  const activeCategory: CategoryFilter = isCardCategory(rawCategory) ? rawCategory : 'all';
  const selectedOccasion = isCardOccasion(rawOccasion) ? rawOccasion : 'all';
  const selectedSort = isCardSort(rawSort) ? rawSort : 'featured';
  const searchQuery = (searchParams.get('q') ?? '').slice(0, 100);
  const [selectedCardForModal, setSelectedCardForModal] = useState<CardOption | null>(null);
  
  const langKey = currentLanguage === 'so' ? 'so' : 'en';

  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [imageScale, setImageScale] = useState<number>(1);
  const [imagePos, setImagePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const closeCardEditor = () => setSelectedCardForModal(null);
  const editorDialogRef = useDialogAccessibility<HTMLDivElement>(
    Boolean(selectedCardForModal) && !isCheckoutOpen,
    closeCardEditor,
  );

  const updateCatalogParam = (key: string, value: string, defaultValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === defaultValue) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const clearCatalogFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    ['q', 'category', 'occasion', 'sort'].forEach((key) => params.delete(key));
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const normalizedQuery = normalizeSearch(searchQuery);
  const filteredCards = cardOptions.filter((card) => {
    if (activeCategory !== 'all' && card.category !== activeCategory) return false;
    if (selectedOccasion !== 'all' && card.occasion !== selectedOccasion) return false;
    if (!normalizedQuery) return true;

    const searchableText = [
      card.title.so,
      card.title.en,
      card.badge.so,
      card.badge.en,
      card.occasion,
      ...Object.values(occasionLabels[card.occasion]),
      ...card.searchTerms,
    ].map(normalizeSearch).join(' ');

    return searchableText.includes(normalizedQuery);
  });
  const sortedCards = [...filteredCards];
  if (selectedSort === 'name-asc' || selectedSort === 'name-desc') {
    const collator = new Intl.Collator(currentLanguage, { sensitivity: 'base' });
    sortedCards.sort((left, right) => {
      const comparison = collator.compare(left.title[langKey], right.title[langKey]);
      return selectedSort === 'name-asc' ? comparison : -comparison;
    });
  } else {
    sortedCards.sort(
      (left, right) =>
        Number(Boolean(right.featured)) - Number(Boolean(left.featured)) ||
        cardOptions.indexOf(left) - cardOptions.indexOf(right),
    );
  }

  const showFeatured =
    activeCategory === 'all' &&
    selectedOccasion === 'all' &&
    normalizedQuery === '' &&
    selectedSort === 'featured';
  const featuredCards = showFeatured ? sortedCards.filter((card) => card.featured) : [];
  const catalogCards = showFeatured
    ? sortedCards.filter((card) => !card.featured)
    : sortedCards;
  const hasCatalogFilters =
    normalizedQuery !== '' ||
    activeCategory !== 'all' ||
    selectedOccasion !== 'all' ||
    selectedSort !== 'featured';

  const handleOpenCustomize = (card: CardOption) => {
    setSelectedCardForModal(card);
    setRecipientName(card.defaultRecipient[langKey] || card.defaultRecipient['en']);
    setSenderName(card.defaultSender[langKey] || card.defaultSender['en']);
    setMessage(card.defaultMessage[langKey] || card.defaultMessage['en']);
    setUploadedImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(currentLanguage === 'so' ? 'Fadlan dooro sawir.' : 'Please choose an image file.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      alert(currentLanguage === 'so' ? 'Sawirka lama akhrin karin.' : 'The image could not be read.');
    };
    reader.onload = () => {
      const imageSource = reader.result;
      if (typeof imageSource !== 'string') {
        alert(currentLanguage === 'so' ? 'Sawirka lama akhrin karin.' : 'The image could not be read.');
        return;
      }

      const previewImage = new window.Image();
      previewImage.onerror = () => {
        alert(currentLanguage === 'so' ? 'Sawirkan lama furi karo.' : 'This image could not be opened.');
      };
      previewImage.onload = () => {
        setUploadedImage({
          src: imageSource,
          width: previewImage.naturalWidth,
          height: previewImage.naturalHeight,
        });
        setImageScale(1);
        setImagePos({ x: 0, y: 0 });
      };
      previewImage.src = imageSource;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
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
    alert(currentLanguage === 'so' ? 'Soo dejinta kaarka wali lama heli karo.' : 'Card download is not available yet.');
  };

  const getCardStyle = (card: CardOption) => {
    if (card.bgImage) {
      return {
        backgroundImage: `linear-gradient(to bottom, rgba(20,15,10,0.15), rgba(15,10,5,0.7)), url(${card.bgImage})`,
        backgroundColor: '#261e16',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }

    return {
      background: card.gradient || 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
    };
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 lg:px-10 flex flex-col gap-8 pb-20">
      <StorefrontHero currentLanguage={currentLanguage} />
      <OccasionNavigation
        currentLanguage={currentLanguage}
        activeCategory={activeCategory}
        onCategoryChange={(category) => updateCatalogParam('category', category, 'all')}
      />

      <div id="card-catalog" className="mx-auto flex w-full max-w-7xl scroll-mt-8 flex-col gap-10">
      {featuredCards.length > 0 && (
        <section aria-labelledby="featured-cards-heading" className="mx-auto w-full max-w-7xl">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#718078]">
                {currentLanguage === 'nl' ? 'UITGELICHT' : currentLanguage === 'so' ? 'KAARAR LA DOORTAY' : 'A FEW TO START WITH'}
              </p>
              <h2 id="featured-cards-heading" className="mt-2 font-serif text-3xl text-[#263e36] sm:text-4xl">
                {currentLanguage === 'nl' ? 'Uitgelichte kaarten' : currentLanguage === 'so' ? 'Kaararka la doortay' : 'Featured cards'}
              </h2>
            </div>
            <a href="#all-cards" className="hidden text-sm font-semibold text-[#35594b] underline-offset-4 hover:underline sm:inline">
              {currentLanguage === 'nl' ? 'Bekijk alle kaarten' : currentLanguage === 'so' ? 'Eeg dhammaan' : 'View all cards'}
            </a>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredCards.map((card) => (
              <CardProductCard
                key={card.id}
                card={card}
                language={currentLanguage}
                featured
                onSelect={handleOpenCustomize}
              />
            ))}
          </div>
        </section>
      )}

      <section id="all-cards" aria-labelledby="card-catalog-heading" className="w-full scroll-mt-8">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#718078]">
            {currentLanguage === 'nl' ? 'DE COLLECTIE' : currentLanguage === 'so' ? 'URURINTA' : 'THE COLLECTION'}
          </p>
          <h2 id="card-catalog-heading" className="mt-2 font-serif text-3xl text-[#263e36] sm:text-4xl">
            {currentLanguage === 'nl' ? 'Alle kaarten' : currentLanguage === 'so' ? 'Dhammaan kaararka' : 'Explore the cards'}
          </h2>
        </div>
        <CardCatalogControls
          language={currentLanguage}
          query={searchQuery}
          occasion={selectedOccasion}
          sort={selectedSort}
          resultCount={filteredCards.length}
          hasFilters={hasCatalogFilters}
          onQueryChange={(value) => updateCatalogParam('q', value, '')}
          onOccasionChange={(occasion) => updateCatalogParam('occasion', occasion, 'all')}
          onSortChange={(sort) => updateCatalogParam('sort', sort, 'featured')}
          onClear={clearCatalogFilters}
        />
        {filteredCards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#cfd8d0] bg-white px-5 py-10 text-center">
            <p className="font-semibold text-[#29443a]">
              {currentLanguage === 'nl'
                ? 'Geen kaarten gevonden. Pas je zoekopdracht of filters aan.'
                : currentLanguage === 'so'
                  ? 'Kaarka lama helin. Beddel raadinta ama shaandhooyinka.'
                  : 'No cards found. Try changing your search or filters.'}
            </p>
            <button
              type="button"
              onClick={clearCatalogFilters}
              className="mt-4 min-h-11 rounded-lg bg-[#285347] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e4338] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
            >
              {currentLanguage === 'nl'
                ? 'Wis filters'
                : currentLanguage === 'so'
                  ? 'Nadiifi shaandhooyinka'
                  : 'Clear filters'}
            </button>
          </div>
        ) : (
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {catalogCards.map((card) => (
            <CardProductCard key={card.id} card={card} language={currentLanguage} onSelect={handleOpenCustomize} />
          ))}
        </div>
        )}
      </section>
      </div>

      <EditorialSections currentLanguage={currentLanguage} />

      {/* Greenvelope-stijl Aanpas-Modal wanneer op een kaart geklikt wordt */}
      {selectedCardForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div
            ref={editorDialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal={!isCheckoutOpen}
            aria-hidden={isCheckoutOpen}
            aria-labelledby="card-editor-heading"
            className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl relative border border-stone-200 my-8 flex flex-col lg:flex-row gap-8"
          >
            
            <button
              type="button"
              onClick={() => setSelectedCardForModal(null)}
              aria-label={currentLanguage === 'so' ? 'Xir tifaftiraha' : 'Close card editor'}
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
                    <Image
                      src={uploadedImage.src}
                      alt="Uploaded card preview"
                      width={uploadedImage.width}
                      height={uploadedImage.height}
                      unoptimized
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
                  type="button"
                  onClick={handleDownload}
                  className="py-3 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition border border-stone-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  📥 Download
                </button>
                <button
                  type="button"
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
                <h3 id="card-editor-heading" className="text-lg font-black text-stone-900 tracking-tight">
                  {currentLanguage === 'so' ? '✍️ Shakhsiyeey Kaarkaaga' : 'Personalize Your Card'}
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="card-recipient" className="block text-[10px] font-bold text-stone-600 uppercase mb-1">To (Recipient)</label>
                    <input
                      id="card-recipient"
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 bg-stone-50 font-medium"
                    />
                  </div>
                  <div>
                    <label htmlFor="card-sender" className="block text-[10px] font-bold text-stone-600 uppercase mb-1">From (Sender)</label>
                    <input
                      id="card-sender"
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 bg-stone-50 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="card-message" className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Message</label>
                  <textarea
                    id="card-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 bg-stone-50 font-medium"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="card-photo" className="block text-[10px] font-bold text-stone-600 uppercase">Photo (Optional)</label>
                    {uploadedImage && (
                      <button type="button" onClick={handleRemoveImage} className="text-[10px] text-rose-600 font-semibold cursor-pointer">Remove</button>
                    )}
                  </div>
                  <input
                    id="card-photo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-xs text-stone-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-amber-50 file:text-amber-700 cursor-pointer bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <button
                type="button"
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