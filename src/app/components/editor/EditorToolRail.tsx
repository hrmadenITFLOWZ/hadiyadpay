"use client";

import type { CardLanguage } from "../../../lib/card-types";

export type EditorTool =
  "layout" | "text" | "photo" | "stickers" | "video" | "audio" | "handwriting";

interface EditorToolRailProps {
  language: CardLanguage;
  activeTool: EditorTool | null;
  hasPhoto?: boolean;
  stickerCount?: number;

  onToolSelect: (tool: EditorTool) => void;
}

const tools: EditorTool[] = [
  "layout",
  "text",
  "photo",
  "stickers",
  "video",
  "audio",
  "handwriting",
];

const enabledTools = new Set<EditorTool>(["text", "photo", "stickers"]);

export default function EditorToolRail({
  language,
  activeTool,
  hasPhoto = false,
  stickerCount = 0,
  onToolSelect,
}: EditorToolRailProps) {
  const text = {
    so: {
      layout: "Qaab",
      text: "Qoraal",
      photo: "Sawirro",
      stickers: "Qurxin",
      video: "Muuqaal",
      audio: "Cod",
      handwriting: "Gacan-qoris",
      comingSoon: "Dhawaan",
      navigation: "Shakhsiyee Hadiyadda",
    },

    en: {
      layout: "Layout",
      text: "Text",
      photo: "Photos",
      stickers: "Stickers",
      video: "Video",
      audio: "Audio",
      handwriting: "Handwriting",
      comingSoon: "Coming soon",
      navigation: "Personalise your Hadiyad",
    },

    nl: {
      layout: "Opmaak",
      text: "Tekst",
      photo: "Foto's",
      stickers: "Stickers",
      video: "Video",
      audio: "Audio",
      handwriting: "Handschrift",
      comingSoon: "Binnenkort",
      navigation: "Personaliseer je Hadiyad",
    },
  }[language];

  const labelFor = (tool: EditorTool): string => {
    return text[tool];
  };

  const iconFor = (tool: EditorTool) => {
    if (tool === "layout") {
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 sm:h-6 sm:w-6"
        >
          <rect
            x="3.5"
            y="3.5"
            width="17"
            height="17"
            rx="2.5"
            stroke="currentColor"
            strokeWidth="1.7"
          />

          <path
            d="M11 4V20M11 11H20"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    if (tool === "text") {
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 sm:h-6 sm:w-6"
        >
          <rect
            x="4"
            y="3.5"
            width="16"
            height="17"
            rx="2.5"
            stroke="currentColor"
            strokeWidth="1.7"
          />

          <path
            d="M8 8H16M12 8V17"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    if (tool === "photo") {
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 sm:h-6 sm:w-6"
        >
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="2.5"
            stroke="currentColor"
            strokeWidth="1.8"
          />

          <circle
            cx="8.5"
            cy="9"
            r="1.7"
            stroke="currentColor"
            strokeWidth="1.6"
          />

          <path
            d="M5.5 17L10 12.5L13 15L15.5 12.5L19 17"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    if (tool === "stickers") {
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 sm:h-6 sm:w-6"
        >
          <path
            d="M7.5 4H15.2C17.9 4 20 6.1 20 8.8V13.8C20 17.2 17.2 20 13.8 20H8.8C6.1 20 4 17.9 4 15.2V7.5C4 5.6 5.6 4 7.5 4Z"
            stroke="currentColor"
            strokeWidth="1.7"
          />

          <path
            d="M14 20V16.8C14 15.3 15.3 14 16.8 14H20"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />

          <circle cx="9" cy="9.5" r="1" fill="currentColor" />

          <circle cx="15" cy="9.5" r="1" fill="currentColor" />

          <path
            d="M8.5 13C9.4 14.2 10.6 14.8 12 14.8C13.4 14.8 14.6 14.2 15.5 13"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    if (tool === "video") {
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 sm:h-6 sm:w-6"
        >
          <rect
            x="3.5"
            y="4"
            width="17"
            height="16"
            rx="2.5"
            stroke="currentColor"
            strokeWidth="1.7"
          />

          <path
            d="M10 8.5L16 12L10 15.5V8.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    if (tool === "audio") {
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 sm:h-6 sm:w-6"
        >
          <path
            d="M5 10V14H8L12 18V6L8 10H5Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />

          <path
            d="M15 9C16.2 10.7 16.2 13.3 15 15M18 7C20.8 10 20.8 14 18 17"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5 sm:h-6 sm:w-6"
      >
        <path
          d="M5 18.5L6 14L15.8 4.2C16.7 3.3 18.1 3.3 19 4.2L19.8 5C20.7 5.9 20.7 7.3 19.8 8.2L10 18L5 18.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />

        <path
          d="M13.8 6.2L17.8 10.2M4 21H20"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  return (
    <nav
      aria-label={text.navigation}
      className="flex h-full w-[64px] shrink-0 flex-col overflow-hidden rounded-xl border border-[#ded5c8] bg-white shadow-[0_8px_24px_rgba(38,62,54,0.12)] sm:w-[76px] lg:w-[92px] lg:rounded-2xl"
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tools.map((tool, index) => {
          const active = activeTool === tool;
          const enabled = enabledTools.has(tool);

          const showPhotoDot = tool === "photo" && hasPhoto;

          const showStickerCount = tool === "stickers" && stickerCount > 0;

          return (
            <button
              key={tool}
              type="button"
              disabled={!enabled}
              aria-pressed={active}
              aria-label={
                enabled
                  ? labelFor(tool)
                  : `${labelFor(tool)} - ${text.comingSoon}`
              }
              title={
                enabled
                  ? labelFor(tool)
                  : `${labelFor(tool)} - ${text.comingSoon}`
              }
              onClick={() => {
                if (enabled) {
                  onToolSelect(tool);
                }
              }}
              className={`group relative flex min-h-[68px] w-full flex-col items-center justify-center gap-1 border-[#eee8df] px-1 py-2 text-center transition sm:min-h-[78px] lg:min-h-[88px] ${
                index > 0 ? "border-t" : ""
              } ${
                active
                  ? "bg-[#eef4f1] text-[#285347]"
                  : enabled
                    ? "bg-white text-[#3d443f] hover:bg-[#faf7f1] hover:text-[#285347]"
                    : "cursor-not-allowed bg-[#fbfaf7] text-stone-300"
              } focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#285347]`}
            >
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-[#285347]"
                />
              )}

              <span
                className={`relative flex h-8 w-8 items-center justify-center rounded-lg transition ${
                  active
                    ? "bg-white text-[#285347] shadow-sm"
                    : enabled
                      ? "text-[#3d443f] group-hover:text-[#285347]"
                      : "text-stone-300"
                }`}
              >
                {iconFor(tool)}

                {showPhotoDot && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#9a7441]"
                  />
                )}

                {showStickerCount && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#9a7441] px-1 text-[8px] font-black leading-none text-white shadow-sm">
                    {stickerCount > 9 ? "9+" : stickerCount}
                  </span>
                )}
              </span>

              <span
                className={`max-w-full truncate text-[8px] font-semibold leading-tight sm:text-[9px] lg:text-[10px] ${
                  active
                    ? "text-[#285347]"
                    : enabled
                      ? "text-stone-600 group-hover:text-[#285347]"
                      : "text-stone-300"
                }`}
              >
                {labelFor(tool)}
              </span>

              {!enabled && (
                <span className="max-w-full truncate text-[6px] font-semibold uppercase tracking-[0.04em] text-[#b8afa3] sm:text-[7px]">
                  {text.comingSoon}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
