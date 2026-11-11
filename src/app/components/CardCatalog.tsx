'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import CardCatalogControls from './CardCatalogControls';
import CardProductCard from './CardProductCard';
import OccasionNavigation from './OccasionNavigation';
import { cardOptions } from '../data/cardOptions';
import {
  defaultCatalogFilters,
  filterAndSortCards,
  parseCatalogFilters,
  updateCatalogParams,
} from '../../lib/catalog';
import { occasionLabels, type CardOccasion } from '../../lib/card-types';
import { useStorefrontLanguage } from './StorefrontShell';

interface CardCatalogProps {
  defaultOccasion?: CardOccasion | 'all';
  showCategoryNavigation?: boolean;
  headingLevel?: 1 | 2;
}

export default function CardCatalog({
  defaultOccasion = 'all',
  showCategoryNavigation = false,
  headingLevel = 1,
}: CardCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const language = useStorefrontLanguage();
  const filters = parseCatalogFilters(new URLSearchParams(searchParams.toString()), defaultOccasion);
  const cards = filterAndSortCards(cardOptions, filters, language);
  const hasFilters =
    filters.query !== '' ||
    filters.category !== 'all' ||
    filters.occasion !== defaultOccasion ||
    filters.recipient !== 'all' ||
    filters.style !== 'all' ||
    filters.color !== 'all' ||
    filters.language !== 'all' ||
    filters.orientation !== 'all' ||
    filters.sort !== 'featured';
  const activeFilterCount = [
    filters.category !== 'all',
    filters.occasion !== defaultOccasion,
    filters.recipient !== 'all',
    filters.style !== 'all',
    filters.color !== 'all',
    filters.language !== 'all',
    filters.orientation !== 'all',
  ].filter(Boolean).length;

  const updateFilters = (nextFilters: typeof filters) => {
    const params = updateCatalogParams(
      new URLSearchParams(searchParams.toString()),
      nextFilters,
      defaultOccasion,
    );
    const query = params.toString();
    const href = `${pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    router.replace(href, { scroll: false });
  };

  const clearFilters = () => {
    updateFilters({
      ...defaultCatalogFilters,
      occasion: defaultOccasion,
    });
  };

  const title = defaultOccasion === 'all'
    ? language === 'nl' ? 'Alle digitale kaarten' : language === 'so' ? 'Dhammaan kaararka dijitaalka ah' : 'All digital cards'
    : language === 'nl'
      ? `Kaarten voor ${occasionLabels[defaultOccasion].nl.toLocaleLowerCase()}`
      : language === 'so'
        ? `Kaararka: ${occasionLabels[defaultOccasion].so}`
        : `${occasionLabels[defaultOccasion].en} cards`;
  const Heading = headingLevel === 1 ? 'h1' : 'h2';

  return (
    <section id="card-catalog" aria-labelledby="card-catalog-heading" className="mx-auto w-full max-w-7xl scroll-mt-8">
      {showCategoryNavigation && (
        <OccasionNavigation
          currentLanguage={language}
          activeCategory={filters.category}
          onCategoryChange={(category) => updateFilters({ ...filters, category })}
        />
      )}
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#718078]">
          {language === 'nl' ? 'DE COLLECTIE' : language === 'so' ? 'URURINTA' : 'THE COLLECTION'}
        </p>
        <Heading id="card-catalog-heading" className="mt-2 font-serif text-3xl text-[#263e36] sm:text-4xl">
          {title}
        </Heading>
      </div>

      <CardCatalogControls
        language={language}
        filters={filters}
        resultCount={cards.length}
        activeFilterCount={activeFilterCount}
        hasFilters={hasFilters}
        onChange={updateFilters}
        onClear={clearFilters}
      />

      {cards.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((card) => (
            <CardProductCard key={card.id} card={card} language={language} featured={Boolean(card.featured)} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#cfd8d0] bg-white px-5 py-10 text-center">
          <p className="font-semibold text-[#29443a]">
            {language === 'nl'
              ? 'Geen kaarten gevonden. Pas je zoekopdracht of filters aan.'
              : language === 'so'
                ? 'Kaarka lama helin. Beddel raadinta ama shaandhooyinka.'
                : 'No cards found. Try changing your search or filters.'}
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 min-h-11 rounded-lg bg-[#285347] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e4338] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
          >
            {language === 'nl' ? 'Wis filters' : language === 'so' ? 'Nadiifi shaandhooyinka' : 'Clear filters'}
          </button>
        </div>
      )}
    </section>
  );
}
