'use client';

interface HistoryControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  labels: {
    undo: string;
    redo: string;
  };
}

export default function HistoryControls({ canUndo, canRedo, onUndo, onRedo, labels }: HistoryControlsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        className="min-h-11 rounded-xl border border-stone-200 bg-stone-100 px-3 text-xs font-bold text-stone-800 transition hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
      >
        {labels.undo}
      </button>
      <button
        type="button"
        onClick={onRedo}
        disabled={!canRedo}
        className="min-h-11 rounded-xl border border-stone-200 bg-stone-100 px-3 text-xs font-bold text-stone-800 transition hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
      >
        {labels.redo}
      </button>
    </div>
  );
}
