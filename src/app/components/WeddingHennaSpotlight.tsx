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

type SpotlightVariant =
  | 'full'
  | 'compact';

interface WeddingHennaSpotlightProps {
  showAllCardsButton?: boolean;
  variant?: SpotlightVariant;
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
  variant = 'full',
}: WeddingHennaSpotlightProps) {
  const language =
    useStorefrontLanguage();

  const text =
    copy[language];

  const isCompact =
    variant ===
    'compact';

  const hennaCard =
    getCardById(
      'henna-celebration',
    ) ??
    getCardById(
      'henna-bridal-moment',
    ) ??
    cardOptions[0];

  const weddingCard =
    getCardById(
      'wedding-celebration',
    ) ??
    getCardById(
      'wedding-elegance-03',
    ) ??
    cardOptions[0];

  const aroosCard =
    getCardById(
      'wedding-elegance-03',
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

  const containerClass =
    isCompact
      ? 'grid gap-6 px-6 py-7 sm:px-8 sm:py-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-8 lg:px-10 lg:py-9'
      : 'grid gap-10 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-14 lg:py-20';

  const titleClass =
    isCompact
      ? 'mt-3 max-w-2xl font-serif text-3xl leading-[1.08] text-white sm:text-4xl'
      : 'mt-4 max-w-2xl font-serif text-4xl leading-[1.08] text-white sm:text-5xl';

  const descriptionClass =
    isCompact
      ? 'mt-3 max-w-2xl text-sm leading-6 text-white/70'
      : 'mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base';

  const momentsClass =
    isCompact
      ? 'mt-5 flex flex-wrap gap-2'
      : 'mt-7 flex flex-wrap gap-2';

  const actionsClass =
    isCompact
      ? 'mt-6 flex flex-wrap gap-3'
      : 'mt-9 flex flex-wrap gap-3';

  const artworkStageClass =
    isCompact
      ? 'relative min-h-[230px] sm:min-h-[255px]'
      : 'relative min-h-[350px] sm:min-h-[390px]';

  return (
    <section className="overflow-hidden rounded-[2rem] bg-[#1f4037] text-white">
      <div
        className={
          containerClass
        }
      >
        <div>
          <p className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-[#e4c99e]">
            {
              text.eyebrow
            }
          </p>

          <h2
            className={
              titleClass
            }
          >
            {
              text.title
            }
          </h2>

          <p
            className={
              descriptionClass
            }
          >
            {
              text.description
            }
          </p>

          <div
            className={
              momentsClass
            }
          >
            {moments.map(
              (
                moment,
              ) => (
                <span
                  key={
                    moment
                  }
                  className={`rounded-full border border-white/15 bg-white/10 font-semibold text-[#f7efe2] ${
                    isCompact
                      ? 'px-3 py-1.5 text-[0.68rem]'
                      : 'px-4 py-2 text-xs'
                  }`}
                >
                  {
                    moment
                  }
                </span>
              ),
            )}
          </div>

          <div
            className={
              actionsClass
            }
          >
            <a
              href="#card-catalog"
              className={`inline-flex items-center gap-2 rounded-full bg-[#f3e4ca] font-bold text-[#29443a] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white ${
                isCompact
                  ? 'min-h-10 px-4 py-2 text-xs'
                  : 'min-h-11 px-5 py-2.5 text-sm'
              }`}
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
                className={`inline-flex items-center gap-2 rounded-full border border-white/30 font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white ${
                  isCompact
                    ? 'min-h-10 px-4 py-2 text-xs'
                    : 'min-h-11 px-5 py-2.5 text-sm'
                }`}
              >
                {
                  text.allCards
                }
              </Link>
            )}
          </div>
        </div>

        <div
          className={
            artworkStageClass
          }
          aria-hidden="true"
        >
          <div
            className={`absolute z-10 aspect-[0.72] -rotate-[7deg] overflow-hidden border border-white/20 bg-[#f3e3cf] shadow-[0_28px_55px_rgba(0,0,0,0.28)] ${
              isCompact
                ? 'left-[9%] top-[16%] w-[34%] rounded-[1.25rem]'
                : 'left-[5%] top-[14%] w-[39%] rounded-[1.6rem]'
            }`}
          >
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

            <div
              className={`pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/20 ${
                isCompact
                  ? 'rounded-[1.25rem]'
                  : 'rounded-[1.6rem]'
              }`}
            />
          </div>

          <div
            className={`absolute z-20 aspect-[0.72] rotate-[7deg] overflow-hidden border border-white/20 bg-[#f4e8d3] shadow-[0_28px_55px_rgba(0,0,0,0.28)] ${
              isCompact
                ? 'right-[8%] top-[5%] w-[34%] rounded-[1.25rem]'
                : 'right-[4%] top-[5%] w-[39%] rounded-[1.6rem]'
            }`}
          >
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

            <div
              className={`pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/20 ${
                isCompact
                  ? 'rounded-[1.25rem]'
                  : 'rounded-[1.6rem]'
              }`}
            />
          </div>

          <div
            className={`absolute bottom-[1%] left-1/2 z-30 aspect-[0.72] -translate-x-1/2 overflow-hidden border border-white/25 bg-[#fff8ed] shadow-[0_36px_70px_rgba(0,0,0,0.34)] ${
              isCompact
                ? 'w-[37%] rounded-[1.3rem]'
                : 'w-[43%] rounded-[1.7rem]'
            }`}
          >
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

            <div
              className={`pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/25 ${
                isCompact
                  ? 'rounded-[1.3rem]'
                  : 'rounded-[1.7rem]'
              }`}
            />
          </div>

          <div
            aria-hidden="true"
            className={`absolute left-1/2 z-0 -translate-x-1/2 rounded-full bg-black/20 blur-2xl ${
              isCompact
                ? 'bottom-[-0.5rem] h-10 w-[60%]'
                : 'bottom-[-1rem] h-16 w-[70%]'
            }`}
          />
        </div>
      </div>
    </section>
  );
}