import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import CardDetailExperience from '../../components/CardDetailExperience';
import JsonLd from '../../components/JsonLd';
import StorefrontShell from '../../components/StorefrontShell';
import { getCardBySlug } from '../../../lib/catalog';
import { getOccasionRouteSlug, occasionLabels } from '../../../lib/card-types';
import { cardOptions } from '../../data/cardOptions';
import { absoluteSiteUrl, toBreadcrumbListJsonLd, toCardJsonLd } from '../../../lib/seo';

interface CardPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return cardOptions.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: CardPageProps): Promise<Metadata> {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) notFound();

  return {
    title: card.title.nl,
    description: card.description.nl,
    alternates: { canonical: `/kaart/${card.slug}` },
    openGraph: {
      title: `${card.title.nl} | HadiyadPay`,
      description: card.description.nl,
      url: `/kaart/${card.slug}`,
      images: ['/images/logo.jpg'],
      type: 'website',
    },
  };
}

export default async function CardPage({ params }: CardPageProps) {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) notFound();

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <StorefrontShell>
        <JsonLd data={toBreadcrumbListJsonLd([
          { name: 'HadiyadPay', url: absoluteSiteUrl('/') },
          { name: 'Kaarten', url: absoluteSiteUrl('/kaarten') },
          {
            name: occasionLabels[card.occasion].nl,
            url: absoluteSiteUrl(`/kaarten/${getOccasionRouteSlug(card.occasion)}`),
          },
          { name: card.title.nl, url: absoluteSiteUrl(`/kaart/${card.slug}`) },
        ])} />
        <JsonLd data={toCardJsonLd(card)} />
        <CardDetailExperience card={card} />
      </StorefrontShell>
    </Suspense>
  );
}
