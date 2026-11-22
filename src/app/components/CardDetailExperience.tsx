'use client';

import {
  useState,
} from 'react';

import Link from 'next/link';

import {
  getOccasionRouteSlug,
  occasionLabels,
  type CardOption,
} from '../../lib/card-types';

import CardArtworkLayer from './CardArtworkLayer';
import CardBuilder from './CardBuilder';
import CardProductCard from './CardProductCard';

import {
  cardOptions,
} from '../data/cardOptions';

import {
  useStorefrontLanguage,
} from './StorefrontShell';

export default function CardDetailExperience({
  card,
}: {
  card: CardOption;
}) {
  const language =
    useStorefrontLanguage();

  const [
    isEditorOpen,
    setIsEditorOpen,
  ] = useState(
    false,
  );

  const relatedCards = cardOptions
    .filter(
      (candidate) =>
        candidate.occasion === card.occasion &&
        candidate.id !== card.id
    )
    .slice(
      0,
      4,
    );

  const labels = {
    so: {
      back:
        'Dhammaan kaararka',

      occasion:
        occasionLabels[
          card.occasion
        ].so,

      personalize:
        'Shakhsiyeey kaarkan',

      related:
        'Waxaa laga yaabaa inaad kuwan sidoo kale jeclaato',

      relatedDescription:
        'Ka eeg naqshado kale oo isla munaasabaddan ah.',

      details:
        'Kaar dijitaal ah',

      artwork:
        'Naqshadda kaarka',

      openHint:
        'Shakhsiyee kaarka oo fariintaada ku qor gudaha.',

      price:
        '€2.00',

      priceNote:
        'Hal mar oo lacag-bixin ah',

      viewOccasion:
        'Eeg dhammaan',
    },

    en: {
      back:
        'All cards',

      occasion:
        occasionLabels[
          card.occasion
        ].en,

      personalize:
        'Personalize this card',

      related:
        'You might also like',

      relatedDescription:
        'Discover more designs for the same occasion.',

      details:
        'Digital greeting card',

      artwork:
        'Card design',

      openHint:
        'Personalize the card and write your own message inside.',

      price:
        '€2.00',

      priceNote:
        'One-time purchase',

      viewOccasion:
        'View all',
    },

    nl: {
      back:
        'Alle kaarten',

      occasion:
        occasionLabels[
          card.occasion
        ].nl,

      personalize:
        'Personaliseer deze kaart',

      related:
        'Misschien vind je deze ook mooi',

      relatedDescription:
        'Bekijk meer ontwerpen voor dezelfde gelegenheid.',

      details:
        'Digitale wenskaart',

      artwork:
        'Kaartontwerp',

      openHint:
        'Personaliseer de kaart en schrijf straks je eigen boodschap aan de binnenkant.',

      price:
        '€2,00',

      priceNote:
        'Eenmalige aankoop',

      viewOccasion:
        'Bekijk alles',
    },
  }[
    language
  ];

  return (
    <>
      <nav
        aria-label={
          language === 'nl'
            ? 'Broodkruimelnavigatie'
            : language === 'so'
              ? 'Hagidda raad-raaca'
              : 'Breadcrumb'
        }
        className="mb-7 text-sm text-[#69746c]"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href={`/?lang=${language}`}
              className="underline-offset-4 hover:underline"
            >
              HadiyadPay
            </Link>
          </li>

          <li aria-hidden="true">
            /
          </li>

          <li>
            <Link
              href={`/kaarten?lang=${language}`}
              className="underline-offset-4 hover:underline"
            >
              {labels.back}
            </Link>
          </li>

          <li aria-hidden="true">
            /
          </li>

          <li>
            <Link
              href={`/kaarten/${getOccasionRouteSlug(
                card.occasion,
              )}?lang=${language}`}
              className="underline-offset-4 hover:underline"
            >
              {labels.occasion}
            </Link>
          </li>

          <li aria-hidden="true">
            /
          </li>

          <li
            aria-current="page"
            className="font-medium text-[#293d35]"
          >
            {
              card.title[
                language
              ]
            }
          </li>
        </ol>
      </nav>

      <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,0.8fr)] lg:gap-16">
        <div className="mx-auto w-full max-w-[34rem]">
          <p className="mb-3 text-center text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#8b7963]">
            {labels.artwork}
          </p>

          <button
            type="button"
            onClick={() =>
              setIsEditorOpen(
                true,
              )
            }
            aria-haspopup="dialog"
            aria-label={
              labels.personalize
            }
            className={`group relative block w-full overflow-hidden rounded-[1.75rem] border border-[#e8e1d7] bg-[#f7f1e8] shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#285347] ${
              card.orientation === 'portrait'
                ? 'aspect-[2/3]'
                : 'aspect-[4/3]'
            }`}
          >
            <CardArtworkLayer
              artwork={
                card.artwork
              }
              language={
                language
              }
              decorative={
                false
              }
              overlay={
                false
              }
              fit="contain"
              backgroundColor="#f7f1e8"
            />

            <span className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/60 bg-white/90 px-4 py-2 text-xs font-bold text-[#285347] opacity-0 shadow-md backdrop-blur-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
              {
                labels.personalize
              }
            </span>
          </button>
        </div>

        <div className="mx-auto w-full max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#f7eddc] px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#71583c]">
              {
                labels.occasion
              }
            </span>

            <span className="rounded-full bg-[#eef4f1] px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#285347]">
              {
                labels.details
              }
            </span>
          </div>

          <h1 className="mt-5 font-serif text-4xl leading-[1.05] text-[#263e36] sm:text-5xl">
            {
              card.title[
                language
              ]
            }
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-8 text-[#59655d]">
            {
              card.description[
                language
              ]
            }
          </p>

          <p className="mt-5 max-w-lg text-sm leading-6 text-[#6f7972]">
            {
              labels.openHint
            }
          </p>

          <div className="mt-7 flex items-end gap-3">
            <span className="text-2xl font-bold text-[#263e36]">
              {
                labels.price
              }
            </span>

            <span className="pb-1 text-xs text-[#7a837d]">
              {
                labels.priceNote
              }
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsEditorOpen(
                true,
              )
            }
            aria-haspopup="dialog"
            className="mt-7 inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#285347] px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#1e4338] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
          >
            {
              labels.personalize
            }

            <span aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </section>

      {relatedCards.length > 0 && (
        <section
          className="mt-20 border-t border-[#e8e4dc] pt-12"
          aria-labelledby="related-cards-heading"
        >
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#987b59]">
                {
                  labels.occasion
                }
              </p>

              <h2
                id="related-cards-heading"
                className="mt-2 font-serif text-3xl leading-tight text-[#263e36] sm:text-4xl"
              >
                {
                  labels.related
                }
              </h2>

              <p className="mt-2 text-sm text-[#6f7972]">
                {
                  labels.relatedDescription
                }
              </p>
            </div>

            <Link
              href={`/kaarten/${getOccasionRouteSlug(
                card.occasion,
              )}?lang=${language}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#285347] underline-offset-4 hover:underline"
            >
              {
                labels.viewOccasion
              }

              <span aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {relatedCards.map(
              (
                relatedCard,
              ) => (
                <div
                  key={
                    relatedCard.id
                  }
                  className="w-[74vw] max-w-[18rem] shrink-0 snap-start sm:w-auto sm:max-w-none"
                >
                  <CardProductCard
                    card={
                      relatedCard
                    }
                    language={
                      language
                    }
                  />
                </div>
              ),
            )}
          </div>
        </section>
      )}

      {isEditorOpen && (
        <CardBuilder
          key={
            card.slug
          }
          card={
            card
          }
          currentLanguage={
            language
          }
          onClose={() =>
            setIsEditorOpen(
              false,
            )
          }
        />
      )}
    </>
  );
}