'use client';

interface PhotoControlsProps {
  hasPhoto: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onMove: (dx: number, dy: number) => void;
  onRotate: (amount: number) => void;
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
    reset: string;
  };
}

export default function PhotoControls({ hasPhoto, onUpload, onRemove, onMove, onRotate, onResetTransform, labels }: PhotoControlsProps) {
  const buttonClass = 'min-h-10 rounded-xl border border-stone-200 bg-white px-2 text-xs font-bold text-stone-700 transition hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]';

  return (
    <div className="space-y-3">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor="card-photo" className="text-xs font-bold uppercase text-stone-600">{labels.photo}</label>
        {hasPhoto && (
          <button type="button" onClick={onRemove} className="min-h-9 rounded px-2 text-xs font-semibold text-rose-700 underline underline-offset-2">
            {labels.remove}
          </button>
        )}
      </div>
      <input
        id="card-photo"
        type="file"
        accept="image/*"
        onChange={onUpload}
        className="w-full rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-2 file:text-[10px] file:font-bold file:text-amber-800"
      />

      <div className="grid grid-cols-2 gap-2">
        <button type="button" aria-label={labels.moveLeft} onClick={() => onMove(-12, 0)} className={buttonClass}>{labels.moveLeft}</button>
        <button type="button" aria-label={labels.moveRight} onClick={() => onMove(12, 0)} className={buttonClass}>{labels.moveRight}</button>
        <button type="button" aria-label={labels.moveUp} onClick={() => onMove(0, -12)} className={buttonClass}>{labels.moveUp}</button>
        <button type="button" aria-label={labels.moveDown} onClick={() => onMove(0, 12)} className={buttonClass}>{labels.moveDown}</button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" aria-label={labels.rotateLeft} onClick={() => onRotate(-15)} className={buttonClass}>{labels.rotateLeft}</button>
        <button type="button" aria-label={labels.rotateRight} onClick={() => onRotate(15)} className={buttonClass}>{labels.rotateRight}</button>
      </div>

      <button type="button" onClick={onResetTransform} className="w-full min-h-11 rounded-xl border border-stone-200 bg-stone-100 px-3 text-xs font-bold text-stone-800 transition hover:bg-stone-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">
        {labels.reset}
      </button>
    </div>
  );
}
