export type CardLanguage = 'so' | 'en' | 'nl';
export type LocalizedText = Record<CardLanguage, string>;

export type CardCategory = 'celebrations' | 'milestones';

export const cardOccasions = [
  'birthday',
  'wedding',
  'henna',
  'eid',
  'heritage',
  'encouragement',
  'graduation',
  'blessings',
] as const;

export type CardOccasion = (typeof cardOccasions)[number];

export const occasionLabels: Record<CardOccasion, LocalizedText> = {
  birthday: { so: 'Dhalasho', en: 'Birthday', nl: 'Verjaardag' },
  wedding: { so: 'Aroos', en: 'Wedding', nl: 'Bruiloft' },
  henna: { so: 'Henna', en: 'Henna night', nl: 'Hennafeest' },
  eid: { so: 'Ciid', en: 'Eid', nl: 'Eid' },
  heritage: { so: 'Hiddaha', en: 'Heritage', nl: 'Erfgoed' },
  encouragement: { so: 'Dhiirigelin', en: 'Encouragement', nl: 'Aanmoediging' },
  graduation: { so: 'Qalinjabin', en: 'Graduation', nl: 'Diploma' },
  blessings: { so: 'Barako', en: 'Blessings', nl: 'Zegeningen' },
};

export const recipientTypes = ['friend', 'family', 'partner', 'colleague', 'graduate'] as const;
export type RecipientType = (typeof recipientTypes)[number];

export const cardStyles = [
  'illustrated',
  'traditional',
  'floral',
  'minimal',
  'ornamental',
  'geometric',
] as const;
export type CardStyle = (typeof cardStyles)[number];

export const cardColors = ['green', 'blue', 'gold', 'rose', 'terracotta', 'neutral'] as const;
export type CardColor = (typeof cardColors)[number];

export type CardOrientation = 'portrait' | 'landscape';

export type CardArtwork =
  | {
      type: 'local-image';
      src: `/images/cards/${string}.svg` | `/images/cards/${string}.webp` | `/images/cards/${string}.jpg`;
      alt: LocalizedText;
      focalPoint?: string;
      owner: 'hadiyadpay';
    }
  | {
      type: 'gradient';
      background: string;
      alt: LocalizedText;
      owner: 'hadiyadpay';
    };

export interface CardOption {
  id: string;
  slug: string;
  category: CardCategory;
  occasion: CardOccasion;
  title: LocalizedText;
  badge: LocalizedText;
  description: LocalizedText;
  searchTerms: string[];
  recipientTypes: RecipientType[];
  styles: CardStyle[];
  colors: CardColor[];
  languages: CardLanguage[];
  orientation: CardOrientation;
  artwork: CardArtwork;
  featured?: boolean;
  defaultRecipient: LocalizedText;
  defaultSender: LocalizedText;
  defaultMessage: LocalizedText;
}

export type CatalogSort = 'featured' | 'name-asc' | 'name-desc';

export interface CatalogFilters {
  query: string;
  category: CardCategory | 'all';
  occasion: CardOccasion | 'all';
  recipient: RecipientType | 'all';
  style: CardStyle | 'all';
  color: CardColor | 'all';
  language: CardLanguage | 'all';
  orientation: CardOrientation | 'all';
  sort: CatalogSort;
}
