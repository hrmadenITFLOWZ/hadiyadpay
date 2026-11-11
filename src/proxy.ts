import { NextResponse, type NextRequest } from 'next/server';
import { cardOccasions, occasionRouteMap, type CardLanguage } from './lib/card-types';

function isCardLanguage(value: string | null): value is CardLanguage {
  return value === 'so' || value === 'en' || value === 'nl';
}

export function proxy(request: NextRequest) {
  const segments = request.nextUrl.pathname.split('/').filter(Boolean);
  if (segments.length !== 2 || segments[0] !== 'kaarten') {
    return NextResponse.next();
  }

  const occasion = cardOccasions.find((candidate) => candidate === segments[1]);
  if (!occasion) {
    return NextResponse.next();
  }

  const canonicalSlug = occasionRouteMap[occasion];
  if (canonicalSlug === segments[1]) {
    return NextResponse.next();
  }

  const destination = request.nextUrl.clone();
  destination.pathname = `/kaarten/${canonicalSlug}`;
  destination.search = '';

  const language = request.nextUrl.searchParams.get('lang');
  if (isCardLanguage(language)) {
    destination.searchParams.set('lang', language);
  }

  return NextResponse.redirect(destination, { status: 308 });
}

export const config = {
  matcher: '/kaarten/:occasion',
};
