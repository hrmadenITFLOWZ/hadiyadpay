import Link from 'next/link';

import type {
  CardOption,
} from '../data/cardOptions';

import CardArtworkLayer from './CardArtworkLayer';

type Language =
  | 'so'
  | 'en'
  | 'nl';

interface CardProductCardProps {
  card: CardOption;
  language: Language;
  featured?: boolean;
}

const copy = {
  so: {
    featured:
      'La doortay',

    personalize:
      'Eeg kaarka',

    price:
      'Kaar dijitaal ah',
  },

  en: {
    featured:
      'Featured',

    personalize:
      'View card',

    price:
      'Digital e-card',
  },

  nl: {
    featured:
      'Uitgelicht',

    personalize:
      'Bekijk kaart',

    price:
      'Digitale kaart',
  },
} satisfies Record<
  Language,
  Record<string, string>
>;

export default function CardProductCard({
  card,
  language,
  featured = false,
}: CardProductCardProps) {
  const lang =
    language;

  return (
    <article className="group min-w-0">
      <Link
        href={`/kaart/${card.slug}?lang=${language}`}
        aria-label={`${copy[language].personalize}: ${card.title[lang]}`}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#285347]"
      >
        <div
          className={`relative w-full overflow-hidden rounded-[1.35rem] border border-[#e8e2d8] bg-[#f7f1e8] shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl ${
            card.orientation ===
            'portrait'
              ? 'aspect-[2/3]'
              : 'aspect-[4/3]'
          }`}
        >
          <CardArtworkLayer
            artwork={
              card.artwork
            }
            language={
              language
            }
            decorative={
              false
            }
            overlay={
              false
            }
            fit="contain"
            backgroundColor="#f7f1e8"
          />

          {featured && (
            <span className="absolute left-3 top-3 z-10 rounded-full border border-white/70 bg-[#fffaf2]/95 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[#594c3d] shadow-sm backdrop-blur-sm">
              {
                copy[
                  language
                ].featured
              }
            </span>
          )}
        </div>

        <div className="px-1 pt-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="min-w-0 line-clamp-2 font-serif text-lg leading-snug text-[#293d35] transition-colors group-hover:text-[#285347]">
              {
                card.title[
                  lang
                ]
              }
            </h3>

            <p className="shrink-0 rounded-full bg-[#eef4f1] px-2.5 py-1 text-sm font-bold text-[#285347]">
              €2.00
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-[#798079]">
              {
                copy[
                  language
                ].price
              }
            </span>

            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#285347]">
              {
                copy[
                  language
                ].personalize
              }

              <span
                aria-hidden="true"
              >
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}