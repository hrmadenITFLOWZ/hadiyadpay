'use client';

import type {
  CardLanguage,
} from '../../../lib/card-types';

export type EditorTool =
  | 'text'
  | 'photo'
  | 'stickers';

interface EditorToolRailProps {
  language: CardLanguage;
  activeTool: EditorTool | null;
  hasPhoto?: boolean;
  stickerCount?: number;

  onToolSelect: (
    tool: EditorTool,
  ) => void;
}

const tools: EditorTool[] = [
  'text',
  'photo',
  'stickers',
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
      text:
        'Fariin',

      photo:
        'Sawir',

      stickers:
        'Qurxin',
    },

    en: {
      text:
        'Message',

      photo:
        'Photo',

      stickers:
        'Decorate',
    },

    nl: {
      text:
        'Boodschap',

      photo:
        'Foto',

      stickers:
        'Versieren',
    },
  }[
    language
  ];

  const labelFor = (
    tool: EditorTool,
  ) => {
    if (
      tool ===
      'text'
    ) {
      return text.text;
    }

    if (
      tool ===
      'photo'
    ) {
      return text.photo;
    }

    return text.stickers;
  };

  const iconFor = (
    tool: EditorTool,
  ) => {
    if (
      tool ===
      'text'
    ) {
      return (
        <span className="font-serif text-[20px] font-bold leading-none sm:text-[22px]">
          Aa
        </span>
      );
    }

    if (
      tool ===
      'photo'
    ) {
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

    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5 sm:h-6 sm:w-6"
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

  return (
    <nav
      aria-label={
        language ===
        'nl'
          ? 'Personaliseren'
          : language ===
              'so'
            ? 'Shakhsiyee'
            : 'Personalise'
      }
      className="flex h-full w-[62px] shrink-0 flex-col overflow-hidden rounded-xl border border-[#ded5c8] bg-white shadow-[0_8px_24px_rgba(38,62,54,0.12)] sm:w-[76px] lg:w-[92px] lg:rounded-2xl"
    >
      {tools.map(
        (
          tool,
          index,
        ) => {
          const active =
            activeTool ===
            tool;

          const showPhotoDot =
            tool ===
              'photo' &&
            hasPhoto;

          const showStickerCount =
            tool ===
              'stickers' &&
            stickerCount >
              0;

          return (
            <button
              key={
                tool
              }
              type="button"
              aria-pressed={
                active
              }
              aria-label={
                labelFor(
                  tool,
                )
              }
              onClick={() =>
                onToolSelect(
                  tool,
                )
              }
              className={`group relative flex min-h-[74px] flex-1 flex-col items-center justify-center gap-1 border-[#eee8df] px-1 py-2 text-center transition sm:min-h-[86px] lg:min-h-[96px] lg:flex-none ${
                index >
                0
                  ? 'border-t'
                  : ''
              } ${
                active
                  ? 'bg-[#eef4f1] text-[#285347]'
                  : 'bg-white text-[#3d443f] hover:bg-[#faf7f1] hover:text-[#285347]'
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
                    ? 'bg-white text-[#285347] shadow-sm'
                    : 'text-[#3d443f] group-hover:text-[#285347]'
                }`}
              >
                {
                  iconFor(
                    tool,
                  )
                }

                {showPhotoDot && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#9a7441]"
                  />
                )}

                {showStickerCount && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#9a7441] px-1 text-[8px] font-black leading-none text-white shadow-sm">
                    {
                      stickerCount >
                      9
                        ? '9+'
                        : stickerCount
                    }
                  </span>
                )}
              </span>

              <span
                className={`max-w-full truncate text-[8px] font-semibold leading-tight sm:text-[10px] lg:text-[11px] ${
                  active
                    ? 'text-[#285347]'
                    : 'text-stone-600 group-hover:text-[#285347]'
                }`}
              >
                {
                  labelFor(
                    tool,
                  )
                }
              </span>
            </button>
          );
        },
      )}
    </nav>
  );
}