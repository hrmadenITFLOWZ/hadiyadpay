import type { Metadata } from 'next';
import { Suspense } from 'react';
import CardCatalog from '../components/CardCatalog';
import JsonLd from '../components/JsonLd';
import StorefrontShell from '../components/StorefrontShell';
import { cardOptions } from '../data/cardOptions';
import { absoluteSiteUrl, toBreadcrumbListJsonLd, toItemListJsonLd } from '../../lib/seo';

export const metadata: Metadata = {
  title: 'Alle digitale kaarten',
  description: 'Bekijk digitale kaarten voor verschillende gelegenheden.',
  alternates: { canonical: '/kaarten' },
  openGraph: {
    title: 'Alle digitale kaarten | HadiyadPay',
    description: 'Bekijk digitale kaarten voor verschillende gelegenheden.',
    url: '/kaarten',
    images: ['/images/logo.jpg'],
    type: 'website',
  },
};

export default function CardsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <StorefrontShell>
        <JsonLd data={toBreadcrumbListJsonLd([
          { name: 'HadiyadPay', url: absoluteSiteUrl('/') },
          { name: 'Kaarten', url: absoluteSiteUrl('/kaarten') },
        ])} />
        <JsonLd data={toItemListJsonLd(cardOptions)} />
        <CardCatalog />
      </StorefrontShell>
    </Suspense>
  );
}
