'use client';

import type {
  EditorPreviewMode,
} from '../../../lib/card-editor';

interface PreviewControlsProps {
  activeMode:
    EditorPreviewMode;

  onSelect:
    (
      mode:
        EditorPreviewMode,
    ) => void;

  labels: {
    edit:
      string;

    clean:
      string;

    full:
      string;
  };
}

export default function PreviewControls({
  activeMode,
  onSelect,
  labels,
}: PreviewControlsProps) {
  const isPreview =
    activeMode ===
    'clean';

  return (
    <section className="rounded-2xl border border-stone-200 bg-[#fcfbf8] p-1.5">
      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          aria-pressed={
            !isPreview
          }
          onClick={() =>
            onSelect(
              'edit',
            )
          }
          className={`min-h-11 rounded-xl px-3 text-xs font-semibold transition ${
            !isPreview
              ? 'bg-white text-[#285347] shadow-sm ring-1 ring-stone-200'
              : 'text-stone-500 hover:bg-white/70 hover:text-stone-800'
          } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]`}
        >
          <span className="inline-flex items-center justify-center gap-2">
            <span
              aria-hidden="true"
              className="text-sm"
            >
              ✎
            </span>

            <span>
              {
                labels.edit
              }
            </span>
          </span>
        </button>

        <button
          type="button"
          aria-pressed={
            isPreview
          }
          onClick={() =>
            onSelect(
              'clean',
            )
          }
          className={`min-h-11 rounded-xl px-3 text-xs font-semibold transition ${
            isPreview
              ? 'bg-white text-[#285347] shadow-sm ring-1 ring-stone-200'
              : 'text-stone-500 hover:bg-white/70 hover:text-stone-800'
          } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]`}
        >
          <span className="inline-flex items-center justify-center gap-2">
            <span
              aria-hidden="true"
              className="text-sm"
            >
              ◉
            </span>

            <span>
              {
                labels.clean
              }
            </span>
          </span>
        </button>
      </div>
    </section>
  );
}