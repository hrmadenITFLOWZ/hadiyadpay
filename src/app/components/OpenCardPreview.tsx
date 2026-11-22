'use client';

import {
  useRef,
  type PointerEvent,
} from 'react';

import type {
  CardLanguage,
  CardOption,
} from '../../lib/card-types';

import {
  PHOTO_FRAME_SIZES,
  type EditorPosition,
  type EditorSideState,
  type EditorTextLayer,
} from '../../lib/card-editor';

import CardArtworkLayer from './CardArtworkLayer';
import CardComposition from './CardComposition';

interface OpenCardPreviewProps {
  card: CardOption;
  language: CardLanguage;
  inside: EditorSideState;
  isOpen: boolean;
  interactive?: boolean;
  showEditGuides?: boolean;
  activeTextLayer?: EditorTextLayer;
  selectedLayer?: 'photo' | 'text';
  onOpen?: () => void;
  onClose?: () => void;
  onRequestPhoto?: () => void;

  onTextSelect?: (
    layer: EditorTextLayer,
  ) => void;

  onTextPositionChange?: (
    layer: EditorTextLayer,
    position: EditorPosition,
    recordHistory: boolean,
  ) => void;

  onPhotoSelect?: () => void;

  onPhotoPositionChange?: (
    position: EditorPosition,
    recordHistory: boolean,
  ) => void;
}

interface PhotoDragState {
  pointerId: number;

  startClientX: number;
  startClientY: number;

  startPhotoX: number;
  startPhotoY: number;

  currentPhotoX: number;
  currentPhotoY: number;

  moved: boolean;
}

export default function OpenCardPreview({
  card,
  language,
  inside,
  isOpen,
  interactive = false,
  showEditGuides = false,
  activeTextLayer = 'message',
  selectedLayer = 'text',
  onOpen,
  onClose,
  onRequestPhoto,
  onTextSelect,
  onTextPositionChange,
  onPhotoSelect,
  onPhotoPositionChange,
}: OpenCardPreviewProps) {
  const photoDragRef =
    useRef<PhotoDragState | null>(
      null,
    );

  const text = {
    so: {
      open:
        'Fur kaarka',

      close:
        'Xir kaarka',

      insideLeft:
        'Sawirka gudaha',

      photo:
        'Ku dar sawir',

      addPhoto:
        'Guji halkan si aad sawir ugu darto Hadiyaddaada.',

      choosePhoto:
        'Dooro sawir',

      movePhoto:
        'Jiido sawirka si aad u hagaajiso qaybta muuqata',
    },

    en: {
      open:
        'Open card',

      close:
        'Close card',

      insideLeft:
        'Inside photo',

      photo:
        'Add a photo',

      addPhoto:
        'Click here to add a personal photo to your Hadiyad.',

      choosePhoto:
        'Choose a photo',

      movePhoto:
        'Drag the photo to adjust the visible area',
    },

    nl: {
      open:
        'Open kaart',

      close:
        'Sluit kaart',

      insideLeft:
        'Foto binnenin',

      photo:
        'Voeg een foto toe',

      addPhoto:
        'Klik hier om een persoonlijke foto aan je Hadiyad toe te voegen.',

      choosePhoto:
        'Kies een foto',

      movePhoto:
        'Sleep de foto om het zichtbare gedeelte aan te passen',
    },
  }[
    language
  ];

  const coverAspectRatio =
    card.orientation ===
    'portrait'
      ? '2 / 3'
      : '4 / 3';

  const photo =
    inside.photo;

  const hasUsablePhoto =
    Boolean(
      photo?.src &&
      !photo.requiresReselection,
    );

  const framePercent =
    photo
      ? PHOTO_FRAME_SIZES[
          photo.frameSize
        ]
      : PHOTO_FRAME_SIZES.large;

  const frameInsetPercent =
    (
      100 -
      framePercent
    ) /
    2;

  const clampPercentage = (
    value: number,
  ): number =>
    Math.min(
      100,
      Math.max(
        0,
        value,
      ),
    );

  const handlePhotoPointerDown = (
    event:
      PointerEvent<HTMLButtonElement>,
  ) => {
    if (
      !interactive ||
      !photo ||
      photo.requiresReselection ||
      !onPhotoPositionChange
    ) {
      return;
    }

    event.preventDefault();

    onPhotoSelect?.();

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

    photoDragRef.current = {
      pointerId:
        event.pointerId,

      startClientX:
        event.clientX,

      startClientY:
        event.clientY,

      startPhotoX:
        photo.x,

      startPhotoY:
        photo.y,

      currentPhotoX:
        photo.x,

      currentPhotoY:
        photo.y,

      moved:
        false,
    };
  };

  const handlePhotoPointerMove = (
    event:
      PointerEvent<HTMLButtonElement>,
  ) => {
    const drag =
      photoDragRef.current;

    if (
      !drag ||
      drag.pointerId !==
        event.pointerId ||
      !onPhotoPositionChange
    ) {
      return;
    }

    const bounds =
      event.currentTarget
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
      clampPercentage(
        drag.startPhotoX -
          deltaX,
      );

    const nextY =
      clampPercentage(
        drag.startPhotoY -
          deltaY,
      );

    drag.currentPhotoX =
      nextX;

    drag.currentPhotoY =
      nextY;

    const hasMoved =
      Math.abs(
        event.clientX -
          drag.startClientX,
      ) >
        2 ||
      Math.abs(
        event.clientY -
          drag.startClientY,
      ) >
        2;

    if (hasMoved) {
      drag.moved =
        true;
    }

    onPhotoPositionChange(
      {
        x:
          nextX,

        y:
          nextY,
      },
      false,
    );
  };

  const finishPhotoDrag = (
    event:
      PointerEvent<HTMLButtonElement>,
  ) => {
    const drag =
      photoDragRef.current;

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
      onPhotoPositionChange
    ) {
      onPhotoPositionChange(
        {
          x:
            drag.currentPhotoX,

          y:
            drag.currentPhotoY,
        },
        true,
      );
    }

    photoDragRef.current =
      null;
  };

  if (!isOpen) {
    return (
      <div className="mx-auto w-full max-w-[34rem]">
        <button
          type="button"
          onClick={
            onOpen
          }
          aria-label={
            text.open
          }
          className="group block w-full rounded-[1.7rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#285347]"
        >
          <div
            className="relative w-full overflow-hidden rounded-[1.7rem] border border-[#ded7cc] bg-[#f7f1e8] shadow-xl transition duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl"
            style={{
              aspectRatio:
                coverAspectRatio,
            }}
          >
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
              fit="contain"
              backgroundColor="#f7f1e8"
            />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {onClose && (
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={
              onClose
            }
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-600 transition hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
          >
            <span
              aria-hidden="true"
              className="mr-1.5"
            >
              ←
            </span>

            {
              text.close
            }
          </button>
        </div>
      )}

      <div className="relative mx-auto grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-[1.6rem] border border-[#d9d0c2] bg-[#fffaf0] shadow-2xl md:grid-cols-2">
        <section
          aria-label={
            text.insideLeft
          }
          className="relative min-h-[28rem] overflow-hidden border-b border-[#ded5c8] bg-[#f6eddf] md:border-b-0 md:border-r"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 25% 25%, rgba(216,189,141,0.13), transparent 34%), radial-gradient(circle at 76% 72%, rgba(40,83,71,0.05), transparent 34%), linear-gradient(145deg, #fffaf0, #f6eddf)',
            }}
          />

          {hasUsablePhoto &&
          photo?.src ? (
            <button
              type="button"
              disabled={
                !interactive
              }
              data-editor-layer="photo"
              aria-label={
                text.movePhoto
              }
              aria-pressed={
                interactive &&
                selectedLayer ===
                  'photo'
              }
              tabIndex={
                interactive &&
                showEditGuides
                  ? 0
                  : -1
              }
              onFocus={
                onPhotoSelect
              }
              onClick={
                onPhotoSelect
              }
              onPointerDown={
                handlePhotoPointerDown
              }
              onPointerMove={
                handlePhotoPointerMove
              }
              onPointerUp={
                finishPhotoDrag
              }
              onPointerCancel={
                finishPhotoDrag
              }
              className={`absolute overflow-hidden rounded-[1.15rem] border border-white/80 bg-[#e8ddca] shadow-[0_12px_30px_rgba(65,47,27,0.16)] transition-[inset,box-shadow] duration-300 ${
                interactive
                  ? 'touch-none cursor-grab active:cursor-grabbing'
                  : 'cursor-default'
              } ${
                interactive &&
                selectedLayer ===
                  'photo' &&
                showEditGuides
                  ? 'ring-2 ring-[#285347] ring-offset-2 ring-offset-[#fffaf0]'
                  : ''
              } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]`}
              style={{
                inset:
                  `${frameInsetPercent}%`,
              }}
            >
              <img
                src={
                  photo.src
                }
                alt=""
                draggable={
                  false
                }
                className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
                style={{
                  objectPosition:
                    `${photo.x}% ${photo.y}%`,

                  transform:
                    `scale(${Math.max(
                      1,
                      photo.scale,
                    )}) rotate(${photo.rotation}deg)`,

                  transformOrigin:
                    `${photo.x}% ${photo.y}%`,
                }}
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5"
              />

              {interactive &&
                showEditGuides && (
                  <>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 border border-dashed border-white/80"
                    />

                    <div className="pointer-events-none absolute inset-x-4 bottom-4 flex justify-center">
                      <span className="rounded-full border border-white/60 bg-black/45 px-3 py-1.5 text-[10px] font-semibold text-white shadow-sm backdrop-blur-sm">
                        {
                          text.movePhoto
                        }
                      </span>
                    </div>
                  </>
                )}
            </button>
          ) : (
            <button
              type="button"
              onClick={
                onRequestPhoto
              }
              className="group absolute inset-[4%] flex cursor-pointer items-center justify-center overflow-hidden rounded-[1.2rem] border border-[#ddc79f]/80 bg-[#f8f0e3] transition hover:border-[#c9a76c] hover:bg-[#f5ead8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[5%] rounded-[1rem] border border-[#ddc79f]/60"
              />

              <div className="relative z-10 px-6 text-center">
                <div
                  aria-hidden="true"
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#d8bd8d] bg-white/80 font-serif text-2xl text-[#9a7441] shadow-sm transition group-hover:scale-105 group-hover:shadow-md"
                >
                  ♡
                </div>

                <p className="mt-5 font-serif text-lg text-[#594b3f]">
                  {
                    text.photo
                  }
                </p>

                <p className="mx-auto mt-2 max-w-[15rem] text-xs leading-5 text-[#8a7765]">
                  {
                    text.addPhoto
                  }
                </p>

                <span className="mt-4 inline-flex min-h-9 items-center justify-center rounded-full bg-white/85 px-4 text-xs font-semibold text-[#285347] shadow-sm transition group-hover:bg-white">
                  <span
                    aria-hidden="true"
                    className="mr-1.5"
                  >
                    +
                  </span>

                  {
                    text.choosePhoto
                  }
                </span>
              </div>
            </button>
          )}
        </section>

        <section className="relative min-w-0 overflow-hidden bg-[#fffaf0]">
          <CardComposition
            card={
              card
            }
            language={
              language
            }
            cardSide="inside"
            side={{
              ...inside,

              photo:
                null,
            }}
            interactive={
              interactive
            }
            showEditGuides={
              showEditGuides
            }
            activeTextLayer={
              activeTextLayer
            }
            selectedLayer={
              selectedLayer
            }
            onTextSelect={
              onTextSelect
            }
            onTextPositionChange={
              onTextPositionChange
            }
          />
        </section>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-black/15 to-transparent shadow-[0_0_12px_rgba(0,0,0,0.16)] md:block"
        />
      </div>
    </div>
  );
}