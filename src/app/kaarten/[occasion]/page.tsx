import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import CardCatalog from '../../components/CardCatalog';
import JsonLd from '../../components/JsonLd';
import StorefrontShell from '../../components/StorefrontShell';
import { getCardsByOccasion, isCardOccasion } from '../../../lib/catalog';
import { cardOccasions, occasionLabels } from '../../../lib/card-types';
import { absoluteSiteUrl, toBreadcrumbListJsonLd, toItemListJsonLd } from '../../../lib/seo';

interface OccasionPageProps {
  params: Promise<{ occasion: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return cardOccasions.map((occasion) => ({ occasion }));
}

export async function generateMetadata({ params }: OccasionPageProps): Promise<Metadata> {
  const { occasion: slug } = await params;
  if (!isCardOccasion(slug)) notFound();

  const title = `${occasionLabels[slug].nl} kaarten`;
  const description = `Bekijk digitale kaarten voor ${occasionLabels[slug].nl.toLocaleLowerCase()}.`;

  return {
    title,
    description,
    alternates: { canonical: `/kaarten/${slug}` },
    openGraph: {
      title: `${title} | HadiyadPay`,
      description,
      url: `/kaarten/${slug}`,
      images: ['/images/logo.jpg'],
      type: 'website',
    },
  };
}

export default async function OccasionPage({ params }: OccasionPageProps) {
  const { occasion: slug } = await params;
  if (!isCardOccasion(slug)) notFound();

  const cards = getCardsByOccasion(slug);
  const occasionName = occasionLabels[slug].nl;

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <StorefrontShell>
        <JsonLd data={toBreadcrumbListJsonLd([
          { name: 'HadiyadPay', url: absoluteSiteUrl('/') },
          { name: 'Kaarten', url: absoluteSiteUrl('/kaarten') },
          { name: occasionName, url: absoluteSiteUrl(`/kaarten/${slug}`) },
        ])} />
        <JsonLd data={toItemListJsonLd(cards)} />
        <CardCatalog defaultOccasion={slug} />
      </StorefrontShell>
    </Suspense>
  );
}
