'use client';

import type { EditorPreviewMode } from '../../../lib/card-editor';

interface PreviewControlsProps {
  activeMode: EditorPreviewMode;
  onSelect: (mode: EditorPreviewMode) => void;
  labels: {
    edit: string;
    clean: string;
    full: string;
  };
}

export default function PreviewControls({ activeMode, onSelect, labels }: PreviewControlsProps) {
  const modes: EditorPreviewMode[] = ['edit', 'clean', 'full'];

  return (
    <div className="grid grid-cols-3 gap-2">
      {modes.map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => onSelect(mode)}
          className={`min-h-10 rounded-lg border px-2 text-[10px] font-black uppercase tracking-[0.12em] transition ${activeMode === mode ? 'border-[#285347] bg-[#285347]/5 text-[#285347]' : 'border-stone-200 bg-white text-stone-700'}`}
        >
          {mode === 'edit' ? labels.edit : mode === 'clean' ? labels.clean : labels.full}
        </button>
      ))}
    </div>
  );
}
