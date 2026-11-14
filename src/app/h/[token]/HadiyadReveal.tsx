'use client';

import {
  useState,
} from 'react';

import type {
  CardLanguage,
} from '../../../lib/card-types';

type RevealState =
  | 'closed'
  | 'opening'
  | 'open';

interface HadiyadRevealProps {
  token: string;
  language: CardLanguage;
  cardTitle: string;
  orientation:
    | 'portrait'
    | 'landscape';
}

const copy = {
  so: {
    brandLabel:
      'Kaar dijitaal ah',
    eyebrow:
      'Gaar ahaan adiga',
    closedTitle:
      'Hadiyad ayaa kuu diyaar ah',
    closedMessage:
      'Qof ayaa kuu sameeyey kaar gaar ah.',
    openButton:
      'Fur Hadiyadda',
    opening:
      'Hadiyaddaada ayaa furmaysa…',
    revealed:
      'Hadiyaddaada',
    save:
      'Kaydi kaarka',
    saveHint:
      'Ku hay qalabkaaga si aad mar walba u daawato.',
    footer:
      'Waxaa lagu sameeyey HadiyadPay',
    unavailable:
      'Kaarka lama furi karin. Mar kale isku day.',
  },

  en: {
    brandLabel:
      'Digital card',
    eyebrow:
      'Especially for you',
    closedTitle:
      'A Hadiyad is waiting for you',
    closedMessage:
      'Someone created a personal card especially for you.',
    openButton:
      'Open your Hadiyad',
    opening:
      'Opening your Hadiyad…',
    revealed:
      'Your Hadiyad',
    save:
      'Save card',
    saveHint:
      'Keep the card on your device and revisit it whenever you like.',
    footer:
      'Created with HadiyadPay',
    unavailable:
      'The card could not be opened. Please try again.',
  },

  nl: {
    brandLabel:
      'Digitale kaart',
    eyebrow:
      'Speciaal voor jou',
    closedTitle:
      'Er staat een Hadiyad voor je klaar',
    closedMessage:
      'Iemand heeft speciaal voor jou een persoonlijke kaart gemaakt.',
    openButton:
      'Open je Hadiyad',
    opening:
      'Je Hadiyad wordt geopend…',
    revealed:
      'Jouw Hadiyad',
    save:
      'Kaart bewaren',
    saveHint:
      'Bewaar de kaart op je apparaat en bekijk haar wanneer je wilt.',
    footer:
      'Gemaakt met HadiyadPay',
    unavailable:
      'De kaart kon niet worden geopend. Probeer het opnieuw.',
  },
} satisfies Record<
  CardLanguage,
  Record<string, string>
>;

function sleep(
  milliseconds: number,
): Promise<void> {
  return new Promise(
    (resolve) => {
      window.setTimeout(
        resolve,
        milliseconds,
      );
    },
  );
}

export default function HadiyadReveal({
  token,
  language,
  cardTitle,
  orientation,
}: HadiyadRevealProps) {
  const [revealState, setRevealState] =
    useState<RevealState>(
      'closed',
    );

  const [
    openingError,
    setOpeningError,
  ] =
    useState(false);

  const text =
    copy[language];

  const encodedToken =
    encodeURIComponent(token);

  const cardUrl =
    `/api/share/${encodedToken}/download`;

  const downloadUrl =
    `${cardUrl}?download=1`;

  const handleOpen =
    async () => {
      if (
        revealState !==
        'closed'
      ) {
        return;
      }

      setOpeningError(false);
      setRevealState(
        'opening',
      );

      /*
       * Start the visual reveal and record the open
       * in parallel. Tracking failure must never stop
       * the recipient from seeing the paid card.
       */
      const trackingRequest =
        fetch(
          `/api/share/${encodedToken}/open`,
          {
            method: 'POST',
            cache: 'no-store',
          },
        ).catch(
          () => null,
        );

      await Promise.all([
        trackingRequest,
        sleep(1100),
      ]);

      setRevealState(
        'open',
      );
    };

  const isOpen =
    revealState === 'open';

  const isOpening =
    revealState ===
    'opening';

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4efe5] text-[#263e36]">
      <div
        aria-hidden="true"
        className="absolute -left-20 -top-24 h-80 w-80 rounded-full bg-[#d8e5dd]/80 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-[#ead7b8]/70 blur-3xl"
      />

      <div
        aria-hidden="true"
        className={`absolute left-[12%] top-[18%] h-2 w-2 rounded-full bg-[#b88b45] transition-all duration-1000 ${
          isOpen
            ? 'translate-x-8 -translate-y-8 scale-150 opacity-0'
            : 'opacity-60'
        }`}
      />

      <div
        aria-hidden="true"
        className={`absolute right-[15%] top-[24%] h-1.5 w-1.5 rounded-full bg-[#b88b45] transition-all delay-150 duration-1000 ${
          isOpen
            ? '-translate-x-10 -translate-y-6 scale-150 opacity-0'
            : 'opacity-50'
        }`}
      />

      <div
        aria-hidden="true"
        className={`absolute bottom-[18%] left-[18%] h-2 w-2 rounded-full bg-[#b88b45] transition-all delay-300 duration-1000 ${
          isOpen
            ? 'translate-x-10 translate-y-5 scale-150 opacity-0'
            : 'opacity-40'
        }`}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-7 sm:px-8 sm:py-10">
        <header className="flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#d6d4c9] bg-white/80 font-serif text-lg font-bold text-[#285347] shadow-sm backdrop-blur">
            H
          </div>

          <div>
            <p className="font-serif text-lg leading-none text-[#263e36]">
              HadiyadPay
            </p>

            <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#8b8178]">
              {text.brandLabel}
            </p>
          </div>
        </header>

        <section className="flex flex-1 items-center justify-center py-10">
          {!isOpen ? (
            <div
              className={`w-full max-w-xl text-center transition-all duration-700 ${
                isOpening
                  ? 'scale-95 opacity-0'
                  : 'scale-100 opacity-100'
              }`}
            >
              <div
                aria-hidden="true"
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#d7c39b] bg-[#fffaf0] text-2xl text-[#a47334] shadow-[0_15px_40px_rgba(73,55,31,0.12)]"
              >
                ✦
              </div>

              <p className="mt-8 text-xs font-black uppercase tracking-[0.25em] text-[#9a7441]">
                {text.eyebrow}
              </p>

              <h1 className="mx-auto mt-4 max-w-lg font-serif text-4xl leading-tight text-[#243d34] sm:text-5xl">
                {isOpening
                  ? text.opening
                  : text.closedTitle}
              </h1>

              <p className="mx-auto mt-5 max-w-md text-base leading-7 text-[#66736d]">
                {text.closedMessage}
              </p>

              <button
                type="button"
                onClick={() =>
                  void handleOpen()
                }
                disabled={isOpening}
                className="mt-9 inline-flex min-h-14 min-w-56 items-center justify-center gap-3 rounded-2xl bg-[#285347] px-7 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_18px_40px_rgba(40,83,71,0.24)] transition hover:-translate-y-0.5 hover:bg-[#1f4339] disabled:cursor-wait disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#285347]"
              >
                {isOpening
                  ? text.opening
                  : text.openButton}

                {!isOpening && (
                  <span
                    aria-hidden="true"
                    className="text-lg"
                  >
                    ✦
                  </span>
                )}
              </button>

              {openingError && (
                <p
                  role="alert"
                  className="mt-5 text-sm font-semibold text-rose-700"
                >
                  {text.unavailable}
                </p>
              )}
            </div>
          ) : (
            <div className="w-full animate-[fade-in_700ms_ease-out]">
              <div className="text-center">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#9a7441]">
                  {text.revealed}
                </p>

                <h1 className="mt-3 font-serif text-3xl text-[#243d34] sm:text-4xl">
                  {cardTitle}
                </h1>
              </div>

              <div
                className={`mx-auto mt-7 overflow-hidden rounded-[2rem] border border-white/70 bg-white/50 p-2 shadow-[0_30px_90px_rgba(38,62,54,0.2)] backdrop-blur transition-all duration-700 ${
                  orientation ===
                  'portrait'
                    ? 'max-w-md'
                    : 'max-w-3xl'
                }`}
              >
                <img
                  src={cardUrl}
                  alt={cardTitle}
                  className="block h-auto w-full rounded-[1.6rem]"
                />
              </div>

              <div className="mx-auto mt-8 max-w-md text-center">
                <a
                  href={downloadUrl}
                  className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#285347] px-6 text-sm font-bold text-white shadow-lg shadow-[#285347]/15 transition hover:-translate-y-0.5 hover:bg-[#1f4339] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#285347]"
                >
                  {text.save}

                  <span
                    aria-hidden="true"
                    className="text-lg"
                  >
                    ↓
                  </span>
                </a>

                <p className="mt-3 text-sm leading-6 text-[#77817c]">
                  {text.saveHint}
                </p>
              </div>
            </div>
          )}
        </section>

        <footer className="text-center text-xs font-semibold tracking-wide text-[#928a7e]">
          {text.footer}
        </footer>
      </div>
    </main>
  );
}