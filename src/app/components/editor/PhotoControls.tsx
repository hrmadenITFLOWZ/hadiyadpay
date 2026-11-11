'use client';

interface PhotoControlsProps {
  hasPhoto: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onMove: (dx: number, dy: number) => void;
  onRotate: (amount: number) => void;
  onZoom: (amount: number) => void;
  scale: number;
  onResetTransform: () => void;
  labels: {
    photo: string;
    remove: string;
    moveLeft: string;
    moveRight: string;
    moveUp: string;
    moveDown: string;
    rotateLeft: string;
    rotateRight: string;
    zoom: string;
    zoomIn: string;
    zoomOut: string;
    reset: string;
  };
}

export default function PhotoControls({ hasPhoto, onUpload, onRemove, onMove, onRotate, onZoom, scale, onResetTransform, labels }: PhotoControlsProps) {
  const buttonClass = 'min-h-11 min-w-11 rounded-xl border border-stone-200 bg-white px-2 text-xs font-bold text-stone-700 transition hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347] disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div className="space-y-3">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor="card-photo" className="text-xs font-bold uppercase text-stone-600">{labels.photo}</label>
        {hasPhoto && (
          <button type="button" onClick={onRemove} className="min-h-11 min-w-11 rounded px-2 text-xs font-semibold text-rose-700 underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">
            {labels.remove}
          </button>
        )}
      </div>
      <input
        id="card-photo"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onUpload}
        className="min-h-11 w-full rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-2 file:text-[10px] file:font-bold file:text-amber-800"
      />

      <div className="grid grid-cols-2 gap-2">
        <button type="button" aria-label={labels.moveLeft} onClick={() => onMove(-12, 0)} disabled={!hasPhoto} className={buttonClass}>{labels.moveLeft}</button>
        <button type="button" aria-label={labels.moveRight} onClick={() => onMove(12, 0)} disabled={!hasPhoto} className={buttonClass}>{labels.moveRight}</button>
        <button type="button" aria-label={labels.moveUp} onClick={() => onMove(0, -12)} disabled={!hasPhoto} className={buttonClass}>{labels.moveUp}</button>
        <button type="button" aria-label={labels.moveDown} onClick={() => onMove(0, 12)} disabled={!hasPhoto} className={buttonClass}>{labels.moveDown}</button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" aria-label={labels.rotateLeft} onClick={() => onRotate(-15)} disabled={!hasPhoto} className={buttonClass}>{labels.rotateLeft}</button>
        <button type="button" aria-label={labels.rotateRight} onClick={() => onRotate(15)} disabled={!hasPhoto} className={buttonClass}>{labels.rotateRight}</button>
      </div>

      <div role="group" aria-label={labels.zoom} className="flex items-center justify-between gap-2">
        <button type="button" aria-label={labels.zoomOut} onClick={() => onZoom(-0.1)} disabled={!hasPhoto} className={buttonClass}>−</button>
        <output aria-label={labels.zoom} className="min-w-12 text-center text-xs font-bold text-stone-700">{Math.round(scale * 100)}%</output>
        <button type="button" aria-label={labels.zoomIn} onClick={() => onZoom(0.1)} disabled={!hasPhoto} className={buttonClass}>+</button>
      </div>

      <button type="button" onClick={onResetTransform} disabled={!hasPhoto} className="w-full min-h-11 rounded-xl border border-stone-200 bg-stone-100 px-3 text-xs font-bold text-stone-800 transition hover:bg-stone-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347] disabled:cursor-not-allowed disabled:opacity-50">
        {labels.reset}
      </button>
    </div>
  );
}
