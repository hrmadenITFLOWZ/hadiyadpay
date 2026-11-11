'use client';

import { useState, type ChangeEvent, type PointerEvent, type WheelEvent } from 'react';
import Image from 'next/image';
import type { CardLanguage, CardOption } from '../../lib/card-types';
import CheckoutModal from './CheckoutModal';
import CardArtworkLayer from './CardArtworkLayer';
import useDialogAccessibility from '../hooks/useDialogAccessibility';

interface CardBuilderProps {
  card: CardOption;
  currentLanguage: CardLanguage;
  onClose: () => void;
}

interface UploadedImage {
  src: string;
  width: number;
  height: number;
}

export default function CardBuilder({ card, currentLanguage, onClose }: CardBuilderProps) {
  const [recipientName, setRecipientName] = useState(card.defaultRecipient[currentLanguage]);
  const [senderName, setSenderName] = useState(card.defaultSender[currentLanguage]);
  const [message, setMessage] = useState(card.defaultMessage[currentLanguage]);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [imageScale, setImageScale] = useState(1);
  const [imagePos, setImagePos] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ pointerId: number; x: number; y: number } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const dialogRef = useDialogAccessibility<HTMLDivElement>(!isCheckoutOpen, onClose);

  const text = {
    so: {
      title: 'Shakhsiyeey Kaarkaaga',
      recipient: 'Qaataha',
      sender: 'Diraha',
      message: 'Fariinta',
      photo: 'Sawir ikhtiyaari ah',
      remove: 'Ka saar',
      close: 'Xir tifaftiraha',
      download: 'Soo dejiso',
      share: 'La wadaag',
      personalize: 'Bixi €2.00 oo Dir Hadiyadda',
      invalidImage: 'Fadlan dooro sawir sax ah.',
      imageError: 'Sawirka lama akhrin karin.',
      copied: 'Linkiga waa la guuriyey.',
      shareError: 'Linkiga lama abuuri karin.',
      shareTitle: 'HadiyadPay Kaarka Dhaqanka',
      shareText: `Kaarka HadiyadPay ee gaarka ah ayaa loo sameeyey ${recipientName}.`,
    },
    en: {
      title: 'Personalize your card',
      recipient: 'Recipient',
      sender: 'Sender',
      message: 'Message',
      photo: 'Optional photo',
      remove: 'Remove',
      close: 'Close card editor',
      download: 'Download',
      share: 'Share card',
      personalize: 'Pay €2.00 & Send Card',
      invalidImage: 'Please choose a valid image file.',
      imageError: 'The image could not be read.',
      copied: 'Link copied to clipboard.',
      shareError: 'The card link could not be created.',
      shareTitle: 'HadiyadPay E-Card',
      shareText: `A personalized HadiyadPay card for ${recipientName}.`,
    },
    nl: {
      title: 'Personaliseer je kaart',
      recipient: 'Ontvanger',
      sender: 'Verzender',
      message: 'Bericht',
      photo: 'Optionele foto',
      remove: 'Verwijderen',
      close: 'Kaarteditor sluiten',
      download: 'Downloaden',
      share: 'Kaart delen',
      personalize: 'Betaal €2,00 en verstuur',
      invalidImage: 'Kies een geldig afbeeldingsbestand.',
      imageError: 'De afbeelding kon niet worden gelezen.',
      copied: 'Link gekopieerd.',
      shareError: 'De kaartlink kon niet worden gemaakt.',
      shareTitle: 'HadiyadPay digitale kaart',
      shareText: `Een persoonlijke HadiyadPay-kaart voor ${recipientName}.`,
    },
  }[currentLanguage];

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      window.alert(text.invalidImage);
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => window.alert(text.imageError);
    reader.onload = () => {
      const imageSource = reader.result;
      if (typeof imageSource !== 'string') {
        window.alert(text.imageError);
        return;
      }

      const previewImage = new window.Image();
      previewImage.onerror = () => window.alert(text.imageError);
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
    event.target.value = '';
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (!uploadedImage) return;
    event.preventDefault();
    setImageScale((scale) => Math.min(Math.max(0.5, scale + (event.deltaY < 0 ? 0.1 : -0.1)), 3));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!uploadedImage) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragStart({ pointerId: event.pointerId, x: event.clientX - imagePos.x, y: event.clientY - imagePos.y });
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStart || dragStart.pointerId !== event.pointerId) return;
    setImagePos({ x: event.clientX - dragStart.x, y: event.clientY - dragStart.y });
  };

  const handleShare = async () => {
    const payload = {
      c: card.id,
      t: recipientName,
      f: senderName,
      m: message,
    };

    try {
      const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
      const shareUrl = new URL('/', window.location.origin);
      shareUrl.searchParams.set('lang', currentLanguage);
      shareUrl.hash = new URLSearchParams({ card: encoded }).toString();

      if (navigator.share) {
        try {
          await navigator.share({
            title: text.shareTitle,
            text: text.shareText,
            url: shareUrl.toString(),
          });
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === 'AbortError') return;
          throw error;
        }
      }

      await navigator.clipboard.writeText(`${text.shareText} ${shareUrl.toString()}`);
      window.alert(text.copied);
    } catch (error) {
      console.error('Unable to share card.', error);
      window.alert(text.shareError);
    }
  };

  const handleDownload = () => {
    window.alert(currentLanguage === 'nl' ? 'Downloaden is nog niet beschikbaar.' : currentLanguage === 'so' ? 'Soo dejintu wali lama heli karo.' : 'Card download is not available yet.');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:items-center">
        <div
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal={!isCheckoutOpen}
          aria-hidden={isCheckoutOpen}
          aria-labelledby="card-editor-heading"
          className="relative my-4 flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col gap-8 overflow-y-auto rounded-3xl border border-stone-200 bg-white p-5 shadow-2xl sm:my-8 sm:max-h-[calc(100vh-4rem)] sm:p-8 lg:flex-row"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={text.close}
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-stone-800 hover:bg-stone-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
          >
            ×
          </button>

          <section aria-label={currentLanguage === 'nl' ? 'Kaartvoorbeeld' : currentLanguage === 'so' ? 'Tusaalaha kaarka' : 'Card preview'} className="flex w-full flex-col gap-4 lg:w-1/2">
            <div className="flex items-center justify-between gap-3 pr-12">
              <span className="text-xs font-black uppercase tracking-wider text-stone-800">
                {currentLanguage === 'nl' ? 'Live voorbeeld' : currentLanguage === 'so' ? 'Tusaalaha tooska ah' : 'Live card preview'}
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold text-amber-900">
                {card.badge[currentLanguage]}
              </span>
            </div>

            <div className="relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-2xl border border-white/20 p-6 text-white shadow-xl sm:min-h-[400px] sm:p-8">
              <CardArtworkLayer artwork={card.artwork} language={currentLanguage} />
              <div className="relative z-10 flex items-center justify-between">
                <span className="rounded-lg bg-black/60 px-3 py-1 text-[10px] font-black tracking-widest text-amber-300">HADIYADPAY</span>
                <span aria-hidden="true" className="text-lg">✦</span>
              </div>

              {uploadedImage && (
                <div
                  className="relative z-10 my-3 flex h-36 touch-none select-none items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-black/70"
                  onWheel={handleWheel}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={() => setDragStart(null)}
                  onPointerCancel={() => setDragStart(null)}
                >
                  <Image
                    src={uploadedImage.src}
                    alt={currentLanguage === 'nl' ? 'Geüploade voorbeeldfoto' : currentLanguage === 'so' ? 'Sawirka la doortay' : 'Uploaded card preview'}
                    width={uploadedImage.width}
                    height={uploadedImage.height}
                    unoptimized
                    draggable={false}
                    className="pointer-events-none absolute max-w-none"
                    style={{
                      transform: `translate(${imagePos.x}px, ${imagePos.y}px) scale(${imageScale})`,
                      transformOrigin: 'center center',
                    }}
                  />
                </div>
              )}

              <div className="relative z-10 my-4">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-amber-300">
                  {currentLanguage === 'nl' ? 'VOOR:' : currentLanguage === 'so' ? 'KU:' : 'TO:'}
                </p>
                <h2 className="text-2xl font-black tracking-wide text-white drop-shadow-xl sm:text-3xl">{recipientName}</h2>
              </div>

              <div className="relative z-10 my-2 rounded-xl border border-white/20 bg-black/50 p-4 shadow-lg backdrop-blur-md">
                <p className="text-sm italic font-light leading-relaxed text-amber-50 drop-shadow">&ldquo;{message}&rdquo;</p>
              </div>

              <div className="relative z-10 mt-4 flex items-end justify-between border-t border-white/20 pt-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-200">
                    {currentLanguage === 'nl' ? 'VAN:' : currentLanguage === 'so' ? 'KA:' : 'FROM:'}
                  </p>
                  <p className="text-xs font-black text-white">{senderName}</p>
                </div>
                <span className="rounded bg-white/20 px-2.5 py-0.5 text-[10px] font-black tracking-widest text-amber-300">HADIYADPAY</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDownload}
                className="min-h-11 rounded-xl border border-stone-200 bg-stone-100 px-3 text-xs font-bold text-stone-800 hover:bg-stone-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
              >
                {text.download}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="min-h-11 rounded-xl bg-emerald-700 px-3 text-xs font-black text-white hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
              >
                {text.share}
              </button>
            </div>
          </section>

          <section className="flex w-full flex-col justify-between gap-5 lg:w-1/2">
            <div className="flex flex-col gap-4">
              <h2 id="card-editor-heading" className="pr-12 text-lg font-black tracking-tight text-stone-900">
                {text.title}
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label htmlFor="card-recipient" className="text-xs font-bold uppercase text-stone-600">
                  {text.recipient}
                  <input
                    id="card-recipient"
                    type="text"
                    value={recipientName}
                    onChange={(event) => setRecipientName(event.target.value)}
                    className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 text-sm font-medium normal-case text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                  />
                </label>
                <label htmlFor="card-sender" className="text-xs font-bold uppercase text-stone-600">
                  {text.sender}
                  <input
                    id="card-sender"
                    type="text"
                    value={senderName}
                    onChange={(event) => setSenderName(event.target.value)}
                    className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 text-sm font-medium normal-case text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                  />
                </label>
              </div>

              <label htmlFor="card-message" className="text-xs font-bold uppercase text-stone-600">
                {text.message}
                <textarea
                  id="card-message"
                  rows={4}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm font-medium normal-case text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                />
              </label>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label htmlFor="card-photo" className="text-xs font-bold uppercase text-stone-600">{text.photo}</label>
                  {uploadedImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedImage(null);
                        setImageScale(1);
                        setImagePos({ x: 0, y: 0 });
                      }}
                      className="min-h-9 rounded px-2 text-xs font-semibold text-rose-700 underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                    >
                      {text.remove}
                    </button>
                  )}
                </div>
                <input
                  id="card-photo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-2 file:text-[10px] file:font-bold file:text-amber-800"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCheckoutOpen(true)}
              className="mt-2 min-h-14 w-full rounded-2xl bg-amber-700 px-4 text-sm font-black uppercase tracking-wider text-white shadow-lg hover:bg-amber-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
            >
              {text.personalize}
            </button>
          </section>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedOccasion={card}
        recipientName={recipientName}
        senderName={senderName}
        message={message}
        cardPrice={2}
        initialLanguage={currentLanguage}
      />
    </>
  );
}
