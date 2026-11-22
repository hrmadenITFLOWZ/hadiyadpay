import type {
  Metadata,
} from 'next';

import {
  notFound,
} from 'next/navigation';

import {
  Suspense,
} from 'react';

import CardCatalog from '../../components/CardCatalog';
import JsonLd from '../../components/JsonLd';
import StorefrontShell from '../../components/StorefrontShell';
import WeddingHennaSpotlight from '../../components/WeddingHennaSpotlight';

import {
  getCardsByOccasion,
} from '../../../lib/catalog';

import {
  cardOccasions,
  getOccasionFromRouteSlug,
  getOccasionRouteSlug,
  occasionLabels,
  type CardOccasion,
} from '../../../lib/card-types';

import {
  absoluteSiteUrl,
  toBreadcrumbListJsonLd,
  toItemListJsonLd,
} from '../../../lib/seo';

interface OccasionPageProps {
  params: Promise<{
    occasion: string;
  }>;
}

export const dynamicParams =
  false;

export function generateStaticParams() {
  return cardOccasions.map(
    (
      occasion,
    ) => ({
      occasion:
        getOccasionRouteSlug(
          occasion,
        ),
    }),
  );
}

function getOccasionOrNotFound(
  slug: string,
): CardOccasion {
  const occasion =
    getOccasionFromRouteSlug(
      slug,
    );

  if (!occasion) {
    notFound();
  }

  return occasion;
}

function isWeddingHennaCollection(
  occasion:
    CardOccasion,
): boolean {
  return (
    occasion ===
    'wedding'
  );
}

function getCollectionCards(
  occasion:
    CardOccasion,
) {
  if (
    isWeddingHennaCollection(
      occasion,
    )
  ) {
    const weddingCards =
      getCardsByOccasion(
        'wedding',
      );

    const hennaCards =
      getCardsByOccasion(
        'henna',
      );

    return [
      ...weddingCards,
      ...hennaCards,
    ];
  }

  return getCardsByOccasion(
    occasion,
  );
}

function getCollectionName(
  occasion:
    CardOccasion,
): string {
  if (
    isWeddingHennaCollection(
      occasion,
    )
  ) {
    return 'Wedding & Henna';
  }

  return occasionLabels[
    occasion
  ].nl;
}

export async function generateMetadata({
  params,
}: OccasionPageProps): Promise<Metadata> {
  const {
    occasion:
      slug,
  } =
    await params;

  const occasion =
    getOccasionOrNotFound(
      slug,
    );

  const canonicalPath =
    `/kaarten/${
      getOccasionRouteSlug(
        occasion,
      )
    }`;

  const isCombinedCollection =
    isWeddingHennaCollection(
      occasion,
    );

  const title =
    isCombinedCollection
      ? 'Wedding & Henna kaarten'
      : `${
          occasionLabels[
            occasion
          ].nl
        } kaarten`;

  const description =
    isCombinedCollection
      ? 'Bekijk digitale kaarten voor Henna, Nikah, bruiloften, trouwfeesten en persoonlijke felicitaties.'
      : `Bekijk digitale kaarten voor ${
          occasionLabels[
            occasion
          ].nl.toLocaleLowerCase()
        }.`;

  return {
    title,

    description,

    alternates: {
      canonical:
        canonicalPath,
    },

    openGraph: {
      title:
        `${title} | HadiyadPay`,

      description,

      url:
        canonicalPath,

      images: [
        '/images/logo.jpg',
      ],

      type:
        'website',
    },
  };
}

export default async function OccasionPage({
  params,
}: OccasionPageProps) {
  const {
    occasion:
      slug,
  } =
    await params;

  const occasion =
    getOccasionOrNotFound(
      slug,
    );

  const canonicalPath =
    `/kaarten/${
      getOccasionRouteSlug(
        occasion,
      )
    }`;

  const cards =
    getCollectionCards(
      occasion,
    );

  const occasionName =
    getCollectionName(
      occasion,
    );

  const isCombinedCollection =
    isWeddingHennaCollection(
      occasion,
    );

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background" />
      }
    >
      <StorefrontShell>
        <JsonLd
          data={
            toBreadcrumbListJsonLd(
              [
                {
                  name:
                    'HadiyadPay',

                  url:
                    absoluteSiteUrl(
                      '/',
                    ),
                },

                {
                  name:
                    'Kaarten',

                  url:
                    absoluteSiteUrl(
                      '/kaarten',
                    ),
                },

                {
                  name:
                    occasionName,

                  url:
                    absoluteSiteUrl(
                      canonicalPath,
                    ),
                },
              ],
            )
          }
        />

        <JsonLd
          data={
            toItemListJsonLd(
              cards,
            )
          }
        />

        {isCombinedCollection && (
          <div className="mx-auto w-full max-w-7xl px-5 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-10 lg:px-12 lg:pb-20">
            <WeddingHennaSpotlight
              showAllCardsButton={
                false
              }
            />
          </div>
        )}

        <CardCatalog
          defaultOccasion={
            occasion
          }
          includedOccasions={
            isCombinedCollection
              ? [
                  'wedding',
                  'henna',
                ]
              : undefined
          }
          collectionTitle={
            isCombinedCollection
              ? {
                  nl:
                    'Wedding & Henna kaarten',

                  en:
                    'Wedding & Henna cards',

                  so:
                    'Kaararka Aroos & Henna',
                }
              : undefined
          }
        />
      </StorefrontShell>
    </Suspense>
  );
}