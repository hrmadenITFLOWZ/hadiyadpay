'use client';

import type {
  CardLanguage,
} from '../../../lib/card-types';

interface EditorTopBarProps {
  language: CardLanguage;

  canUndo: boolean;
  canRedo: boolean;

  isSubmitting?: boolean;

  onClose: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onContinue: () => void;
}

export default function EditorTopBar({
  language,
  canUndo,
  canRedo,
  isSubmitting = false,
  onClose,
  onUndo,
  onRedo,
  onContinue,
}: EditorTopBarProps) {
  const text = {
    so: {
      close:
        'Xir',

      undo:
        'Dib u noqo',

      redo:
        'Mar kale',

      continue:
        'Sii wad',
    },

    en: {
      close:
        'Close',

      undo:
        'Undo',

      redo:
        'Redo',

      continue:
        'Continue',
    },

    nl: {
      close:
        'Afsluiten',

      undo:
        'Ongedaan maken',

      redo:
        'Opnieuw',

      continue:
        'Verder',
    },
  }[
    language
  ];

  return (
    <header className="relative z-50 flex h-[68px] w-full shrink-0 items-center justify-between border-b border-[#ded5c8] bg-white px-3 shadow-[0_2px_8px_rgba(45,54,49,0.08)] sm:h-[72px] sm:px-5">
      <div className="flex min-w-[92px] items-center justify-start sm:min-w-[132px]">
        <button
          type="button"
          onClick={
            onClose
          }
          disabled={
            isSubmitting
          }
          className="inline-flex min-h-11 items-center justify-center rounded-xl px-2 text-sm font-bold text-[#285347] underline decoration-[#285347]/30 underline-offset-4 transition hover:bg-[#eef4f1] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347] sm:px-3"
        >
          {
            text.close
          }
        </button>
      </div>

      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={
            onUndo
          }
          disabled={
            !canUndo ||
            isSubmitting
          }
          aria-label={
            text.undo
          }
          title={
            text.undo
          }
          className="flex h-11 w-11 items-center justify-center rounded-xl text-[27px] leading-none text-[#173f35] transition hover:bg-[#eef4f1] disabled:cursor-not-allowed disabled:text-stone-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
        >
          <span
            aria-hidden="true"
            className="relative -top-px"
          >
            ↶
          </span>
        </button>

        <button
          type="button"
          onClick={
            onRedo
          }
          disabled={
            !canRedo ||
            isSubmitting
          }
          aria-label={
            text.redo
          }
          title={
            text.redo
          }
          className="flex h-11 w-11 items-center justify-center rounded-xl text-[27px] leading-none text-[#173f35] transition hover:bg-[#eef4f1] disabled:cursor-not-allowed disabled:text-stone-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
        >
          <span
            aria-hidden="true"
            className="relative -top-px"
          >
            ↷
          </span>
        </button>
      </div>

      <div className="flex min-w-[92px] items-center justify-end sm:min-w-[132px]">
        <button
          type="button"
          onClick={
            onContinue
          }
          disabled={
            isSubmitting
          }
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#285347] px-4 text-sm font-bold text-white shadow-[0_5px_14px_rgba(40,83,71,0.2)] transition hover:-translate-y-0.5 hover:bg-[#1e4338] hover:shadow-[0_7px_18px_rgba(40,83,71,0.24)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347] sm:min-h-12 sm:px-5"
        >
          {
            text.continue
          }
        </button>
      </div>
    </header>
  );
}