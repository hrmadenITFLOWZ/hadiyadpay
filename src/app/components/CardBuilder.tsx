'use client';

import { useEffect, useReducer, useRef, useState, type ChangeEvent, type PointerEvent } from 'react';
import type { CardLanguage, CardOption } from '../../lib/card-types';
import { getCardComposition } from '../../lib/card-composition';
import {
  createEditorRuntimeState,
  editorColorOptions,
  editorReducer,
  getActiveSideData,
  getTextStyleForSide,
  loadDraftFromStorage,
  saveDraftToStorage,
  PHOTO_SCALE_MAX,
  PHOTO_SCALE_MIN,
  type EditorAction,
  type EditorPhotoLayer,
  type EditorPreviewMode,
  type EditorTextLayer,
} from '../../lib/card-editor';
import { serializeEditorDraft } from '../../lib/card-order';
import CheckoutModal from './CheckoutModal';
import CardComposition from './CardComposition';
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

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
const MAX_ORDER_PHOTO_BYTES = 1800 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function revokeOwnedPhotoUrl(url: string, ownedUrls: Set<string>, files: Map<string, File>) {
  if (ownedUrls.delete(url)) {
    URL.revokeObjectURL(url);
    files.delete(url);
  }
}

async function compressPhotoForOrder(file: File): Promise<File> {
  const image = await createImageBitmap(file);
  const longestSide = Math.max(image.width, image.height);
  let scale = Math.min(1, 1800 / longestSide);
  let blob: Blob | null = null;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext('2d');
    if (!context) {
      image.close();
      throw new Error('Photo could not be prepared for checkout');
    }

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.86 - attempt * 0.08));
    if (blob && blob.size <= MAX_ORDER_PHOTO_BYTES) break;
    scale *= 0.82;
  }
  image.close();

  if (!blob || blob.size > MAX_ORDER_PHOTO_BYTES) {
    throw new Error('Photo could not be reduced to the secure upload limit');
  }

  return new File([blob], 'card-photo.jpg', { type: 'image/jpeg' });
}

export default function CardBuilder({ card, currentLanguage, onClose }: CardBuilderProps) {
  const initialState = () => {
    const savedDraft = loadDraftFromStorage(card, currentLanguage);
    const runtime = savedDraft ? { draft: savedDraft, history: [savedDraft], historyIndex: 0 } : createEditorRuntimeState(card, currentLanguage);
    return runtime;
  };

  const [editorState, dispatch] = useReducer(editorReducer, { card, currentLanguage }, initialState);
  const [dragStart, setDragStart] = useState<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    layer: 'photo' | 'text';
    textLayer?: EditorTextLayer;
  } | null>(null);
  const [activeTextLayer, setActiveTextLayer] = useState<EditorTextLayer>('message');
  const [selectedLayer, setSelectedLayer] = useState<'photo' | 'text'>('text');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCheckoutSubmitting, setIsCheckoutSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const ownedPhotoUrlsRef = useRef(new Set<string>());
  const photoFilesRef = useRef(new Map<string, File>());
  const dragMovedRef = useRef(false);
  const checkoutSubmittingRef = useRef(false);
  const isMountedRef = useRef(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const dialogRef = useDialogAccessibility<HTMLDivElement>(!isCheckoutOpen, onClose);

  const draft = editorState.draft;
  const activeSideData = getActiveSideData(draft);
  const currentTextStyle = getTextStyleForSide(draft, activeTextLayer);

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
    const referencedUrls = new Set<string>();
    for (const snapshot of [editorState.draft, ...editorState.history]) {
      for (const side of [snapshot.front, snapshot.inside]) {
        const source = side.photo?.src;
        if (source?.startsWith('blob:')) referencedUrls.add(source);
      }
    }

    for (const url of ownedPhotoUrlsRef.current) {
      if (!referencedUrls.has(url)) {
        revokeOwnedPhotoUrl(url, ownedPhotoUrlsRef.current, photoFilesRef.current);
      }
    }
  }, [editorState]);

  useEffect(() => {
    isMountedRef.current = true;
    const ownedPhotoUrls = ownedPhotoUrlsRef.current;
    const photoFiles = photoFilesRef.current;
    return () => {
      isMountedRef.current = false;
      for (const url of ownedPhotoUrls) revokeOwnedPhotoUrl(url, ownedPhotoUrls, photoFiles);
    };
  }, []);

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
      if (isCheckoutOpen) return;
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

      const direction = {
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
      }[event.key];
      if (!direction) return;

      event.preventDefault();
      const step = event.shiftKey ? 5 : 1.5;
      if (selectedLayer === 'photo' && activeSideData.photo && !activeSideData.photo.requiresReselection) {
        commitAction({
          type: 'ADJUST_PHOTO',
          changes: {
            x: activeSideData.photo.x + direction[0] * step,
            y: activeSideData.photo.y + direction[1] * step,
          },
        });
        return;
      }

      const position = activeSideData.textPositions[activeTextLayer];
      commitAction({
        type: 'SET_TEXT_POSITION',
        layer: activeTextLayer,
        position: {
          x: position.x + direction[0] * step,
          y: position.y + direction[1] * step,
        },
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSideData, activeTextLayer, isCheckoutOpen, selectedLayer]);

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
      personalize: 'Bixi €2.00 oo soo dejiso',
      invalidImage: 'Dooro sawir JPEG, PNG ama WebP oo aan ka weynayn 8 MB.',
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
      zoom: 'Cabbirka sawirka',
      zoomIn: 'Weynee sawirka',
      zoomOut: 'Yaree sawirka',
      resetTransform: 'Dib u celi qaabeynta',
      reselectPhoto: 'Sawirka hore waa in dib loo doorataa.',
      drag: 'Jiido qoraalka ama sawirka si aad u dhaqaajiso',
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
      personalize: 'Pay €2.00 to download',
      invalidImage: 'Choose a JPEG, PNG, or WebP image no larger than 8 MB.',
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
      zoom: 'Photo zoom',
      zoomIn: 'Zoom in on photo',
      zoomOut: 'Zoom out on photo',
      resetTransform: 'Reset transform',
      reselectPhoto: 'The previous photo needs to be selected again.',
      drag: 'Drag text or photo to reposition',
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
      personalize: 'Betaal €2,00 en download',
      invalidImage: 'Kies een JPEG-, PNG- of WebP-afbeelding van maximaal 8 MB.',
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
      zoom: 'Fotozoom',
      zoomIn: 'Foto inzoomen',
      zoomOut: 'Foto uitzoomen',
      resetTransform: 'Transform resetten',
      reselectPhoto: 'De vorige foto moet opnieuw worden geselecteerd.',
      drag: 'Sleep tekst of foto om te verplaatsen',
    },
  }[currentLanguage];

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!SUPPORTED_IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_SIZE_BYTES) {
      window.alert(text.invalidImage);
      event.target.value = '';
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    ownedPhotoUrlsRef.current.add(nextUrl);
    photoFilesRef.current.set(nextUrl, file);
    const savedTransform = activeSideData.photo ?? null;
    const defaultPhotoPosition = getCardComposition(card, draft.side).defaultPhotoPosition;

    const previewImage = new window.Image();
    previewImage.onerror = () => {
      revokeOwnedPhotoUrl(nextUrl, ownedPhotoUrlsRef.current, photoFilesRef.current);
      window.alert(text.imageError);
    };
    previewImage.onload = () => {
      if (!isMountedRef.current) {
        revokeOwnedPhotoUrl(nextUrl, ownedPhotoUrlsRef.current, photoFilesRef.current);
        return;
      }

      const photo: EditorPhotoLayer = {
        src: nextUrl,
        width: previewImage.naturalWidth,
        height: previewImage.naturalHeight,
        scale: savedTransform?.scale ?? 1,
        x: savedTransform?.x ?? defaultPhotoPosition.x,
        y: savedTransform?.y ?? defaultPhotoPosition.y,
        rotation: savedTransform?.rotation ?? 0,
        requiresReselection: false,
      };
      commitAction({ type: 'UPLOAD_PHOTO', photo });
    };
    previewImage.src = nextUrl;
    event.target.value = '';
  };

  const handleZoom = (scale: number) => {
    if (!activeSideData.photo) return;
    const nextScale = Number(Math.min(Math.max(PHOTO_SCALE_MIN, scale), PHOTO_SCALE_MAX).toFixed(2));
    commitAction({ type: 'ADJUST_PHOTO', changes: { scale: nextScale } });
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (draft.previewMode !== 'edit') return;
    const target = event.target as HTMLElement;
    const layerElement = target.closest<HTMLElement>('[data-editor-layer]');
    if (!layerElement) return;

    const layer = layerElement.dataset.editorLayer;
    if (layer === 'photo') {
      if (!activeSideData.photo || activeSideData.photo.requiresReselection) return;
      setSelectedLayer('photo');
      dragMovedRef.current = false;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragStart({
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: activeSideData.photo.x,
        originY: activeSideData.photo.y,
        layer: 'photo',
      });
      return;
    }

    if (layer === 'text') {
      const textLayer = layerElement.dataset.textLayer as EditorTextLayer | undefined;
      if (!textLayer) return;
      const position = activeSideData.textPositions[textLayer];
      setActiveTextLayer(textLayer);
      setSelectedLayer('text');
      dragMovedRef.current = false;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragStart({
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: position.x,
        originY: position.y,
        layer: 'text',
        textLayer,
      });
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStart || dragStart.pointerId !== event.pointerId) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return;
    const x = dragStart.originX + ((event.clientX - dragStart.startX) / bounds.width) * 100;
    const y = dragStart.originY + ((event.clientY - dragStart.startY) / bounds.height) * 100;

    if (dragStart.layer === 'photo') {
      dragMovedRef.current = true;
      commitAction({ type: 'ADJUST_PHOTO', changes: { x, y }, recordHistory: false });
    } else if (dragStart.textLayer) {
      dragMovedRef.current = true;
      commitAction({
        type: 'SET_TEXT_POSITION',
        layer: dragStart.textLayer,
        position: { x, y },
        recordHistory: false,
      });
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart?.pointerId !== event.pointerId) return;
    if (dragMovedRef.current) dispatch({ type: 'COMMIT_DRAFT' });
    dragMovedRef.current = false;
    setDragStart(null);
  };

  const handleRotate = (amount: number) => {
    if (!activeSideData.photo) return;
    const nextRotation = Math.min(Math.max((activeSideData.photo.rotation ?? 0) + amount, -180), 180);
    commitAction({ type: 'ADJUST_PHOTO', changes: { rotation: nextRotation } });
  };

  const handleCheckout = async () => {
    if (checkoutSubmittingRef.current) return;
    checkoutSubmittingRef.current = true;
    setCheckoutError(null);
    setIsCheckoutSubmitting(true);

    try {
      const formData = new FormData();
      formData.set('cardId', card.id);
      formData.set('language', currentLanguage);
      formData.set('draft', JSON.stringify(serializeEditorDraft(draft)));

      for (const [sideName, side] of [['front', draft.front], ['inside', draft.inside]] as const) {
        if (!side.photo) continue;
        if (side.photo.requiresReselection || !side.photo.src) {
          throw new Error(text.reselectPhoto);
        }
        const sourceFile = photoFilesRef.current.get(side.photo.src);
        if (!sourceFile) throw new Error(text.reselectPhoto);
        formData.set(`photo${sideName === 'front' ? 'Front' : 'Inside'}`, await compressPhotoForOrder(sourceFile));
      }

      const response = await fetch('/api/orders', { method: 'POST', body: formData });
      const result: unknown = await response.json().catch(() => null);
      if (!response.ok || !result || typeof result !== 'object' || !('checkoutUrl' in result) || typeof result.checkoutUrl !== 'string') {
        const message = result && typeof result === 'object' && 'error' in result && typeof result.error === 'string'
          ? result.error
          : 'Checkout could not be started. Please try again later.';
        throw new Error(message);
      }

      const checkoutUrl = new URL(result.checkoutUrl);
      if (
        checkoutUrl.protocol !== 'https:' ||
        checkoutUrl.hostname !== 'checkout.stripe.com' ||
        checkoutUrl.username ||
        checkoutUrl.password
      ) {
        throw new Error('The secure checkout URL was not valid');
      }
      window.location.assign(checkoutUrl.toString());
    } catch (error) {
      checkoutSubmittingRef.current = false;
      setCheckoutError(error instanceof Error ? error.message : 'Checkout could not be started. Please try again later.');
      setIsCheckoutSubmitting(false);
    }
  };

  const handleResetActiveSide = () => {
    commitAction({ type: 'RESET_ACTIVE_SIDE', card, currentLanguage });
  };

  const handleResetCard = () => {
    if (!window.confirm(text.resetConfirm)) return;
    commitAction({ type: 'RESET_CARD', card, currentLanguage });
  };

  const renderPreviewCard = (side: 'front' | 'inside', showEditGuides = draft.previewMode === 'edit') => {
    const sideData = side === 'front' ? draft.front : draft.inside;

    return (
      <CardComposition
        card={card}
        language={currentLanguage}
        cardSide={side}
        side={sideData}
        interactive={showEditGuides && draft.previewMode === 'edit' && side === draft.side}
        showEditGuides={showEditGuides}
        activeTextLayer={activeTextLayer}
        selectedLayer={selectedLayer}
        onTextSelect={(layer) => {
          setActiveTextLayer(layer);
          setSelectedLayer('text');
        }}
        onPhotoSelect={() => setSelectedLayer('photo')}
      />
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
          <button type="button" onClick={onClose} disabled={isCheckoutSubmitting} aria-label={text.close} className="card-editor-close-button absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-stone-800 transition hover:bg-stone-200 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">×</button>

          <section ref={previewRef} aria-label={currentLanguage === 'nl' ? 'Kaartvoorbeeld' : currentLanguage === 'so' ? 'Tusaalaha kaarka' : 'Card preview'} className="flex w-full flex-col gap-4 self-start lg:sticky lg:top-4 lg:w-1/2">
            <div className="flex items-center justify-between gap-3 pr-12">
              <span className="text-xs font-black uppercase tracking-wider text-stone-800">{currentLanguage === 'nl' ? 'Live voorbeeld' : currentLanguage === 'so' ? 'Tusaalaha tooska ah' : 'Live card preview'}</span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold text-amber-900">{card.badge[currentLanguage]}</span>
            </div>

            {draft.previewMode === 'full' ? (
              <div className="grid gap-3 lg:grid-cols-2">{renderPreviewCard('front', false)}{renderPreviewCard('inside', false)}</div>
            ) : (
              <div
                className={draft.previewMode === 'clean' ? '' : 'relative'}
                onPointerDown={draft.previewMode === 'edit' ? handlePointerDown : undefined}
                onPointerMove={draft.previewMode === 'edit' ? handlePointerMove : undefined}
                onPointerUp={draft.previewMode === 'edit' ? handlePointerUp : undefined}
                onPointerCancel={draft.previewMode === 'edit' ? handlePointerUp : undefined}
              >
                {renderPreviewCard(draft.side)}
              </div>
            )}

          </section>

          <section className="flex w-full flex-col justify-between gap-5 lg:w-1/2">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pr-8">
                <h2 id="card-editor-heading" className="text-lg font-black tracking-tight text-stone-900">{text.title}</h2>
                <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-stone-700">{text.privacy}</span>
              </div>

              <CardSideSelector currentLanguage={currentLanguage} activeSide={draft.side} onSelect={(side) => commitAction({ type: 'SET_SIDE', side })} />

              <PreviewControls
                activeMode={draft.previewMode}
                onSelect={(mode: EditorPreviewMode) => commitAction({ type: 'SET_PREVIEW_MODE', mode })}
                labels={{ edit: text.edit, clean: text.clean, full: text.full }}
              />

              <TextControls
                currentLanguage={currentLanguage}
                activeLayer={activeTextLayer}
                value={activeSideData[activeTextLayer]}
                style={currentTextStyle}
                onLayerSelect={(layer) => {
                  setActiveTextLayer(layer);
                  setSelectedLayer('text');
                }}
                onValueChange={(value) => commitAction({ type: 'SET_FIELD', field: activeTextLayer, value })}
                onColorSelect={(color) => commitAction({ type: 'SET_TEXT_STYLE', layer: activeTextLayer, style: { color } })}
                onAlignSelect={(align) => commitAction({ type: 'SET_TEXT_STYLE', layer: activeTextLayer, style: { align } })}
                onSizeChange={(size) => commitAction({ type: 'SET_TEXT_STYLE', layer: activeTextLayer, style: { size } })}
                onFontFamilyChange={(family) => commitAction({ type: 'SET_TEXT_FORMAT', layer: activeTextLayer, field: 'family', value: family })}
                onToggleStyle={(field) => commitAction({ type: 'SET_TEXT_FORMAT', layer: activeTextLayer, field, value: !currentTextStyle[field] })}
                onResetStyle={() => commitAction({ type: 'RESET_TEXT_STYLE', layer: activeTextLayer })}
                colorOptions={editorColorOptions}
              />

              <PhotoControls
                hasPhoto={Boolean(activeSideData.photo && !activeSideData.photo.requiresReselection)}
                onUpload={handleImageUpload}
                onRemove={() => commitAction({ type: 'REMOVE_PHOTO' })}
                onRotate={handleRotate}
                onZoom={handleZoom}
                scale={activeSideData.photo?.scale ?? 1}
                rotation={activeSideData.photo?.rotation ?? 0}
                onResetTransform={() => commitAction({
                  type: 'RESET_PHOTO_TRANSFORM',
                  position: getCardComposition(card, draft.side).defaultPhotoPosition,
                })}
                labels={{
                  photo: text.photo,
                  remove: text.remove,
                  adjust: currentLanguage === 'nl' ? 'Foto aanpassen' : currentLanguage === 'so' ? 'Hagaaji sawirka' : 'Adjust photo',
                  rotate: currentLanguage === 'nl' ? 'Rotatie' : currentLanguage === 'so' ? 'Wareeg' : 'Rotation',
                  zoom: text.zoom,
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
              <button type="button" onClick={() => { setCheckoutError(null); setIsCheckoutOpen(true); }} className="col-span-2 min-h-14 rounded-2xl bg-[#285347] px-4 text-sm font-black uppercase tracking-wider text-white shadow-lg transition hover:bg-[#1e4338] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">{text.personalize}</button>
            </div>

            <EditorStatus currentLanguage={currentLanguage} shareNotice={null} photoRequiresReselection={Boolean(activeSideData.photo?.requiresReselection)} />
          </section>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedOccasion={card}
        draft={draft}
        cardPrice={2}
        initialLanguage={currentLanguage}
        isSubmitting={isCheckoutSubmitting}
        error={checkoutError}
        onPay={handleCheckout}
        onEdit={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
