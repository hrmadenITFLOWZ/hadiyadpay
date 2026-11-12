'use client';

import type { CardLanguage } from '../../../lib/card-types';
import type { EditorTextLayer, EditorTextStyle } from '../../../lib/card-editor';

interface TextControlsProps {
  currentLanguage: CardLanguage;
  activeLayer: EditorTextLayer;
  value: string;
  style: EditorTextStyle;
  onLayerSelect: (layer: EditorTextLayer) => void;
  onValueChange: (value: string) => void;
  onColorSelect: (color: string) => void;
  onAlignSelect: (align: 'left' | 'center' | 'right') => void;
  onSizeChange: (size: number) => void;
  onFontFamilyChange: (family: 'sans' | 'serif' | 'mono') => void;
  onToggleStyle: (key: 'bold' | 'italic' | 'underline') => void;
  onResetStyle: () => void;
  colorOptions: string[];
}

const labels = {
  so: {
    layers: { recipient: 'Qaataha', message: 'Fariin', sender: 'Diraha' },
    text: 'Qoraalka kaarka',
    style: 'Qaabka qoraalka',
    reset: 'Dib u celi qaabka',
    font: 'Farta',
    size: 'Cabbirka',
    colors: 'Midabka',
    align: { left: 'Bidix', center: 'Dhexe', right: 'Midig' },
    value: { recipient: 'Geli magaca qaataha', message: 'Qor fariintaada', sender: 'Geli magacaaga' },
    move: 'Jiido qoraalka kaarka si aad u beddesho booskiisa',
  },
  en: {
    layers: { recipient: 'Recipient', message: 'Message', sender: 'Sender' },
    text: 'Card text',
    style: 'Text style',
    reset: 'Reset style',
    font: 'Font',
    size: 'Size',
    colors: 'Color',
    align: { left: 'Left', center: 'Center', right: 'Right' },
    value: { recipient: 'Enter recipient name', message: 'Write your message', sender: 'Enter your name' },
    move: 'Drag text on the card preview to reposition it',
  },
  nl: {
    layers: { recipient: 'Ontvanger', message: 'Bericht', sender: 'Verzender' },
    text: 'Kaarttekst',
    style: 'Tekstopmaak',
    reset: 'Opmaak resetten',
    font: 'Lettertype',
    size: 'Grootte',
    colors: 'Kleur',
    align: { left: 'Links', center: 'Midden', right: 'Rechts' },
    value: { recipient: 'Vul de naam van de ontvanger in', message: 'Schrijf je bericht', sender: 'Vul je naam in' },
    move: 'Sleep de tekst op het kaartvoorbeeld om deze te verplaatsen',
  },
} satisfies Record<CardLanguage, {
  layers: Record<EditorTextLayer, string>;
  text: string;
  style: string;
  reset: string;
  font: string;
  size: string;
  colors: string;
  align: Record<'left' | 'center' | 'right', string>;
  value: Record<EditorTextLayer, string>;
  move: string;
}>;

const fontOptions = ['sans', 'serif', 'mono'] as const;
const layerOptions: EditorTextLayer[] = ['recipient', 'message', 'sender'];

export default function TextControls({
  currentLanguage,
  activeLayer,
  value,
  style,
  onLayerSelect,
  onValueChange,
  onColorSelect,
  onAlignSelect,
  onSizeChange,
  onFontFamilyChange,
  onToggleStyle,
  onResetStyle,
  colorOptions,
}: TextControlsProps) {
  const copy = labels[currentLanguage];

  return (
    <section className="space-y-3" aria-label={copy.text}>
      <div className="grid grid-cols-3 gap-1 rounded-xl border border-stone-200 bg-stone-100 p-1">
        {layerOptions.map((layer) => (
          <button
            key={layer}
            type="button"
            aria-pressed={activeLayer === layer}
            onClick={() => onLayerSelect(layer)}
            className={`min-h-10 rounded-lg px-1 text-[11px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#285347] ${
              activeLayer === layer ? 'bg-white text-[#285347] shadow-sm' : 'text-stone-600'
            }`}
          >
            {copy.layers[layer]}
          </button>
        ))}
      </div>

      {activeLayer === 'message' ? (
        <textarea
          aria-label={copy.value[activeLayer]}
          rows={3}
          maxLength={800}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          className="min-h-20 w-full resize-y rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
        />
      ) : (
        <input
          aria-label={copy.value[activeLayer]}
          maxLength={80}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          className="min-h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
        />
      )}
      <p className="text-xs text-stone-500">{copy.move}</p>

      <details className="rounded-xl border border-stone-200 bg-white">
        <summary className="min-h-11 cursor-pointer px-3 py-3 text-sm font-semibold text-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">
          {copy.style}
        </summary>
        <div className="space-y-4 border-t border-stone-100 p-3">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={copy.colors}>
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`${copy.colors}: ${color}`}
                aria-pressed={style.color === color}
                onClick={() => onColorSelect(color)}
                className={`h-9 w-9 rounded-full border-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347] ${
                  style.color === color ? 'border-stone-900' : 'border-stone-200'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="grid grid-cols-[1fr_auto] items-end gap-3">
            <label className="block text-xs font-semibold text-stone-600">
              {copy.font}
              <select
                value={style.family}
                onChange={(event) => onFontFamilyChange(event.target.value as (typeof fontOptions)[number])}
                className="mt-1 min-h-11 w-full rounded-lg border border-stone-200 bg-white px-2 text-sm text-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
              >
                {fontOptions.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </label>
            <span className="pb-3 text-xs font-semibold text-stone-600">{copy.size}: {style.size}px</span>
          </div>

          <input
            type="range"
            min={18}
            max={52}
            aria-label={copy.size}
            value={style.size}
            onChange={(event) => onSizeChange(Number(event.target.value))}
            className="w-full accent-[#285347]"
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-1" role="group" aria-label={currentLanguage === 'nl' ? 'Uitlijning' : currentLanguage === 'so' ? 'Isku hagaajin' : 'Alignment'}>
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  type="button"
                  aria-label={copy.align[align]}
                  aria-pressed={style.align === align}
                  onClick={() => onAlignSelect(align)}
                  className={`min-h-10 min-w-10 rounded-lg border px-2 text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347] ${
                    style.align === align ? 'border-[#285347] bg-[#285347]/5 text-[#285347]' : 'border-stone-200 text-stone-700'
                  }`}
                >
                  {align === 'left' ? '≡' : align === 'center' ? '☰' : '≡'}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {([
                { key: 'bold', label: 'B', pressed: style.bold },
                { key: 'italic', label: 'I', pressed: style.italic },
                { key: 'underline', label: 'U', pressed: style.underline },
              ] as const).map((option) => (
                <button
                  key={option.key}
                  type="button"
                  aria-label={option.key}
                  aria-pressed={option.pressed}
                  onClick={() => onToggleStyle(option.key)}
                  className={`min-h-10 min-w-10 rounded-lg border text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347] ${
                    option.pressed ? 'border-[#285347] bg-[#285347]/5 text-[#285347]' : 'border-stone-200 text-stone-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={onResetStyle}
            className="min-h-10 text-xs font-semibold text-[#285347] underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
          >
            {copy.reset}
          </button>
        </div>
      </details>
    </section>
  );
}
