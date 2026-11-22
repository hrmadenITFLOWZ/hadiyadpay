'use client';

import Link from 'next/link';

import {
  cardOptions,
} from '../data/cardOptions';

import type {
  CardLanguage,
} from '../../lib/card-types';

import CardArtworkLayer from './CardArtworkLayer';

import {
  useStorefrontLanguage,
} from './StorefrontShell';

interface WeddingHennaSpotlightProps {
  showAllCardsButton?: boolean;
}

const copy = {
  nl: {
    eyebrow:
      'WEDDING & HENNA SPOTLIGHT',

    title:
      'Voor ieder bijzonder moment van de trouwreis.',

    description:
      'Van de eerste aankondiging en de henna-avond tot Nikah, het trouwfeest en een persoonlijke felicitatie. Ontdek kaarten voor de volledige reis.',

    saveTheDate:
      'Save the Date',

    invitations:
      'Uitnodigingen',

    henna:
      'Henna',

    nikah:
      'Nikah',

    celebration:
      'Trouwfeest',

    congratulations:
      'Felicitatie',

    explore:
      'Ontdek Wedding & Henna',

    allCards:
      'Bekijk alle kaarten',
  },

  en: {
    eyebrow:
      'WEDDING & HENNA SPOTLIGHT',

    title:
      'For every meaningful moment of the wedding journey.',

    description:
      'From the first announcement and henna night to Nikah, Walima and a personal congratulation. Discover cards for the full journey.',

    saveTheDate:
      'Save the Date',

    invitations:
      'Invitations',

    henna:
      'Henna',

    nikah:
      'Nikah',

    celebration:
      'Walima',

    congratulations:
      'Congratulations',

    explore:
      'Explore Wedding & Henna',

    allCards:
      'View all cards',
  },

  so: {
    eyebrow:
      'AROOS & HENNA',

    title:
      'Waqti kasta oo gaar ah oo ka mid ah safarka arooska.',

    description:
      'Laga bilaabo ogeysiiska iyo habeenka Henna ilaa Nikah, Walima iyo hambalyo gaar ah. Soo hel kaarar la socda safarka oo dhan.',

    saveTheDate:
      'Save the Date',

    invitations:
      'Casuumad',

    henna:
      'Henna',

    nikah:
      'Nikah',

    celebration:
      'Walima',

    congratulations:
      'Hambalyo',

    explore:
      'Eeg Aroos & Henna',

    allCards:
      'Eeg dhammaan kaararka',
  },
} satisfies Record<
  CardLanguage,
  Record<string, string>
>;

function getCardById(
  id: string,
) {
  return cardOptions.find(
    (card) =>
      card.id === id,
  );
}

export default function WeddingHennaSpotlight({
  showAllCardsButton = true,
}: WeddingHennaSpotlightProps) {
  const language =
    useStorefrontLanguage();

  const text =
    copy[language];

  const hennaCard =
    getCardById(
      'henna-celebration',
    ) ??
    getCardById(
      'henna',
    ) ??
    cardOptions[0];

  const weddingCard =
    getCardById(
      'wedding-celebration',
    ) ??
    getCardById(
      'aroos',
    ) ??
    cardOptions[0];

  const aroosCard =
    getCardById(
      'aroos',
    ) ??
    weddingCard;

  const moments = [
    text.saveTheDate,
    text.invitations,
    text.henna,
    text.nikah,
    text.celebration,
    text.congratulations,
  ];

  return (
    <section className="overflow-hidden rounded-[2rem] bg-[#1f4037] text-white">
      <div className="grid gap-10 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-14 lg:py-20">
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#e4c99e]">
            {
              text.eyebrow
            }
          </p>

          <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-[1.08] text-white sm:text-5xl">
            {
              text.title
            }
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            {
              text.description
            }
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {moments.map(
              (
                moment,
              ) => (
                <span
                  key={
                    moment
                  }
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-[#f7efe2]"
                >
                  {
                    moment
                  }
                </span>
              ),
            )}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#card-catalog"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f3e4ca] px-5 py-2.5 text-sm font-bold text-[#29443a] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
            >
              {
                text.explore
              }

              <span
                aria-hidden="true"
              >
                →
              </span>
            </a>

            {showAllCardsButton && (
              <Link
                href={`/kaarten?lang=${language}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
              >
                {
                  text.allCards
                }
              </Link>
            )}
          </div>
        </div>

        <div
          className="relative min-h-[350px] sm:min-h-[390px]"
          aria-hidden="true"
        >
          <div className="absolute left-[5%] top-[14%] z-10 aspect-[0.72] w-[39%] -rotate-[7deg] overflow-hidden rounded-[1.6rem] border border-white/20 bg-[#f3e3cf] shadow-[0_28px_55px_rgba(0,0,0,0.28)]">
            <CardArtworkLayer
              artwork={
                hennaCard.artwork
              }
              language={
                language
              }
              overlay={
                false
              }
            />

            <div className="pointer-events-none absolute inset-0 rounded-[1.6rem] ring-1 ring-inset ring-white/20" />
          </div>

          <div className="absolute right-[4%] top-[5%] z-20 aspect-[0.72] w-[39%] rotate-[7deg] overflow-hidden rounded-[1.6rem] border border-white/20 bg-[#f4e8d3] shadow-[0_28px_55px_rgba(0,0,0,0.28)]">
            <CardArtworkLayer
              artwork={
                aroosCard.artwork
              }
              language={
                language
              }
              overlay={
                false
              }
            />

            <div className="pointer-events-none absolute inset-0 rounded-[1.6rem] ring-1 ring-inset ring-white/20" />
          </div>

          <div className="absolute bottom-[1%] left-1/2 z-30 aspect-[0.72] w-[43%] -translate-x-1/2 overflow-hidden rounded-[1.7rem] border border-white/25 bg-[#fff8ed] shadow-[0_36px_70px_rgba(0,0,0,0.34)]">
            <CardArtworkLayer
              artwork={
                weddingCard.artwork
              }
              language={
                language
              }
              overlay={
                false
              }
            />

            <div className="pointer-events-none absolute inset-0 rounded-[1.7rem] ring-1 ring-inset ring-white/25" />
          </div>

          <div
            aria-hidden="true"
            className="absolute bottom-[-1rem] left-1/2 z-0 h-16 w-[70%] -translate-x-1/2 rounded-full bg-black/20 blur-2xl"
          />
        </div>
      </div>
    </section>
  );
}