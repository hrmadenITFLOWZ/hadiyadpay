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

  stickers: EditorSticker[];

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
        'Qurxinta',

      description:
        'Dooro qurxin oo ku dar Hadiyaddaada.',

      forCard:
        'Ku habboon kaarkan',

      added:
        'Lagu daray',

      selected:
        'Qurxinta la doortay',

      size:
        'Cabbirka',

      rotation:
        'Wareeji',

      smaller:
        'Yaree',

      larger:
        'Weynee',

      rotateLeft:
        'Bidix u wareeji',

      rotateRight:
        'Midig u wareeji',

      layers:
        'Lakabyada',

      forward:
        'Hore u soo qaad',

      backward:
        'Dib u dhig',

      front:
        'U keen hore',

      back:
        'U dir gadaal',

      duplicate:
        'Nuqul samee',

      remove:
        'Ka saar',

      noSelection:
        'Dooro qurxin kaarka ku jirta si aad u hagaajiso.',

      tapHint:
        'Taabo qurxin si aad ugu darto kaarka.',

      moveHint:
        'Qurxinta si toos ah ugu jiid kaarka si aad meesha uga beddesho.',

      limit:
        'Waxaad gaartay tirada ugu badan ee qurxinta.',
    },

    en: {
      title:
        'Stickers',

      description:
        'Add a finishing touch to your Hadiyad.',

      forCard:
        'Made for this card',

      added:
        'Added',

      selected:
        'Selected sticker',

      size:
        'Size',

      rotation:
        'Rotation',

      smaller:
        'Smaller',

      larger:
        'Larger',

      rotateLeft:
        'Rotate left',

      rotateRight:
        'Rotate right',

      layers:
        'Layers',

      forward:
        'Bring forward',

      backward:
        'Send backward',

      front:
        'Bring to front',

      back:
        'Send to back',

      duplicate:
        'Duplicate',

      remove:
        'Remove',

      noSelection:
        'Select a sticker on the card to adjust it.',

      tapHint:
        'Tap a sticker to add it to your card.',

      moveHint:
        'Drag a sticker directly on the card to reposition it.',

      limit:
        'You have reached the maximum number of stickers.',
    },

    nl: {
      title:
        'Stickers',

      description:
        'Geef je Hadiyad een persoonlijke finishing touch.',

      forCard:
        'Voor deze kaart',

      added:
        'Toegevoegd',

      selected:
        'Geselecteerde sticker',

      size:
        'Grootte',

      rotation:
        'Draaien',

      smaller:
        'Kleiner',

      larger:
        'Groter',

      rotateLeft:
        'Links draaien',

      rotateRight:
        'Rechts draaien',

      layers:
        'Lagen',

      forward:
        'Naar voren',

      backward:
        'Naar achteren',

      front:
        'Helemaal vooraan',

      back:
        'Helemaal achteraan',

      duplicate:
        'Dupliceren',

      remove:
        'Verwijderen',

      noSelection:
        'Selecteer een sticker op de kaart om deze aan te passen.',

      tapHint:
        'Tik op een sticker om deze aan je kaart toe te voegen.',

      moveHint:
        'Sleep een sticker direct over de kaart om deze te verplaatsen.',

      limit:
        'Je hebt het maximale aantal stickers bereikt.',
    },
  }[
    language
  ];

  const categories =
    getEnabledStickerCategories();

  const selectedSticker =
    selectedStickerId
      ? stickers.find(
          (sticker) =>
            sticker.id ===
            selectedStickerId,
        ) ??
        null
      : null;

  const maximumReached =
    stickers.length >=
    20;

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
      className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
    >
      <header className="border-b border-stone-100 px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[#263e36]">
              {
                text.title
              }
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-5 text-stone-500">
              {
                text.description
              }
            </p>
          </div>

          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f7f1e8] text-lg text-[#9a7441]"
          >
            ✦
          </span>
        </div>
      </header>

      <div className="space-y-5 p-4">
        {maximumReached && (
          <p
            role="status"
            className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900"
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
                <div className="mb-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#9a7441]">
                    {
                      category.label[
                        language
                      ]
                    }
                  </p>

                  <p className="mt-1 text-[11px] leading-4 text-stone-400">
                    {
                      text.forCard
                    }
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
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
                          className="group relative flex aspect-square min-w-0 items-center justify-center overflow-hidden rounded-xl border border-stone-200 bg-[#fffdf9] p-2 transition hover:-translate-y-0.5 hover:border-[#c9a76c] hover:bg-[#fff9ee] hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
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
                            onError={(
                              event,
                            ) => {
                              event.currentTarget.style.display =
                                'none';
                            }}
                          />

                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-2 rounded-lg border border-dashed border-[#dbc9aa]/60 opacity-0 transition group-hover:opacity-100"
                          />

                          {addedCount >
                            0 && (
                            <span className="absolute right-1.5 top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#285347] px-1 text-[9px] font-black text-white shadow-sm">
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
              </div>
            );
          },
        )}

        <p className="text-[11px] leading-5 text-stone-400">
          {
            text.tapHint
          }
        </p>

        <div className="border-t border-stone-100 pt-5">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#9a7441]">
            {
              text.selected
            }
          </p>

          {!selectedSticker ? (
            <div className="mt-3 rounded-xl border border-dashed border-stone-200 bg-stone-50/70 px-4 py-4">
              <p className="text-xs leading-5 text-stone-500">
                {
                  text.noSelection
                }
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-[#ded5c8] bg-[#fffaf0] p-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-[#e6d8c1] bg-white p-2">
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
                  <p className="truncate text-sm font-bold text-[#3d352d]">
                    {
                      selectedSticker.label ||
                      text.added
                    }
                  </p>

                  <p className="mt-1 text-[11px] leading-4 text-[#877766]">
                    {
                      text.moveHint
                    }
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.13em] text-stone-400">
                  {
                    text.size
                  }
                </p>

                <div className="grid grid-cols-2 gap-2">
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
                    className="min-h-11 rounded-xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-600 transition hover:border-[#baa27f] hover:bg-[#fffaf0] hover:text-[#263e36] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
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
                    className="min-h-11 rounded-xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-600 transition hover:border-[#baa27f] hover:bg-[#fffaf0] hover:text-[#263e36] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                  >
                    +{' '}
                    {
                      text.larger
                    }
                  </button>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.13em] text-stone-400">
                    {
                      text.rotation
                    }
                  </p>

                  <span className="text-[10px] font-semibold tabular-nums text-stone-400">
                    {
                      Math.round(
                        selectedSticker.rotation,
                      )
                    }
                    °
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleRotationChange(
                        -15,
                      )
                    }
                    className="min-h-11 rounded-xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-600 transition hover:border-[#baa27f] hover:bg-[#fffaf0] hover:text-[#263e36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                  >
                    ↶{' '}
                    {
                      text.rotateLeft
                    }
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleRotationChange(
                        15,
                      )
                    }
                    className="min-h-11 rounded-xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-600 transition hover:border-[#baa27f] hover:bg-[#fffaf0] hover:text-[#263e36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                  >
                    ↷{' '}
                    {
                      text.rotateRight
                    }
                  </button>
                </div>
              </div>

              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.13em] text-stone-400">
                  {
                    text.layers
                  }
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onBringForward(
                        selectedSticker.id,
                      )
                    }
                    className="min-h-11 rounded-xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-600 transition hover:border-[#baa27f] hover:bg-[#fffaf0] hover:text-[#263e36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
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
                    className="min-h-11 rounded-xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-600 transition hover:border-[#baa27f] hover:bg-[#fffaf0] hover:text-[#263e36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
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
                    className="min-h-11 rounded-xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-600 transition hover:border-[#baa27f] hover:bg-[#fffaf0] hover:text-[#263e36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
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
                    className="min-h-11 rounded-xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-600 transition hover:border-[#baa27f] hover:bg-[#fffaf0] hover:text-[#263e36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                  >
                    ⇊{' '}
                    {
                      text.back
                    }
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-stone-100 pt-4">
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
                  className="min-h-11 rounded-xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-600 transition hover:border-[#baa27f] hover:bg-[#fffaf0] hover:text-[#263e36] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
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
                  className="min-h-11 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                >
                  ×{' '}
                  {
                    text.remove
                  }
                </button>
              </div>
            </div>
          )}
        </div>

        {stickers.length >
          0 && (
          <div className="border-t border-stone-100 pt-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#9a7441]">
                {
                  text.added
                }
              </p>

              <span className="rounded-full bg-stone-100 px-2 py-1 text-[9px] font-bold tabular-nums text-stone-500">
                {
                  stickers.length
                }
                /20
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
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
                        className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border p-1.5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347] ${
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
    </section>
  );
}