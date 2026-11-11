'use client';

import type { CardLanguage } from '../../../lib/card-types';

interface CardSideSelectorProps {
  currentLanguage: CardLanguage;
  activeSide: 'front' | 'inside';
  onSelect: (side: 'front' | 'inside') => void;
}

export default function CardSideSelector({ currentLanguage, activeSide, onSelect }: CardSideSelectorProps) {
  const labels = {
    so: { front: 'Hordhaca', inside: 'Gudaha' },
    en: { front: 'Front', inside: 'Inside' },
    nl: { front: 'Voorkant', inside: 'Binnenkant' },
  }[currentLanguage];

  return (
    <div className="flex w-full rounded-xl border border-stone-200 bg-stone-100 p-1" role="tablist" aria-label="Card side selector">
      {(['front', 'inside'] as const).map((side) => (
        <button
          key={side}
          type="button"
          role="tab"
          aria-selected={activeSide === side}
          onClick={() => onSelect(side)}
          className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] transition ${activeSide === side ? 'bg-white text-[#285347] shadow-sm' : 'text-stone-600'}`}
        >
          {side === 'front' ? labels.front : labels.inside}
        </button>
      ))}
    </div>
  );
}
