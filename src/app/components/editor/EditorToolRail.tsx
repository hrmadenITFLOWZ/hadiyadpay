"use client";

import type { CardLanguage } from "../../../lib/card-types";

export type EditorTool = "text" | "photo" | "stickers";

interface EditorToolRailProps {
  language: CardLanguage;

  activeTool: EditorTool | null;

  hasPhoto?: boolean;

  stickerCount?: number;

  onToolSelect: (tool: EditorTool) => void;
}

interface ToolDefinition {
  id: EditorTool;

  icon: "text" | "photo" | "stickers";
}

const tools: ToolDefinition[] = [
  {
    id: "text",

    icon: "text",
  },

  {
    id: "photo",

    icon: "photo",
  },

  {
    id: "stickers",

    icon: "stickers",
  },
];

export default function EditorToolRail({
  language,
  activeTool,
  hasPhoto = false,
  stickerCount = 0,
  onToolSelect,
}: EditorToolRailProps) {
  const text = {
    so: {
      text: "Fariin",

      photo: "Sawir",

      stickers: "Qurxin",
    },

    en: {
      text: "Message",

      photo: "Photo",

      stickers: "Decorate",
    },

    nl: {
      text: "Boodschap",

      photo: "Foto",

      stickers: "Versieren",
    },
  }[language];

  const renderIcon = (tool: ToolDefinition) => {
    if (tool.icon === "text") {
      return (
        <span
          aria-hidden="true"
          className="font-serif text-[22px] font-bold leading-none"
        >
          Aa
        </span>
      );
    }

    if (tool.icon === "photo") {
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="h-6 w-6"
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

    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
      >
        <path
          d="M12 3.5L13.6 8.4L18.5 10L13.6 11.6L12 16.5L10.4 11.6L5.5 10L10.4 8.4L12 3.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />

        <path
          d="M18.5 15L19.2 17.1L21.3 17.8L19.2 18.5L18.5 20.6L17.8 18.5L15.7 17.8L17.8 17.1L18.5 15Z"
          fill="currentColor"
        />
      </svg>
    );
  };

  const labelFor = (tool: EditorTool) => {
    if (tool === "text") {
      return text.text;
    }

    if (tool === "photo") {
      return text.photo;
    }

    return text.stickers;
  };

  return (
    <nav
      aria-label={
        language === "nl"
          ? "Personaliseren"
          : language === "so"
            ? "Shakhsiyee"
            : "Personalise"
      }
      className="
        relative z-30
        flex w-full
        items-stretch
        justify-center

        border-y
        border-[#ded5c8]
        bg-white

        shadow-[0_5px_20px_rgba(38,62,54,0.08)]

        lg:w-[92px]
        lg:flex-col
        lg:justify-start
        lg:overflow-hidden
        lg:rounded-2xl
        lg:border
        lg:shadow-[0_12px_30px_rgba(38,62,54,0.12)]
      "
    >
      {tools.map((tool, index) => {
        const active = activeTool === tool.id;

        const showPhotoDot = tool.id === "photo" && hasPhoto;

        const showStickerCount = tool.id === "stickers" && stickerCount > 0;

        return (
          <button
            key={tool.id}
            type="button"
            aria-pressed={active}
            aria-label={labelFor(tool.id)}
            onClick={() => onToolSelect(tool.id)}
            className={`
                group
                relative
                flex min-h-[72px]
                flex-1
                flex-col
                items-center
                justify-center
                gap-1.5
                px-2
                py-2
                text-center
                transition

                lg:min-h-[94px]
                lg:w-full
                lg:flex-none
                lg:px-1

                ${
                  index > 0
                    ? "border-l border-[#eee8df] lg:border-l-0 lg:border-t"
                    : ""
                }

                ${
                  active
                    ? "bg-[#eef4f1] text-[#285347]"
                    : "bg-white text-[#353b37] hover:bg-[#faf7f1] hover:text-[#285347]"
                }

                focus-visible:z-20
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-[-2px]
                focus-visible:outline-[#285347]
              `}
          >
            {active && (
              <span
                aria-hidden="true"
                className="
                    absolute
                    inset-x-3
                    top-0
                    h-[3px]
                    rounded-b-full
                    bg-[#285347]

                    lg:bottom-3
                    lg:left-0
                    lg:right-auto
                    lg:top-3
                    lg:h-auto
                    lg:w-[3px]
                    lg:rounded-r-full
                    lg:rounded-bl-none
                  "
              />
            )}

            <span
              className={`
                  relative
                  flex h-8 w-8
                  items-center
                  justify-center
                  rounded-lg
                  transition

                  ${
                    active
                      ? "bg-white text-[#285347] shadow-sm"
                      : "text-[#3d443f] group-hover:text-[#285347]"
                  }
                `}
            >
              {renderIcon(tool)}

              {showPhotoDot && (
                <span
                  aria-hidden="true"
                  className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#9a7441]"
                />
              )}

              {showStickerCount && (
                <span
                  className="
                      absolute
                      -right-2
                      -top-2
                      flex
                      h-4
                      min-w-4
                      items-center
                      justify-center
                      rounded-full
                      bg-[#9a7441]
                      px-1
                      text-[8px]
                      font-black
                      leading-none
                      text-white
                      shadow-sm
                    "
                >
                  {stickerCount > 9 ? "9+" : stickerCount}
                </span>
              )}
            </span>

            <span
              className={`
                  max-w-full
                  truncate
                  text-[10px]
                  font-semibold
                  leading-tight

                  sm:text-[11px]

                  ${
                    active
                      ? "text-[#285347]"
                      : "text-stone-600 group-hover:text-[#285347]"
                  }
                `}
            >
              {labelFor(tool.id)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
