'use client';

interface ResetControlsProps {
  onResetActiveSide: () => void;
  onResetCard: () => void;
  labels: {
    activeSide: string;
    card: string;
  };
}

export default function ResetControls({ onResetActiveSide, onResetCard, labels }: ResetControlsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={onResetActiveSide}
        className="min-h-11 rounded-xl border border-stone-200 bg-stone-100 px-3 text-xs font-bold text-stone-800 transition hover:bg-stone-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
      >
        {labels.activeSide}
      </button>
      <button
        type="button"
        onClick={onResetCard}
        className="min-h-11 rounded-xl border border-stone-200 bg-stone-100 px-3 text-xs font-bold text-stone-800 transition hover:bg-stone-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
      >
        {labels.card}
      </button>
    </div>
  );
}
