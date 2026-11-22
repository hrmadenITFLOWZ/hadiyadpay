import type {
  CardOrientation,
} from './card-types';

import type {
  EditorPhotoFrameSize,
} from './card-editor';

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

export interface ProductionPhotoFrame {
  widthPercent: number;
  heightPercent: number;
}

export interface ProductionPhotoProfile {
  allowed: boolean;

  shape:
    'rounded-rectangle';

  defaultFrameSize:
    EditorPhotoFrameSize;

  frameSizes: Record<
    EditorPhotoFrameSize,
    ProductionPhotoFrame
  >;

  defaultPosition: {
    x: number;
    y: number;
  };

  safeInsetPercent: {
    top: number;
    right: number;
    bottom: number;
    left: number;
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

  productionMaster:
    ProductionDimensions;

  physical:
    ProductionPhysicalDimensions;

  safeZone:
    ProductionSafeZone;

  photo:
    ProductionPhotoProfile;

  products:
    ProductionProductType[];
}

const aroosProductionProfile:
  CardProductionProfile = {
    cardId:
      'aroos',

    orientation:
      'landscape',

    aspectRatio: {
      width:
        4,

      height:
        3,
    },

    digital: {
      width:
        1200,

      height:
        900,
    },

    productionMaster: {
      width:
        4800,

      height:
        3600,
    },

    physical: {
      widthMm:
        400,

      heightMm:
        300,
    },

    safeZone: {
      top:
        8,

      right:
        8,

      bottom:
        8,

      left:
        8,
    },

    photo: {
      allowed:
        true,

      shape:
        'rounded-rectangle',

      defaultFrameSize:
        'large',

      frameSizes: {
        small: {
          widthPercent:
            58,

          heightPercent:
            58,
        },

        medium: {
          widthPercent:
            76,

          heightPercent:
            76,
        },

        large: {
          widthPercent:
            92,

          heightPercent:
            92,
        },
      },

      defaultPosition: {
        x:
          50,

        y:
          50,
      },

      safeInsetPercent: {
        top:
          4,

        right:
          5,

        bottom:
          4,

        left:
          4,
      },
    },

    products: [
      'digital',
      'premium-print',
      'black-frame',
      'natural-frame',
    ],
  };

const productionProfiles:
  Record<
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
    (
      product,
    ) =>
      product !==
      'digital',
  );
}