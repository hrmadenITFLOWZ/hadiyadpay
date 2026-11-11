import type { CSSProperties } from 'react';
import type { CardOption } from '../data/cardOptions';

type Language = 'so' | 'en' | 'nl';

interface CardProductCardProps {
  card: CardOption;
  language: Language;
  featured?: boolean;
  onSelect: (card: CardOption) => void;
}

const copy = {
  so: { featured: 'La doortay', personalize: 'Shakhsiyeeyee', price: 'Kaar dijitaal ah' },
  en: { featured: 'Featured', personalize: 'Personalize card', price: 'Digital e-card' },
  nl: { featured: 'Uitgelicht', personalize: 'Personaliseer kaart', price: 'Digitale kaart' },
} satisfies Record<Language, Record<string, string>>;

export default function CardProductCard({
  card,
  language,
  featured = false,
  onSelect,
}: CardProductCardProps) {
  const lang = language === 'so' ? 'so' : 'en';
  const imageStyle: CSSProperties = card.bgImage
    ? {
        backgroundImage: `linear-gradient(to bottom, rgba(20,15,10,0.12), rgba(15,10,5,0.78)), url(${card.bgImage})`,
        backgroundColor: '#261e16',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { background: card.gradient || 'linear-gradient(135deg, #b45309 0%, #78350f 100%)' };

  return (
    <article className="group min-w-0">
      <button
        type="button"
        onClick={() => onSelect(card)}
        aria-label={`${copy[language].personalize}: ${card.title[lang]}`}
        className={`block w-full overflow-hidden rounded-[1.4rem] text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#285347] ${
          featured ? 'aspect-[1.24/1]' : 'aspect-[0.82/1]'
        }`}
      >
        <span className="relative flex h-full flex-col justify-between p-5 text-white sm:p-6" style={imageStyle}>
          <span className="flex items-start justify-between gap-3">
            <span className="rounded-full border border-white/25 bg-black/35 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
              {card.badge[lang]}
            </span>
            {featured && (
              <span className="rounded-full bg-[#f7eddc] px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-[#5b4b37]">
                {copy[language].featured}
              </span>
            )}
          </span>
          <span className="block max-w-sm">
            <span className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#f4d9a8]">
              HADIYADPAY
            </span>
            <span className={`block font-serif leading-tight text-white drop-shadow ${featured ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>
              {card.title[lang]}
            </span>
            <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-white/90">
              {copy[language].personalize}
              <span aria-hidden="true">→</span>
            </span>
          </span>
        </span>
      </button>

      <div className="flex items-start justify-between gap-3 px-1 pt-4">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-[#293d35] sm:text-base">{card.title[lang]}</h3>
          <p className="mt-1 text-xs text-[#798079]">{copy[language].price}</p>
        </div>
        <p className="shrink-0 text-sm font-semibold text-[#334d41]">€2.00</p>
      </div>
    </article>
  );
}
