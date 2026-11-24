"use client";

import type { ReactNode } from "react";

import type { EditorPage } from "./EditorPageNavigation";

interface EditorStageProps {
  activePage: EditorPage;

  front: ReactNode;

  inside: ReactNode;

  back: ReactNode;

  toolRail: ReactNode;

  toolPanel: ReactNode;

  isToolPanelOpen: boolean;

  closePanelLabel: string;

  onCloseToolPanel: () => void;
}

const pageIndexes: Record<EditorPage, number> = {
  front: 0,

  inside: 1,

  back: 2,
};

export default function EditorStage({
  activePage,
  front,
  inside,
  back,
  toolRail,
  toolPanel,
  isToolPanelOpen,
  closePanelLabel,
  onCloseToolPanel,
}: EditorStageProps) {
  const activeIndex = pageIndexes[activePage];

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden bg-[#eeeae3]">
      <div
        className="flex h-full min-h-0 w-[300%] will-change-transform"
        style={{
          transform: `translate3d(-${activeIndex * 33.333333}%, 0, 0)`,

          transition: "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <section
          aria-hidden={activePage !== "front"}
          className="flex h-full min-h-0 w-1/3 shrink-0 items-center justify-center overflow-hidden px-3 py-3 sm:px-5 sm:py-4 lg:px-7"
        >
          <div className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#e6e3df] shadow-inner">
            <div className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden p-3 sm:p-5 lg:p-7">
              {front}
            </div>
          </div>
        </section>

        <section
          aria-hidden={activePage !== "inside"}
          className="h-full min-h-0 w-1/3 shrink-0 overflow-hidden px-2 py-3 sm:px-4 sm:py-4 lg:px-6"
        >
          <div
            className={`
              grid
              h-full
              min-h-0
              w-full
              items-stretch
              gap-2
              overflow-hidden

              grid-cols-[minmax(0,1fr)_64px]

              sm:grid-cols-[minmax(0,1fr)_76px]
              sm:gap-3

              lg:transition-[grid-template-columns]
              lg:duration-300

              ${
                isToolPanelOpen
                  ? "lg:grid-cols-[minmax(0,1fr)_92px_360px] xl:grid-cols-[minmax(0,1fr)_92px_390px]"
                  : "lg:grid-cols-[minmax(0,1fr)_92px]"
              }
            `}
          >
            <div className="relative h-full min-h-0 min-w-0 overflow-hidden rounded-[1.5rem] bg-[#e6e3df] shadow-inner">
              <div className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden p-2 sm:p-3 lg:p-5">
                {inside}
              </div>
            </div>

            <div className="relative z-30 h-full min-h-0">{toolRail}</div>

            <aside
              aria-hidden={!isToolPanelOpen}
              className={`
                fixed
                inset-x-2
                bottom-[112px]
                z-[70]
                max-h-[50dvh]
                min-h-0
                overflow-hidden
                transition-all
                duration-300

                sm:inset-x-4
                sm:bottom-[132px]

                lg:relative
                lg:inset-auto
                lg:bottom-auto
                lg:z-20
                lg:h-full
                lg:max-h-none
                lg:min-w-0

                ${
                  isToolPanelOpen
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-[calc(100%+40px)] opacity-0 lg:hidden lg:translate-y-0"
                }
              `}
            >
              <div className="flex h-full max-h-[50dvh] min-h-0 w-full flex-col overflow-hidden rounded-t-[1.5rem] border border-[#ded5c8] bg-[#fffdf9] shadow-[0_-14px_38px_rgba(38,62,54,0.2)] lg:max-h-none lg:rounded-[1.5rem] lg:shadow-[0_12px_30px_rgba(38,62,54,0.14)]">
                <div className="flex shrink-0 items-center justify-end border-b border-[#eee8df] px-3 py-2 lg:hidden">
                  <button
                    type="button"
                    onClick={onCloseToolPanel}
                    aria-label={closePanelLabel}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-lg text-stone-600 transition hover:bg-stone-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
                  >
                    ×
                  </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                  {toolPanel}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section
          aria-hidden={activePage !== "back"}
          className="flex h-full min-h-0 w-1/3 shrink-0 items-center justify-center overflow-hidden px-3 py-3 sm:px-5 sm:py-4 lg:px-7"
        >
          <div className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#e6e3df] shadow-inner">
            <div className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden p-3 sm:p-5 lg:p-7">
              {back}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
