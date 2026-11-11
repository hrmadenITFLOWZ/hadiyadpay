import { Suspense } from 'react';
import HomeStorefront from './components/HomeStorefront';
import JsonLd from './components/JsonLd';
import StorefrontShell from './components/StorefrontShell';
import { cardOptions } from './data/cardOptions';
import { toItemListJsonLd } from '../lib/seo';

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <StorefrontShell>
        <JsonLd data={toItemListJsonLd(cardOptions)} />
        <HomeStorefront />
      </StorefrontShell>
    </Suspense>
  );
}
