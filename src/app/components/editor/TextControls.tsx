'use client';

import type { CardLanguage } from '../../../lib/card-types';
import type { EditorTextStyle } from '../../../lib/card-editor';

interface TextControlsProps {
  currentLanguage: CardLanguage;
  value: EditorTextStyle;
  onColorSelect: (color: string) => void;
  onAlignSelect: (align: 'left' | 'center' | 'right') => void;
  onSizeChange: (size: number) => void;
  onFontFamilyChange: (family: 'sans' | 'serif' | 'mono') => void;
  onToggleStyle: (key: 'bold' | 'italic' | 'underline') => void;
  onResetStyle: () => void;
  colorOptions: string[];
  alignmentOptions: Array<'left' | 'center' | 'right'>;
}

const FONT_LABELS = {
  so: { sans: 'Sans', serif: 'Serif', mono: 'Mono' },
  en: { sans: 'Sans', serif: 'Serif', mono: 'Mono' },
  nl: { sans: 'Sans', serif: 'Serif', mono: 'Mono' },
} as const;

export default function TextControls({ currentLanguage, value, onColorSelect, onAlignSelect, onSizeChange, onFontFamilyChange, onToggleStyle, onResetStyle, colorOptions, alignmentOptions }: TextControlsProps) {
  const fontOptions = ['sans', 'serif', 'mono'] as const;

  return (
    <div className="space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase text-stone-600">{currentLanguage === 'nl' ? 'Tekst' : currentLanguage === 'so' ? 'Qoraal' : 'Text'}</p>
        <button type="button" onClick={onResetStyle} className="text-[10px] font-bold uppercase tracking-[0.12em] text-stone-600 underline underline-offset-2">
          {currentLanguage === 'nl' ? 'Reset' : currentLanguage === 'so' ? 'Dib u habeeb' : 'Reset'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {colorOptions.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Select text color ${color}`}
            onClick={() => onColorSelect(color)}
            className={`h-8 w-8 rounded-full border-2 transition ${value.color === color ? 'border-stone-900' : 'border-white'}`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {alignmentOptions.map((alignment) => (
          <button
            key={alignment}
            type="button"
            onClick={() => onAlignSelect(alignment)}
            className={`min-h-10 rounded-lg border px-2 text-xs font-bold uppercase tracking-[0.12em] transition ${value.align === alignment ? 'border-[#285347] bg-[#285347]/5 text-[#285347]' : 'border-stone-200 bg-white text-stone-700'}`}
          >
            {alignment}
          </button>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-600">
          <span className="mb-1 block">{currentLanguage === 'nl' ? 'Lettertype' : currentLanguage === 'so' ? 'Qoraal xeer' : 'Font'}</span>
          <select
            value={value.family}
            onChange={(event) => onFontFamilyChange(event.target.value as 'sans' | 'serif' | 'mono')}
            className="min-h-10 w-full rounded-lg border border-stone-200 bg-white px-2 text-xs font-semibold text-stone-800"
          >
            {fontOptions.map((option) => (
              <option key={option} value={option}>{FONT_LABELS[currentLanguage][option]}</option>
            ))}
          </select>
        </label>

        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-600">
          <span className="mb-1 block">{currentLanguage === 'nl' ? 'Grootte' : currentLanguage === 'so' ? 'Cabbirka' : 'Size'}</span>
          <div className="rounded-lg border border-stone-200 bg-white px-2 py-2 text-sm font-semibold text-stone-800">{value.size}px</div>
        </div>
      </div>

      <div className="space-y-2">
        <input
          type="range"
          min={18}
          max={52}
          value={value.size}
          onChange={(event) => onSizeChange(Number(event.target.value))}
          className="w-full accent-[#285347]"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { key: 'bold', label: 'B' },
          { key: 'italic', label: 'I' },
          { key: 'underline', label: 'U' },
        ].map((option) => {
          const enabled = option.key === 'bold' ? value.bold : option.key === 'italic' ? value.italic : value.underline;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onToggleStyle(option.key as 'bold' | 'italic' | 'underline')}
              className={`min-h-9 rounded-lg border px-3 text-sm font-bold transition ${enabled ? 'border-[#285347] bg-[#285347]/8 text-[#285347]' : 'border-stone-200 bg-white text-stone-700'}`}
              style={{
                fontWeight: option.key === 'bold' ? 700 : 500,
                fontStyle: option.key === 'italic' ? 'italic' : 'normal',
                textDecoration: option.key === 'underline' ? 'underline' : 'none',
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
