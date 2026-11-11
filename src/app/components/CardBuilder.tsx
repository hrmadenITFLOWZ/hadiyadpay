'use client';

import { useEffect, useReducer, useState, type ChangeEvent, type PointerEvent, type WheelEvent } from 'react';
import Image from 'next/image';
import type { CardLanguage, CardOption } from '../../lib/card-types';
import {
  createEditorRuntimeState,
  editorAlignmentOptions,
  editorColorOptions,
  editorReducer,
  loadDraftFromStorage,
  saveDraftToStorage,
  type EditorPhotoLayer,
} from '../../lib/card-editor';
import CheckoutModal from './CheckoutModal';
import CardArtworkLayer from './CardArtworkLayer';
import useDialogAccessibility from '../hooks/useDialogAccessibility';

interface CardBuilderProps {
  card: CardOption;
  currentLanguage: CardLanguage;
  onClose: () => void;
}

export default function CardBuilder({ card, currentLanguage, onClose }: CardBuilderProps) {
  const [editorState, dispatch] = useReducer(editorReducer, createEditorRuntimeState(card, currentLanguage));
  const { draft } = editorState;
  const [dragStart, setDragStart] = useState<{ pointerId: number; x: number; y: number } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [shareNotice, setShareNotice] = useState<string | null>(null);
  const dialogRef = useDialogAccessibility<HTMLDivElement>(!isCheckoutOpen, onClose);

  useEffect(() => {
    const savedDraft = loadDraftFromStorage(card, currentLanguage);
    if (savedDraft) {
      dispatch({ type: 'LOAD_DRAFT', draft: savedDraft });
    }
  }, [card, currentLanguage]);

  useEffect(() => {
    saveDraftToStorage(card, draft);
  }, [card, draft]);

  useEffect(() => {
    if (!shareNotice) return;
    const timer = window.setTimeout(() => setShareNotice(null), 2600);
    return () => window.clearTimeout(timer);
  }, [shareNotice]);

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
      shareUnavailable: 'La wadaaggu ma heli karo. Fariintaadu waxay ku sii jirtaa qalabkaaga.',
      downloadUnavailable: 'Soo dejintu wali lama heli karo.',
      personalize: 'Bixi €2.00 oo Dir Hadiyadda',
      invalidImage: 'Fadlan dooro sawir sax ah.',
      imageError: 'Sawirka lama akhrin karin.',
      front: 'Hordhaca',
      inside: 'Gudaha',
      textStyle: 'Qaabka qoraalka',
      textSize: 'Cabbirka qoraalka',
      undo: 'Dib u celin',
      redo: 'Mara u samee',
      reset: 'Dib u warshad',
      safeArea: 'Aagga badbaadada',
      privacy: 'Xogta shakhsi ahaaneed ma la abuuri doono link cusub.',
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
      shareUnavailable: 'Secure sharing is not available yet. Your card stays on this device.',
      downloadUnavailable: 'Card download is not available yet.',
      personalize: 'Pay €2.00 & Send Card',
      invalidImage: 'Please choose a valid image file.',
      imageError: 'The image could not be read.',
      front: 'Front',
      inside: 'Inside',
      textStyle: 'Text styling',
      textSize: 'Text size',
      undo: 'Undo',
      redo: 'Redo',
      reset: 'Reset',
      safeArea: 'Safe area',
      privacy: 'New personal-data share links are not generated.',
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
      shareUnavailable: 'Veilig delen is nog niet beschikbaar. Je kaart blijft lokaal op dit apparaat.',
      downloadUnavailable: 'Downloaden is nog niet beschikbaar.',
      personalize: 'Betaal €2,00 en verstuur',
      invalidImage: 'Kies een geldig afbeeldingsbestand.',
      imageError: 'De afbeelding kon niet worden gelezen.',
      front: 'Voorkant',
      inside: 'Binnenkant',
      textStyle: 'Tekststijl',
      textSize: 'Tekstgrootte',
      undo: 'Ongedaan maken',
      redo: 'Opnieuw',
      reset: 'Resetten',
      safeArea: 'Veilig gebied',
      privacy: 'Nieuwe links met persoonlijke gegevens worden niet gemaakt.',
    },
  }[currentLanguage];

  const textStyle = {
    color: draft.textStyle.color,
    textAlign: draft.textStyle.align,
    fontSize: `${draft.textStyle.size}px`,
  } as const;

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
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
        const photo: EditorPhotoLayer = {
          src: imageSource,
          width: previewImage.naturalWidth,
          height: previewImage.naturalHeight,
          scale: 1,
          x: 0,
          y: 0,
        };
        dispatch({ type: 'UPLOAD_PHOTO', photo });
      };
      previewImage.src = imageSource;
    };

    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (!draft.photo) return;
    event.preventDefault();
    const nextScale = Number(Math.min(Math.max(0.5, draft.photo.scale + (event.deltaY < 0 ? 0.1 : -0.1)), 3).toFixed(2));
    dispatch({ type: 'ADJUST_PHOTO', changes: { scale: nextScale } });
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!draft.photo) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragStart({ pointerId: event.pointerId, x: event.clientX - draft.photo.x, y: event.clientY - draft.photo.y });
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draft.photo || !dragStart || dragStart.pointerId !== event.pointerId) return;
    dispatch({
      type: 'ADJUST_PHOTO',
      changes: {
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y,
      },
    });
  };

  const handleShare = () => {
    setShareNotice(text.shareUnavailable);
    window.alert(text.shareUnavailable);
  };

  const handleDownload = () => {
    setShareNotice(text.downloadUnavailable);
    window.alert(text.downloadUnavailable);
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
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-stone-800 transition hover:bg-stone-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
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

            <div className="relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[1.7rem] border border-white/20 p-6 text-white shadow-xl sm:min-h-[420px] sm:p-8">
              <CardArtworkLayer artwork={card.artwork} language={currentLanguage} decorative={false} />
              <div className="pointer-events-none absolute inset-[14px] rounded-[1.25rem] border border-white/25 bg-white/5" aria-hidden="true" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="rounded-lg bg-black/60 px-3 py-1 text-[10px] font-black tracking-[0.18em] text-amber-300">HADIYADPAY</span>
                <span aria-hidden="true" className="text-lg">✦</span>
              </div>

              {draft.photo && (
                <div
                  className="relative z-10 my-3 flex h-36 touch-none select-none items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-black/60"
                  onWheel={handleWheel}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={() => setDragStart(null)}
                  onPointerCancel={() => setDragStart(null)}
                >
                  <Image
                    src={draft.photo.src}
                    alt={currentLanguage === 'nl' ? 'Geüploade voorbeeldfoto' : currentLanguage === 'so' ? 'Sawirka la doortay' : 'Uploaded card preview'}
                    width={draft.photo.width}
                    height={draft.photo.height}
                    unoptimized
                    draggable={false}
                    className="pointer-events-none absolute max-w-none"
                    style={{
                      transform: `translate(${draft.photo.x}px, ${draft.photo.y}px) scale(${draft.photo.scale})`,
                      transformOrigin: 'center center',
                    }}
                  />
                </div>
              )}

              {draft.side === 'front' ? (
                <>
                  <div className="relative z-10 my-4 flex flex-col gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300">
                      {currentLanguage === 'nl' ? 'VOOR:' : currentLanguage === 'so' ? 'KU:' : 'TO:'}
                    </p>
                    <h2 className="text-2xl font-black tracking-wide text-white drop-shadow-xl sm:text-3xl" style={textStyle}>
                      {draft.recipient}
                    </h2>
                  </div>

                  <div className="relative z-10 my-2 rounded-xl border border-white/20 bg-black/40 p-4 shadow-lg backdrop-blur-md">
                    <p className="text-sm italic font-light leading-relaxed text-amber-50 drop-shadow" style={textStyle}>
                      &ldquo;{draft.message}&rdquo;
                    </p>
                  </div>

                  <div className="relative z-10 mt-4 flex items-end justify-between border-t border-white/20 pt-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-200">
                        {currentLanguage === 'nl' ? 'VAN:' : currentLanguage === 'so' ? 'KA:' : 'FROM:'}
                      </p>
                      <p className="text-xs font-black text-white" style={textStyle}>{draft.sender}</p>
                    </div>
                    <span className="rounded bg-white/20 px-2.5 py-0.5 text-[10px] font-black tracking-[0.18em] text-amber-300">HADIYADPAY</span>
                  </div>
                </>
              ) : (
                <div className="relative z-10 my-2 flex flex-1 flex-col justify-between rounded-[1.4rem] border border-white/15 bg-black/30 p-5 backdrop-blur-md">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300">
                    <span>{text.safeArea}</span>
                    <span>{card.badge[currentLanguage]}</span>
                  </div>

                  <div className="mt-4 rounded-xl border border-white/15 bg-white/10 p-4 shadow-inner">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-200">
                      {currentLanguage === 'nl' ? 'Bericht' : currentLanguage === 'so' ? 'Fariinta' : 'Message'}
                    </p>
                    <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-white" style={textStyle}>
                      {draft.message}
                    </p>
                  </div>

                  <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-200">
                        {currentLanguage === 'nl' ? 'Aan' : currentLanguage === 'so' ? 'Ku' : 'To'}
                      </p>
                      <p className="text-sm font-black text-white">{draft.recipient}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-200">
                        {currentLanguage === 'nl' ? 'Van' : currentLanguage === 'so' ? 'Ka' : 'From'}
                      </p>
                      <p className="text-sm font-black text-white">{draft.sender}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDownload}
                className="min-h-11 rounded-xl border border-stone-200 bg-stone-100 px-3 text-xs font-bold text-stone-800 transition hover:bg-stone-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
              >
                {text.download}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="min-h-11 rounded-xl bg-emerald-700 px-3 text-xs font-black text-white transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
              >
                {text.share}
              </button>
            </div>
          </section>

          <section className="flex w-full flex-col justify-between gap-5 lg:w-1/2">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3 pr-8">
                <h2 id="card-editor-heading" className="text-lg font-black tracking-tight text-stone-900">
                  {text.title}
                </h2>
                <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-stone-700">
                  {text.privacy}
                </span>
              </div>

              <div className="flex w-full rounded-xl border border-stone-200 bg-stone-100 p-1" role="tablist" aria-label={text.safeArea}>
                {(['front', 'inside'] as const).map((side) => (
                  <button
                    key={side}
                    type="button"
                    role="tab"
                    aria-selected={draft.side === side}
                    onClick={() => dispatch({ type: 'SET_SIDE', side })}
                    className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] transition ${draft.side === side ? 'bg-white text-[#285347] shadow-sm' : 'text-stone-600'}`}
                  >
                    {side === 'front' ? text.front : text.inside}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label htmlFor="card-recipient" className="text-xs font-bold uppercase text-stone-600">
                  {text.recipient}
                  <input
                    id="card-recipient"
                    type="text"
                    value={draft.recipient}
                    onChange={(event) => dispatch({ type: 'SET_FIELD', field: 'recipient', value: event.target.value })}
                    className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 text-sm font-medium normal-case text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                  />
                </label>
                <label htmlFor="card-sender" className="text-xs font-bold uppercase text-stone-600">
                  {text.sender}
                  <input
                    id="card-sender"
                    type="text"
                    value={draft.sender}
                    onChange={(event) => dispatch({ type: 'SET_FIELD', field: 'sender', value: event.target.value })}
                    className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 text-sm font-medium normal-case text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                  />
                </label>
              </div>

              <label htmlFor="card-message" className="text-xs font-bold uppercase text-stone-600">
                {text.message}
                <textarea
                  id="card-message"
                  rows={4}
                  value={draft.message}
                  onChange={(event) => dispatch({ type: 'SET_FIELD', field: 'message', value: event.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm font-medium normal-case text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                />
              </label>

              <div className="space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase text-stone-600">{text.textStyle}</p>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">{text.safeArea}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {editorColorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={`Select text color ${color}`}
                      onClick={() => dispatch({ type: 'SET_TEXT_STYLE', style: { color } })}
                      className={`h-8 w-8 rounded-full border-2 transition ${draft.textStyle.color === color ? 'border-stone-900' : 'border-white'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  {editorAlignmentOptions.map((alignment) => (
                    <button
                      key={alignment}
                      type="button"
                      onClick={() => dispatch({ type: 'SET_TEXT_STYLE', style: { align: alignment } })}
                      className={`min-h-10 rounded-lg border px-2 text-xs font-bold uppercase tracking-[0.12em] transition ${draft.textStyle.align === alignment ? 'border-[#285347] bg-[#285347]/5 text-[#285347]' : 'border-stone-200 bg-white text-stone-700'}`}
                    >
                      {alignment}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label htmlFor="card-letter-size" className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-600">
                    <span>{text.textSize}</span>
                    <span>{draft.textStyle.size}px</span>
                  </label>
                  <input
                    id="card-letter-size"
                    type="range"
                    min={18}
                    max={52}
                    value={draft.textStyle.size}
                    onChange={(event) => dispatch({ type: 'SET_TEXT_STYLE', style: { size: Number(event.target.value) } })}
                    className="w-full accent-[#285347]"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label htmlFor="card-photo" className="text-xs font-bold uppercase text-stone-600">{text.photo}</label>
                  {draft.photo && (
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'REMOVE_PHOTO' })}
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

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => dispatch({ type: 'UNDO' })}
                disabled={editorState.historyIndex <= 0}
                className="min-h-11 rounded-xl border border-stone-200 bg-stone-100 px-3 text-xs font-bold text-stone-800 transition hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
              >
                {text.undo}
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: 'REDO' })}
                disabled={editorState.historyIndex >= editorState.history.length - 1}
                className="min-h-11 rounded-xl border border-stone-200 bg-stone-100 px-3 text-xs font-bold text-stone-800 transition hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
              >
                {text.redo}
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: 'RESET', card, currentLanguage })}
                className="min-h-11 rounded-xl border border-stone-200 bg-stone-100 px-3 text-xs font-bold text-stone-800 transition hover:bg-stone-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
              >
                {text.reset}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
                className="min-h-14 rounded-2xl bg-amber-700 px-4 text-sm font-black uppercase tracking-wider text-white shadow-lg transition hover:bg-amber-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
              >
                {text.personalize}
              </button>
              <button
                type="button"
                aria-live="polite"
                onClick={handleShare}
                className="min-h-14 rounded-2xl border border-emerald-700 bg-emerald-50 px-4 text-sm font-black uppercase tracking-wider text-emerald-800 transition hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
              >
                {text.share}
              </button>
            </div>

            {shareNotice && (
              <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
                {shareNotice}
              </p>
            )}
          </section>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedOccasion={card}
        recipientName={draft.recipient}
        senderName={draft.sender}
        message={draft.message}
        cardPrice={2}
        initialLanguage={currentLanguage}
      />
    </>
  );
}
