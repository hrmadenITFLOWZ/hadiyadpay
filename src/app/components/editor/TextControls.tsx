'use client';

import type {
  CardLanguage,
} from '../../../lib/card-types';

import type {
  EditorTextLayer,
  EditorTextStyle,
} from '../../../lib/card-editor';

interface TextControlsProps {
  currentLanguage: CardLanguage;
  activeLayer: EditorTextLayer;
  value: string;
  style: EditorTextStyle;

  onLayerSelect: (
    layer: EditorTextLayer,
  ) => void;

  onValueChange: (
    value: string,
  ) => void;

  onColorSelect: (
    color: string,
  ) => void;

  onAlignSelect: (
    align:
      | 'left'
      | 'center'
      | 'right',
  ) => void;

  onSizeChange: (
    size: number,
  ) => void;

  onFontFamilyChange: (
    family:
      | 'sans'
      | 'serif'
      | 'mono',
  ) => void;

  onToggleStyle: (
    key:
      | 'bold'
      | 'italic'
      | 'underline',
  ) => void;

  onMoveUp: () => void;
  onMoveDown: () => void;
  onResetPosition: () => void;
  onResetStyle: () => void;

  colorOptions: string[];
}

const labels = {
  so: {
    layers: {
      recipient:
        'Ku socota',

      message:
        'Fariintaada',

      sender:
        'Ka timid',
    },

    section:
      'Ka dhig mid gaar ah',

    style:
      'Qaabka qoraalka',

    reset:
      'Dib u celi qaabka',

    font:
      'Habka qoraalka',

    size:
      'Cabbirka',

    colors:
      'Midabka',

    alignment:
      'Isku hagaajin',

    position:
      'Meesha qoraalka',

    moveUp:
      'Kor u qaad',

    moveDown:
      'Hoos u dhig',

    resetPosition:
      'Dib u celi meesha',

    align: {
      left:
        'Bidix',

      center:
        'Dhexe',

      right:
        'Midig',
    },

    value: {
      recipient:
        'Tusaale: Ayaan',

      message:
        'Qor fariin qalbigaaga ka timid...',

      sender:
        'Tusaale: Mohamed',
    },

    help: {
      recipient:
        'Magaca qofka Hadiyadda loo dirayo.',

      message:
        'Ku qor fariintaada gaarka ah gudaha Hadiyadda.',

      sender:
        'Magaca aad rabto inuu ka muuqdo dhammaadka fariinta.',
    },

    move:
      'Qoraalka la doortay kor ama hoos u dhaqaaji.',

    modern:
      'Casri',

    elegant:
      'Qurux badan',

    typewriter:
      'Classic',
  },

  en: {
    layers: {
      recipient:
        'For',

      message:
        'Your message',

      sender:
        'From',
    },

    section:
      'Make it personal',

    style:
      'Text style',

    reset:
      'Reset style',

    font:
      'Style',

    size:
      'Size',

    colors:
      'Colour',

    alignment:
      'Alignment',

    position:
      'Text position',

    moveUp:
      'Move up',

    moveDown:
      'Move down',

    resetPosition:
      'Reset position',

    align: {
      left:
        'Left',

      center:
        'Centre',

      right:
        'Right',
    },

    value: {
      recipient:
        'For example: Ayaan',

      message:
        'Write something from the heart...',

      sender:
        'For example: Mohamed',
    },

    help: {
      recipient:
        'Who is this Hadiyad for?',

      message:
        'Write the personal message they will see inside the card.',

      sender:
        'How would you like to sign your Hadiyad?',
    },

    move:
      'Move the selected text up or down inside the card.',

    modern:
      'Modern',

    elegant:
      'Elegant',

    typewriter:
      'Classic',
  },

  nl: {
    layers: {
      recipient:
        'Voor',

      message:
        'Jouw boodschap',

      sender:
        'Van',
    },

    section:
      'Maak het persoonlijk',

    style:
      'Tekststijl',

    reset:
      'Stijl herstellen',

    font:
      'Stijl',

    size:
      'Grootte',

    colors:
      'Kleur',

    alignment:
      'Uitlijning',

    position:
      'Tekstpositie',

    moveUp:
      'Omhoog',

    moveDown:
      'Omlaag',

    resetPosition:
      'Positie herstellen',

    align: {
      left:
        'Links',

      center:
        'Midden',

      right:
        'Rechts',
    },

    value: {
      recipient:
        'Bijvoorbeeld: Ayaan',

      message:
        'Schrijf iets vanuit het hart...',

      sender:
        'Bijvoorbeeld: Mohamed',
    },

    help: {
      recipient:
        'Voor wie is deze Hadiyad?',

      message:
        'Schrijf de persoonlijke boodschap die binnenin de kaart verschijnt.',

      sender:
        'Met welke naam wil je de Hadiyad afsluiten?',
    },

    move:
      'Verplaats de geselecteerde tekst omhoog of omlaag in de kaart.',

    modern:
      'Modern',

    elegant:
      'Elegant',

    typewriter:
      'Klassiek',
  },
} satisfies Record<
  CardLanguage,
  {
    layers:
      Record<
        EditorTextLayer,
        string
      >;

    section: string;
    style: string;
    reset: string;
    font: string;
    size: string;
    colors: string;
    alignment: string;
    position: string;
    moveUp: string;
    moveDown: string;
    resetPosition: string;

    align:
      Record<
        | 'left'
        | 'center'
        | 'right',
        string
      >;

    value:
      Record<
        EditorTextLayer,
        string
      >;

    help:
      Record<
        EditorTextLayer,
        string
      >;

    move: string;
    modern: string;
    elegant: string;
    typewriter: string;
  }
>;

const fontOptions = [
  'sans',
  'serif',
  'mono',
] as const;

const layerOptions:
  EditorTextLayer[] = [
    'recipient',
    'message',
    'sender',
  ];

export default function TextControls({
  currentLanguage,
  activeLayer,
  value,
  style,
  onLayerSelect,
  onValueChange,
  onColorSelect,
  onAlignSelect,
  onSizeChange,
  onFontFamilyChange,
  onToggleStyle,
  onMoveUp,
  onMoveDown,
  onResetPosition,
  onResetStyle,
  colorOptions,
}: TextControlsProps) {
  const copy =
    labels[
      currentLanguage
    ];

  const fontLabel = (
    font:
      (typeof fontOptions)[number],
  ) => {
    if (
      font ===
      'serif'
    ) {
      return copy.elegant;
    }

    if (
      font ===
      'mono'
    ) {
      return copy.typewriter;
    }

    return copy.modern;
  };

  return (
    <section
      className="space-y-4"
      aria-label={
        copy.section
      }
    >
      <div>
        <h3 className="text-sm font-bold text-stone-900">
          {
            copy.section
          }
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-1 rounded-2xl border border-stone-200 bg-stone-100 p-1">
        {layerOptions.map(
          (
            layer,
          ) => (
            <button
              key={
                layer
              }
              type="button"
              aria-pressed={
                activeLayer ===
                layer
              }
              onClick={() =>
                onLayerSelect(
                  layer,
                )
              }
              className={`min-h-11 rounded-xl px-2 text-xs font-semibold transition ${
                activeLayer ===
                layer
                  ? 'bg-white text-[#285347] shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#285347]`}
            >
              {
                copy.layers[
                  layer
                ]
              }
            </button>
          ),
        )}
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold text-stone-700">
          {
            copy.layers[
              activeLayer
            ]
          }
        </label>

        {activeLayer ===
        'message' ? (
          <textarea
            aria-label={
              copy.value[
                activeLayer
              ]
            }
            placeholder={
              copy.value[
                activeLayer
              ]
            }
            rows={
              4
            }
            maxLength={
              800
            }
            value={
              value
            }
            onChange={(
              event,
            ) =>
              onValueChange(
                event.target.value,
              )
            }
            className="min-h-28 w-full resize-y rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-stone-900 placeholder:text-stone-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
          />
        ) : (
          <input
            aria-label={
              copy.value[
                activeLayer
              ]
            }
            placeholder={
              copy.value[
                activeLayer
              ]
            }
            maxLength={
              80
            }
            value={
              value
            }
            onChange={(
              event,
            ) =>
              onValueChange(
                event.target.value,
              )
            }
            className="min-h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm text-stone-900 placeholder:text-stone-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
          />
        )}

        <p className="mt-2 text-xs leading-5 text-stone-500">
          {
            copy.help[
              activeLayer
            ]
          }
        </p>
      </div>

      <details className="group rounded-2xl border border-stone-200 bg-white">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">
          <span>
            {
              copy.style
            }
          </span>

          <span
            aria-hidden="true"
            className="text-stone-400 transition group-open:rotate-180"
          >
            ↓
          </span>
        </summary>

        <div className="space-y-5 border-t border-stone-100 p-4">
          <fieldset>
            <legend className="mb-2 text-xs font-bold text-stone-600">
              {
                copy.position
              }
            </legend>

            <p className="mb-3 text-[11px] leading-5 text-stone-500">
              {
                copy.move
              }
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={
                  onMoveUp
                }
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 transition hover:border-[#285347]/30 hover:bg-[#eef4f1] hover:text-[#285347] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
              >
                <span
                  aria-hidden="true"
                  className="text-base"
                >
                  ↑
                </span>

                <span>
                  {
                    copy.moveUp
                  }
                </span>
              </button>

              <button
                type="button"
                onClick={
                  onMoveDown
                }
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 transition hover:border-[#285347]/30 hover:bg-[#eef4f1] hover:text-[#285347] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
              >
                <span
                  aria-hidden="true"
                  className="text-base"
                >
                  ↓
                </span>

                <span>
                  {
                    copy.moveDown
                  }
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={
                onResetPosition
              }
              className="mt-2 min-h-10 w-full rounded-xl bg-stone-100 px-3 text-xs font-semibold text-stone-600 transition hover:bg-stone-200 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
            >
              {
                copy.resetPosition
              }
            </button>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-xs font-bold text-stone-600">
              {
                copy.font
              }
            </legend>

            <div className="grid grid-cols-3 gap-2">
              {fontOptions.map(
                (
                  font,
                ) => (
                  <button
                    key={
                      font
                    }
                    type="button"
                    aria-pressed={
                      style.family ===
                      font
                    }
                    onClick={() =>
                      onFontFamilyChange(
                        font,
                      )
                    }
                    className={`min-h-11 rounded-xl border px-2 text-xs transition ${
                      style.family ===
                      font
                        ? 'border-[#285347] bg-[#eef4f1] text-[#285347]'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    } ${
                      font ===
                      'serif'
                        ? 'font-serif'
                        : font ===
                            'mono'
                          ? 'font-mono'
                          : 'font-sans'
                    } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]`}
                  >
                    {
                      fontLabel(
                        font,
                      )
                    }
                  </button>
                ),
              )}
            </div>
          </fieldset>

          <label className="block">
            <span className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-stone-600">
                {
                  copy.size
                }
              </span>

              <output className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-600">
                {
                  style.size
                }
                px
              </output>
            </span>

            <input
              type="range"
              min={
                18
              }
              max={
                52
              }
              aria-label={
                copy.size
              }
              value={
                style.size
              }
              onChange={(
                event,
              ) =>
                onSizeChange(
                  Number(
                    event.target.value,
                  ),
                )
              }
              className="mt-3 w-full accent-[#285347]"
            />
          </label>

          <fieldset>
            <legend className="mb-2 text-xs font-bold text-stone-600">
              {
                copy.alignment
              }
            </legend>

            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  'left',
                  'center',
                  'right',
                ] as const
              ).map(
                (
                  align,
                ) => (
                  <button
                    key={
                      align
                    }
                    type="button"
                    aria-label={
                      copy.align[
                        align
                      ]
                    }
                    aria-pressed={
                      style.align ===
                      align
                    }
                    onClick={() =>
                      onAlignSelect(
                        align,
                      )
                    }
                    className={`min-h-11 rounded-xl border px-2 text-xs font-semibold transition ${
                      style.align ===
                      align
                        ? 'border-[#285347] bg-[#eef4f1] text-[#285347]'
                        : 'border-stone-200 bg-white text-stone-700'
                    } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]`}
                  >
                    {
                      copy.align[
                        align
                      ]
                    }
                  </button>
                ),
              )}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-xs font-bold text-stone-600">
              {
                copy.colors
              }
            </legend>

            <div className="flex flex-wrap items-center gap-2">
              {colorOptions.map(
                (
                  color,
                ) => (
                  <button
                    key={
                      color
                    }
                    type="button"
                    aria-label={`${copy.colors}: ${color}`}
                    aria-pressed={
                      style.color ===
                      color
                    }
                    onClick={() =>
                      onColorSelect(
                        color,
                      )
                    }
                    className={`h-9 w-9 rounded-full border-2 shadow-sm transition ${
                      style.color ===
                      color
                        ? 'scale-110 border-[#285347]'
                        : 'border-white ring-1 ring-stone-200'
                    } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]`}
                    style={{
                      backgroundColor:
                        color,
                    }}
                  />
                ),
              )}
            </div>
          </fieldset>

          <div className="grid grid-cols-3 gap-2">
            {(
              [
                {
                  key:
                    'bold',

                  label:
                    'B',

                  pressed:
                    style.bold,
                },

                {
                  key:
                    'italic',

                  label:
                    'I',

                  pressed:
                    style.italic,
                },

                {
                  key:
                    'underline',

                  label:
                    'U',

                  pressed:
                    style.underline,
                },
              ] as const
            ).map(
              (
                option,
              ) => (
                <button
                  key={
                    option.key
                  }
                  type="button"
                  aria-label={
                    option.key
                  }
                  aria-pressed={
                    option.pressed
                  }
                  onClick={() =>
                    onToggleStyle(
                      option.key,
                    )
                  }
                  className={`min-h-11 rounded-xl border text-sm font-bold transition ${
                    option.pressed
                      ? 'border-[#285347] bg-[#eef4f1] text-[#285347]'
                      : 'border-stone-200 bg-white text-stone-700'
                  } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]`}
                >
                  <span
                    className={
                      option.key ===
                      'italic'
                        ? 'italic'
                        : option.key ===
                            'underline'
                          ? 'underline'
                          : ''
                    }
                  >
                    {
                      option.label
                    }
                  </span>
                </button>
              ),
            )}
          </div>

          <div className="flex justify-end border-t border-stone-100 pt-3">
            <button
              type="button"
              onClick={
                onResetStyle
              }
              className="text-xs font-semibold text-[#285347] underline decoration-[#285347]/30 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
            >
              {
                copy.reset
              }
            </button>
          </div>
        </div>
      </details>
    </section>
  );
}