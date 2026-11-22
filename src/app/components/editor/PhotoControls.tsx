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
    event: ChangeEvent<HTMLInputElement>,
  ) => void;

  onRemove: () => void;

  onFrameSizeChange: (
    frameSize: EditorPhotoFrameSize,
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
  const frameOptions: Array<{
    value: EditorPhotoFrameSize;
    label: string;
  }> = [
    {
      value:
        'small',

      label:
        labels.small,
    },
    {
      value:
        'medium',

      label:
        labels.medium,
    },
    {
      value:
        'large',

      label:
        labels.large,
    },
  ];

  return (
    <section>
      <input
        ref={
          inputRef
        }
        id="card-photo"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={
          onUpload
        }
        className="sr-only"
      />

      {hasPhoto && (
        <details
          open
          className="rounded-2xl border border-stone-200 bg-[#fcfbf8]"
        >
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">
            <span className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef4f1] text-base"
              >
                📷
              </span>

              <span>
                {
                  labels.adjust
                }
              </span>
            </span>

            <span
              aria-hidden="true"
              className="text-stone-400"
            >
              ↓
            </span>
          </summary>

          <div className="space-y-5 border-t border-stone-100 p-4">
            <button
              type="button"
              onClick={() =>
                inputRef.current?.click()
              }
              className="min-h-11 w-full rounded-xl border border-[#285347]/20 bg-[#eef4f1] px-4 text-sm font-semibold text-[#285347] transition hover:border-[#285347]/30 hover:bg-[#e4efea] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
            >
              {
                labels.photo
              }
            </button>

            <div>
              <p className="mb-2 text-xs font-semibold text-stone-600">
                {
                  labels.size
                }
              </p>

              <div className="grid grid-cols-3 gap-2 rounded-xl bg-stone-100 p-1">
                {frameOptions.map(
                  (option) => {
                    const isActive =
                      frameSize ===
                      option.value;

                    return (
                      <button
                        key={
                          option.value
                        }
                        type="button"
                        aria-pressed={
                          isActive
                        }
                        onClick={() =>
                          onFrameSizeChange(
                            option.value,
                          )
                        }
                        className={`min-h-10 rounded-lg px-2 text-xs font-semibold transition ${
                          isActive
                            ? 'bg-white text-[#285347] shadow-sm ring-1 ring-black/5'
                            : 'text-stone-500 hover:bg-white/60 hover:text-stone-800'
                        } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]`}
                      >
                        {
                          option.label
                        }
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            <div className="rounded-xl bg-[#f5f1e9] px-3 py-2.5">
              <p className="text-xs leading-5 text-stone-600">
                {
                  labels.drag
                }
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-stone-100 pt-4">
              <button
                type="button"
                onClick={
                  onResetTransform
                }
                className="min-h-11 rounded-xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 transition hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
              >
                {
                  labels.reset
                }
              </button>

              <button
                type="button"
                onClick={
                  onRemove
                }
                className="min-h-11 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-800 transition hover:bg-rose-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
              >
                {
                  labels.remove
                }
              </button>
            </div>
          </div>
        </details>
      )}
    </section>
  );
}