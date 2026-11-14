import type {
  Metadata,
} from 'next';

import {
  notFound,
} from 'next/navigation';

import {
  cardOptions,
} from '../../data/cardOptions';

import {
  getOrderForShareToken,
} from '../../../lib/server/share-access';

import type {
  CardLanguage,
} from '../../../lib/card-types';

import HadiyadReveal from './HadiyadReveal';

export const dynamic =
  'force-dynamic';

export const revalidate = 0;

const productionOrigin =
  'https://www.hadiyadpay.com';

const metadataCopy = {
  so: {
    title:
      'Hadiyad gaar ah ayaa kuu diyaar ah ✨',
    description:
      'Qof ayaa wax gaar ah kuu sameeyey. Fur Hadiyaddaada.',
  },

  en: {
    title:
      'A special Hadiyad is waiting for you ✨',
    description:
      'Someone created something special for you. Open your Hadiyad.',
  },

  nl: {
    title:
      'Er staat een Hadiyad voor je klaar ✨',
    description:
      'Iemand heeft iets bijzonders voor je gemaakt. Open je Hadiyad.',
  },
} satisfies Record<
  CardLanguage,
  {
    title: string;
    description: string;
  }
>;

async function loadSharedCard(
  token: string,
) {
  try {
    return await getOrderForShareToken(
      token,
    );
  } catch (error) {
    console.error(
      'Unable to load shared Hadiyad',
      {
        errorType:
          error instanceof Error
            ? error.name
            : 'unknown',
      },
    );

    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    token: string;
  }>;
}): Promise<Metadata> {
  const { token } =
    await params;

  const sharedOrder =
    await loadSharedCard(
      token,
    );

  const language =
    sharedOrder?.language ??
    'nl';

  const content =
    metadataCopy[language];

  const shareUrl =
    `${productionOrigin}/h/${encodeURIComponent(token)}`;

  /*
   * The version parameter gives WhatsApp a fresh image URL
   * after metadata changes instead of relying on an older
   * cached version of the existing HadiyadPay logo.
   */
  const logoUrl =
    `${productionOrigin}/images/logo.jpg?v=3`;

  return {
    metadataBase:
      new URL(
        productionOrigin,
      ),

    title:
      content.title,

    description:
      content.description,

    applicationName:
      'HadiyadPay',

    robots: {
      index: false,
      follow: false,
      nocache: true,
    },

    alternates: {
      canonical:
        shareUrl,
    },

    openGraph: {
      type:
        'website',

      url:
        shareUrl,

      siteName:
        'HadiyadPay',

      title:
        content.title,

      description:
        content.description,

      images: [
        {
          url:
            logoUrl,

          width:
            512,

          height:
            512,

          type:
            'image/jpeg',

          alt:
            'HadiyadPay',
        },
      ],
    },

    twitter: {
      card:
        'summary',

      title:
        content.title,

      description:
        content.description,

      images: [
        logoUrl,
      ],
    },

    icons: {
      icon:
        '/images/logo.jpg',

      shortcut:
        '/images/logo.jpg',

      apple:
        '/images/logo.jpg',
    },

    other: {
      'og:image:secure_url':
        logoUrl,

      'og:image:type':
        'image/jpeg',

      'og:image:width':
        '512',

      'og:image:height':
        '512',
    },
  };
}

export default async function SharedCardPage({
  params,
}: {
  params: Promise<{
    token: string;
  }>;
}) {
  const { token } =
    await params;

  const sharedOrder =
    await loadSharedCard(
      token,
    );

  if (!sharedOrder) {
    notFound();
  }

  const card =
    cardOptions.find(
      (option) =>
        option.id ===
        sharedOrder.card_id,
    );

  if (!card) {
    notFound();
  }

  return (
    <HadiyadReveal
      token={token}
      language={
        sharedOrder.language
      }
      cardTitle={
        card.title[
          sharedOrder.language
        ]
      }
      orientation={
        card.orientation
      }
    />
  );
}
