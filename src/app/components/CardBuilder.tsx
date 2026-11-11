'use client';

import { useEffect, useReducer, useRef, useState, type ChangeEvent, type PointerEvent, type WheelEvent } from 'react';
import Image from 'next/image';
import type { CardLanguage, CardOption } from '../../lib/card-types';
import {
  createEditorRuntimeState,
  editorAlignmentOptions,
  editorColorOptions,
  editorReducer,
  getActiveSideData,
  getTextStyleForSide,
  loadDraftFromStorage,
  saveDraftToStorage,
  type EditorAction,
  type EditorPhotoLayer,
  type EditorPreviewMode,
} from '../../lib/card-editor';
import CheckoutModal from './CheckoutModal';
import CardArtworkLayer from './CardArtworkLayer';
import useDialogAccessibility from '../hooks/useDialogAccessibility';
import CardSideSelector from './editor/CardSideSelector';
import TextControls from './editor/TextControls';
import PhotoControls from './editor/PhotoControls';
import HistoryControls from './editor/HistoryControls';
import PreviewControls from './editor/PreviewControls';
import ResetControls from './editor/ResetControls';
import EditorStatus from './editor/EditorStatus';

interface CardBuilderProps {
  card: CardOption;
  currentLanguage: CardLanguage;
  onClose: () => void;
}

const fontFamilyMap = {
  sans: 'Arial, Helvetica, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: '"Courier New", monospace',
} as const;

export default function CardBuilder({ card, currentLanguage, onClose }: CardBuilderProps) {
  const initialState = () => {
    const savedDraft = loadDraftFromStorage(card, currentLanguage);
    const runtime = savedDraft ? { draft: savedDraft, history: [savedDraft], historyIndex: 0 } : createEditorRuntimeState(card, currentLanguage);
    return runtime;
  };

  const [editorState, dispatch] = useReducer(editorReducer, { card, currentLanguage }, initialState);
  const [dragStart, setDragStart] = useState<{ pointerId: number; x: number; y: number } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [shareNotice, setShareNotice] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const previewObjectUrlRef = useRef<string | null>(null);
  const dialogRef = useDialogAccessibility<HTMLDivElement>(!isCheckoutOpen, onClose);

  const draft = editorState.draft;
  const activeSideData = getActiveSideData(draft);
  const currentTextStyle = getTextStyleForSide(draft);

  const commitAction = (action: EditorAction) => {
    dispatch(action);
    setHasUnsavedChanges(true);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveDraftToStorage(card, draft);
      setHasUnsavedChanges(false);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [card, draft]);

  useEffect(() => {
    if (!activeSideData.photo?.src || activeSideData.photo.src.startsWith('blob:') === false) {
      return;
    }

    previewObjectUrlRef.current = activeSideData.photo.src;
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
        previewObjectUrlRef.current = null;
      }
    };
  }, [activeSideData.photo?.src]);

  useEffect(() => {
    if (!shareNotice) return;
    const timer = window.setTimeout(() => setShareNotice(null), 2600);
    return () => window.clearTimeout(timer);
  }, [shareNotice]);

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingTarget = Boolean(target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable));
      if (isTypingTarget) return;

      const modifier = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();

      if (modifier && (key === 'z' || key === 'y')) {
        event.preventDefault();
        if (event.shiftKey && key === 'z') {
          dispatch({ type: 'REDO' });
        } else if (key === 'y') {
          dispatch({ type: 'REDO' });
        } else {
          dispatch({ type: 'UNDO' });
        }
        setHasUnsavedChanges(true);
        return;
      }

      if (!activeSideData.photo) return;
      const step = event.shiftKey ? 18 : 8;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        commitAction({ type: 'ADJUST_PHOTO', changes: { x: (activeSideData.photo.x ?? 0) - step } });
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        commitAction({ type: 'ADJUST_PHOTO', changes: { x: (activeSideData.photo.x ?? 0) + step } });
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        commitAction({ type: 'ADJUST_PHOTO', changes: { y: (activeSideData.photo.y ?? 0) - step } });
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        commitAction({ type: 'ADJUST_PHOTO', changes: { y: (activeSideData.photo.y ?? 0) + step } });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSideData.photo, draft]);

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
      resetCard: 'Dib u celi kaar dhan',
      resetSide: 'Dib u celi qaybta hadda',
      resetConfirm: 'Ma hubtaa inaad dib u habeyneysid kaarka oo dhan?',
      edit: 'Tifaftire',
      clean: 'Eegis nadiif',
      full: 'Eegis buuxa',
      moveLeft: 'Goya bidix',
      moveRight: 'Goya midig',
      moveUp: 'Goya kor',
      moveDown: 'Goya hoos',
      rotateLeft: 'Wareeji bidix',
      rotateRight: 'Wareeji midig',
      resetTransform: 'Dib u celi qaabeynta',
      reselectPhoto: 'Sawirka hore waa in dib loo doorataa.',
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
      resetCard: 'Reset full card',
      resetSide: 'Reset active side',
      resetConfirm: 'Are you sure you want to reset the full card?',
      edit: 'Edit',
      clean: 'Clean',
      full: 'Full',
      moveLeft: 'Move left',
      moveRight: 'Move right',
      moveUp: 'Move up',
      moveDown: 'Move down',
      rotateLeft: 'Rotate left',
      rotateRight: 'Rotate right',
      resetTransform: 'Reset transform',
      reselectPhoto: 'The previous photo needs to be selected again.',
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
      resetCard: 'Volledige kaart resetten',
      resetSide: 'Actieve zijde resetten',
      resetConfirm: 'Weet je zeker dat je de hele kaart wilt resetten?',
      edit: 'Bewerken',
      clean: 'Schoon',
      full: 'Volledige',
      moveLeft: 'Links bewegen',
      moveRight: 'Rechts bewegen',
      moveUp: 'Omhoog',
      moveDown: 'Omlaag',
      rotateLeft: 'Links draaien',
      rotateRight: 'Rechts draaien',
      resetTransform: 'Transform resetten',
      reselectPhoto: 'De vorige foto moet opnieuw worden geselecteerd.',
    },
  }[currentLanguage];

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
      window.alert(text.invalidImage);
      event.target.value = '';
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    const savedTransform = activeSideData.photo ?? null;
    if (previewObjectUrlRef.current && previewObjectUrlRef.current !== nextUrl) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
    }

    const previewImage = new window.Image();
    previewImage.onerror = () => {
      URL.revokeObjectURL(nextUrl);
      window.alert(text.imageError);
    };
    previewImage.onload = () => {
      const photo: EditorPhotoLayer = {
        src: nextUrl,
        width: previewImage.naturalWidth,
        height: previewImage.naturalHeight,
        scale: savedTransform?.scale ?? 1,
        x: savedTransform?.x ?? 0,
        y: savedTransform?.y ?? 0,
        rotation: savedTransform?.rotation ?? 0,
        requiresReselection: false,
      };
      commitAction({ type: 'UPLOAD_PHOTO', photo });
    };
    previewImage.src = nextUrl;
    event.target.value = '';
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (!activeSideData.photo) return;
    event.preventDefault();
    const nextScale = Number(Math.min(Math.max(0.5, activeSideData.photo.scale + (event.deltaY < 0 ? 0.1 : -0.1)), 3).toFixed(2));
    commitAction({ type: 'ADJUST_PHOTO', changes: { scale: nextScale } });
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!activeSideData.photo || activeSideData.photo.requiresReselection) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragStart({ pointerId: event.pointerId, x: event.clientX - activeSideData.photo.x, y: event.clientY - activeSideData.photo.y });
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!activeSideData.photo || !dragStart || dragStart.pointerId !== event.pointerId || activeSideData.photo.requiresReselection) return;
    commitAction({
      type: 'ADJUST_PHOTO',
      changes: {
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y,
      },
    });
  };

  const handlePointerUp = () => {
    setDragStart(null);
  };

  const handleShare = () => {
    setShareNotice(text.shareUnavailable);
    window.alert(text.shareUnavailable);
  };

  const handleDownload = () => {
    setShareNotice(text.downloadUnavailable);
    window.alert(text.downloadUnavailable);
  };

  const handleMove = (deltaX: number, deltaY: number) => {
    if (!activeSideData.photo) return;
    commitAction({
      type: 'ADJUST_PHOTO',
      changes: {
        x: (activeSideData.photo.x ?? 0) + deltaX,
        y: (activeSideData.photo.y ?? 0) + deltaY,
      },
    });
  };

  const handleRotate = (amount: number) => {
    if (!activeSideData.photo) return;
    const nextRotation = Math.min(Math.max((activeSideData.photo.rotation ?? 0) + amount, -180), 180);
    commitAction({ type: 'ADJUST_PHOTO', changes: { rotation: nextRotation } });
  };

  const handleResetActiveSide = () => {
    commitAction({ type: 'RESET_ACTIVE_SIDE', card, currentLanguage });
  };

  const handleResetCard = () => {
    if (!window.confirm(text.resetConfirm)) return;
    commitAction({ type: 'RESET_CARD', card, currentLanguage });
  };

  const renderPreviewCard = (side: 'front' | 'inside', compact = false) => {
    const sideData = side === 'front' ? draft.front : draft.inside;
    const sideStyle = getTextStyleForSide({ ...draft, side });
    const sideTextStyle = {
      color: sideStyle.color,
      textAlign: sideStyle.align,
      fontSize: `${sideStyle.size}px`,
      fontFamily: fontFamilyMap[sideStyle.family],
      fontWeight: sideStyle.bold ? 700 : 400,
      fontStyle: sideStyle.italic ? 'italic' : 'normal',
      textDecoration: sideStyle.underline ? 'underline' : 'none',
    } as const;

    const photo = sideData.photo;
    const imageTransform = photo ? `translate(${photo.x}px, ${photo.y}px) scale(${photo.scale}) rotate(${photo.rotation ?? 0}deg)` : 'none';

    return (
      <div className={`${compact ? 'min-h-[220px]' : 'min-h-[360px]'} relative flex flex-col justify-between overflow-hidden rounded-[1.7rem] border border-white/20 p-5 text-white shadow-xl`}>
        <CardArtworkLayer artwork={card.artwork} language={currentLanguage} decorative={false} />
        <div className="pointer-events-none absolute inset-[14px] rounded-[1.25rem] border border-white/25 bg-white/5" aria-hidden="true" />
        {photo && !photo.requiresReselection && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
            <Image
              src={photo.src ?? ''}
              alt={currentLanguage === 'nl' ? 'Geüploade voorbeeldfoto' : currentLanguage === 'so' ? 'Sawirka la doortay' : 'Uploaded card preview'}
              width={photo.width}
              height={photo.height}
              unoptimized
              draggable={false}
              className="pointer-events-none absolute max-w-none object-cover"
              style={{
                transform: imageTransform,
                transformOrigin: 'center center',
                maxHeight: '100%',
              }}
            />
          </div>
        )}

        {side === 'front' ? (
          <>
            <div className="relative z-20 flex items-center justify-between">
              <span className="rounded-lg bg-black/60 px-3 py-1 text-[10px] font-black tracking-[0.18em] text-amber-300">HADIYADPAY</span>
              <span className="text-lg" aria-hidden="true">✦</span>
            </div>
            <div className="relative z-20 my-4 flex flex-col gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300">{currentLanguage === 'nl' ? 'VOOR:' : currentLanguage === 'so' ? 'KU:' : 'TO:'}</p>
              <h2 className="text-2xl font-black tracking-wide text-white drop-shadow-xl sm:text-3xl" style={sideTextStyle}>{sideData.recipient}</h2>
            </div>
            <div className="relative z-20 my-2 rounded-xl border border-white/20 bg-black/40 p-4">
              <p className="text-sm italic font-light leading-relaxed text-amber-50 drop-shadow" style={sideTextStyle}>&ldquo;{sideData.message}&rdquo;</p>
            </div>
            <div className="relative z-20 mt-4 flex items-end justify-between border-t border-white/20 pt-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-200">{currentLanguage === 'nl' ? 'VAN:' : currentLanguage === 'so' ? 'KA:' : 'FROM:'}</p>
                <p className="text-xs font-black text-white" style={sideTextStyle}>{sideData.sender}</p>
              </div>
              <span className="rounded bg-white/20 px-2.5 py-0.5 text-[10px] font-black tracking-[0.18em] text-amber-300">HADIYADPAY</span>
            </div>
          </>
        ) : (
          <div className="relative z-20 my-2 flex flex-1 flex-col justify-between rounded-[1.4rem] border border-white/15 bg-black/30 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300">
              <span>{text.safeArea}</span>
              <span>{card.badge[currentLanguage]}</span>
            </div>
            <div className="mt-4 rounded-xl border border-white/15 bg-white/10 p-4 shadow-inner">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-200">{currentLanguage === 'nl' ? 'Bericht' : currentLanguage === 'so' ? 'Fariinta' : 'Message'}</p>
              <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-white" style={sideTextStyle}>{sideData.message}</p>
            </div>
            <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-200">{currentLanguage === 'nl' ? 'Aan' : currentLanguage === 'so' ? 'Ku' : 'To'}</p>
                <p className="text-sm font-black text-white">{sideData.recipient}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-200">{currentLanguage === 'nl' ? 'Van' : currentLanguage === 'so' ? 'Ka' : 'From'}</p>
                <p className="text-sm font-black text-white">{sideData.sender}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
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
          <button type="button" onClick={onClose} aria-label={text.close} className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-stone-800 transition hover:bg-stone-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">×</button>

          <section aria-label={currentLanguage === 'nl' ? 'Kaartvoorbeeld' : currentLanguage === 'so' ? 'Tusaalaha kaarka' : 'Card preview'} className="flex w-full flex-col gap-4 lg:w-1/2">
            <div className="flex items-center justify-between gap-3 pr-12">
              <span className="text-xs font-black uppercase tracking-wider text-stone-800">{currentLanguage === 'nl' ? 'Live voorbeeld' : currentLanguage === 'so' ? 'Tusaalaha tooska ah' : 'Live card preview'}</span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold text-amber-900">{card.badge[currentLanguage]}</span>
            </div>

            {draft.previewMode === 'full' ? (
              <div className="grid gap-3 lg:grid-cols-2">{renderPreviewCard('front', true)}{renderPreviewCard('inside', true)}</div>
            ) : (
              <div
                className={draft.previewMode === 'clean' ? '' : 'relative'}
                onWheel={handleWheel}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                {renderPreviewCard(draft.side, false)}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={handleDownload} className="min-h-11 rounded-xl border border-stone-200 bg-stone-100 px-3 text-xs font-bold text-stone-800 transition hover:bg-stone-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">{text.download}</button>
              <button type="button" onClick={handleShare} className="min-h-11 rounded-xl bg-emerald-700 px-3 text-xs font-black text-white transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">{text.share}</button>
            </div>
          </section>

          <section className="flex w-full flex-col justify-between gap-5 lg:w-1/2">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3 pr-8">
                <h2 id="card-editor-heading" className="text-lg font-black tracking-tight text-stone-900">{text.title}</h2>
                <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-stone-700">{text.privacy}</span>
              </div>

              <CardSideSelector currentLanguage={currentLanguage} activeSide={draft.side} onSelect={(side) => commitAction({ type: 'SET_SIDE', side })} />

              <PreviewControls
                activeMode={draft.previewMode}
                onSelect={(mode: EditorPreviewMode) => commitAction({ type: 'SET_PREVIEW_MODE', mode })}
                labels={{ edit: text.edit, clean: text.clean, full: text.full }}
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label htmlFor="card-recipient" className="text-xs font-bold uppercase text-stone-600">
                  {text.recipient}
                  <input
                    id="card-recipient"
                    type="text"
                    value={activeSideData.recipient}
                    onChange={(event) => commitAction({ type: 'SET_FIELD', field: 'recipient', value: event.target.value })}
                    className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 text-sm font-medium normal-case text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                  />
                </label>
                <label htmlFor="card-sender" className="text-xs font-bold uppercase text-stone-600">
                  {text.sender}
                  <input
                    id="card-sender"
                    type="text"
                    value={activeSideData.sender}
                    onChange={(event) => commitAction({ type: 'SET_FIELD', field: 'sender', value: event.target.value })}
                    className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 text-sm font-medium normal-case text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                  />
                </label>
              </div>

              <label htmlFor="card-message" className="text-xs font-bold uppercase text-stone-600">
                {text.message}
                <textarea
                  id="card-message"
                  rows={4}
                  value={activeSideData.message}
                  onChange={(event) => commitAction({ type: 'SET_FIELD', field: 'message', value: event.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm font-medium normal-case text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                />
              </label>

              <TextControls
                currentLanguage={currentLanguage}
                value={currentTextStyle}
                onColorSelect={(color) => commitAction({ type: 'SET_TEXT_STYLE', style: { color } })}
                onAlignSelect={(align) => commitAction({ type: 'SET_TEXT_STYLE', style: { align } })}
                onSizeChange={(size) => commitAction({ type: 'SET_TEXT_STYLE', style: { size } })}
                onFontFamilyChange={(family) => commitAction({ type: 'SET_TEXT_FORMAT', field: 'family', value: family })}
                onToggleStyle={(field) => commitAction({ type: 'SET_TEXT_FORMAT', field, value: !currentTextStyle[field] })}
                onResetStyle={() => commitAction({ type: 'RESET_TEXT_STYLE' })}
                colorOptions={editorColorOptions}
                alignmentOptions={editorAlignmentOptions}
              />

              <PhotoControls
                hasPhoto={Boolean(activeSideData.photo && !activeSideData.photo.requiresReselection)}
                onUpload={handleImageUpload}
                onRemove={() => commitAction({ type: 'REMOVE_PHOTO' })}
                onMove={handleMove}
                onRotate={handleRotate}
                onResetTransform={() => commitAction({ type: 'RESET_PHOTO_TRANSFORM' })}
                labels={{
                  photo: text.photo,
                  remove: text.remove,
                  moveLeft: text.moveLeft,
                  moveRight: text.moveRight,
                  moveUp: text.moveUp,
                  moveDown: text.moveDown,
                  rotateLeft: text.rotateLeft,
                  rotateRight: text.rotateRight,
                  reset: text.resetTransform,
                }}
              />
            </div>

            <HistoryControls
              canUndo={editorState.historyIndex > 0}
              canRedo={editorState.historyIndex < editorState.history.length - 1}
              onUndo={() => dispatch({ type: 'UNDO' })}
              onRedo={() => dispatch({ type: 'REDO' })}
              labels={{ undo: text.undo, redo: text.redo }}
            />

            <ResetControls
              onResetActiveSide={handleResetActiveSide}
              onResetCard={handleResetCard}
              labels={{ activeSide: text.resetSide, card: text.resetCard }}
            />

            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setIsCheckoutOpen(true)} className="min-h-14 rounded-2xl bg-amber-700 px-4 text-sm font-black uppercase tracking-wider text-white shadow-lg transition hover:bg-amber-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">{text.personalize}</button>
              <button type="button" aria-live="polite" onClick={handleShare} className="min-h-14 rounded-2xl border border-emerald-700 bg-emerald-50 px-4 text-sm font-black uppercase tracking-wider text-emerald-800 transition hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">{text.share}</button>
            </div>

            <EditorStatus currentLanguage={currentLanguage} shareNotice={shareNotice} photoRequiresReselection={Boolean(activeSideData.photo?.requiresReselection)} />
          </section>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedOccasion={card}
        recipientName={activeSideData.recipient}
        senderName={activeSideData.sender}
        message={activeSideData.message}
        cardPrice={2}
        initialLanguage={currentLanguage}
      />
    </>
  );
}
