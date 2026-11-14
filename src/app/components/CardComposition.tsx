'use client';

import Image from 'next/image';

import type { CardLanguage, CardOption } from '../../lib/card-types';
import type {
  EditorSideState,
  EditorTextLayer,
} from '../../lib/card-editor';
import {
  cardInsideColors,
  getCardComposition,
  type CardSide,
} from '../../lib/card-composition';

import CardArtworkLayer from './CardArtworkLayer';

interface CardCompositionProps {
  card: CardOption;
  language: CardLanguage;
  cardSide: CardSide;
  side: EditorSideState;
  interactive?: boolean;
  showEditGuides?: boolean;
  activeTextLayer?: EditorTextLayer;
  selectedLayer?: 'photo' | 'text';
  onTextSelect?: (layer: EditorTextLayer) => void;
  onPhotoSelect?: () => void;
}

const fontFamilies = {
  fredoka:
    'var(--font-fredoka), "Arial Rounded MT Bold", Arial, sans-serif',
  baloo:
    'var(--font-baloo), "Arial Rounded MT Bold", Arial, sans-serif',
  nunito:
    'var(--font-nunito), Arial, Helvetica, sans-serif',
  playfair:
    'var(--font-playfair), Georgia, "Times New Roman", serif',

  /*
   * Legacy values remain available while older locally saved drafts
   * are migrated by card-editor.ts.
   */
  sans:
    'var(--font-nunito), Arial, Helvetica, sans-serif',
  serif:
    'var(--font-playfair), Georgia, "Times New Roman", serif',
  mono:
    'var(--font-nunito), Arial, Helvetica, sans-serif',
} as const;

export default function CardComposition({
  card,
  language,
  cardSide,
  side,
  interactive = false,
  showEditGuides = false,
  activeTextLayer = 'message',
  selectedLayer = 'text',
  onTextSelect,
  onPhotoSelect,
}: CardCompositionProps) {
  const layout = getCardComposition(card, cardSide);
  const photo = side.photo;

  const renderTextLayer = (layer: EditorTextLayer) => {
    const position = side.textPositions[layer];
    const style = side.textStyles[layer];
    const value = side[layer].trim();

    /*
     * Empty recipient, message, or sender fields are completely omitted.
     * This also prevents empty text layers from appearing in downloads.
     */
    if (!value) {
      return null;
    }

    const layerLabel =
      layer === 'recipient'
        ? language === 'nl'
          ? 'Ontvanger'
          : language === 'so'
            ? 'Qaataha'
            : 'Recipient'
        : layer === 'sender'
          ? language === 'nl'
            ? 'Verzender'
            : language === 'so'
              ? 'Diraha'
              : 'Sender'
          : language === 'nl'
            ? 'Bericht'
            : language === 'so'
              ? 'Fariin'
              : 'Message';

    const isActive =
      interactive &&
      activeTextLayer === layer &&
      selectedLayer === 'text';

    const height = layout.textHeights[layer];

    const textStyle = {
      left: `${position.x}%`,
      top: `${position.y}%`,
      width: '86%',
      height: `${height}%`,
      color: style.color,
      textAlign: style.align,
      fontSize: layout.protectsBirthdayArtwork
        ? layer === 'message'
          ? `max(8px, min(${style.size / 5.5}cqw, 5.2cqw))`
          : `min(${style.size / 5}cqw, 6.5cqw)`
        : `${style.size / 4}cqw`,
      fontFamily:
        fontFamilies[style.family as keyof typeof fontFamilies] ??
        fontFamilies.nunito,
      fontWeight: style.bold ? 700 : 400,
      fontStyle: style.italic ? 'italic' : 'normal',
      textDecoration: style.underline ? 'underline' : 'none',
      textShadow:
        layout.showArtwork && !layout.protectsBirthdayArtwork
          ? '0 2px 8px rgba(0,0,0,.8), 0 1px 2px rgba(0,0,0,.9)'
          : 'none',
      touchAction: showEditGuides
        ? ('none' as const)
        : undefined,
      display: 'flex',
      alignItems: 'center',
      justifyContent:
        style.align === 'left'
          ? 'flex-start'
          : style.align === 'right'
            ? 'flex-end'
            : 'center',
      lineHeight: layout.protectsBirthdayArtwork ? 1.08 : 1.18,
      padding: '0 2%',
      border: 'none',
      background: 'transparent',
      boxShadow: 'none',
      outline: 'none',
    };

    const classes = [
      'absolute',
      'z-20',
      'max-w-[86%]',
      '-translate-x-1/2',
      '-translate-y-1/2',
      'overflow-hidden',
      'whitespace-pre-wrap',
      'break-words',
      'leading-tight',
      'border-0',
      'bg-transparent',
      'p-0',
      interactive ? 'cursor-grab active:cursor-grabbing' : '',
      isActive && showEditGuides
        ? 'drop-shadow-[0_0_5px_rgba(255,255,255,0.45)]'
        : '',
    ]
      .filter(Boolean)
      .join(' ');

    if (!interactive) {
      return (
        <span
          key={layer}
          className={classes}
          style={textStyle}
        >
          {value}
        </span>
      );
    }

    return (
      <button
        key={layer}
        type="button"
        data-editor-layer="text"
        data-text-layer={layer}
        aria-label={`${layerLabel}: ${value}`}
        aria-pressed={isActive}
        tabIndex={showEditGuides ? 0 : -1}
        onFocus={() => onTextSelect?.(layer)}
        onClick={() => onTextSelect?.(layer)}
        className={classes}
        style={textStyle}
      >
        {value}
      </button>
    );
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[1.7rem] border border-stone-200 text-white shadow-xl ${
        card.orientation === 'portrait'
          ? 'aspect-[1200/1464]'
          : 'aspect-[1200/968]'
      }`}
      style={{
        containerType: 'inline-size',
        background: layout.showArtwork
          ? undefined
          : `linear-gradient(180deg, ${cardInsideColors.background}, #f5eddf)`,
        boxShadow: layout.showArtwork
          ? undefined
          : `inset 0 0 0 8px ${cardInsideColors.background}, inset 0 0 0 10px ${cardInsideColors.border}`,
      }}
    >
      {layout.showArtwork ? (
        <>
          <CardArtworkLayer
            artwork={card.artwork}
            language={language}
            decorative={false}
            overlay={false}
          />

          {!layout.protectsBirthdayArtwork && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[1]"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(16, 23, 19, .12) 0%, rgba(16, 23, 19, .02) 48%, rgba(16, 23, 19, .48) 100%)',
              }}
            />
          )}
        </>
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <span className="absolute left-[8%] right-[8%] top-[10%] h-px bg-[#d8bd8d]" />
          <span className="absolute bottom-[10%] left-[8%] right-[8%] h-px bg-[#d8bd8d]" />
          <span className="absolute left-1/2 top-[10%] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b47855]" />
          <span className="absolute bottom-[10%] left-1/2 h-2.5 w-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#b47855]" />
        </div>
      )}

      {photo?.src && !photo.requiresReselection && (
        <button
          type="button"
          disabled={!interactive}
          data-editor-layer="photo"
          aria-label={
            language === 'nl'
              ? 'Foto selecteren en verplaatsen'
              : language === 'so'
                ? 'Dooro oo dhaqaaji sawirka'
                : 'Select and move photo'
          }
          aria-pressed={
            interactive && selectedLayer === 'photo'
          }
          tabIndex={
            interactive && showEditGuides ? 0 : -1
          }
          onFocus={onPhotoSelect}
          onClick={onPhotoSelect}
          className={`absolute z-30 aspect-square w-[22%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-white shadow-lg ${
            showEditGuides
              ? 'touch-none cursor-grab active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
              : ''
          } ${
            interactive &&
            selectedLayer === 'photo' &&
            showEditGuides
              ? 'ring-2 ring-white/70'
              : ''
          }`}
          style={{
            left: `${photo.x}%`,
            top: `${photo.y}%`,
          }}
        >
          <Image
            src={photo.src}
            alt={
              language === 'nl'
                ? 'Geüploade voorbeeldfoto'
                : language === 'so'
                  ? 'Sawirka la doortay'
                  : 'Uploaded card preview'
            }
            width={photo.width}
            height={photo.height}
            unoptimized
            draggable={false}
            className="h-full w-full object-cover"
            style={{
              transform: `scale(${photo.scale}) rotate(${photo.rotation}deg)`,
              transformOrigin: 'center center',
            }}
          />
        </button>
      )}

      {(
        ['recipient', 'message', 'sender'] as const
      ).map(renderTextLayer)}
    </div>
  );
}