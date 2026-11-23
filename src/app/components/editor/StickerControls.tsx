'use client';

import type {
  CardLanguage,
} from '../../../lib/card-types';

import type {
  EditorSticker,
} from '../../../lib/card-editor';

import {
  getEnabledStickerCategories,
  getStickersByCategory,
  type StickerAsset,
  type StickerCategory,
} from '../../data/stickers';

interface StickerControlsProps {
  language: CardLanguage;

  stickers:
    EditorSticker[];

  selectedStickerId:
    string | null;

  onAddSticker: (
    asset: StickerAsset,
  ) => void;

  onSelectSticker: (
    stickerId: string,
  ) => void;

  onScaleChange: (
    stickerId: string,
    scale: number,
  ) => void;

  onRotationChange: (
    stickerId: string,
    rotation: number,
  ) => void;

  onBringForward: (
    stickerId: string,
  ) => void;

  onSendBackward: (
    stickerId: string,
  ) => void;

  onBringToFront: (
    stickerId: string,
  ) => void;

  onSendToBack: (
    stickerId: string,
  ) => void;

  onDuplicate: (
    stickerId: string,
  ) => void;

  onRemove: (
    stickerId: string,
  ) => void;
}

const MAX_STICKERS =
  20;

export default function StickerControls({
  language,
  stickers,
  selectedStickerId,
  onAddSticker,
  onSelectSticker,
  onScaleChange,
  onRotationChange,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  onDuplicate,
  onRemove,
}: StickerControlsProps) {
  const text = {
    so: {
      title:
        'Qurxi Hadiyaddaada',

      description:
        'Ku dar faahfaahin yar oo Hadiyaddaada ka dhigaysa mid kuu gaar ah.',

      forCard:
        'Ku habboon Hadiyaddan',

      selected:
        'Qurxintaada',

      size:
        'Cabbirka',

      rotation:
        'Wareeji',

      position:
        'Hore iyo gadaal',

      smaller:
        'Yaree',

      larger:
        'Weynee',

      rotateLeft:
        'Bidix',

      rotateRight:
        'Midig',

      forward:
        'Hore',

      backward:
        'Gadaal',

      front:
        'Hore dhammaan',

      back:
        'Gadaal dhammaan',

      duplicate:
        'Mid kale ku dar',

      remove:
        'Ka saar',

      onCard:
        'Ku jira Hadiyaddaada',

      moveHint:
        'Si toos ah ugu jiid Hadiyadda si aad meesha uga beddesho.',

      chooseHint:
        'Taabo qurxin aad jeceshahay si aad ugu darto.',

      noSelection:
        'Taabo qurxin Hadiyadda ku jirta si aad u hagaajiso.',

      limit:
        'Waxaad gaartay tirada ugu badan ee qurxinta.',
    },

    en: {
      title:
        'Decorate your Hadiyad',

      description:
        'Add a beautiful detail that makes your Hadiyad feel even more personal.',

      forCard:
        'Perfect for this card',

      selected:
        'Your decoration',

      size:
        'Size',

      rotation:
        'Turn',

      position:
        'Layering',

      smaller:
        'Smaller',

      larger:
        'Larger',

      rotateLeft:
        'Left',

      rotateRight:
        'Right',

      forward:
        'Forward',

      backward:
        'Backward',

      front:
        'In front of all',

      back:
        'Behind all',

      duplicate:
        'Add another',

      remove:
        'Remove',

      onCard:
        'On your Hadiyad',

      moveHint:
        'Drag it directly on your Hadiyad to find the perfect spot.',

      chooseHint:
        'Tap a detail you love to add it to your Hadiyad.',

      noSelection:
        'Tap a decoration on your Hadiyad to adjust it.',

      limit:
        'You have reached the maximum number of decorations.',
    },

    nl: {
      title:
        'Versier je Hadiyad',

      description:
        'Voeg een mooi detail toe dat jouw Hadiyad nog persoonlijker maakt.',

      forCard:
        'Past mooi bij deze kaart',

      selected:
        'Jouw versiering',

      size:
        'Formaat',

      rotation:
        'Draai',

      position:
        'Voor of achter',

      smaller:
        'Kleiner',

      larger:
        'Groter',

      rotateLeft:
        'Links',

      rotateRight:
        'Rechts',

      forward:
        'Naar voren',

      backward:
        'Naar achteren',

      front:
        'Voor alles',

      back:
        'Achter alles',

      duplicate:
        'Nog een toevoegen',

      remove:
        'Verwijder',

      onCard:
        'Op je Hadiyad',

      moveHint:
        'Sleep de versiering direct over je Hadiyad naar de mooiste plek.',

      chooseHint:
        'Tik op een detail dat je mooi vindt om het toe te voegen.',

      noSelection:
        'Tik op een versiering op je Hadiyad om deze aan te passen.',

      limit:
        'Je hebt het maximale aantal versieringen bereikt.',
    },
  }[
    language
  ];

  const categories =
    getEnabledStickerCategories();

  const selectedSticker =
    selectedStickerId
      ? stickers.find(
          (
            sticker,
          ) =>
            sticker.id ===
            selectedStickerId,
        ) ??
        null
      : null;

  const maximumReached =
    stickers.length >=
    MAX_STICKERS;

  const getCategoryAssets = (
    category:
      StickerCategory,
  ) =>
    getStickersByCategory(
      category,
    );

  const handleScaleChange = (
    difference: number,
  ) => {
    if (
      !selectedSticker
    ) {
      return;
    }

    const nextScale =
      Math.min(
        3,
        Math.max(
          0.25,
          selectedSticker.scale +
            difference,
        ),
      );

    onScaleChange(
      selectedSticker.id,
      Number(
        nextScale.toFixed(
          2,
        ),
      ),
    );
  };

  const handleRotationChange = (
    difference: number,
  ) => {
    if (
      !selectedSticker
    ) {
      return;
    }

    let nextRotation =
      selectedSticker.rotation +
      difference;

    if (
      nextRotation >
      180
    ) {
      nextRotation -=
        360;
    }

    if (
      nextRotation <
      -180
    ) {
      nextRotation +=
        360;
    }

    onRotationChange(
      selectedSticker.id,
      nextRotation,
    );
  };

  return (
    <section
      aria-label={
        text.title
      }
    >
      <details className="group rounded-2xl border border-stone-200 bg-white">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">
          <span className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f8f0e3] text-sm text-[#9a7441]"
            >
              ✦
            </span>

            <span className="min-w-0">
              <span className="block text-sm font-semibold text-stone-800">
                {
                  text.title
                }
              </span>

              {stickers.length >
                0 && (
                <span className="mt-0.5 block text-[10px] text-stone-400">
                  {
                    stickers.length
                  }{' '}
                  op je kaart
                </span>
              )}
            </span>
          </span>

          <span className="flex shrink-0 items-center gap-2">
            {stickers.length >
              0 && (
              <span className="rounded-full bg-[#eef4f1] px-2 py-1 text-[9px] font-bold tabular-nums text-[#285347]">
                {
                  stickers.length
                }
                /
                {
                  MAX_STICKERS
                }
              </span>
            )}

            <span
              aria-hidden="true"
              className="text-sm text-stone-400 transition-transform group-open:rotate-180"
            >
              ↓
            </span>
          </span>
        </summary>

        <div className="space-y-4 border-t border-stone-100 p-3.5">
          <p className="text-[11px] leading-5 text-stone-500">
            {
              text.description
            }
          </p>

          {maximumReached && (
            <p
              role="status"
              className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-4 text-amber-900"
            >
              {
                text.limit
              }
            </p>
          )}

          {categories.map(
            (
              category,
            ) => {
              const assets =
                getCategoryAssets(
                  category.id,
                );

              if (
                assets.length ===
                0
              ) {
                return null;
              }

              return (
                <div
                  key={
                    category.id
                  }
                >
                  <div className="mb-2.5">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#9a7441]">
                      {
                        category.label[
                          language
                        ]
                      }
                    </p>

                    <p className="mt-0.5 text-[10px] text-stone-400">
                      {
                        text.forCard
                      }
                    </p>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {assets.map(
                      (
                        asset,
                      ) => {
                        const addedCount =
                          stickers.filter(
                            (
                              sticker,
                            ) =>
                              sticker.assetId ===
                              asset.id,
                          ).length;

                        return (
                          <button
                            key={
                              asset.id
                            }
                            type="button"
                            disabled={
                              maximumReached
                            }
                            onClick={() =>
                              onAddSticker(
                                asset,
                              )
                            }
                            aria-label={
                              asset.label[
                                language
                              ]
                            }
                            className="group relative flex aspect-square min-w-0 items-center justify-center overflow-hidden rounded-xl border border-stone-200 bg-[#fffdf9] p-1.5 transition hover:-translate-y-0.5 hover:border-[#c9a76c] hover:bg-[#fff9ee] hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                          >
                            <img
                              src={
                                asset.src
                              }
                              alt=""
                              aria-hidden="true"
                              draggable={
                                false
                              }
                              className="pointer-events-none block max-h-full max-w-full select-none object-contain transition duration-200 group-hover:scale-105"
                            />

                            {addedCount >
                              0 && (
                              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#285347] px-1 text-[8px] font-black text-white shadow-sm">
                                {
                                  addedCount
                                }
                              </span>
                            )}
                          </button>
                        );
                      },
                    )}
                  </div>

                  <p className="mt-2 text-[10px] leading-4 text-stone-400">
                    {
                      text.chooseHint
                    }
                  </p>
                </div>
              );
            },
          )}

          {selectedSticker ? (
            <div className="border-t border-stone-100 pt-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#e6d8c1] bg-[#fffaf0] p-1.5">
                  <img
                    src={
                      selectedSticker.src
                    }
                    alt=""
                    aria-hidden="true"
                    draggable={
                      false
                    }
                    className="pointer-events-none block max-h-full max-w-full select-none object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#9a7441]">
                    {
                      text.selected
                    }
                  </p>

                  <p className="mt-0.5 truncate text-xs font-semibold text-[#3d352d]">
                    {
                      selectedSticker.label ||
                      text.selected
                    }
                  </p>
                </div>
              </div>

              <p className="mb-3 text-[10px] leading-4 text-stone-400">
                {
                  text.moveHint
                }
              </p>

              <div className="space-y-3">
                <div className="grid grid-cols-[78px_1fr] items-center gap-3">
                  <span className="text-[11px] font-semibold text-stone-600">
                    {
                      text.size
                    }
                  </span>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleScaleChange(
                          -0.1,
                        )
                      }
                      disabled={
                        selectedSticker.scale <=
                        0.25
                      }
                      aria-label={
                        text.smaller
                      }
                      className="min-h-9 rounded-lg border border-stone-200 bg-white px-2 text-xs font-semibold text-stone-600 transition hover:border-[#baa27f] hover:bg-[#fffaf0] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                    >
                      −{' '}
                      {
                        text.smaller
                      }
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleScaleChange(
                          0.1,
                        )
                      }
                      disabled={
                        selectedSticker.scale >=
                        3
                      }
                      aria-label={
                        text.larger
                      }
                      className="min-h-9 rounded-lg border border-stone-200 bg-white px-2 text-xs font-semibold text-stone-600 transition hover:border-[#baa27f] hover:bg-[#fffaf0] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                    >
                      +{' '}
                      {
                        text.larger
                      }
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-[78px_1fr] items-center gap-3">
                  <span className="text-[11px] font-semibold text-stone-600">
                    {
                      text.rotation
                    }
                  </span>

                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleRotationChange(
                          -15,
                        )
                      }
                      aria-label={
                        text.rotateLeft
                      }
                      className="min-h-9 rounded-lg border border-stone-200 bg-white px-2 text-xs font-semibold text-stone-600 transition hover:border-[#baa27f] hover:bg-[#fffaf0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                    >
                      ↶{' '}
                      {
                        text.rotateLeft
                      }
                    </button>

                    <span className="min-w-10 text-center text-[10px] font-semibold tabular-nums text-stone-400">
                      {
                        Math.round(
                          selectedSticker.rotation,
                        )
                      }
                      °
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleRotationChange(
                          15,
                        )
                      }
                      aria-label={
                        text.rotateRight
                      }
                      className="min-h-9 rounded-lg border border-stone-200 bg-white px-2 text-xs font-semibold text-stone-600 transition hover:border-[#baa27f] hover:bg-[#fffaf0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                    >
                      ↷{' '}
                      {
                        text.rotateRight
                      }
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-[78px_1fr] items-start gap-3">
                  <span className="pt-2 text-[11px] font-semibold text-stone-600">
                    {
                      text.position
                    }
                  </span>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        onBringForward(
                          selectedSticker.id,
                        )
                      }
                      className="min-h-9 rounded-lg border border-stone-200 bg-white px-2 text-[11px] font-semibold text-stone-600 transition hover:border-[#baa27f] hover:bg-[#fffaf0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                    >
                      ↑{' '}
                      {
                        text.forward
                      }
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onSendBackward(
                          selectedSticker.id,
                        )
                      }
                      className="min-h-9 rounded-lg border border-stone-200 bg-white px-2 text-[11px] font-semibold text-stone-600 transition hover:border-[#baa27f] hover:bg-[#fffaf0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                    >
                      ↓{' '}
                      {
                        text.backward
                      }
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onBringToFront(
                          selectedSticker.id,
                        )
                      }
                      className="min-h-9 rounded-lg border border-stone-200 bg-white px-2 text-[11px] font-semibold text-stone-600 transition hover:border-[#baa27f] hover:bg-[#fffaf0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                    >
                      ⇈{' '}
                      {
                        text.front
                      }
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onSendToBack(
                          selectedSticker.id,
                        )
                      }
                      className="min-h-9 rounded-lg border border-stone-200 bg-white px-2 text-[11px] font-semibold text-stone-600 transition hover:border-[#baa27f] hover:bg-[#fffaf0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                    >
                      ⇊{' '}
                      {
                        text.back
                      }
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-stone-100 pt-3">
                  <button
                    type="button"
                    disabled={
                      maximumReached
                    }
                    onClick={() =>
                      onDuplicate(
                        selectedSticker.id,
                      )
                    }
                    className="min-h-10 rounded-xl border border-stone-200 bg-white px-3 text-[11px] font-semibold text-stone-600 transition hover:border-[#baa27f] hover:bg-[#fffaf0] hover:text-[#263e36] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                  >
                    ⧉{' '}
                    {
                      text.duplicate
                    }
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onRemove(
                        selectedSticker.id,
                      )
                    }
                    className="min-h-10 rounded-xl border border-rose-200 bg-rose-50 px-3 text-[11px] font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                  >
                    ×{' '}
                    {
                      text.remove
                    }
                  </button>
                </div>
              </div>
            </div>
          ) : (
            stickers.length >
              0 && (
              <p className="border-t border-stone-100 pt-3 text-[10px] leading-4 text-stone-400">
                {
                  text.noSelection
                }
              </p>
            )
          )}

          {stickers.length >
            0 && (
            <div className="border-t border-stone-100 pt-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-stone-400">
                  {
                    text.onCard
                  }
                </p>

                <span className="text-[9px] font-semibold tabular-nums text-stone-400">
                  {
                    stickers.length
                  }
                  /
                  {
                    MAX_STICKERS
                  }
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {[
                  ...stickers,
                ]
                  .sort(
                    (
                      first,
                      second,
                    ) =>
                      second.zIndex -
                      first.zIndex,
                  )
                  .map(
                    (
                      sticker,
                    ) => {
                      const active =
                        sticker.id ===
                        selectedStickerId;

                      return (
                        <button
                          key={
                            sticker.id
                          }
                          type="button"
                          onClick={() =>
                            onSelectSticker(
                              sticker.id,
                            )
                          }
                          aria-pressed={
                            active
                          }
                          aria-label={
                            sticker.label ||
                            text.selected
                          }
                          className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border p-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347] ${
                            active
                              ? 'border-[#285347] bg-[#eef4f1] ring-1 ring-[#285347]'
                              : 'border-stone-200 bg-white hover:border-[#baa27f] hover:bg-[#fffaf0]'
                          }`}
                        >
                          <img
                            src={
                              sticker.src
                            }
                            alt=""
                            aria-hidden="true"
                            draggable={
                              false
                            }
                            className="pointer-events-none block max-h-full max-w-full select-none object-contain"
                          />
                        </button>
                      );
                    },
                  )}
              </div>
            </div>
          )}
        </div>
      </details>
    </section>
  );
}