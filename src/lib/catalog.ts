import { cardOptions } from '../app/data/cardOptions';
import {
  cardColors,
  cardOccasions,
  cardStyles,
  recipientTypes,
  type CardCategory,
  type CardColor,
  type CardLanguage,
  type CardOccasion,
  type CardOption,
  type CardOrientation,
  type CardStyle,
  type CatalogFilters,
  type CatalogSort,
  type RecipientType,
} from './card-types';

export const defaultCatalogFilters: CatalogFilters = {
  query: '',
  category: 'all',
  occasion: 'all',
  recipient: 'all',
  style: 'all',
  color: 'all',
  language: 'all',
  orientation: 'all',
  sort: 'featured',
};

const catalogParamKeys = [
  'q',
  'category',
  'occasion',
  'recipient',
  'style',
  'color',
  'language',
  'orientation',
  'sort',
] as const;

function isCategory(value: string | null): value is CardCategory {
  return value === 'celebrations' || value === 'milestones';
}

function isOccasion(value: string | null): value is CardOccasion {
  return value !== null && cardOccasions.some((occasion) => occasion === value);
}

export function isRecipientType(value: string): value is RecipientType {
  return recipientTypes.some((recipient) => recipient === value);
}

export function isCardStyle(value: string): value is CardStyle {
  return cardStyles.some((style) => style === value);
}

export function isCardColor(value: string): value is CardColor {
  return cardColors.some((color) => color === value);
}

export function isCardLanguage(value: string): value is CardLanguage {
  return value === 'so' || value === 'en' || value === 'nl';
}

export function isCardOrientation(value: string): value is CardOrientation {
  return value === 'portrait' || value === 'landscape';
}

export function isCatalogSort(value: string): value is CatalogSort {
  return value === 'featured' || value === 'name-asc' || value === 'name-desc';
}

export function normalizeSearch(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim();
}

export function parseCatalogFilters(
  params: URLSearchParams,
  defaultOccasion: CardOccasion | 'all' = 'all',
): CatalogFilters {
  const rawOccasion = params.get('occasion');
  const rawCategory = params.get('category');
  const rawRecipient = params.get('recipient');
  const rawStyle = params.get('style');
  const rawColor = params.get('color');
  const rawLanguage = params.get('language');
  const rawOrientation = params.get('orientation');
  const rawSort = params.get('sort');

  return {
    query: (params.get('q') ?? '').slice(0, 100),
    category: isCategory(rawCategory) ? rawCategory : 'all',
    occasion: rawOccasion === 'all'
      ? 'all'
      : isOccasion(rawOccasion)
        ? rawOccasion
        : defaultOccasion,
    recipient: rawRecipient !== null && isRecipientType(rawRecipient) ? rawRecipient : 'all',
    style: rawStyle !== null && isCardStyle(rawStyle) ? rawStyle : 'all',
    color: rawColor !== null && isCardColor(rawColor) ? rawColor : 'all',
    language: rawLanguage !== null && isCardLanguage(rawLanguage) ? rawLanguage : 'all',
    orientation: rawOrientation !== null && isCardOrientation(rawOrientation) ? rawOrientation : 'all',
    sort: rawSort !== null && isCatalogSort(rawSort) ? rawSort : 'featured',
  };
}

export function updateCatalogParams(
  current: URLSearchParams,
  filters: CatalogFilters,
  defaultOccasion: CardOccasion | 'all' = 'all',
): URLSearchParams {
  const next = new URLSearchParams(current);
  catalogParamKeys.forEach((key) => next.delete(key));

  if (filters.query) next.set('q', filters.query.slice(0, 100));
  if (filters.category !== 'all') next.set('category', filters.category);
  if (filters.occasion !== defaultOccasion) next.set('occasion', filters.occasion);
  if (filters.recipient !== 'all') next.set('recipient', filters.recipient);
  if (filters.style !== 'all') next.set('style', filters.style);
  if (filters.color !== 'all') next.set('color', filters.color);
  if (filters.language !== 'all') next.set('language', filters.language);
  if (filters.orientation !== 'all') next.set('orientation', filters.orientation);
  if (filters.sort !== 'featured') next.set('sort', filters.sort);

  return next;
}

export function filterAndSortCards(
  cards: readonly CardOption[],
  filters: CatalogFilters,
  language: CardLanguage,
): CardOption[] {
  const query = normalizeSearch(filters.query);
  const filtered = cards.filter((card) => {
    if (filters.category !== 'all' && card.category !== filters.category) return false;
    if (filters.occasion !== 'all' && card.occasion !== filters.occasion) return false;
    if (filters.recipient !== 'all' && !card.recipientTypes.includes(filters.recipient)) return false;
    if (filters.style !== 'all' && !card.styles.includes(filters.style)) return false;
    if (filters.color !== 'all' && !card.colors.includes(filters.color)) return false;
    if (filters.language !== 'all' && !card.languages.includes(filters.language)) return false;
    if (filters.orientation !== 'all' && card.orientation !== filters.orientation) return false;
    if (!query) return true;

    const searchable = [
      ...Object.values(card.title),
      ...Object.values(card.badge),
      ...Object.values(card.description),
      card.occasion,
      ...card.searchTerms,
    ].map(normalizeSearch).join(' ');

    return searchable.includes(query);
  });

  if (filters.sort === 'name-asc' || filters.sort === 'name-desc') {
    const collator = new Intl.Collator(language, { sensitivity: 'base' });
    return filtered.sort((left, right) => {
      const comparison = collator.compare(left.title[language], right.title[language]);
      return filters.sort === 'name-asc' ? comparison : -comparison;
    });
  }

  return filtered.sort(
    (left, right) =>
      Number(Boolean(right.featured)) - Number(Boolean(left.featured)) ||
      cards.indexOf(left) - cards.indexOf(right),
  );
}

export function getCardBySlug(slug: string): CardOption | undefined {
  return cardOptions.find((card) => card.slug === slug);
}

export function getCardsByOccasion(occasion: CardOccasion): CardOption[] {
  return cardOptions.filter((card) => card.occasion === occasion);
}

export function isCardOccasion(value: string): value is CardOccasion {
  return cardOccasions.some((occasion) => occasion === value);
}

export function isCatalogCategory(value: string): value is CardCategory {
  return value === 'celebrations' || value === 'milestones';
}

export function getArtworkPath(card: CardOption): string {
  return card.artwork.type === 'local-image' ? card.artwork.src : '/images/logo.jpg';
}
