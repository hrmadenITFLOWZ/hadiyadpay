"use client";

import type { CardLanguage, CardOption } from "../../../lib/card-types";

import type { EditorSideState } from "../../../lib/card-editor";

import CardArtworkLayer from "../CardArtworkLayer";

export type EditorPage = "front" | "inside" | "back";

interface EditorPageNavigationProps {
  card: CardOption;
  language: CardLanguage;
  inside: EditorSideState;
  activePage: EditorPage;

  onPageChange: (page: EditorPage) => void;
}

const pageOrder: EditorPage[] = ["front", "inside", "back"];

export default function EditorPageNavigation({
  card,
  language,
  inside,
  activePage,
  onPageChange,
}: EditorPageNavigationProps) {
  const text = {
    so: {
      previous: "Bogga hore",

      next: "Bogga xiga",

      front: "Dibadda",

      inside: "Gudaha",

      back: "Gadaasha",

      backSoon: "Dhawaan",
    },

    en: {
      previous: "Previous page",

      next: "Next page",

      front: "Front",

      inside: "Inside",

      back: "Back",

      backSoon: "Soon",
    },

    nl: {
      previous: "Vorige pagina",

      next: "Volgende pagina",

      front: "Voorkant",

      inside: "Binnenkant",

      back: "Achterkant",

      backSoon: "Binnenkort",
    },
  }[language];

  const activeIndex = pageOrder.indexOf(activePage);

  const canGoPrevious = activeIndex > 0;

  const canGoNext = activeIndex < pageOrder.length - 1;

  const goPrevious = () => {
    if (!canGoPrevious) {
      return;
    }

    onPageChange(pageOrder[activeIndex - 1]);
  };

  const goNext = () => {
    if (!canGoNext) {
      return;
    }

    onPageChange(pageOrder[activeIndex + 1]);
  };

  const pageLabel = (page: EditorPage): string => {
    if (page === "front") {
      return text.front;
    }

    if (page === "inside") {
      return text.inside;
    }

    return text.back;
  };

  return (
    <nav
      aria-label={
        language === "nl"
          ? "Kaartpagina’s"
          : language === "so"
            ? "Bogagga Hadiyadda"
            : "Card pages"
      }
      className="border-t border-[#ded5c8] bg-[#fffdf9]"
    >
      <div className="mx-auto flex min-h-[112px] w-full max-w-[44rem] items-center justify-center gap-3 px-3 py-3 sm:min-h-[132px] sm:gap-6 sm:px-5">
        <button
          type="button"
          disabled={!canGoPrevious}
          onClick={goPrevious}
          aria-label={text.previous}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl text-[#173f35] transition hover:bg-[#eef4f1] disabled:cursor-not-allowed disabled:opacity-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
        >
          ‹
        </button>

        <div className="flex min-w-0 items-end justify-center gap-2 sm:gap-4">
          {pageOrder.map((page) => {
            const active = activePage === page;

            const isInside = page === "inside";

            const isBack = page === "back";

            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-pressed={active}
                aria-label={pageLabel(page)}
                className="group flex min-w-0 flex-col items-center gap-1.5 focus-visible:outline-none"
              >
                <span
                  className={`relative block overflow-hidden border bg-white shadow-sm transition ${
                    isInside
                      ? "h-[68px] w-[86px] sm:h-[82px] sm:w-[112px]"
                      : "h-[68px] w-[48px] sm:h-[82px] sm:w-[58px]"
                  } ${
                    active
                      ? "border-[#285347] ring-2 ring-[#285347] ring-offset-2 ring-offset-[#fffdf9]"
                      : "border-[#cfc7bc] group-hover:border-[#9a7441]"
                  }`}
                >
                  {page === "front" ? (
                    <CardArtworkLayer
                      artwork={card.artwork}
                      language={language}
                      decorative={true}
                      overlay={false}
                      fit="cover"
                      backgroundColor="#f7f1e8"
                    />
                  ) : isInside ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-[#d8d0c4]"
                      />

                      <span
                        aria-hidden="true"
                        className="absolute inset-y-[10%] left-[8%] right-[54%] rounded-[2px] bg-[#f7efe3]"
                      />

                      <span
                        aria-hidden="true"
                        className="absolute left-[57%] right-[8%] top-[25%] h-1 rounded-full bg-[#285347]/25"
                      />

                      <span
                        aria-hidden="true"
                        className="absolute left-[57%] right-[14%] top-[43%] h-1 rounded-full bg-[#285347]/15"
                      />

                      <span
                        aria-hidden="true"
                        className="absolute left-[57%] right-[20%] top-[61%] h-1 rounded-full bg-[#285347]/15"
                      />

                      {inside.stickers.length > 0 && (
                        <span
                          aria-hidden="true"
                          className="absolute right-[10%] top-[10%] text-[10px] text-[#9a7441]"
                        >
                          ✦
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-br from-[#fffdf9] to-[#f6f1e8]"
                      />

                      <span
                        aria-hidden="true"
                        className="absolute left-1/2 top-[43%] h-5 w-5 -translate-x-1/2 rounded-full border border-[#d8bd8d] text-[8px] leading-[18px] text-[#9a7441]"
                      >
                        M
                      </span>

                      <span className="absolute inset-x-1 bottom-1 rounded-sm bg-white/90 py-0.5 text-center text-[6px] font-bold uppercase tracking-wide text-[#9a7441]">
                        {text.backSoon}
                      </span>
                    </>
                  )}
                </span>

                <span
                  className={`max-w-[72px] truncate text-[10px] font-semibold sm:text-[11px] ${
                    active ? "text-[#285347]" : "text-stone-500"
                  }`}
                >
                  {pageLabel(page)}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={!canGoNext}
          onClick={goNext}
          aria-label={text.next}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl text-[#173f35] transition hover:bg-[#eef4f1] disabled:cursor-not-allowed disabled:opacity-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
        >
          ›
        </button>
      </div>
    </nav>
  );
}
