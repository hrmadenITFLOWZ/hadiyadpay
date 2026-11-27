"use client";

import { useEffect, useRef, type ReactNode } from "react";

import type { EditorStagePosition } from "./editor-stage-types";

interface EditorStageProps {
  activePosition: EditorStagePosition;

  front: ReactNode;
  inside: ReactNode;
  back: ReactNode;

  toolRail: ReactNode;
  toolPanel: ReactNode;

  isToolPanelOpen: boolean;
  closePanelLabel: string;
  onCloseToolPanel: () => void;
}

export default function EditorStage({
  activePosition,
  front,
  inside,
  back,
  toolRail,
  toolPanel,
  isToolPanelOpen,
  closePanelLabel,
  onCloseToolPanel,
}: EditorStageProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const frontRef = useRef<HTMLDivElement>(null);
  const insideLeftRef = useRef<HTMLDivElement>(null);
  const insideRightRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target =
      activePosition === "front"
        ? frontRef.current
        : activePosition === "inside-left"
          ? insideLeftRef.current
          : activePosition === "inside-right"
            ? insideRightRef.current
            : backRef.current;

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activePosition]);

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden bg-[#eeeae3]">
      <div
        ref={scrollerRef}
        className="flex h-full min-h-0 w-full snap-x snap-mandatory items-center overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex h-full min-h-0 w-max items-center gap-3 px-[8vw] py-3 sm:gap-4 sm:px-[10vw] sm:py-4 lg:gap-5 lg:px-[12vw]">
          <div
            ref={frontRef}
            className="flex h-full min-h-0 w-[min(78vw,31rem)] shrink-0 snap-center items-center justify-center"
          >
            <div className="flex h-full w-full items-center justify-center">
              {front}
            </div>
          </div>

          <div className="relative z-30 h-[calc(100%-1rem)] shrink-0 self-center">
            {toolRail}
          </div>

          <div className="relative h-full min-h-0 w-[min(158vw,68rem)] shrink-0">
            <div
              ref={insideLeftRef}
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-[25%] top-0 w-px snap-center"
            />

            <div
              ref={insideRightRef}
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-[75%] top-0 w-px snap-center"
            />

            <div className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden">
              {inside}
            </div>
          </div>

          <div
            ref={backRef}
            className="flex h-full min-h-0 w-[min(78vw,31rem)] shrink-0 snap-center items-center justify-center"
          >
            {back}
          </div>
        </div>
      </div>

      <aside
        aria-hidden={!isToolPanelOpen}
        className={`fixed inset-x-2 bottom-[118px] z-[80] max-h-[52dvh] overflow-hidden transition-all duration-300 sm:inset-x-4 sm:bottom-[138px] lg:bottom-5 lg:left-auto lg:right-5 lg:top-5 lg:w-[380px] lg:max-h-none ${
          isToolPanelOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-[calc(100%+40px)] opacity-0 lg:translate-y-0 lg:translate-x-[calc(100%+40px)]"
        }`}
      >
        <div className="flex h-full max-h-[52dvh] min-h-0 flex-col overflow-hidden rounded-t-[1.5rem] border border-[#ded5c8] bg-[#fffdf9] shadow-[0_-14px_38px_rgba(38,62,54,0.20)] lg:max-h-none lg:rounded-[1.5rem] lg:shadow-[0_14px_38px_rgba(38,62,54,0.16)]">
          <div className="flex shrink-0 items-center justify-end border-b border-[#eee8df] px-3 py-2">
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
  );
}
