'use client';

import type {
  ChangeEvent,
  RefObject,
} from 'react';

import type {
  EditorPhotoFrameSize,
} from '../../../lib/card-editor';

interface PhotoControlsProps {
  hasPhoto: boolean;

  inputRef:
    RefObject<HTMLInputElement | null>;

  onUpload: (
    event:
      ChangeEvent<HTMLInputElement>,
  ) => void;

  onRemove: () => void;

  onFrameSizeChange: (
    frameSize:
      EditorPhotoFrameSize,
  ) => void;

  frameSize:
    EditorPhotoFrameSize;

  onResetTransform:
    () => void;

  labels: {
    photo: string;
    remove: string;
    adjust: string;
    size: string;
    small: string;
    medium: string;
    large: string;
    reset: string;
    drag: string;
  };
}

const frameOptions: {
  value: EditorPhotoFrameSize;
  key:
    | 'small'
    | 'medium'
    | 'large';
}[] = [
  {
    value:
      'small',

    key:
      'small',
  },
  {
    value:
      'medium',

    key:
      'medium',
  },
  {
    value:
      'large',

    key:
      'large',
  },
];

export default function PhotoControls({
  hasPhoto,
  inputRef,
  onUpload,
  onRemove,
  onFrameSizeChange,
  frameSize,
  onResetTransform,
  labels,
}: PhotoControlsProps) {
  return (
    <section
      aria-label={
        labels.adjust
      }
    >
      <input
        ref={
          inputRef
        }
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={
          onUpload
        }
        className="sr-only"
      />

      <details className="group rounded-2xl border border-stone-200 bg-white">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">
          <span className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef4f1] text-sm text-[#285347]"
            >
              ▣
            </span>

            <span className="min-w-0">
              <span className="block text-sm font-semibold text-stone-800">
                Jouw foto
              </span>

              {hasPhoto && (
                <span className="mt-0.5 block text-[10px] text-stone-400">
                  Maak jouw foto helemaal passend
                </span>
              )}
            </span>
          </span>

          <span
            aria-hidden="true"
            className="shrink-0 text-sm text-stone-400 transition-transform group-open:rotate-180"
          >
            ↓
          </span>
        </summary>

        <div className="border-t border-stone-100 p-3.5">
          {!hasPhoto ? (
            <div className="space-y-3">
              <div className="rounded-xl bg-[#faf7f1] px-3 py-3">
                <p className="text-xs leading-5 text-[#75695d]">
                  Voeg een persoonlijke foto toe en maak jouw Hadiyad nog specialer.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  inputRef.current
                    ?.click()
                }
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#285347] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[#1e4338] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
              >
                <span
                  aria-hidden="true"
                  className="text-base"
                >
                  +
                </span>

                Kies jouw foto
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() =>
                  inputRef.current
                    ?.click()
                }
                className="inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-[#285347]/25 bg-[#eef4f1] px-3 text-xs font-semibold text-[#285347] transition hover:border-[#285347]/40 hover:bg-[#e5efea] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
              >
                Kies een andere foto
              </button>

              <fieldset>
                <legend className="mb-2 text-[11px] font-bold text-stone-600">
                  Formaat
                </legend>

                <div className="grid grid-cols-3 gap-1 rounded-xl bg-stone-100 p-1">
                  {frameOptions.map(
                    (
                      option,
                    ) => {
                      const active =
                        frameSize ===
                        option.value;

                      return (
                        <button
                          key={
                            option.value
                          }
                          type="button"
                          aria-pressed={
                            active
                          }
                          onClick={() =>
                            onFrameSizeChange(
                              option.value,
                            )
                          }
                          className={`min-h-9 rounded-lg px-2 text-[11px] font-semibold transition ${
                            active
                              ? 'bg-white text-[#285347] shadow-sm'
                              : 'text-stone-500 hover:text-stone-800'
                          } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#285347]`}
                        >
                          {
                            labels[
                              option.key
                            ]
                          }
                        </button>
                      );
                    },
                  )}
                </div>
              </fieldset>

              <p className="flex items-start gap-2 text-[11px] leading-5 text-stone-500">
                <span
                  aria-hidden="true"
                  className="mt-[1px] shrink-0 text-[#9a7441]"
                >
                  ↔
                </span>

                <span>
                  Sleep je foto op de kaart om precies het mooiste deel te laten zien.
                </span>
              </p>

              <div className="grid grid-cols-2 gap-2 border-t border-stone-100 pt-3">
                <button
                  type="button"
                  onClick={
                    onResetTransform
                  }
                  className="min-h-10 rounded-xl border border-stone-200 bg-white px-3 text-[11px] font-semibold text-stone-600 transition hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                >
                  Herstel foto
                </button>

                <button
                  type="button"
                  onClick={
                    onRemove
                  }
                  className="min-h-10 rounded-xl border border-rose-200 bg-rose-50 px-3 text-[11px] font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                >
                  Verwijder
                </button>
              </div>
            </div>
          )}
        </div>
      </details>
    </section>
  );
}