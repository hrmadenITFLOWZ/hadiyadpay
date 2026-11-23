import type {
  CardLanguage,
} from '../../lib/card-types';

export type StickerCategory =
  | 'wedding-henna'
  | 'eid'
  | 'love'
  | 'heritage'
  | 'birthday'
  | 'graduation'
  | 'general';

export interface StickerAsset {
  id: string;

  category:
    StickerCategory;

  src: string;

  label: Record<
    CardLanguage,
    string
  >;

  defaultWidth: number;

  defaultScale?: number;

  defaultRotation?: number;

  keywords: string[];
}

export interface StickerCategoryDefinition {
  id: StickerCategory;

  label: Record<
    CardLanguage,
    string
  >;

  description: Record<
    CardLanguage,
    string
  >;

  enabled: boolean;
}

export const stickerCategories:
  StickerCategoryDefinition[] = [
    {
      id:
        'wedding-henna',

      label: {
        so:
          'Aroos & Xinna',

        en:
          'Wedding & Henna',

        nl:
          'Wedding & Henna',
      },

      description: {
        so:
          'Qurxin loogu talagalay arooska iyo xinnada.',

        en:
          'Elegant details for wedding and henna cards.',

        nl:
          'Elegante details voor Wedding & Henna-kaarten.',
      },

      enabled:
        true,
    },

    {
      id:
        'eid',

      label: {
        so:
          'Ciid',

        en:
          'Eid',

        nl:
          'Eid',
      },

      description: {
        so:
          'Qurxin loogu talagalay munaasabadaha Ciidda.',

        en:
          'Decorative details for Eid moments.',

        nl:
          'Decoratieve details voor Eid-momenten.',
      },

      enabled:
        false,
    },

    {
      id:
        'love',

      label: {
        so:
          'Jacayl',

        en:
          'Love',

        nl:
          'Liefde',
      },

      description: {
        so:
          'Qurxin loogu talagalay farriimaha jacaylka.',

        en:
          'Warm details for meaningful love cards.',

        nl:
          'Warme details voor persoonlijke liefdeskaarten.',
      },

      enabled:
        false,
    },

    {
      id:
        'heritage',

      label: {
        so:
          'Hidaha',

        en:
          'Heritage',

        nl:
          'Heritage',
      },

      description: {
        so:
          'Qurxin leh muuqaal dhaqameed.',

        en:
          'Decorative details inspired by heritage.',

        nl:
          'Decoratieve details geïnspireerd op heritage.',
      },

      enabled:
        false,
    },

    {
      id:
        'birthday',

      label: {
        so:
          'Dhalasho',

        en:
          'Birthday',

        nl:
          'Verjaardag',
      },

      description: {
        so:
          'Qurxin loogu talagalay maalmaha dhalashada.',

        en:
          'Playful details for birthday cards.',

        nl:
          'Speelse details voor verjaardagskaarten.',
      },

      enabled:
        false,
    },

    {
      id:
        'graduation',

      label: {
        so:
          'Qalin-jabin',

        en:
          'Graduation',

        nl:
          'Afstuderen',
      },

      description: {
        so:
          'Qurxin loogu talagalay qalin-jabinta.',

        en:
          'Celebratory details for graduation cards.',

        nl:
          'Feestelijke details voor afstudeerkaarten.',
      },

      enabled:
        false,
    },

    {
      id:
        'general',

      label: {
        so:
          'Guud',

        en:
          'Everyday',

        nl:
          'Algemeen',
      },

      description: {
        so:
          'Qurxin ku habboon kaarar kala duwan.',

        en:
          'Versatile details for every kind of card.',

        nl:
          'Veelzijdige details voor verschillende kaarten.',
      },

      enabled:
        false,
    },
  ];

export const stickerAssets:
  StickerAsset[] = [
    {
      id:
        'gold-sparkle-01',

      category:
        'wedding-henna',

      src:
        '/stickers/wedding-henna/gold-sparkle-01.png',

      label: {
        so:
          'Iftiin dahab ah',

        en:
          'Golden sparkle',

        nl:
          'Gouden sparkle',
      },

      defaultWidth:
        14,

      defaultScale:
        1,

      defaultRotation:
        0,

      keywords: [
        'gold',
        'sparkle',
        'star',
        'wedding',
        'henna',
        'celebration',
      ],
    },

    {
      id:
        'henna-flower-01',

      category:
        'wedding-henna',

      src:
        '/stickers/wedding-henna/henna-flower-01.png',

      label: {
        so:
          'Ubax xinna',

        en:
          'Henna flower',

        nl:
          'Henna bloem',
      },

      defaultWidth:
        22,

      defaultScale:
        1,

      defaultRotation:
        -8,

      keywords: [
        'henna',
        'flower',
        'floral',
        'wedding',
        'ornament',
      ],
    },

    {
      id:
        'gold-rings-01',

      category:
        'wedding-henna',

      src:
        '/stickers/wedding-henna/gold-rings-01.png',

      label: {
        so:
          'Faraanti dahab ah',

        en:
          'Golden rings',

        nl:
          'Gouden ringen',
      },

      defaultWidth:
        20,

      defaultScale:
        1,

      defaultRotation:
        0,

      keywords: [
        'rings',
        'gold',
        'marriage',
        'wedding',
        'love',
      ],
    },

    {
      id:
        'soft-heart-01',

      category:
        'wedding-henna',

      src:
        '/stickers/wedding-henna/soft-heart-01.png',

      label: {
        so:
          'Wadne',

        en:
          'Soft heart',

        nl:
          'Zacht hart',
      },

      defaultWidth:
        16,

      defaultScale:
        1,

      defaultRotation:
        6,

      keywords: [
        'heart',
        'love',
        'wedding',
        'romantic',
      ],
    },

    {
      id:
        'floral-sprig-01',

      category:
        'wedding-henna',

      src:
        '/stickers/wedding-henna/floral-sprig-01.png',

      label: {
        so:
          'Laanta ubaxa',

        en:
          'Floral sprig',

        nl:
          'Bloemtakje',
      },

      defaultWidth:
        24,

      defaultScale:
        1,

      defaultRotation:
        -12,

      keywords: [
        'flower',
        'floral',
        'branch',
        'wedding',
        'henna',
        'botanical',
      ],
    },
  ];

export function getStickerAsset(
  stickerId: string,
): StickerAsset | null {
  return (
    stickerAssets.find(
      (sticker) =>
        sticker.id ===
        stickerId,
    ) ??
    null
  );
}

export function getStickersByCategory(
  category: StickerCategory,
): StickerAsset[] {
  return stickerAssets.filter(
    (sticker) =>
      sticker.category ===
      category,
  );
}

export function getEnabledStickerCategories():
  StickerCategoryDefinition[] {
  return stickerCategories.filter(
    (category) =>
      category.enabled,
  );
}

export function getStickerLabel(
  sticker:
    StickerAsset,
  language:
    CardLanguage,
): string {
  return sticker.label[
    language
  ];
}

export function searchStickers(
  query: string,
  language:
    CardLanguage,
): StickerAsset[] {
  const normalizedQuery =
    query
      .trim()
      .toLowerCase();

  if (
    !normalizedQuery
  ) {
    return stickerAssets;
  }

  return stickerAssets.filter(
    (sticker) => {
      const label =
        sticker.label[
          language
        ].toLowerCase();

      const category =
        sticker.category
          .toLowerCase();

      const keywordMatch =
        sticker.keywords.some(
          (keyword) =>
            keyword
              .toLowerCase()
              .includes(
                normalizedQuery,
              ),
        );

      return (
        label.includes(
          normalizedQuery,
        ) ||
        category.includes(
          normalizedQuery,
        ) ||
        keywordMatch
      );
    },
  );
}