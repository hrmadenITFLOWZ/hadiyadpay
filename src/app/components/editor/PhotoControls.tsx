'use client';

import type { ChangeEvent } from 'react';

interface PhotoControlsProps {
  hasPhoto: boolean;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onRotate: (amount: number) => void;
  onZoom: (amount: number) => void;
  scale: number;
  rotation: number;
  onResetTransform: () => void;
  labels: {
    photo: string;
    remove: string;
    adjust: string;
    rotate: string;
    zoom: string;
    reset: string;
  };
}

export default function PhotoControls({
  hasPhoto,
  onUpload,
  onRemove,
  onRotate,
  onZoom,
  scale,
  rotation,
  onResetTransform,
  labels,
}: PhotoControlsProps) {
  const controlClass = 'min-h-11 rounded-lg border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]';

  return (
    <section className="space-y-2">
      <label htmlFor="card-photo" className="block text-xs font-semibold text-stone-600">
        {labels.photo}
      </label>
      <input
        id="card-photo"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onUpload}
        className="min-h-11 w-full rounded-xl border border-stone-200 bg-white text-xs text-stone-600 file:mr-3 file:min-h-11 file:border-0 file:bg-[#285347]/5 file:px-3 file:font-semibold file:text-[#285347]"
      />

      {hasPhoto && (
        <details className="rounded-xl border border-stone-200 bg-white">
          <summary className="min-h-11 cursor-pointer px-3 py-3 text-sm font-semibold text-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">
            {labels.adjust}
          </summary>
          <div className="space-y-4 border-t border-stone-100 p-3">
            <label className="block text-xs font-semibold text-stone-600">
              <span className="flex items-center justify-between">
                <span>{labels.zoom}</span>
                <output>{Math.round(scale * 100)}%</output>
              </span>
              <input
                type="range"
                min={0.5}
                max={3}
                step={0.1}
                value={scale}
                aria-label={labels.zoom}
                onChange={(event) => onZoom(Number(event.target.value) - scale)}
                className="mt-2 w-full accent-[#285347]"
              />
            </label>

            <label className="block text-xs font-semibold text-stone-600">
              <span className="flex items-center justify-between">
                <span>{labels.rotate}</span>
                <output>{rotation}°</output>
              </span>
              <input
                type="range"
                min={-180}
                max={180}
                step={5}
                value={rotation}
                aria-label={labels.rotate}
                onChange={(event) => onRotate(Number(event.target.value) - rotation)}
                className="mt-2 w-full accent-[#285347]"
              />
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={onResetTransform} className={controlClass}>{labels.reset}</button>
              <button
                type="button"
                onClick={onRemove}
                className="min-h-11 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
              >
                {labels.remove}
              </button>
            </div>
          </div>
        </details>
      )}
    </section>
  );
}
