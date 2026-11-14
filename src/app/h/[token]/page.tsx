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

export const revalidate = 0;

export const metadata: Metadata = {
  title:
    'Er staat een Hadiyad voor je klaar',
  description:
    'Open je persoonlijke digitale HadiyadPay-kaart.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function SharedCardPage({
  params,
}: {
  params: Promise<{
    token: string;
  }>;
}) {
  const { token } =
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
