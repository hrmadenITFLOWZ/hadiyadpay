'use client';

import {
  useRef,
  type PointerEvent,
} from 'react';

import type {
  CardLanguage,
  CardOption,
} from '../../lib/card-types';

import type {
  EditorPosition,
  EditorSideState,
  EditorTextLayer,
} from '../../lib/card-editor';

import {
  cardInsideColors,
  getCardComposition,
  type CardSide,
} from '../../lib/card-composition';

import {
  getCardProductionProfile,
} from '../../lib/card-production';

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

  onTextSelect?: (
    layer: EditorTextLayer,
  ) => void;

  onTextPositionChange?: (
    layer: EditorTextLayer,
    position: EditorPosition,
    recordHistory: boolean,
  ) => void;

  onPhotoSelect?: () => void;
}

interface TextDragState {
  pointerId: number;
  layer: EditorTextLayer;

  startClientX: number;
  startClientY: number;

  startX: number;
  startY: number;

  currentX: number;
  currentY: number;

  moved: boolean;
}

const fontFamilies = {
  sans:
    'Arial, Helvetica, sans-serif',

  serif:
    'Georgia, "Times New Roman", serif',

  mono:
    '"Courier New", monospace',
} as const;

const clampPosition = (
  value: number,
  min: number,
  max: number,
): number =>
  Math.min(
    max,
    Math.max(
      min,
      value,
    ),
  );

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
  onTextPositionChange,
}: CardCompositionProps) {
  const textDragRef =
    useRef<TextDragState | null>(
      null,
    );

  const layout =
    getCardComposition(
      card,
      cardSide,
    );

  const productionProfile =
    getCardProductionProfile(
      card.id,
    );

  const aspectRatio =
    productionProfile
      ? `${productionProfile.aspectRatio.width} / ${productionProfile.aspectRatio.height}`
      : card.orientation ===
          'portrait'
        ? '1200 / 1464'
        : '1200 / 968';

  const handleTextPointerDown = (
    event:
      PointerEvent<HTMLButtonElement>,
    layer: EditorTextLayer,
  ) => {
    if (
      !interactive ||
      !showEditGuides ||
      !onTextPositionChange
    ) {
      return;
    }

    const position =
      side.textPositions[
        layer
      ];

    event.preventDefault();

    onTextSelect?.(
      layer,
    );

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

    textDragRef.current = {
      pointerId:
        event.pointerId,

      layer,

      startClientX:
        event.clientX,

      startClientY:
        event.clientY,

      startX:
        position.x,

      startY:
        position.y,

      currentX:
        position.x,

      currentY:
        position.y,

      moved:
        false,
    };
  };

  const handleTextPointerMove = (
    event:
      PointerEvent<HTMLButtonElement>,
  ) => {
    const drag =
      textDragRef.current;

    if (
      !drag ||
      drag.pointerId !==
        event.pointerId ||
      !onTextPositionChange
    ) {
      return;
    }

    const cardElement =
      event.currentTarget
        .parentElement;

    if (!cardElement) {
      return;
    }

    const bounds =
      cardElement
        .getBoundingClientRect();

    if (
      bounds.width <= 0 ||
      bounds.height <= 0
    ) {
      return;
    }

    event.preventDefault();

    const deltaX =
      (
        (
          event.clientX -
          drag.startClientX
        ) /
        bounds.width
      ) *
      100;

    const deltaY =
      (
        (
          event.clientY -
          drag.startClientY
        ) /
        bounds.height
      ) *
      100;

    const nextX =
      clampPosition(
        drag.startX +
          deltaX,
        43,
        57,
      );

    const nextY =
      clampPosition(
        drag.startY +
          deltaY,
        8,
        92,
      );

    drag.currentX =
      nextX;

    drag.currentY =
      nextY;

    if (
      Math.abs(
        event.clientX -
          drag.startClientX,
      ) > 2 ||
      Math.abs(
        event.clientY -
          drag.startClientY,
      ) > 2
    ) {
      drag.moved =
        true;
    }

    onTextPositionChange(
      drag.layer,
      {
        x:
          nextX,

        y:
          nextY,
      },
      false,
    );
  };

  const finishTextDrag = (
    event:
      PointerEvent<HTMLButtonElement>,
  ) => {
    const drag =
      textDragRef.current;

    if (
      !drag ||
      drag.pointerId !==
        event.pointerId
    ) {
      return;
    }

    if (
      event.currentTarget
        .hasPointerCapture(
          event.pointerId,
        )
    ) {
      event.currentTarget
        .releasePointerCapture(
          event.pointerId,
        );
    }

    if (
      drag.moved &&
      onTextPositionChange
    ) {
      onTextPositionChange(
        drag.layer,
        {
          x:
            drag.currentX,

          y:
            drag.currentY,
        },
        true,
      );
    }

    textDragRef.current =
      null;
  };

  const renderTextLayer = (
    layer: EditorTextLayer,
  ) => {
    const position =
      side.textPositions[
        layer
      ];

    const style =
      side.textStyles[
        layer
      ];

    const value =
      side[layer];

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

    const height =
      layout.textHeights[
        layer
      ];

    const textStyle = {
      left:
        `${position.x}%`,

      top:
        `${position.y}%`,

      width:
        '86%',

      height:
        `${height}%`,

      color:
        style.color,

      textAlign:
        style.align,

      fontSize:
        layout.protectsBirthdayArtwork
          ? layer ===
              'message'
            ? `max(8px, min(${style.size / 5.5}cqw, 5.2cqw))`
            : `min(${style.size / 5}cqw, 6.5cqw)`
          : `${style.size / 4}cqw`,

      fontFamily:
        fontFamilies[
          style.family
        ],

      fontWeight:
        style.bold
          ? 700
          : 400,

      fontStyle:
        style.italic
          ? 'italic'
          : 'normal',

      textDecoration:
        style.underline
          ? 'underline'
          : 'none',

      textShadow:
        layout.showArtwork &&
        !layout.protectsBirthdayArtwork
          ? '0 2px 8px rgba(0,0,0,.8), 0 1px 2px rgba(0,0,0,.9)'
          : 'none',

      touchAction:
        interactive &&
        showEditGuides
          ? ('none' as const)
          : undefined,

      display:
        'flex',

      alignItems:
        'center',

      justifyContent:
        style.align ===
          'left'
          ? 'flex-start'
          : style.align ===
              'right'
            ? 'flex-end'
            : 'center',

      lineHeight:
        layout.protectsBirthdayArtwork
          ? 1.08
          : 1.18,

      padding:
        '0 2%',

      userSelect:
        interactive
          ? ('none' as const)
          : undefined,
    };

    /*
     * No visible selection ring around the text.
     * The text itself remains draggable.
     */
    const classes =
      `absolute z-20 max-w-[86%] -translate-x-1/2 -translate-y-1/2 overflow-hidden whitespace-pre-wrap break-words leading-tight ${
        interactive
          ? 'cursor-grab active:cursor-grabbing'
          : ''
      } ${
        showEditGuides
          ? 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]'
          : ''
      }`;

    if (!interactive) {
      return (
        <span
          key={
            layer
          }
          className={
            classes
          }
          style={
            textStyle
          }
        >
          {
            value
          }
        </span>
      );
    }

    return (
      <button
        key={
          layer
        }
        type="button"
        data-editor-layer="text"
        data-text-layer={
          layer
        }
        aria-label={`${layerLabel}: ${value || layerLabel}`}
        tabIndex={
          showEditGuides
            ? 0
            : -1
        }
        onFocus={() =>
          onTextSelect?.(
            layer,
          )
        }
        onClick={() =>
          onTextSelect?.(
            layer,
          )
        }
        onPointerDown={(
          event,
        ) =>
          handleTextPointerDown(
            event,
            layer,
          )
        }
        onPointerMove={
          handleTextPointerMove
        }
        onPointerUp={
          finishTextDrag
        }
        onPointerCancel={
          finishTextDrag
        }
        className={
          classes
        }
        style={
          textStyle
        }
      >
        {
          value ||
          (
            showEditGuides
              ? layerLabel
              : ''
          )
        }
      </button>
    );
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-[1.7rem] border border-stone-200 text-white shadow-xl"
      style={{
        aspectRatio,

        containerType:
          'inline-size',

        background:
          layout.showArtwork
            ? undefined
            : `linear-gradient(180deg, ${cardInsideColors.background}, #f5eddf)`,

        boxShadow:
          layout.showArtwork
            ? undefined
            : `inset 0 0 0 8px ${cardInsideColors.background}, inset 0 0 0 10px ${cardInsideColors.border}`,
      }}
    >
      {layout.showArtwork ? (
        <>
          <CardArtworkLayer
            artwork={
              card.artwork
            }
            language={
              language
            }
            decorative={
              false
            }
            overlay={
              false
            }
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

      {showEditGuides && (
        <div
          className="pointer-events-none absolute inset-[14px] z-[2] rounded-[1.25rem] border border-white/25 bg-white/5"
          aria-hidden="true"
        />
      )}

      {layout.showBrand && (
        <span className="pointer-events-none absolute left-[6%] top-[5%] z-20 px-2.5 py-1 text-[10px] font-black tracking-[0.18em] text-amber-100 [text-shadow:0_2px_8px_#000,0_1px_2px_#000] sm:text-xs">
          HADIYADPAY
        </span>
      )}

      {(
        [
          'recipient',
          'message',
          'sender',
        ] as const
      ).map(
        renderTextLayer,
      )}
    </div>
  );
}