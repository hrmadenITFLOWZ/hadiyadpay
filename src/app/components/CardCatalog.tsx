'use client';

import CardProductCard from './CardProductCard';
import OccasionNavigation from './OccasionNavigation';

import {
  cardOptions,
} from '../data/cardOptions';

import {
  occasionLabels,
  type CardLanguage,
  type CardOccasion,
} from '../../lib/card-types';

import {
  useStorefrontLanguage,
} from './StorefrontShell';

interface CardCatalogProps {
  defaultOccasion?:
    | CardOccasion
    | 'all';

  includedOccasions?:
    CardOccasion[];

  collectionTitle?:
    Partial<
      Record<
        CardLanguage,
        string
      >
    >;

  showCategoryNavigation?:
    boolean;

  headingLevel?:
    | 1
    | 2;
}

export default function CardCatalog({
  defaultOccasion = 'all',
  includedOccasions,
  collectionTitle,
  showCategoryNavigation = false,
  headingLevel = 1,
}: CardCatalogProps) {
  const language =
    useStorefrontLanguage();

  const cards =
    includedOccasions &&
    includedOccasions.length > 0
      ? cardOptions.filter(
          (card) =>
            includedOccasions.includes(
              card.occasion,
            ),
        )
      : defaultOccasion !==
          'all'
        ? cardOptions.filter(
            (card) =>
              card.occasion ===
              defaultOccasion,
          )
        : cardOptions;

  const defaultTitle =
    defaultOccasion ===
      'all'
      ? language ===
          'nl'
        ? 'Alle digitale kaarten'
        : language ===
            'so'
          ? 'Dhammaan kaararka dijitaalka ah'
          : 'All digital cards'
      : language ===
          'nl'
        ? `Kaarten voor ${
            occasionLabels[
              defaultOccasion
            ].nl.toLocaleLowerCase()
          }`
        : language ===
            'so'
          ? `Kaararka: ${
              occasionLabels[
                defaultOccasion
              ].so
            }`
          : `${
              occasionLabels[
                defaultOccasion
              ].en
            } cards`;

  const title =
    collectionTitle?.[
      language
    ] ??
    defaultTitle;

  const Heading =
    headingLevel ===
      1
      ? 'h1'
      : 'h2';

  return (
    <section
      id="card-catalog"
      aria-labelledby="card-catalog-heading"
      className="mx-auto w-full max-w-7xl scroll-mt-8"
    >
      {showCategoryNavigation && (
        <OccasionNavigation
          currentLanguage={
            language
          }
          activeCategory="all"
          onCategoryChange={
            () => {}
          }
        />
      )}

      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#718078]">
          {language ===
          'nl'
            ? 'DE COLLECTIE'
            : language ===
                'so'
              ? 'URURINTA'
              : 'THE COLLECTION'}
        </p>

        <Heading
          id="card-catalog-heading"
          className="mt-2 font-serif text-3xl text-[#263e36] sm:text-4xl"
        >
          {
            title
          }
        </Heading>
      </div>

      {cards.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map(
            (card) => (
              <CardProductCard
                key={
                  card.id
                }
                card={
                  card
                }
                language={
                  language
                }
                featured={
                  Boolean(
                    card.featured,
                  )
                }
              />
            ),
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#cfd8d0] bg-white px-5 py-10 text-center">
          <p className="font-semibold text-[#29443a]">
            {language ===
            'nl'
              ? 'Er zijn momenteel geen kaarten in deze collectie.'
              : language ===
                  'so'
                ? 'Hadda wax kaarar ah kuma jiraan ururintan.'
                : 'There are currently no cards in this collection.'}
          </p>
        </div>
      )}
    </section>
  );
}