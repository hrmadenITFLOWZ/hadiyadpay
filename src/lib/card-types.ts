export type CardLanguage =
  | 'so'
  | 'en'
  | 'nl';

export type LocalizedText =
  Record<
    CardLanguage,
    string
  >;

export type CardCategory =
  | 'celebrations'
  | 'milestones';

export const cardOccasions = [
  'birthday',
  'birth',
  'wedding',
  'graduation',
  'love',
  'thanks',
  'get-well',
  'new-home',
  'eid',
  'henna',
  'heritage',
  'encouragement',
  'blessings',
  'just-because',
] as const;

export type CardOccasion =
  (
    typeof cardOccasions
  )[number];

export const occasionRouteMap = {
  birthday:
    'verjaardag',

  birth:
    'geboorte',

  wedding:
    'huwelijk',

  graduation:
    'afstuderen',

  love:
    'liefde',

  thanks:
    'bedankt',

  'get-well':
    'beterschap',

  'new-home':
    'nieuwe-woning',

  eid:
    'eid',

  henna:
    'hennafeest',

  heritage:
    'erfgoed',

  encouragement:
    'aanmoediging',

  blessings:
    'zegeningen',

  'just-because':
    'zomaar',
} as const satisfies Record<
  CardOccasion,
  string
>;

export function getOccasionFromRouteSlug(
  slug: string,
): CardOccasion | undefined {
  return cardOccasions.find(
    (occasion) =>
      occasionRouteMap[
        occasion
      ] === slug,
  );
}

export function getOccasionRouteSlug(
  occasion: CardOccasion,
): string {
  return occasionRouteMap[
    occasion
  ];
}

export const occasionLabels: Record<
  CardOccasion,
  LocalizedText
> = {
  birthday: {
    so:
      'Dhalasho',

    en:
      'Birthday',

    nl:
      'Verjaardag',
  },

  birth: {
    so:
      'Dhalasho',

    en:
      'Birth',

    nl:
      'Geboorte',
  },

  wedding: {
    so:
      'Aroos & Henna',

    en:
      'Wedding & Henna',

    nl:
      'Wedding & Henna',
  },

  graduation: {
    so:
      'Qalinjabin',

    en:
      'Graduation',

    nl:
      'Diploma',
  },

  love: {
    so:
      'Jacayl',

    en:
      'Love',

    nl:
      'Liefde',
  },

  thanks: {
    so:
      'Mahadsanid',

    en:
      'Thanks',

    nl:
      'Bedankt',
  },

  'get-well': {
    so:
      'Caafimaad degdeg ah',

    en:
      'Get well soon',

    nl:
      'Beterschap',
  },

  'new-home': {
    so:
      'Guri cusub',

    en:
      'New home',

    nl:
      'Nieuwe woning',
  },

  eid: {
    so:
      'Ciid',

    en:
      'Eid',

    nl:
      'Eid',
  },

  henna: {
    so:
      'Henna',

    en:
      'Henna',

    nl:
      'Henna',
  },

  heritage: {
    so:
      'Hiddaha',

    en:
      'Heritage',

    nl:
      'Erfgoed',
  },

  encouragement: {
    so:
      'Dhiirigelin',

    en:
      'Encouragement',

    nl:
      'Aanmoediging',
  },

  blessings: {
    so:
      'Barako',

    en:
      'Blessings',

    nl:
      'Zegeningen',
  },

  'just-because': {
    so:
      'Sabab la’aan',

    en:
      'Just Because',

    nl:
      'Zomaar',
  },
};

export const recipientTypes = [
  'friend',
  'family',
  'partner',
  'colleague',
  'graduate',
] as const;

export type RecipientType =
  (
    typeof recipientTypes
  )[number];

export const cardStyles = [
  'illustrated',
  'traditional',
  'floral',
  'minimal',
  'ornamental',
  'geometric',
] as const;

export type CardStyle =
  (
    typeof cardStyles
  )[number];

export const cardColors = [
  'green',
  'blue',
  'gold',
  'rose',
  'terracotta',
  'neutral',
] as const;

export type CardColor =
  (
    typeof cardColors
  )[number];

export type CardOrientation =
  | 'portrait'
  | 'landscape';

/*
 * Every local card image must live underneath:
 *
 * /public/images/cards/
 *
 * Examples:
 *
 * /images/cards/birthday.svg
 * /images/cards/love-01-en.png
 * /images/cards/wedding-henna/bridal-henna-moment.png
 * /images/cards/heritage/heritage-04.png
 *
 * ${string} also allows subdirectories such as
 * wedding-henna/, heritage/, and just-because/.
 */
export type CardArtworkSource =
  | `/images/cards/${string}.svg`
  | `/images/cards/${string}.png`
  | `/images/cards/${string}.webp`
  | `/images/cards/${string}.jpg`
  | `/images/cards/${string}.jpeg`;

export type CardArtwork =
  | {
      type:
        'local-image';

      /*
       * Default artwork.
       *
       * For cards containing embedded wording,
       * this can be the English version.
       *
       * English and Dutch use this artwork unless
       * a language-specific override exists.
       */
      src:
        CardArtworkSource;

      /*
       * Optional language-specific artwork.
       *
       * Example:
       *
       * src:
       *   '/images/cards/love-03-en.png'
       *
       * localizedSrc:
       *   {
       *     so:
       *       '/images/cards/love-03-so.png'
       *   }
       *
       * Somali then receives the Somali artwork.
       * English and Dutch continue using src.
       */
      localizedSrc?:
        Partial<
          Record<
            CardLanguage,
            CardArtworkSource
          >
        >;

      alt:
        LocalizedText;

      /*
       * Controls which part of an image remains
       * visually important when object-cover is used.
       *
       * Examples:
       *
       * 'center'
       * 'center top'
       * '50% 20%'
       */
      focalPoint?:
        string;

      owner:
        'hadiyadpay';
    }
  | {
      type:
        'gradient';

      background:
        string;

      alt:
        LocalizedText;

      owner:
        'hadiyadpay';
    };

/*
 * Central artwork-language resolver.
 *
 * Components should use this helper rather than
 * reading artwork.src directly.
 *
 * This ensures that editor preview, download,
 * recipient reveal, and production output use
 * the same language-specific artwork.
 */
export function getCardArtworkSource(
  artwork: CardArtwork,
  language: CardLanguage,
): CardArtworkSource | null {
  if (
    artwork.type !==
    'local-image'
  ) {
    return null;
  }

  return (
    artwork.localizedSrc?.[
      language
    ] ??
    artwork.src
  );
}

export interface CardOption {
  id:
    string;

  slug:
    string;

  category:
    CardCategory;

  occasion:
    CardOccasion;

  title:
    LocalizedText;

  badge:
    LocalizedText;

  description:
    LocalizedText;

  searchTerms:
    string[];

  recipientTypes:
    RecipientType[];

  styles:
    CardStyle[];

  colors:
    CardColor[];

  languages:
    CardLanguage[];

  orientation:
    CardOrientation;

  artwork:
    CardArtwork;

  featured?:
    boolean;

  defaultRecipient:
    LocalizedText;

  defaultSender:
    LocalizedText;

  defaultMessage:
    LocalizedText;
}

export type CatalogSort =
  | 'featured'
  | 'name-asc'
  | 'name-desc';

export interface CatalogFilters {
  query:
    string;

  category:
    | CardCategory
    | 'all';

  occasion:
    | CardOccasion
    | 'all';

  recipient:
    | RecipientType
    | 'all';

  style:
    | CardStyle
    | 'all';

  color:
    | CardColor
    | 'all';

  language:
    | CardLanguage
    | 'all';

  orientation:
    | CardOrientation
    | 'all';

  sort:
    CatalogSort;
}