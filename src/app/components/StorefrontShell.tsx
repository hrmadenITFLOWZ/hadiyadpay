'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';

import type {
  CardLanguage,
  CardOption,
} from '../../lib/card-types';

import {
  getOccasionRouteSlug,
  occasionLabels,
} from '../../lib/card-types';

import {
  cardOptions,
} from '../data/cardOptions';

import CardArtworkLayer from './CardArtworkLayer';
import ReceivedCardModal from './ReceivedCardModal';

const StorefrontLanguageContext =
  createContext<CardLanguage>('so');

const languageNames: Record<CardLanguage, string> = {
  so: 'Somali',
  en: 'English',
  nl: 'Nederlands',
};

const copy = {
  so: {
    skip: 'U gudub nuxurka',
    nav: 'Hagidda bogga',
    search: 'Raadi kaar, munaasabad ama fariin...',
    searchButton: 'Raadi',
    close: 'Xir',
    menu: 'Liiska',
    closeMenu: 'Xir liiska',
    searchDialog: 'Raadi kaar',
    popular: 'CAANKA AH',
    moments: 'MUNAASABADAHA',
    recipients: 'QOFKEE LOO DIRAYAA?',
    results: 'NATIIJOOYINKA',
    noResults: 'Wax kaar ah lama helin.',
    noResultsDescription:
      'Isku day eray kale sida aroos, jacayl, Eid ama qoys.',
    cards: 'Kaararka',
    weddingHenna: 'Aroos & Henna',
    love: 'Jacayl',
    justBecause: 'Sabab la’aan',
    heritage: 'Hiddaha',
    eid: 'Ciid',
    graduation: 'Qalinjabin',
    encouragement: 'Dhiirigelin',
    blessings: 'Barako',
    henna: 'Henna',
    nikah: 'Nikah',
    weddingParty: 'Xafladda arooska',
    congratulations: 'Hambalyo',
    partner: 'Lammaane',
    family: 'Qoys',
    friend: 'Saaxiib',
    colleague: 'Shaqaale',
    allCards: 'Eeg dhammaan kaararka',
    viewCard: 'Eeg kaarka',
    more: 'Wax kale',
    language: 'Dooro luqadda',
    top: 'Bilowga bogga',
    footer: 'Kaararka salaanta dijitaalka ah',
  },

  en: {
    skip: 'Skip to content',
    nav: 'Main navigation',
    search: 'Search for a card, moment or message...',
    searchButton: 'Search',
    close: 'Close',
    menu: 'Menu',
    closeMenu: 'Close menu',
    searchDialog: 'Search for a card',
    popular: 'POPULAR',
    moments: 'MOMENTS',
    recipients: 'WHO IS IT FOR?',
    results: 'RESULTS',
    noResults: 'No matching cards found.',
    noResultsDescription:
      'Try another term such as wedding, love, Eid or family.',
    cards: 'Cards',
    weddingHenna: 'Wedding & Henna',
    love: 'Love',
    justBecause: 'Just Because',
    heritage: 'Heritage',
    eid: 'Eid',
    graduation: 'Graduation',
    encouragement: 'Encouragement',
    blessings: 'Blessings',
    henna: 'Henna',
    nikah: 'Nikah',
    weddingParty: 'Wedding celebration',
    congratulations: 'Congratulations',
    partner: 'Partner',
    family: 'Family',
    friend: 'Friend',
    colleague: 'Colleague',
    allCards: 'View all cards',
    viewCard: 'View card',
    more: 'More',
    language: 'Choose a language',
    top: 'Back to top',
    footer: 'Digital greeting cards',
  },

  nl: {
    skip: 'Ga naar de inhoud',
    nav: 'Hoofdnavigatie',
    search: 'Zoek een kaart, moment of boodschap...',
    searchButton: 'Zoeken',
    close: 'Sluiten',
    menu: 'Menu',
    closeMenu: 'Menu sluiten',
    searchDialog: 'Zoek een kaart',
    popular: 'POPULAIR',
    moments: 'MOMENTEN',
    recipients: 'VOOR WIE?',
    results: 'RESULTATEN',
    noResults: 'Geen passende kaarten gevonden.',
    noResultsDescription:
      'Probeer een ander woord zoals huwelijk, liefde, Eid of familie.',
    cards: 'Kaarten',
    weddingHenna: 'Wedding & Henna',
    love: 'Liefde',
    justBecause: 'Zomaar',
    heritage: 'Erfgoed',
    eid: 'Eid',
    graduation: 'Afstuderen',
    encouragement: 'Aanmoediging',
    blessings: 'Zegeningen',
    henna: 'Henna',
    nikah: 'Nikah',
    weddingParty: 'Trouwfeest',
    congratulations: 'Felicitatie',
    partner: 'Partner',
    family: 'Familie',
    friend: 'Vriend(in)',
    colleague: 'Collega',
    allCards: 'Bekijk alle kaarten',
    viewCard: 'Bekijk kaart',
    more: 'Meer',
    language: 'Kies een taal',
    top: 'Naar boven',
    footer: 'Digitale kaarten voor bijzondere momenten',
  },
} satisfies Record<
  CardLanguage,
  Record<string, string>
>;

function isLanguage(
  value: string | null,
): value is CardLanguage {
  return (
    value === 'so' ||
    value === 'en' ||
    value === 'nl'
  );
}

function normalizeSearchValue(
  value: string,
): string {
  return value
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      '',
    )
    .trim();
}

function getCardSearchText(
  card: CardOption,
  language: CardLanguage,
): string {
  return normalizeSearchValue(
    [
      card.id,
      card.slug,
      card.title[language],
      card.description[language],
      card.badge[language],
      card.occasion,
      occasionLabels[
        card.occasion
      ][language],
      ...card.searchTerms,
      ...card.recipientTypes,
      ...card.styles,
      ...card.colors,
    ].join(' '),
  );
}

export function useStorefrontLanguage(): CardLanguage {
  return useContext(
    StorefrontLanguageContext,
  );
}

interface StorefrontShellProps {
  children: ReactNode;
}

export default function StorefrontShell({
  children,
}: StorefrontShellProps) {
  const router =
    useRouter();

  const pathname =
    usePathname();

  const searchParams =
    useSearchParams();

  const searchInputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const [
    isSearchOpen,
    setIsSearchOpen,
  ] =
    useState(false);

  const [
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  ] =
    useState(false);

  const [
    isMoreOpen,
    setIsMoreOpen,
  ] =
    useState(false);

  const [
    query,
    setQuery,
  ] =
    useState('');

  const requestedLanguage =
    searchParams.get(
      'lang',
    );

  const language =
    isLanguage(
      requestedLanguage,
    )
      ? requestedLanguage
      : 'so';

  const text =
    copy[language];

  const languageQuery =
    `?lang=${language}`;

  useEffect(
    () => {
      document.documentElement.lang =
        language;
    },
    [language],
  );

  useEffect(
    () => {
      if (
        !isSearchOpen &&
        !isMobileMenuOpen
      ) {
        return;
      }

      const previousOverflow =
        document.body.style.overflow;

      document.body.style.overflow =
        'hidden';

      return () => {
        document.body.style.overflow =
          previousOverflow;
      };
    },
    [
      isSearchOpen,
      isMobileMenuOpen,
    ],
  );

  useEffect(
    () => {
      if (!isSearchOpen) {
        return;
      }

      const timeout =
        window.setTimeout(
          () => {
            searchInputRef.current?.focus();
          },
          50,
        );

      return () => {
        window.clearTimeout(
          timeout,
        );
      };
    },
    [isSearchOpen],
  );

  useEffect(
    () => {
      const handleKeyDown = (
        event: KeyboardEvent,
      ) => {
        if (
          event.key !==
          'Escape'
        ) {
          return;
        }

        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
        setIsMoreOpen(false);
      };

      window.addEventListener(
        'keydown',
        handleKeyDown,
      );

      return () => {
        window.removeEventListener(
          'keydown',
          handleKeyDown,
        );
      };
    },
    [],
  );

  const searchResults =
    useMemo(
      () => {
        const normalizedQuery =
          normalizeSearchValue(
            query,
          );

        if (
          normalizedQuery.length ===
          0
        ) {
          return [];
        }

        const queryWords =
          normalizedQuery
            .split(/\s+/)
            .filter(Boolean);

        return cardOptions
          .filter(
            (card) => {
              const searchText =
                getCardSearchText(
                  card,
                  language,
                );

              return queryWords.every(
                (word) =>
                  searchText.includes(
                    word,
                  ),
              );
            },
          )
          .slice(
            0,
            6,
          );
      },
      [
        query,
        language,
      ],
    );

  const changeLanguage = (
    nextLanguage: CardLanguage,
  ) => {
    const params =
      new URLSearchParams(
        searchParams.toString(),
      );

    params.set(
      'lang',
      nextLanguage,
    );

    const nextQuery =
      params.toString();

    router.replace(
      `${pathname}${
        nextQuery
          ? `?${nextQuery}`
          : ''
      }${
        window.location.hash
      }`,
      {
        scroll: false,
      },
    );
  };

  const openSearch = (
    initialQuery = '',
  ) => {
    setQuery(
      initialQuery,
    );

    setIsMobileMenuOpen(
      false,
    );

    setIsMoreOpen(
      false,
    );

    setIsSearchOpen(
      true,
    );
  };

  const closeSearch = () => {
    setIsSearchOpen(
      false,
    );

    setQuery('');
  };

  const closeMenus = () => {
    setIsMobileMenuOpen(
      false,
    );

    setIsMoreOpen(
      false,
    );
  };

  const mainLinks = [
    {
      label:
        text.cards,

      href:
        `/kaarten${languageQuery}`,
    },

    {
      label:
        text.weddingHenna,

      href:
        `/kaarten/${getOccasionRouteSlug(
          'wedding',
        )}${languageQuery}`,
    },

    {
      label:
        text.love,

      href:
        `/kaarten/${getOccasionRouteSlug(
          'love',
        )}${languageQuery}`,
    },

    {
      label:
        text.justBecause,

      href:
        `/kaarten/${getOccasionRouteSlug(
          'just-because',
        )}${languageQuery}`,
    },

    {
      label:
        text.heritage,

      href:
        `/kaarten/${getOccasionRouteSlug(
          'heritage',
        )}${languageQuery}`,
    },
  ];

  const moreLinks = [
    {
      label:
        text.eid,

      href:
        `/kaarten/${getOccasionRouteSlug(
          'eid',
        )}${languageQuery}`,
    },

    {
      label:
        text.graduation,

      href:
        `/kaarten/${getOccasionRouteSlug(
          'graduation',
        )}${languageQuery}`,
    },

    {
      label:
        text.encouragement,

      href:
        `/kaarten/${getOccasionRouteSlug(
          'encouragement',
        )}${languageQuery}`,
    },

    {
      label:
        text.blessings,

      href:
        `/kaarten/${getOccasionRouteSlug(
          'blessings',
        )}${languageQuery}`,
    },
  ];

  const popularActions = [
    {
      label:
        text.weddingHenna,

      href:
        `/kaarten/${getOccasionRouteSlug(
          'wedding',
        )}${languageQuery}`,
    },

    {
      label:
        text.love,

      href:
        `/kaarten/${getOccasionRouteSlug(
          'love',
        )}${languageQuery}`,
    },

    {
      label:
        text.justBecause,

      href:
        `/kaarten/${getOccasionRouteSlug(
          'just-because',
        )}${languageQuery}`,
    },

    {
      label:
        text.heritage,

      href:
        `/kaarten/${getOccasionRouteSlug(
          'heritage',
        )}${languageQuery}`,
    },
  ];

  const momentActions = [
    text.henna,
    text.nikah,
    text.weddingParty,
    text.congratulations,
    text.eid,
    text.graduation,
  ];

  const recipientActions = [
    text.partner,
    text.family,
    text.friend,
    text.colleague,
  ];

  return (
    <StorefrontLanguageContext.Provider
      value={language}
    >
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-md bg-white px-4 py-3 text-[#243d34] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {text.skip}
      </a>

      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b border-[#e8e4dc] bg-[#fbfaf7]/95 shadow-[0_1px_10px_rgba(35,60,53,0.04)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:gap-6 lg:px-8">
            <button
              type="button"
              aria-label={
                isMobileMenuOpen
                  ? text.closeMenu
                  : text.menu
              }
              aria-expanded={
                isMobileMenuOpen
              }
              onClick={() => {
                setIsMobileMenuOpen(
                  (current) =>
                    !current,
                );

                setIsSearchOpen(
                  false,
                );
              }}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e3ded4] bg-white text-[#285347] transition hover:bg-[#f1eee8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347] lg:hidden"
            >
              {isMobileMenuOpen ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>

            <Link
              href={`/?lang=${language}`}
              onClick={
                closeMenus
              }
              className="flex shrink-0 items-center gap-2 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#285347]"
            >
              <Image
                src="/images/logo.jpg"
                alt=""
                aria-hidden="true"
                width={44}
                height={44}
                className="h-10 w-10 rounded-xl border border-[#d6c6a9] bg-white object-cover sm:h-11 sm:w-11"
              />

              <span className="hidden text-xl font-bold tracking-tight text-[#233c35] sm:inline">
                Hadiyad
                <span className="text-[#9b7450]">
                  Pay
                </span>
              </span>
            </Link>

            <button
              type="button"
              onClick={() =>
                openSearch()
              }
              className="group hidden min-h-12 min-w-0 flex-1 items-center gap-3 rounded-full border border-[#9dae9f] bg-white px-5 text-left text-sm text-[#707a73] shadow-sm transition hover:border-[#285347] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347] md:flex"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 shrink-0 text-[#285347]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />

                <path d="m20 20-3.5-3.5" />
              </svg>

              <span className="truncate">
                {text.search}
              </span>
            </button>

            <div
              role="group"
              aria-label={
                text.language
              }
              className="ml-auto hidden rounded-full border border-[#e3ded4] bg-white p-1 text-xs font-semibold shadow-sm sm:flex"
            >
              {(
                [
                  'so',
                  'en',
                  'nl',
                ] as const
              ).map(
                (nextLanguage) => (
                  <button
                    key={
                      nextLanguage
                    }
                    type="button"
                    aria-label={
                      languageNames[
                        nextLanguage
                      ]
                    }
                    aria-pressed={
                      language ===
                      nextLanguage
                    }
                    onClick={() =>
                      changeLanguage(
                        nextLanguage,
                      )
                    }
                    className={`min-h-9 min-w-10 rounded-full px-3 uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#285347] ${
                      language ===
                      nextLanguage
                        ? 'bg-[#285347] text-white'
                        : 'text-[#59655d] hover:bg-[#f1eee8]'
                    }`}
                  >
                    {
                      nextLanguage
                    }
                  </button>
                ),
              )}
            </div>

            <button
              type="button"
              aria-label={
                text.searchButton
              }
              onClick={() =>
                openSearch()
              }
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e3ded4] bg-white text-[#285347] transition hover:bg-[#f1eee8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347] md:hidden"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />

                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
          </div>

          <nav
            aria-label={
              text.nav
            }
            className="hidden border-t border-[#eeeae3] bg-white/70 lg:block"
          >
            <div className="mx-auto flex max-w-7xl items-center gap-8 px-8">
              {mainLinks.map(
                (item) => (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    className="border-b-2 border-transparent py-3 text-sm font-semibold text-[#4f5f57] transition hover:border-[#b88d57] hover:text-[#285347] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                  >
                    {
                      item.label
                    }
                  </Link>
                ),
              )}

              <div className="relative">
                <button
                  type="button"
                  aria-expanded={
                    isMoreOpen
                  }
                  onClick={() =>
                    setIsMoreOpen(
                      (current) =>
                        !current,
                    )
                  }
                  className="inline-flex items-center gap-1.5 border-b-2 border-transparent py-3 text-sm font-semibold text-[#4f5f57] transition hover:border-[#b88d57] hover:text-[#285347] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                >
                  {text.more}

                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className={`h-4 w-4 transition-transform ${
                      isMoreOpen
                        ? 'rotate-180'
                        : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="m5 7.5 5 5 5-5" />
                  </svg>
                </button>

                {isMoreOpen && (
                  <div className="absolute right-0 top-full w-64 rounded-2xl border border-[#e5dfd5] bg-white p-2 shadow-[0_20px_55px_rgba(35,60,53,0.16)]">
                    {moreLinks.map(
                      (item) => (
                        <Link
                          key={
                            item.href
                          }
                          href={
                            item.href
                          }
                          onClick={
                            closeMenus
                          }
                          className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#4f5f57] transition hover:bg-[#f4f0e9] hover:text-[#285347]"
                        >
                          {
                            item.label
                          }
                        </Link>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          </nav>
        </header>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <button
              type="button"
              aria-label={
                text.closeMenu
              }
              onClick={() =>
                setIsMobileMenuOpen(
                  false,
                )
              }
              className="absolute inset-0 bg-[#203b33]/40 backdrop-blur-sm"
            />

            <aside className="absolute left-0 top-0 h-full w-[min(88vw,24rem)] overflow-y-auto bg-[#fbfaf7] px-5 pb-8 pt-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <Link
                  href={`/?lang=${language}`}
                  onClick={
                    closeMenus
                  }
                  className="flex items-center gap-2"
                >
                  <Image
                    src="/images/logo.jpg"
                    alt=""
                    aria-hidden="true"
                    width={42}
                    height={42}
                    className="h-10 w-10 rounded-xl border border-[#d6c6a9] object-cover"
                  />

                  <span className="text-xl font-bold text-[#233c35]">
                    Hadiyad
                    <span className="text-[#9b7450]">
                      Pay
                    </span>
                  </span>
                </Link>

                <button
                  type="button"
                  aria-label={
                    text.closeMenu
                  }
                  onClick={() =>
                    setIsMobileMenuOpen(
                      false,
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e2ddd3] bg-white text-[#285347]"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  openSearch()
                }
                className="mt-7 flex min-h-12 w-full items-center gap-3 rounded-full border border-[#9dae9f] bg-white px-4 text-left text-sm text-[#707a73]"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-[#285347]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                  />

                  <path d="m20 20-3.5-3.5" />
                </svg>

                <span className="truncate">
                  {text.search}
                </span>
              </button>

              <div className="mt-7 space-y-1">
                {[
                  ...mainLinks,
                  ...moreLinks,
                ].map(
                  (item) => (
                    <Link
                      key={
                        item.href
                      }
                      href={
                        item.href
                      }
                      onClick={
                        closeMenus
                      }
                      className="flex items-center justify-between rounded-xl px-3 py-3.5 text-base font-semibold text-[#30483f] transition hover:bg-[#f0ece4]"
                    >
                      {
                        item.label
                      }

                      <span
                        aria-hidden="true"
                        className="text-[#a07c53]"
                      >
                        →
                      </span>
                    </Link>
                  ),
                )}
              </div>

              <div className="mt-8 border-t border-[#e6e1d8] pt-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#8a7257]">
                  {text.language}
                </p>

                <div className="flex rounded-full border border-[#e3ded4] bg-white p-1 text-xs font-semibold">
                  {(
                    [
                      'so',
                      'en',
                      'nl',
                    ] as const
                  ).map(
                    (nextLanguage) => (
                      <button
                        key={
                          nextLanguage
                        }
                        type="button"
                        aria-label={
                          languageNames[
                            nextLanguage
                          ]
                        }
                        aria-pressed={
                          language ===
                          nextLanguage
                        }
                        onClick={() =>
                          changeLanguage(
                            nextLanguage,
                          )
                        }
                        className={`min-h-10 flex-1 rounded-full px-3 uppercase ${
                          language ===
                          nextLanguage
                            ? 'bg-[#285347] text-white'
                            : 'text-[#59655d]'
                        }`}
                      >
                        {
                          nextLanguage
                        }
                      </button>
                    ),
                  )}
                </div>
              </div>
            </aside>
          </div>
        )}

        {isSearchOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={
              text.searchDialog
            }
            className="fixed inset-0 z-[80] overflow-y-auto bg-[#203b33]/55 px-3 py-4 backdrop-blur-sm sm:px-6 sm:py-8"
          >
            <button
              type="button"
              aria-label={
                text.close
              }
              onClick={
                closeSearch
              }
              className="fixed inset-0"
            />

            <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/60 bg-[#fffdf9] shadow-[0_30px_90px_rgba(20,45,37,0.35)]">
              <div className="flex items-center gap-3 border-b border-[#e8e2d8] p-4 sm:p-6">
                <div className="flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-full border-2 border-[#285347] bg-white px-5 shadow-sm">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 shrink-0 text-[#285347]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                    />

                    <path d="m20 20-3.5-3.5" />
                  </svg>

                  <input
                    ref={
                      searchInputRef
                    }
                    type="search"
                    value={
                      query
                    }
                    onChange={(event) =>
                      setQuery(
                        event.target.value,
                      )
                    }
                    placeholder={
                      text.search
                    }
                    className="min-w-0 flex-1 bg-transparent text-base text-[#263f37] outline-none placeholder:text-[#808b84] sm:text-lg"
                  />

                  {query && (
                    <button
                      type="button"
                      aria-label={
                        text.close
                      }
                      onClick={() =>
                        setQuery('')
                      }
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f0ece5] text-[#59655d]"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  aria-label={
                    text.close
                  }
                  onClick={
                    closeSearch
                  }
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#e2ddd3] bg-white text-[#285347] transition hover:bg-[#f2eee7]"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <div className="max-h-[calc(100vh-8rem)] overflow-y-auto p-5 sm:p-8">
                {query.trim() ? (
                  <section>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b704e]">
                      {text.results}
                    </p>

                    {searchResults.length > 0 ? (
                      <>
                        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                          {searchResults.map(
                            (card) => (
                              <Link
                                key={
                                  card.id
                                }
                                href={`/kaart/${card.slug}?lang=${language}`}
                                onClick={
                                  closeSearch
                                }
                                className="group min-w-0"
                              >
                                <div
                                  className={`relative overflow-hidden rounded-2xl border border-[#e5dfd5] bg-[#f5efe5] shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-lg ${
                                    card.orientation ===
                                    'portrait'
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
                                    backgroundColor="#f5efe5"
                                  />
                                </div>

                                <p className="mt-3 line-clamp-2 font-serif text-sm leading-snug text-[#29483e]">
                                  {
                                    card.title[
                                      language
                                    ]
                                  }
                                </p>

                                <span className="mt-1 inline-flex text-xs font-bold text-[#527369]">
                                  {text.viewCard} →
                                </span>
                              </Link>
                            ),
                          )}
                        </div>

                        <Link
                          href={`/kaarten?lang=${language}&q=${encodeURIComponent(
                            query,
                          )}`}
                          onClick={
                            closeSearch
                          }
                          className="mt-8 inline-flex min-h-11 items-center rounded-full bg-[#285347] px-6 text-sm font-bold text-white transition hover:bg-[#1f443a]"
                        >
                          {text.allCards} →
                        </Link>
                      </>
                    ) : (
                      <div className="mt-5 rounded-2xl border border-[#e6e0d6] bg-[#f7f2ea] p-6">
                        <p className="font-serif text-xl text-[#29483e]">
                          {
                            text.noResults
                          }
                        </p>

                        <p className="mt-2 text-sm leading-6 text-[#6d776f]">
                          {
                            text.noResultsDescription
                          }
                        </p>
                      </div>
                    )}
                  </section>
                ) : (
                  <div className="space-y-8">
                    <section>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b704e]">
                        {text.popular}
                      </p>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {popularActions.map(
                          (item) => (
                            <Link
                              key={
                                item.href
                              }
                              href={
                                item.href
                              }
                              onClick={
                                closeSearch
                              }
                              className="flex min-h-14 items-center justify-between rounded-2xl border border-[#ded8ce] bg-white px-4 font-semibold text-[#364e45] transition hover:border-[#78978c] hover:bg-[#f4f7f5]"
                            >
                              {
                                item.label
                              }

                              <span
                                aria-hidden="true"
                                className="text-[#a07c53]"
                              >
                                →
                              </span>
                            </Link>
                          ),
                        )}
                      </div>
                    </section>

                    <section>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b704e]">
                        {text.moments}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2.5">
                        {momentActions.map(
                          (item) => (
                            <button
                              key={
                                item
                              }
                              type="button"
                              onClick={() =>
                                setQuery(
                                  item,
                                )
                              }
                              className="rounded-full border border-[#dcd6cc] bg-white px-5 py-2.5 text-sm font-semibold text-[#455c53] transition hover:border-[#78978c] hover:bg-[#f4f7f5]"
                            >
                              {item}
                            </button>
                          ),
                        )}
                      </div>
                    </section>

                    <section>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b704e]">
                        {
                          text.recipients
                        }
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2.5">
                        {recipientActions.map(
                          (item) => (
                            <button
                              key={
                                item
                              }
                              type="button"
                              onClick={() =>
                                setQuery(
                                  item,
                                )
                              }
                              className="rounded-full border border-[#dcd6cc] bg-white px-5 py-2.5 text-sm font-semibold text-[#455c53] transition hover:border-[#78978c] hover:bg-[#f4f7f5]"
                            >
                              {item}
                            </button>
                          ),
                        )}
                      </div>
                    </section>

                    <Link
                      href={`/kaarten?lang=${language}`}
                      onClick={
                        closeSearch
                      }
                      className="inline-flex min-h-11 items-center rounded-full bg-[#285347] px-6 text-sm font-bold text-white transition hover:bg-[#1f443a]"
                    >
                      {text.allCards} →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <main
          id="main-content"
          className="px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:px-8"
        >
          {children}
        </main>

        <footer className="border-t border-[#e8e4dc] bg-[#fbfaf7]">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-6 text-sm text-[#69746c] sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <p>
              HadiyadPay · {text.footer}
            </p>

            <Link
              href={`/?lang=${language}`}
              className="rounded underline-offset-4 hover:text-[#285347] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
            >
              {text.top} ↑
            </Link>
          </div>
        </footer>
      </div>

      <ReceivedCardModal
        currentLanguage={
          language
        }
      />
    </StorefrontLanguageContext.Provider>
  );
}