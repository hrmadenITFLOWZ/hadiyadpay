import {
  cardOptions,
} from '../data/cardOptions';

import CardArtworkLayer from './CardArtworkLayer';

type Language =
  | 'so'
  | 'en'
  | 'nl';

interface StorefrontHeroProps {
  currentLanguage: Language;
}

const copy = {
  so: {
    eyebrow:
      'KAARAR SALAAN OO SHAQSI AH',

    title:
      'Eray yar. Xusuus weyn.',

    description:
      'Dooro naqshad, qor fariin kuu gaar ah, kadibna la wadaag qof aad jeceshahay.',

    primaryAction:
      'Eeg kaararka',

    secondaryAction:
      'Dooro munaasabad',

    collectionLabel:
      'URURINTA HADIYADPAY',

    collectionTitle:
      'Kaar munaasabad kasta loogu talagalay',

    previewAlt:
      'Xulasho ka mid ah kaararka HadiyadPay',
  },

  en: {
    eyebrow:
      'PERSONAL DIGITAL GREETING CARDS',

    title:
      'A few words. A lasting moment.',

    description:
      'Choose a design, write a personal message, and share it with someone you care about.',

    primaryAction:
      'Explore the cards',

    secondaryAction:
      'Choose an occasion',

    collectionLabel:
      'THE HADIYADPAY COLLECTION',

    collectionTitle:
      'A card for every meaningful moment',

    previewAlt:
      'A selection of HadiyadPay greeting cards',
  },

  nl: {
    eyebrow:
      'PERSOONLIJKE DIGITALE KAARTEN',

    title:
      'Een klein gebaar. Een blijvende herinnering.',

    description:
      'Kies een ontwerp, schrijf een persoonlijke boodschap en deel je kaart.',

    primaryAction:
      'Bekijk de kaarten',

    secondaryAction:
      'Kies een gelegenheid',

    collectionLabel:
      'DE HADIYADPAY COLLECTIE',

    collectionTitle:
      'Een kaart voor ieder bijzonder moment',

    previewAlt:
      'Een selectie uit de HadiyadPay collectie',
  },
} satisfies Record<
  Language,
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

export default function StorefrontHero({
  currentLanguage,
}: StorefrontHeroProps) {
  const text =
    copy[currentLanguage];

  const loveCard =
    getCardById(
      'love-across-distance',
    );

  const weddingCard =
    getCardById(
      'wedding-celebration',
    );

  const heritageCard =
    getCardById(
      'heritage-flower-pot',
    );

  const fallbackCard =
    cardOptions[0];

  const mainCard =
    loveCard ??
    fallbackCard;

  const leftCard =
    weddingCard ??
    fallbackCard;

  const rightCard =
    heritageCard ??
    fallbackCard;

  return (
    <section
      id="hero"
      aria-labelledby="storefront-hero-title"
      className="mx-auto grid w-full max-w-7xl items-center gap-10 overflow-hidden rounded-[2rem] bg-[#eee8dc] px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:px-16 lg:py-16"
    >
      <div className="relative z-10 max-w-2xl">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#527369]">
          {
            text.eyebrow
          }
        </p>

        <h1
          id="storefront-hero-title"
          className="max-w-xl font-serif text-4xl font-medium leading-[1.08] tracking-tight text-[#233c35] sm:text-5xl lg:text-6xl"
        >
          {
            text.title
          }
        </h1>

        <p className="mt-6 max-w-lg text-base leading-7 text-[#59655d] sm:text-lg">
          {
            text.description
          }
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="#card-catalog"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#285347] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#1e4238] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#285347]"
          >
            {
              text.primaryAction
            }
          </a>

          <a
            href="#occasions"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#9aa99e] px-7 text-sm font-semibold text-[#29483e] transition-colors hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#285347]"
          >
            {
              text.secondaryAction
            }
          </a>
        </div>
      </div>

      <div
        role="img"
        aria-label={
          text.previewAlt
        }
        className="relative mx-auto w-full max-w-[34rem]"
      >
        <div className="relative min-h-[30rem] w-full sm:min-h-[34rem]">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d8c8ac]/65 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute left-[2%] top-[19%] z-10 aspect-[0.78] w-[40%] -rotate-[6deg] overflow-hidden rounded-[1.6rem] border border-white/65 bg-[#f8f1e6] shadow-[0_24px_55px_rgba(53,62,54,0.20)] transition duration-500 hover:-translate-x-1 hover:-rotate-[8deg] sm:left-[4%] sm:top-[17%] sm:w-[40%]"
          >
            <CardArtworkLayer
              artwork={
                leftCard.artwork
              }
              language={
                currentLanguage
              }
            />

            <div className="pointer-events-none absolute inset-0 rounded-[1.6rem] ring-1 ring-inset ring-white/30" />
          </div>

          <div
            aria-hidden="true"
            className="absolute right-[1%] top-[9%] z-20 aspect-[0.78] w-[44%] rotate-[7deg] overflow-hidden rounded-[1.6rem] border border-white/65 bg-[#f8f1e6] shadow-[0_24px_55px_rgba(53,62,54,0.20)] transition duration-500 hover:translate-x-1 hover:rotate-[9deg] sm:right-[2%] sm:w-[42%]"
          >
            <CardArtworkLayer
              artwork={
                rightCard.artwork
              }
              language={
                currentLanguage
              }
            />

            <div className="pointer-events-none absolute inset-0 rounded-[1.6rem] ring-1 ring-inset ring-white/30" />
          </div>

          <div className="absolute bottom-[3%] left-1/2 z-30 aspect-[0.78] w-[52%] -translate-x-1/2 overflow-hidden rounded-[1.8rem] border border-white/80 bg-[#fffaf0] shadow-[0_34px_75px_rgba(40,62,54,0.28)] transition duration-500 hover:-translate-y-1 sm:w-[50%]">
            <CardArtworkLayer
              artwork={
                mainCard.artwork
              }
              language={
                currentLanguage
              }
            />

            <div className="pointer-events-none absolute inset-0 rounded-[1.8rem] ring-1 ring-inset ring-white/35" />
          </div>

          <div
            aria-hidden="true"
            className="absolute bottom-[2%] left-1/2 z-0 h-12 w-[62%] -translate-x-1/2 rounded-full bg-[#29483e]/20 blur-2xl"
          />
        </div>

        <div className="relative z-40 mx-auto -mt-1 max-w-sm text-center">
          <span className="mx-auto block h-px w-10 bg-[#b48a54]" />

          <p className="mt-4 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#8b704e]">
            {
              text.collectionLabel
            }
          </p>

          <p className="mt-2 font-serif text-lg leading-snug text-[#29483e] sm:text-xl">
            {
              text.collectionTitle
            }
          </p>
        </div>
      </div>
    </section>
  );
}