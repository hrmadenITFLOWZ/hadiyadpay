'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getOccasionRouteSlug, occasionLabels, type CardOption } from '../../lib/card-types';
import CardArtworkLayer from './CardArtworkLayer';
import CardBuilder from './CardBuilder';
import CardProductCard from './CardProductCard';
import { cardOptions } from '../data/cardOptions';
import { useStorefrontLanguage } from './StorefrontShell';

export default function CardDetailExperience({ card }: { card: CardOption }) {
  const language = useStorefrontLanguage();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const relatedCards = cardOptions.filter(
    (candidate) => candidate.occasion === card.occasion && candidate.id !== card.id,
  );
  const labels = {
    so: {
      back: 'Dhammaan kaararka',
      occasion: occasionLabels[card.occasion].so,
      personalize: 'Shakhsiyeey kaarkan',
      related: 'Kaarar kale',
      details: 'Kaarka dijitaalka ah',
    },
    en: {
      back: 'All cards',
      occasion: occasionLabels[card.occasion].en,
      personalize: 'Personalize this card',
      related: 'Related cards',
      details: 'Digital e-card',
    },
    nl: {
      back: 'Alle kaarten',
      occasion: occasionLabels[card.occasion].nl,
      personalize: 'Personaliseer deze kaart',
      related: 'Vergelijkbare kaarten',
      details: 'Digitale kaart',
    },
  }[language];

  return (
    <>
      <nav aria-label={language === 'nl' ? 'Broodkruimelnavigatie' : language === 'so' ? 'Hagidda raad-raaca' : 'Breadcrumb'} className="mb-6 text-sm text-[#69746c]">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href={`/?lang=${language}`} className="underline-offset-4 hover:underline">HadiyadPay</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href={`/kaarten?lang=${language}`} className="underline-offset-4 hover:underline">{labels.back}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href={`/kaarten/${getOccasionRouteSlug(card.occasion)}?lang=${language}`} className="underline-offset-4 hover:underline">{labels.occasion}</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-[#293d35]">{card.title[language]}</li>
        </ol>
      </nav>

      <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:gap-14">
        <div className={`relative mx-auto w-full max-w-3xl overflow-hidden rounded-[1.75rem] shadow-lg ${card.orientation === 'portrait' ? 'aspect-[0.82/1]' : 'aspect-[1.24/1]'}`}>
          <CardArtworkLayer artwork={card.artwork} language={language} decorative={false} />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-20 text-white sm:p-9 sm:pt-28">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f4d9a8]">{card.badge[language]}</p>
            <p className="mt-3 font-serif text-3xl leading-tight sm:text-5xl">{card.title[language]}</p>
          </div>
        </div>

        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#718078]">{labels.details}</p>
          <h1 className="mt-3 font-serif text-3xl leading-tight text-[#263e36] sm:text-5xl">{card.title[language]}</h1>
          <p className="mt-5 text-lg leading-8 text-[#59655d]">{card.description[language]}</p>
          <p className="mt-4 text-sm font-medium text-[#718078]">{labels.occasion}</p>
          <button
            type="button"
            onClick={() => setIsEditorOpen(true)}
            aria-haspopup="dialog"
            className="mt-8 min-h-12 rounded-xl bg-[#285347] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1e4338] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
          >
            {labels.personalize}
          </button>
        </div>
      </section>

      {relatedCards.length > 0 && (
        <section className="mt-16 border-t border-[#e8e4dc] pt-10" aria-labelledby="related-cards-heading">
          <h2 id="related-cards-heading" className="mb-7 font-serif text-2xl text-[#263e36] sm:text-3xl">{labels.related}</h2>
          <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCards.map((relatedCard) => (
              <CardProductCard key={relatedCard.id} card={relatedCard} language={language} />
            ))}
          </div>
        </section>
      )}

      {isEditorOpen && (
        <CardBuilder
          key={card.slug}
          card={card}
          currentLanguage={language}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </>
  );
}
