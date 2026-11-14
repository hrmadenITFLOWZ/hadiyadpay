'use client';

import Link from 'next/link';

import { cardOptions } from '../data/cardOptions';
import type { CardLanguage, CardOption } from '../../lib/card-types';

import CardArtworkLayer from './CardArtworkLayer';
import { useStorefrontLanguage } from './StorefrontShell';

type ShowcaseCopy = {
  eyebrow: string;
  title: string;
  description: string;
  viewAll: string;
  viewCard: string;
};

const copy: Record<CardLanguage, ShowcaseCopy> = {
  nl: {
    eyebrow: 'DE COLLECTIE',
    title: 'Voor elk bijzonder moment een kaart.',
    description:
      'Ontdek kaarten voor bruiloften, verjaardagen, Eid en de momenten die je met iemand wilt delen.',
    viewAll: 'Bekijk alle kaarten',
    viewCard: 'Bekijk kaart',
  },
  en: {
    eyebrow: 'THE COLLECTION',
    title: 'A card for every meaningful moment.',
    description:
      'Discover cards for weddings, birthdays, Eid and the moments you want to share with someone.',
    viewAll: 'View all cards',
    viewCard: 'View card',
  },
  so: {
    eyebrow: 'URURINTA',
    title: 'Kaar loogu talagalay daqiiqad kasta oo gaar ah.',
    description:
      'Soo hel kaarar aroos, dhalasho, Ciid iyo waqtiyada aad rabto inaad qof la wadaagto.',
    viewAll: 'Eeg dhammaan kaararka',
    viewCard: 'Eeg kaarka',
  },
};

function getShowcaseCards(): CardOption[] {
  const priority: CardOption['occasion'][] = [
    'wedding',
    'henna',
    'birthday',
    'eid',
    'heritage',
    'graduation',
    'blessings',
    'encouragement',
  ];

  const prioritizedCards: CardOption[] = [];

  for (const occasion of priority) {
    const card = cardOptions.find(
      (candidate) => candidate.occasion === occasion,
    );

    if (card) {
      prioritizedCards.push(card);
    }
  }

  const remainingCards = cardOptions.filter(
    (card) =>
      !prioritizedCards.some(
        (prioritizedCard) => prioritizedCard.id === card.id,
      ),
  );

  return [...prioritizedCards, ...remainingCards];
}

type ShowcaseCardProps = {
  card: CardOption;
  language: CardLanguage;
  index: number;
};

function getStaggerClass(index: number): string {
  const position = index % 4;

  if (position === 0) {
    return 'md:translate-y-10';
  }

  if (position === 1) {
    return 'md:-translate-y-2';
  }

  if (position === 2) {
    return 'md:translate-y-16';
  }

  return 'md:translate-y-5';
}

function ShowcaseCard({
  card,
  language,
  index,
}: ShowcaseCardProps) {
  const title = card.title[language];
  const staggerClass = getStaggerClass(index);

  const aspectClass =
    card.orientation === 'portrait'
      ? 'aspect-[0.72/1]'
      : 'aspect-[0.86/1]';

  return (
    <article
      className={`w-[190px] shrink-0 sm:w-[220px] md:w-[250px] lg:w-[270px] ${staggerClass}`}
    >
      <Link
        href={`/kaart/${card.slug}?lang=${language}`}
        aria-label={`${copy[language].viewCard}: ${title}`}
        className="group/card block rounded-[1.5rem] focus-visible:outline-none"
      >
        <div
          className={`relative overflow-hidden rounded-[1.5rem] bg-[#e9e4d9] shadow-[0_18px_50px_rgba(38,62,54,0.09)] transition duration-500 ease-out group-hover/card:-translate-y-2 group-hover/card:shadow-[0_24px_70px_rgba(38,62,54,0.16)] group-focus-visible/card:outline group-focus-visible/card:outline-2 group-focus-visible/card:outline-offset-4 group-focus-visible/card:outline-[#285347] ${aspectClass}`}
        >
          <CardArtworkLayer
            artwork={card.artwork}
            language={language}
            overlay={false}
          />

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/35 via-black/10 to-transparent opacity-70 transition-opacity duration-300 group-hover/card:opacity-40"
          />

          <div className="absolute left-4 top-4">
            <span className="inline-flex rounded-full border border-white/30 bg-black/30 px-3 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
              {card.badge[language]}
            </span>
          </div>

          <div className="absolute inset-x-4 bottom-4 translate-y-2 opacity-0 transition duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus-visible/card:translate-y-0 group-focus-visible/card:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fffdf7]/95 px-3.5 py-2 text-xs font-semibold text-[#29443a] shadow-sm backdrop-blur">
              {copy[language].viewCard}
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>

        <div className="px-1 pt-4 text-center">
          <h3 className="font-serif text-lg leading-tight text-[#293d35]">
            {title}
          </h3>

          <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#8b8179]">
            HadiyadPay
          </p>
        </div>
      </Link>
    </article>
  );
}

export default function AnimatedCardShowcase() {
  const language = useStorefrontLanguage();
  const cards = getShowcaseCards();

  if (cards.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="animated-collection-heading"
      className="overflow-hidden border-y border-[#d8d4ca] bg-[#fffdf8] py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto mb-10 flex w-full max-w-7xl flex-col gap-6 px-5 sm:px-8 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.26em] text-[#7f6b62]">
            {copy[language].eyebrow}
          </p>

          <h2
            id="animated-collection-heading"
            className="mt-4 max-w-4xl font-serif text-4xl leading-[1.05] tracking-[-0.025em] text-[#263e36] sm:text-5xl lg:text-6xl"
          >
            {copy[language].title}
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#66736d] sm:text-base">
            {copy[language].description}
          </p>
        </div>

        <Link
          href={`/kaarten?lang=${language}`}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full border border-[#bfc9c2] bg-[#fffdf8] px-5 py-2.5 text-sm font-semibold text-[#29443a] transition hover:border-[#285347] hover:bg-[#285347] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347] lg:self-auto"
        >
          {copy[language].viewAll}
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="hadiyad-showcase-mask">
        <div className="hadiyad-showcase-track py-5 md:py-16">
          <div className="flex shrink-0 items-start gap-5 pr-5 sm:gap-7 sm:pr-7 lg:gap-9 lg:pr-9">
            {cards.map((card, index) => (
              <ShowcaseCard
                key={`primary-${card.id}`}
                card={card}
                language={language}
                index={index}
              />
            ))}
          </div>

          <div
            aria-hidden="true"
            className="flex shrink-0 items-start gap-5 pr-5 sm:gap-7 sm:pr-7 lg:gap-9 lg:pr-9"
          >
            {cards.map((card, index) => (
              <ShowcaseCard
                key={`duplicate-${card.id}`}
                card={card}
                language={language}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-9 flex w-full max-w-7xl justify-center px-5 sm:px-8 md:mt-2">
        <p className="text-center text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#968c83]">
          Birthday · Wedding · Henna · Eid · Heritage · Milestones
        </p>
      </div>
    </section>
  );
}