import { getArtworkPath } from './catalog';
import type { CardOption } from './card-types';

export function getSiteUrl(): URL {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://hadiyadpay.com');
}

export function absoluteSiteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function toBreadcrumbListJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function toCardJsonLd(card: CardOption) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: card.title.en,
    description: card.description.en,
    image: getArtworkPath(card),
    inLanguage: card.languages,
    url: absoluteSiteUrl(`/kaart/${card.slug}`),
  };
}

export function toItemListJsonLd(cards: readonly CardOption[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'HadiyadPay digital greeting cards',
    numberOfItems: cards.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: cards.map((card, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: card.title.en,
      url: absoluteSiteUrl(`/kaart/${card.slug}`),
    })),
  };
}
