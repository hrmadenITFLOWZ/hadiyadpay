import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import CardCatalog from '../../components/CardCatalog';
import JsonLd from '../../components/JsonLd';
import StorefrontShell from '../../components/StorefrontShell';
import { getCardsByOccasion } from '../../../lib/catalog';
import {
  cardOccasions,
  getOccasionFromRouteSlug,
  getOccasionRouteSlug,
  occasionLabels,
  type CardOccasion,
} from '../../../lib/card-types';
import { absoluteSiteUrl, toBreadcrumbListJsonLd, toItemListJsonLd } from '../../../lib/seo';

interface OccasionPageProps {
  params: Promise<{ occasion: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return cardOccasions.map((occasion) => ({ occasion: getOccasionRouteSlug(occasion) }));
}

function getOccasionOrNotFound(slug: string): CardOccasion {
  const occasion = getOccasionFromRouteSlug(slug);
  if (!occasion) notFound();
  return occasion;
}

export async function generateMetadata({ params }: OccasionPageProps): Promise<Metadata> {
  const { occasion: slug } = await params;
  const occasion = getOccasionOrNotFound(slug);
  const canonicalPath = `/kaarten/${getOccasionRouteSlug(occasion)}`;

  const title = `${occasionLabels[occasion].nl} kaarten`;
  const description = `Bekijk digitale kaarten voor ${occasionLabels[occasion].nl.toLocaleLowerCase()}.`;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: `${title} | HadiyadPay`,
      description,
      url: canonicalPath,
      images: ['/images/logo.jpg'],
      type: 'website',
    },
  };
}

export default async function OccasionPage({ params }: OccasionPageProps) {
  const { occasion: slug } = await params;
  const occasion = getOccasionOrNotFound(slug);
  const canonicalPath = `/kaarten/${getOccasionRouteSlug(occasion)}`;

  const cards = getCardsByOccasion(occasion);
  const occasionName = occasionLabels[occasion].nl;

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <StorefrontShell>
        <JsonLd data={toBreadcrumbListJsonLd([
          { name: 'HadiyadPay', url: absoluteSiteUrl('/') },
          { name: 'Kaarten', url: absoluteSiteUrl('/kaarten') },
          { name: occasionName, url: absoluteSiteUrl(canonicalPath) },
        ])} />
        <JsonLd data={toItemListJsonLd(cards)} />
        <CardCatalog defaultOccasion={occasion} />
      </StorefrontShell>
    </Suspense>
  );
}
