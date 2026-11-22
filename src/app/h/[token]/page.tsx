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

import HadiyadReveal from './HadiyadReveal';

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

const productionOrigin =
  'https://www.hadiyadpay.com';

export const metadata: Metadata = {
  metadataBase:
    new URL(
      productionOrigin,
    ),

  title:
    'Er staat een Hadiyad voor je klaar ✨',

  description:
    'Iemand heeft iets bijzonders voor je gemaakt. Open je Hadiyad.',

  applicationName:
    'HadiyadPay',

  robots: {
    index:
      false,

    follow:
      false,

    nocache:
      true,
  },

  openGraph: {
    type:
      'website',

    siteName:
      'HadiyadPay',

    title:
      'Er staat een Hadiyad voor je klaar ✨',

    description:
      'Iemand heeft iets bijzonders voor je gemaakt. Open je Hadiyad.',

    images: [
      {
        url:
          '/images/logo.jpg?v=5',

        width:
          455,

        height:
          452,

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
      'Er staat een Hadiyad voor je klaar ✨',

    description:
      'Iemand heeft iets bijzonders voor je gemaakt. Open je Hadiyad.',

    images: [
      '/images/logo.jpg?v=5',
    ],
  },

  icons: {
    icon:
      '/images/logo.jpg?v=5',

    shortcut:
      '/images/logo.jpg?v=5',

    apple:
      '/images/logo.jpg?v=5',
  },

  other: {
    'og:image:secure_url':
      `${productionOrigin}/images/logo.jpg?v=5`,

    'og:image:type':
      'image/jpeg',

    'og:image:width':
      '455',

    'og:image:height':
      '452',
  },
};

export default async function SharedCardPage({
  params,
}: {
  params: Promise<{
    token: string;
  }>;
}) {
  const {
    token,
  } =
    await params;

  let sharedOrder: Awaited<
    ReturnType<
      typeof getOrderForShareToken
    >
  >;

  try {
    sharedOrder =
      await getOrderForShareToken(
        token,
      );
  } catch (error) {
    console.error(
      'Unable to load Hadiyad Reveal page',
      {
        errorType:
          error instanceof Error
            ? error.name
            : 'unknown',
      },
    );

    notFound();
  }

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
      token={
        token
      }
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
      occasion={
        card.occasion
      }
    />
  );
}