import type {
  CardOrientation,
} from './card-types';

export type ProductionProductType =
  | 'digital'
  | 'premium-print'
  | 'black-frame'
  | 'natural-frame';

export interface ProductionDimensions {
  width: number;
  height: number;
}

export interface ProductionPhysicalDimensions {
  widthMm: number;
  heightMm: number;
}

export interface ProductionSafeZone {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ProductionPhotoProfile {
  allowed: boolean;
  shape: 'circle';
  widthPercent: number;
  defaultPosition: {
    x: number;
    y: number;
  };
}

export interface CardProductionProfile {
  cardId: string;

  orientation: CardOrientation;

  aspectRatio: {
    width: number;
    height: number;
  };

  digital: ProductionDimensions;

  /**
   * High-resolution internal production master.
   *
   * This is intentionally supplier-independent.
   * Gelato/Printful-specific bleed dimensions will
   * be added only after we select and test a product.
   */
  productionMaster: ProductionDimensions;

  physical: ProductionPhysicalDimensions;

  /**
   * Percentage of the finished design that should
   * remain clear of critical text and personalisation.
   */
  safeZone: ProductionSafeZone;

  photo: ProductionPhotoProfile;

  products: ProductionProductType[];
}

/**
 * First HadiyadPay physical-production master.
 *
 * The original wedding.svg artwork has a native
 * 1200 × 900 viewBox, which is exactly 4:3.
 *
 * We preserve that ratio across:
 *
 * - digital Hadiyad
 * - production master
 * - 40 × 30 cm print
 * - 40 × 30 cm framed products
 */
const aroosProductionProfile: CardProductionProfile = {
  cardId:
    'aroos',

  orientation:
    'landscape',

  aspectRatio: {
    width: 4,
    height: 3,
  },

  digital: {
    width: 1200,
    height: 900,
  },

  productionMaster: {
    width: 4800,
    height: 3600,
  },

  physical: {
    widthMm: 400,
    heightMm: 300,
  },

  safeZone: {
    top: 8,
    right: 8,
    bottom: 8,
    left: 8,
  },

  photo: {
    allowed: true,

    shape:
      'circle',

    widthPercent: 20,

    defaultPosition: {
      x: 84,
      y: 76,
    },
  },

  products: [
    'digital',
    'premium-print',
    'black-frame',
    'natural-frame',
  ],
};

const productionProfiles: Record<
  string,
  CardProductionProfile
> = {
  aroos:
    aroosProductionProfile,
};

export function getCardProductionProfile(
  cardId: string,
): CardProductionProfile | null {
  return (
    productionProfiles[
      cardId
    ] ??
    null
  );
}

export function hasPhysicalProductionProfile(
  cardId: string,
): boolean {
  const profile =
    getCardProductionProfile(
      cardId,
    );

  if (!profile) {
    return false;
  }

  return profile.products.some(
    (product) =>
      product !== 'digital',
  );
}