'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type SyntheticEvent,
} from 'react';

import type {
  CardLanguage,
  CardOccasion,
} from '../../../lib/card-types';

type RevealState =
  | 'closed'
  | 'showing-cover'
  | 'opening'
  | 'open';

interface HadiyadRevealProps {
  token: string;
  language: CardLanguage;
  cardTitle: string;
  orientation:
    | 'portrait'
    | 'landscape';
  occasion: CardOccasion;
}

const WEDDING_HENNA_AUDIO =
  '/audio/wedding-henna-reveal.m4a';

const AUDIO_START_VOLUME =
  0.35;

const AUDIO_FADE_START_MS =
  5900;

const AUDIO_STOP_MS =
  6500;

const AUDIO_FADE_STEP_MS =
  50;

const EFFECT_END_MS =
  3400;

const CARD_OPEN_DELAY_MS =
  2200;

const CARD_OPEN_ANIMATION_MS =
  1250;

const copy = {
  so: {
    brandLabel:
      'Kaar dijitaal ah',
    eyebrow:
      'Gaar ahaan adiga',
    closedTitle:
      'Wax gaar ah ayaa kuu yimid',
    closedMessage:
      'Qof ayaa si gaar ah kuugu sameeyey Hadiyad.',
    openButton:
      'Fur Hadiyaddayda',
    opening:
      'Hadiyaddaada ayaa furmaysa…',
    tapToOpen:
      'Taabo Hadiyaddaada si aad u furto',
    tapHint:
      'Fur oo arag fariinta laguu reebay',
    revealed:
      'Hadiyaddaada',
    moment:
      'Xusuustan hayso',
    save:
      'Kaydi kaarka',
    saveHint:
      'Ku kaydi qalabkaaga si aad mar walba dib ugu daawato.',
    footer:
      'Waxaa lagu sameeyey HadiyadPay',
  },

  en: {
    brandLabel:
      'Digital card',
    eyebrow:
      'Especially for you',
    closedTitle:
      'Something special has arrived',
    closedMessage:
      'Someone created a personal Hadiyad especially for you.',
    openButton:
      'Open my Hadiyad',
    opening:
      'Opening your Hadiyad…',
    tapToOpen:
      'Tap your Hadiyad to open',
    tapHint:
      'Open the card to reveal your personal message',
    revealed:
      'Your Hadiyad',
    moment:
      'Keep this moment',
    save:
      'Save card',
    saveHint:
      'Save the card to your device so you can revisit this moment anytime.',
    footer:
      'Created with HadiyadPay',
  },

  nl: {
    brandLabel:
      'Digitale kaart',
    eyebrow:
      'Speciaal voor jou',
    closedTitle:
      'Er is iets bijzonders voor je gekomen',
    closedMessage:
      'Iemand heeft speciaal voor jou een persoonlijke Hadiyad gemaakt.',
    openButton:
      'Open mijn Hadiyad',
    opening:
      'Je Hadiyad wordt geopend…',
    tapToOpen:
      'Tik op je Hadiyad om te openen',
    tapHint:
      'Open de kaart en bekijk je persoonlijke boodschap',
    revealed:
      'Jouw Hadiyad',
    moment:
      'Bewaar dit moment',
    save:
      'Kaart bewaren',
    saveHint:
      'Bewaar de kaart op je apparaat, zodat je dit moment altijd terug kunt kijken.',
    footer:
      'Gemaakt met HadiyadPay',
  },
} satisfies Record<
  CardLanguage,
  Record<string, string>
>;

const revealOrnaments = [
  {
    left: '4%',
    top: '76%',
    size: 12,
    delay: 0,
    color: '#a66f54',
  },
  {
    left: '9%',
    top: '62%',
    size: 8,
    delay: 100,
    color: '#7f4d59',
  },
  {
    left: '15%',
    top: '86%',
    size: 10,
    delay: 180,
    color: '#c09a5f',
  },
  {
    left: '22%',
    top: '72%',
    size: 7,
    delay: 260,
    color: '#687461',
  },
  {
    left: '29%',
    top: '91%',
    size: 9,
    delay: 340,
    color: '#9a634e',
  },
  {
    left: '71%',
    top: '91%',
    size: 9,
    delay: 320,
    color: '#9a634e',
  },
  {
    left: '78%',
    top: '72%',
    size: 7,
    delay: 240,
    color: '#687461',
  },
  {
    left: '85%',
    top: '86%',
    size: 10,
    delay: 160,
    color: '#c09a5f',
  },
  {
    left: '91%',
    top: '62%',
    size: 8,
    delay: 80,
    color: '#7f4d59',
  },
  {
    left: '96%',
    top: '76%',
    size: 12,
    delay: 20,
    color: '#a66f54',
  },
] as const;

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
  occasion,
}: HadiyadRevealProps) {
  const [
    revealState,
    setRevealState,
  ] =
    useState<RevealState>(
      'closed',
    );

  const [
    coverAspectRatio,
    setCoverAspectRatio,
  ] =
    useState<number | null>(
      null,
    );

  const [
    specialEffectVisible,
    setSpecialEffectVisible,
  ] =
    useState(false);

  const [
    specialEffectActive,
    setSpecialEffectActive,
  ] =
    useState(false);

  const hasStartedRef =
    useRef(false);

  const isOpeningRef =
    useRef(false);

  const coverInteractiveAtRef =
    useRef(0);

  const audioRef =
    useRef<HTMLAudioElement | null>(
      null,
    );

  const fadeStartTimerRef =
    useRef<number | null>(
      null,
    );

  const stopTimerRef =
    useRef<number | null>(
      null,
    );

  const fadeIntervalRef =
    useRef<number | null>(
      null,
    );

  const effectTimerRef =
    useRef<number | null>(
      null,
    );

  const effectRemoveTimerRef =
    useRef<number | null>(
      null,
    );

  const text =
    copy[language];

  const hasWeddingHennaReveal =
    occasion ===
      'wedding' ||
    occasion ===
      'henna';

  const encodedToken =
    encodeURIComponent(
      token,
    );

  const baseCardUrl =
    `/api/share/${encodedToken}/download`;

  const coverUrl =
    `${baseCardUrl}?side=cover`;

  const insidePhotoUrl =
    `${baseCardUrl}?side=inside-photo`;

  const insideUrl =
    `${baseCardUrl}?side=inside`;

  const downloadUrl =
    `${baseCardUrl}?side=complete&download=1`;

  const isClosed =
    revealState ===
    'closed';

  const isShowingCover =
    revealState ===
    'showing-cover';

  const isOpening =
    revealState ===
    'opening';

  const isOpen =
    revealState ===
    'open';

  const hasCardStarted =
    !isClosed;

  const cardBookStyle =
    coverAspectRatio
      ? ({
          '--cover-aspect-ratio':
            coverAspectRatio,
        } as CSSProperties)
      : undefined;

  const clearAudioTimers =
    () => {
      if (
        fadeStartTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          fadeStartTimerRef.current,
        );

        fadeStartTimerRef.current =
          null;
      }

      if (
        stopTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          stopTimerRef.current,
        );

        stopTimerRef.current =
          null;
      }

      if (
        fadeIntervalRef.current !==
        null
      ) {
        window.clearInterval(
          fadeIntervalRef.current,
        );

        fadeIntervalRef.current =
          null;
      }
    };

  const clearEffectTimers =
    () => {
      if (
        effectTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          effectTimerRef.current,
        );

        effectTimerRef.current =
          null;
      }

      if (
        effectRemoveTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          effectRemoveTimerRef.current,
        );

        effectRemoveTimerRef.current =
          null;
      }
    };

  const stopRevealAudio =
    () => {
      clearAudioTimers();

      const audio =
        audioRef.current;

      if (!audio) {
        return;
      }

      audio.pause();
      audio.currentTime =
        0;
      audio.volume =
        AUDIO_START_VOLUME;
    };

  const startRevealEffect =
    () => {
      if (
        !hasWeddingHennaReveal
      ) {
        return;
      }

      clearEffectTimers();

      setSpecialEffectVisible(
        true,
      );

      setSpecialEffectActive(
        false,
      );

      window.requestAnimationFrame(
        () => {
          window.requestAnimationFrame(
            () => {
              setSpecialEffectActive(
                true,
              );
            },
          );
        },
      );

      effectTimerRef.current =
        window.setTimeout(
          () => {
            setSpecialEffectActive(
              false,
            );

            effectRemoveTimerRef.current =
              window.setTimeout(
                () => {
                  setSpecialEffectVisible(
                    false,
                  );
                },
                900,
              );
          },
          EFFECT_END_MS,
        );
    };

  const startRevealAudio =
    async () => {
      if (
        !hasWeddingHennaReveal
      ) {
        return;
      }

      clearAudioTimers();

      let audio =
        audioRef.current;

      if (!audio) {
        audio =
          new Audio(
            WEDDING_HENNA_AUDIO,
          );

        audio.preload =
          'auto';

        audioRef.current =
          audio;
      }

      audio.pause();
      audio.currentTime =
        0;
      audio.volume =
        AUDIO_START_VOLUME;

      try {
        await audio.play();
      } catch (error) {
        console.warn(
          'Wedding and Henna reveal audio could not start',
          {
            errorType:
              error instanceof Error
                ? error.name
                : 'unknown',
          },
        );

        return;
      }

      fadeStartTimerRef.current =
        window.setTimeout(
          () => {
            const fadeDuration =
              AUDIO_STOP_MS -
              AUDIO_FADE_START_MS;

            const totalSteps =
              Math.max(
                1,
                Math.ceil(
                  fadeDuration /
                    AUDIO_FADE_STEP_MS,
                ),
              );

            let currentStep =
              0;

            fadeIntervalRef.current =
              window.setInterval(
                () => {
                  const currentAudio =
                    audioRef.current;

                  if (
                    !currentAudio
                  ) {
                    return;
                  }

                  currentStep +=
                    1;

                  const progress =
                    Math.min(
                      1,
                      currentStep /
                        totalSteps,
                    );

                  currentAudio.volume =
                    Math.max(
                      0,
                      AUDIO_START_VOLUME *
                        (
                          1 -
                          progress
                        ),
                    );

                  if (
                    progress >=
                      1 &&
                    fadeIntervalRef.current !==
                      null
                  ) {
                    window.clearInterval(
                      fadeIntervalRef.current,
                    );

                    fadeIntervalRef.current =
                      null;
                  }
                },
                AUDIO_FADE_STEP_MS,
              );
          },
          AUDIO_FADE_START_MS,
        );

      stopTimerRef.current =
        window.setTimeout(
          () => {
            const currentAudio =
              audioRef.current;

            if (
              currentAudio
            ) {
              currentAudio.pause();

              currentAudio.currentTime =
                0;

              currentAudio.volume =
                AUDIO_START_VOLUME;
            }

            if (
              fadeIntervalRef.current !==
              null
            ) {
              window.clearInterval(
                fadeIntervalRef.current,
              );

              fadeIntervalRef.current =
                null;
            }
          },
          AUDIO_STOP_MS,
        );
    };

  useEffect(
    () => {
      if (
        !hasWeddingHennaReveal ||
        typeof Audio ===
          'undefined'
      ) {
        return;
      }

      const audio =
        new Audio(
          WEDDING_HENNA_AUDIO,
        );

      audio.preload =
        'auto';

      audio.volume =
        AUDIO_START_VOLUME;

      audioRef.current =
        audio;

      return () => {
        clearAudioTimers();
        clearEffectTimers();

        audio.pause();
        audio.currentTime =
          0;

        audioRef.current =
          null;
      };
    },
    [
      hasWeddingHennaReveal,
    ],
  );

  const handleCoverLoad = (
    event:
      SyntheticEvent<HTMLImageElement>,
  ) => {
    const image =
      event.currentTarget;

    if (
      image.naturalWidth <=
        0 ||
      image.naturalHeight <=
        0
    ) {
      return;
    }

    setCoverAspectRatio(
      image.naturalWidth /
        image.naturalHeight,
    );
  };

  const handleStartReveal =
    () => {
      if (
        hasStartedRef.current
      ) {
        return;
      }

      hasStartedRef.current =
        true;

      coverInteractiveAtRef.current =
        Date.now() +
        900;

      setRevealState(
        'showing-cover',
      );

      void fetch(
        `/api/share/${encodedToken}/open`,
        {
          method:
            'POST',

          cache:
            'no-store',
        },
      ).catch(
        () =>
          null,
      );
    };

  const handleOpenCard =
    async () => {
      if (
        revealState !==
          'showing-cover' ||
        isOpeningRef.current ||
        Date.now() <
          coverInteractiveAtRef.current
      ) {
        return;
      }

      isOpeningRef.current =
        true;

      if (
        hasWeddingHennaReveal
      ) {
        startRevealEffect();

        void startRevealAudio();

        await sleep(
          CARD_OPEN_DELAY_MS,
        );
      }

      setRevealState(
        'opening',
      );

      await sleep(
        CARD_OPEN_ANIMATION_MS,
      );

      setRevealState(
        'open',
      );

      isOpeningRef.current =
        false;
    };

  const handleCardKeyDown = (
    event:
      KeyboardEvent<HTMLDivElement>,
  ) => {
    if (
      revealState !==
      'showing-cover'
    ) {
      return;
    }

    if (
      event.key ===
        'Enter' ||
      event.key ===
        ' '
    ) {
      event.preventDefault();

      void handleOpenCard();
    }
  };

  return (
    <main
      className={`hadiyad-stage ${
        hasCardStarted
          ? 'has-card-started'
          : ''
      } ${
        isShowingCover
          ? 'is-showing-cover'
          : ''
      } ${
        isOpening
          ? 'is-opening'
          : ''
      } ${
        isOpen
          ? 'is-open'
          : ''
      } ${
        hasWeddingHennaReveal
          ? 'has-wedding-henna-reveal'
          : ''
      }`}
    >
      {specialEffectVisible &&
        hasWeddingHennaReveal && (
          <div
            aria-hidden="true"
            className={`hadiyad-special-reveal ${
              specialEffectActive
                ? 'is-active'
                : ''
            }`}
          >
            <div className="hadiyad-special-wash" />

            <div className="hadiyad-special-ring hadiyad-special-ring-one" />

            <div className="hadiyad-special-ring hadiyad-special-ring-two" />

            <div className="hadiyad-special-bloom hadiyad-special-bloom-left" />

            <div className="hadiyad-special-bloom hadiyad-special-bloom-right" />

            <div className="hadiyad-special-ornament hadiyad-special-ornament-left" />

            <div className="hadiyad-special-ornament hadiyad-special-ornament-right" />

            {revealOrnaments.map(
              (
                ornament,
                index,
              ) => (
                <span
                  key={
                    `${ornament.left}-${ornament.top}-${index}`
                  }
                  className="hadiyad-special-particle"
                  style={
                    {
                      '--particle-left':
                        ornament.left,

                      '--particle-top':
                        ornament.top,

                      '--particle-size':
                        `${ornament.size}px`,

                      '--particle-delay':
                        `${ornament.delay}ms`,

                      '--particle-color':
                        ornament.color,
                    } as CSSProperties
                  }
                />
              ),
            )}
          </div>
        )}

      <div
        aria-hidden="true"
        className="hadiyad-ambient hadiyad-ambient-left"
      />

      <div
        aria-hidden="true"
        className="hadiyad-ambient hadiyad-ambient-right"
      />

      <div
        aria-hidden="true"
        className="hadiyad-pattern"
      />

      <header className="hadiyad-brand">
        <div className="hadiyad-monogram">
          H
        </div>

        <div>
          <p className="hadiyad-brand-name">
            HadiyadPay
          </p>

          <p className="hadiyad-brand-label">
            {text.brandLabel}
          </p>
        </div>
      </header>

      <section className="hadiyad-content">
        {isClosed && (
          <div className="hadiyad-intro">
            <p className="hadiyad-eyebrow">
              {text.eyebrow}
            </p>

            <h1 className="hadiyad-title">
              {text.closedTitle}
            </h1>

            <p className="hadiyad-message">
              {text.closedMessage}
            </p>

            <button
              type="button"
              onClick={
                handleStartReveal
              }
              className="hadiyad-open-button"
            >
              {text.openButton}
            </button>
          </div>
        )}

        {hasCardStarted && (
          <div className="hadiyad-result">
            <div className="hadiyad-result-heading">
              <p className="hadiyad-eyebrow">
                {isOpen
                  ? text.revealed
                  : isOpening
                    ? text.opening
                    : text.eyebrow}
              </p>

              <h1 className="hadiyad-card-title">
                {cardTitle}
              </h1>
            </div>

            <div
              className={`hadiyad-card-stage ${
                orientation ===
                'portrait'
                  ? 'is-portrait'
                  : 'is-landscape'
              }`}
            >
              <div
                aria-hidden="true"
                className="hadiyad-card-glow"
              />

              <div
                className={`hadiyad-card-book ${
                  isShowingCover
                    ? 'is-interactive'
                    : ''
                }`}
                style={
                  cardBookStyle
                }
                role={
                  isShowingCover
                    ? 'button'
                    : undefined
                }
                tabIndex={
                  isShowingCover
                    ? 0
                    : -1
                }
                aria-label={
                  isShowingCover
                    ? text.tapToOpen
                    : undefined
                }
                onClick={() => {
                  if (
                    isShowingCover
                  ) {
                    void handleOpenCard();
                  }
                }}
                onKeyDown={
                  handleCardKeyDown
                }
              >
                <div className="hadiyad-inside-right">
                  <img
                    src={
                      insideUrl
                    }
                    alt={
                      cardTitle
                    }
                    className="hadiyad-inside-image"
                  />
                </div>

                <div className="hadiyad-cover-panel">
                  <div className="hadiyad-cover-front">
                    <img
                      src={
                        coverUrl
                      }
                      alt=""
                      aria-hidden="true"
                      className="hadiyad-cover-image"
                      onLoad={
                        handleCoverLoad
                      }
                    />

                    <div
                      aria-hidden="true"
                      className="hadiyad-cover-shine"
                    />
                  </div>

                  <div className="hadiyad-cover-back">
                    <img
                      src={
                        insidePhotoUrl
                      }
                      alt=""
                      aria-hidden="true"
                      className="hadiyad-inside-photo-image"
                    />

                    <div
                      aria-hidden="true"
                      className="hadiyad-inside-photo-finish"
                    />
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className="hadiyad-card-spine"
                />
              </div>

              {isShowingCover && (
                <div className="hadiyad-tap-instruction">
                  <span
                    aria-hidden="true"
                    className="hadiyad-instruction-line"
                  />

                  <p className="hadiyad-tap-title">
                    {text.tapToOpen}
                  </p>

                  <p className="hadiyad-tap-hint">
                    {text.tapHint}
                  </p>
                </div>
              )}

              {isOpening && (
                <div
                  aria-live="polite"
                  className="hadiyad-opening-status"
                >
                  <span
                    aria-hidden="true"
                    className="hadiyad-opening-dot"
                  />

                  <span>
                    {text.opening}
                  </span>
                </div>
              )}
            </div>

            {isOpen && (
              <div className="hadiyad-actions">
                <p className="hadiyad-moment">
                  {text.moment}
                </p>

                <a
                  href={
                    downloadUrl
                  }
                  className="hadiyad-save-button"
                >
                  {text.save}
                </a>

                <p className="hadiyad-save-hint">
                  {text.saveHint}
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      <footer className="hadiyad-footer">
        {text.footer}
      </footer>

      <style jsx global>{`
        .hadiyad-stage {
          position: relative;
          min-height: 100svh;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          background:
            radial-gradient(
              circle at 50% 28%,
              rgba(255, 250, 239, 0.98),
              rgba(244, 237, 223, 0.96) 42%,
              rgba(226, 215, 194, 0.98) 100%
            );
          color: #263e36;
          isolation: isolate;
        }

        .hadiyad-stage::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.22),
              transparent 28%,
              rgba(40, 83, 71, 0.08)
            );
        }

        .hadiyad-special-reveal {
          position: fixed;
          inset: 0;
          z-index: 100;
          overflow: hidden;
          pointer-events: none;
          opacity: 1;
        }

        .hadiyad-special-wash {
          position: absolute;
          inset: 0;
          opacity: 0;
          background:
            radial-gradient(
              circle at 50% 48%,
              rgba(207, 172, 107, 0.32),
              rgba(121, 66, 73, 0.14) 34%,
              transparent 70%
            );
          transition:
            opacity 850ms ease;
        }

        .hadiyad-special-reveal.is-active
          .hadiyad-special-wash {
          opacity: 1;
        }

        .hadiyad-special-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 999px;
          opacity: 0.72;
          transform:
            translate(-50%, -50%)
            scale(0.35);
          transition:
            transform 2100ms
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              ),
            opacity 2100ms ease;
        }

        .hadiyad-special-ring-one {
          width: 22rem;
          height: 22rem;
          border:
            1px solid
            rgba(194, 154, 88, 0.46);
        }

        .hadiyad-special-ring-two {
          width: 15rem;
          height: 15rem;
          border:
            1px solid
            rgba(127, 75, 85, 0.38);
          transition-delay: 130ms;
        }

        .hadiyad-special-reveal.is-active
          .hadiyad-special-ring-one {
          opacity: 0;
          transform:
            translate(-50%, -50%)
            scale(2.2);
        }

        .hadiyad-special-reveal.is-active
          .hadiyad-special-ring-two {
          opacity: 0;
          transform:
            translate(-50%, -50%)
            scale(2.7);
        }

        .hadiyad-special-bloom {
          position: absolute;
          bottom: -10rem;
          width: 25rem;
          height: 25rem;
          border-radius: 999px;
          opacity: 0;
          filter: blur(55px);
          transition:
            opacity 1700ms ease,
            transform 2200ms
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              );
        }

        .hadiyad-special-bloom-left {
          left: -11rem;
          background:
            radial-gradient(
              circle,
              rgba(128, 72, 79, 0.74),
              transparent 68%
            );
          transform:
            translate(-2rem, 5rem)
            scale(0.7);
        }

        .hadiyad-special-bloom-right {
          right: -11rem;
          background:
            radial-gradient(
              circle,
              rgba(194, 150, 83, 0.72),
              transparent 68%
            );
          transform:
            translate(2rem, 5rem)
            scale(0.7);
        }

        .hadiyad-special-reveal.is-active
          .hadiyad-special-bloom-left {
          opacity: 0.34;
          transform:
            translate(7rem, -8rem)
            scale(1.25);
        }

        .hadiyad-special-reveal.is-active
          .hadiyad-special-bloom-right {
          opacity: 0.34;
          transform:
            translate(-7rem, -8rem)
            scale(1.25);
        }

        .hadiyad-special-ornament {
          position: absolute;
          top: 54%;
          width: 7.5rem;
          height: 7.5rem;
          opacity: 0.55;
          border-radius:
            55% 45% 60% 40%;
          transition:
            transform 2100ms
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              ),
            opacity 2100ms ease;
        }

        .hadiyad-special-ornament-left {
          left: 5%;
          border:
            1px solid
            rgba(184, 139, 77, 0.45);
          transform:
            rotate(-26deg)
            scale(0.7);
        }

        .hadiyad-special-ornament-right {
          right: 5%;
          border:
            1px solid
            rgba(126, 74, 83, 0.42);
          transform:
            rotate(26deg)
            scale(0.7);
        }

        .hadiyad-special-reveal.is-active
          .hadiyad-special-ornament-left {
          opacity: 0;
          transform:
            translate(-5rem, -9rem)
            rotate(-62deg)
            scale(1.7);
        }

        .hadiyad-special-reveal.is-active
          .hadiyad-special-ornament-right {
          opacity: 0;
          transform:
            translate(5rem, -9rem)
            rotate(62deg)
            scale(1.7);
        }

        .hadiyad-special-particle {
          position: absolute;
          left:
            var(--particle-left);
          top:
            var(--particle-top);
          width:
            var(--particle-size);
          height:
            var(--particle-size);
          border-radius:
            999px 999px 999px 0;
          opacity: 0.74;
          background:
            var(--particle-color);
          box-shadow:
            0 0 14px
            rgba(185, 139, 81, 0.32);
          transform:
            translateY(0)
            rotate(45deg)
            scale(1);
          transition:
            transform 1900ms
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              ),
            opacity 1900ms ease;
          transition-delay:
            var(--particle-delay);
        }

        .hadiyad-special-reveal.is-active
          .hadiyad-special-particle {
          opacity: 0;
          transform:
            translateY(-13rem)
            rotate(165deg)
            scale(0.15);
        }

        .hadiyad-ambient {
          position: absolute;
          z-index: -2;
          width: 28rem;
          height: 28rem;
          border-radius: 999px;
          filter: blur(75px);
          opacity: 0.62;
          transition:
            transform 1800ms ease,
            opacity 1800ms ease;
        }

        .hadiyad-ambient-left {
          left: -12rem;
          top: -10rem;
          background: #bfd6ca;
        }

        .hadiyad-ambient-right {
          right: -13rem;
          bottom: -12rem;
          background: #e4c798;
        }

        .has-card-started
          .hadiyad-ambient-left {
          transform:
            translate3d(
              4rem,
              2rem,
              0
            )
            scale(1.2);
        }

        .has-card-started
          .hadiyad-ambient-right {
          transform:
            translate3d(
              -4rem,
              -2rem,
              0
            )
            scale(1.2);
        }

        .hadiyad-pattern {
          position: absolute;
          inset: 0;
          z-index: -1;
          opacity: 0.16;
          pointer-events: none;
          background-image:
            linear-gradient(
              30deg,
              transparent 48%,
              rgba(164, 115, 52, 0.18) 49%,
              rgba(164, 115, 52, 0.18) 51%,
              transparent 52%
            ),
            linear-gradient(
              -30deg,
              transparent 48%,
              rgba(40, 83, 71, 0.1) 49%,
              rgba(40, 83, 71, 0.1) 51%,
              transparent 52%
            );
          background-size:
            72px 124px;
          mask-image:
            radial-gradient(
              circle at center,
              black,
              transparent 72%
            );
        }

        .has-wedding-henna-reveal.is-opening
          .hadiyad-card-glow {
          background:
            radial-gradient(
              circle,
              rgba(205, 164, 93, 0.72),
              rgba(126, 73, 81, 0.3) 46%,
              transparent 72%
            );
        }

        .hadiyad-brand {
          position: relative;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding:
            1.4rem 1rem 0;
        }

        .hadiyad-monogram {
          display: flex;
          width: 2.7rem;
          height: 2.7rem;
          align-items: center;
          justify-content: center;
          border-radius: 1rem;
          border:
            1px solid
            rgba(184, 145, 81, 0.38);
          background:
            rgba(255, 253, 248, 0.78);
          box-shadow:
            0 10px 30px
            rgba(53, 73, 63, 0.12);
          backdrop-filter:
            blur(14px);
          font-family:
            Georgia,
            serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #285347;
        }

        .hadiyad-brand-name {
          margin: 0;
          font-family:
            Georgia,
            serif;
          font-size: 1.1rem;
          line-height: 1;
        }

        .hadiyad-brand-label {
          margin:
            0.3rem 0 0;
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #897b6c;
        }

        .hadiyad-content {
          position: relative;
          display: flex;
          flex: 1;
          width: 100%;
          max-width: 78rem;
          margin: 0 auto;
          align-items: center;
          justify-content: center;
          padding:
            2.5rem 1.25rem
            3rem;
        }

        .hadiyad-intro {
          width: 100%;
          max-width: 34rem;
          text-align: center;
          animation:
            intro-arrive
            700ms ease both;
        }

        .hadiyad-eyebrow {
          margin: 0;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #9a7441;
        }

        .hadiyad-title {
          max-width: 32rem;
          margin:
            1rem auto 0;
          font-family:
            Georgia,
            serif;
          font-size:
            clamp(
              2.4rem,
              8vw,
              4.5rem
            );
          font-weight: 400;
          line-height: 1.06;
          letter-spacing:
            -0.035em;
          color: #243d34;
          text-wrap: balance;
        }

        .hadiyad-message {
          max-width: 29rem;
          margin:
            1.25rem auto 0;
          font-size: 1rem;
          line-height: 1.75;
          color: #65726c;
          text-wrap: balance;
        }

        .hadiyad-open-button {
          display: inline-flex;
          min-width:
            min(
              100%,
              17rem
            );
          min-height: 3.65rem;
          margin-top: 2rem;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 1.15rem;
          background:
            linear-gradient(
              135deg,
              #315f51,
              #1f4439
            );
          padding:
            0.9rem 1.6rem;
          box-shadow:
            0 18px 50px
            rgba(40, 83, 71, 0.28);
          color: white;
          cursor: pointer;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .hadiyad-open-button:hover {
          transform:
            translateY(-3px);
          box-shadow:
            0 23px 55px
            rgba(40, 83, 71, 0.32);
        }

        .hadiyad-open-button:focus-visible,
        .hadiyad-save-button:focus-visible,
        .hadiyad-card-book.is-interactive:focus-visible {
          outline:
            3px solid #285347;
          outline-offset: 5px;
        }

        .hadiyad-result {
          width: 100%;
          animation:
            result-arrive
            700ms ease both;
        }

        .hadiyad-result-heading {
          text-align: center;
        }

        .hadiyad-card-title {
          margin:
            0.65rem 0 0;
          font-family:
            Georgia,
            serif;
          font-size:
            clamp(
              2rem,
              7vw,
              3.5rem
            );
          font-weight: 400;
          line-height: 1.1;
          color: #243d34;
          text-wrap: balance;
        }

        .hadiyad-card-stage {
          position: relative;
          width: 100%;
          margin:
            1.75rem auto 0;
          perspective: 2400px;
          transition:
            max-width 800ms
            cubic-bezier(
              0.16,
              1,
              0.3,
              1
            );
        }

        .hadiyad-card-stage.is-portrait {
          max-width: 29rem;
        }

        .hadiyad-card-stage.is-landscape {
          max-width: 48rem;
        }

        .is-opening
          .hadiyad-card-stage.is-portrait,
        .is-open
          .hadiyad-card-stage.is-portrait {
          max-width: 58rem;
        }

        .is-opening
          .hadiyad-card-stage.is-landscape,
        .is-open
          .hadiyad-card-stage.is-landscape {
          max-width: 72rem;
        }

        .hadiyad-card-glow {
          position: absolute;
          z-index: -1;
          inset: 8%;
          border-radius: 999px;
          background:
            rgba(224, 181, 101, 0.5);
          filter: blur(55px);
          opacity: 0.7;
          transform: scale(0.9);
          animation:
            card-glow
            2.8s ease-in-out
            infinite;
        }

        .hadiyad-card-book {
          position: relative;
          width: 50%;
          margin-left: 50%;
          border-radius: 2rem;
          transform-style:
            preserve-3d;
          filter:
            drop-shadow(
              0 35px 55px
              rgba(38, 62, 54, 0.24)
            );
          animation:
            card-book-arrive
            850ms
            cubic-bezier(
              0.16,
              1,
              0.3,
              1
            )
            both;
          transition:
            transform 220ms ease,
            filter 220ms ease;
        }

        .is-showing-cover
          .hadiyad-card-book {
          width:
            min(
              100%,
              29rem
            );
          margin:
            0 auto;
          aspect-ratio:
            var(
              --cover-aspect-ratio,
              0.82
            );
        }

        .hadiyad-card-book.is-interactive {
          cursor: pointer;
          animation:
            card-book-arrive
              850ms
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              )
              both,
            card-breathe
              3.6s
              1.2s
              ease-in-out
              infinite;
        }

        .hadiyad-card-book.is-interactive:hover {
          transform:
            translateY(-4px)
            scale(1.008);
          filter:
            drop-shadow(
              0 42px 62px
              rgba(38, 62, 54, 0.3)
            );
        }

        .hadiyad-card-book.is-interactive:active {
          transform:
            translateY(-1px)
            scale(0.995);
        }

        .is-showing-cover
          .hadiyad-inside-right {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
        }

        .is-opening
          .hadiyad-card-book,
        .is-open
          .hadiyad-card-book {
          width: 50%;
          margin-left: 50%;
          aspect-ratio: auto;
          cursor: default;
          animation: none;
        }

        .hadiyad-inside-right {
          position: relative;
          z-index: 1;
          width: 100%;
          overflow: hidden;
          border:
            0.5rem solid
            rgba(255, 255, 255, 0.78);
          border-radius: 2rem;
          background: #fffaf0;
          box-shadow:
            inset 0 0 0 1px
            rgba(181, 139, 75, 0.25);
          transition:
            opacity 300ms ease;
        }

        .hadiyad-inside-image {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 1.5rem;
        }

        .hadiyad-cover-panel {
          position: absolute;
          z-index: 5;
          inset: 0;
          border-radius: 2rem;
          transform-origin:
            left center;
          transform-style:
            preserve-3d;
          transform:
            rotateY(0deg);
          transition:
            transform 1200ms
            cubic-bezier(
              0.65,
              0,
              0.22,
              1
            );
          will-change:
            transform;
        }

        .is-opening
          .hadiyad-cover-panel,
        .is-open
          .hadiyad-cover-panel {
          transform:
            rotateY(-180deg);
        }

        .hadiyad-cover-front,
        .hadiyad-cover-back {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border:
            0.5rem solid
            rgba(255, 255, 255, 0.82);
          border-radius: 2rem;
          backface-visibility:
            hidden;
          -webkit-backface-visibility:
            hidden;
        }

        .hadiyad-cover-front {
          z-index: 2;
          background: #fffaf0;
          box-shadow:
            inset 0 0 0 1px
            rgba(181, 139, 75, 0.22);
        }

        .hadiyad-cover-back {
          z-index: 1;
          background: #fffaf0;
          transform:
            rotateY(180deg);
          box-shadow:
            inset 0 0 45px
            rgba(136, 95, 40, 0.12);
        }

        .hadiyad-cover-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: fill;
          border-radius: 1.5rem;
        }

        .hadiyad-inside-photo-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          border-radius: 1.5rem;
        }

        .hadiyad-cover-shine {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              115deg,
              transparent 20%,
              rgba(255, 255, 255, 0.28) 42%,
              transparent 62%
            );
          transform:
            translateX(-110%);
          animation:
            cover-shine
            1500ms 350ms
            ease-out both;
        }

        .hadiyad-inside-photo-finish {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: 1.5rem;
          box-shadow:
            inset -18px 0 30px
            rgba(83, 57, 26, 0.08);
        }

        .hadiyad-card-spine {
          position: absolute;
          z-index: 8;
          left: -2px;
          top: 3%;
          bottom: 3%;
          width: 4px;
          border-radius: 999px;
          background:
            linear-gradient(
              180deg,
              transparent,
              rgba(82, 59, 29, 0.34),
              transparent
            );
          opacity: 0;
          transition:
            opacity 500ms ease;
        }

        .is-opening
          .hadiyad-card-spine,
        .is-open
          .hadiyad-card-spine {
          opacity: 1;
        }

        .hadiyad-tap-instruction {
          width:
            min(
              100%,
              31rem
            );
          margin:
            1.45rem auto 0;
          padding:
            0 0.75rem;
          text-align: center;
          animation:
            instruction-arrive
            600ms 300ms
            ease both;
        }

        .hadiyad-instruction-line {
          display: block;
          width: 3rem;
          height: 1px;
          margin:
            0 auto 0.9rem;
          background:
            linear-gradient(
              90deg,
              transparent,
              #b4823d,
              transparent
            );
        }

        .hadiyad-tap-title {
          margin: 0;
          color: #8e6b3d;
          font-size:
            clamp(
              0.85rem,
              2.2vw,
              1rem
            );
          font-weight: 900;
          letter-spacing: 0.12em;
          line-height: 1.45;
          text-transform: uppercase;
          text-wrap: balance;
        }

        .hadiyad-tap-hint {
          margin:
            0.6rem 0 0;
          color: #52655d;
          font-family:
            Georgia,
            serif;
          font-size:
            clamp(
              1rem,
              2.6vw,
              1.15rem
            );
          line-height: 1.5;
          text-wrap: balance;
        }

        .hadiyad-opening-status {
          display: flex;
          min-height: 2rem;
          margin-top: 1.25rem;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          color: #65726c;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .hadiyad-opening-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 999px;
          background: #b4823d;
          box-shadow:
            0 0 0 0
            rgba(180, 130, 61, 0.4);
          animation:
            opening-dot
            1.4s ease-out
            infinite;
        }

        .hadiyad-actions {
          width:
            min(
              100%,
              29rem
            );
          margin:
            2.1rem auto 0;
          text-align: center;
          animation:
            actions-arrive
            700ms 250ms
            ease both;
        }

        .hadiyad-moment {
          margin:
            0 0 1rem;
          font-family:
            Georgia,
            serif;
          font-size: 1.35rem;
          color: #364d44;
        }

        .hadiyad-save-button {
          display: inline-flex;
          width: 100%;
          min-height: 3.6rem;
          align-items: center;
          justify-content: center;
          border-radius: 1.15rem;
          background:
            linear-gradient(
              135deg,
              #315f51,
              #1f4439
            );
          padding:
            0.9rem 1.4rem;
          box-shadow:
            0 16px 40px
            rgba(40, 83, 71, 0.23);
          color: white;
          font-size: 0.88rem;
          font-weight: 800;
          text-decoration: none;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .hadiyad-save-button:hover {
          transform:
            translateY(-2px);
          box-shadow:
            0 21px 46px
            rgba(40, 83, 71, 0.28);
        }

        .hadiyad-save-hint {
          margin:
            0.8rem 0 0;
          font-size: 0.82rem;
          line-height: 1.6;
          color: #747f79;
        }

        .hadiyad-footer {
          position: relative;
          z-index: 12;
          padding:
            0 1rem 1.4rem;
          text-align: center;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #918778;
        }

        @keyframes intro-arrive {
          from {
            opacity: 0;
            transform:
              translateY(20px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
          }
        }

        @keyframes result-arrive {
          from {
            opacity: 0;
            transform:
              translateY(28px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
          }
        }

        @keyframes card-book-arrive {
          0% {
            opacity: 0;
            transform:
              translateY(65px)
              scale(0.82);
            filter: blur(8px);
          }

          65% {
            opacity: 1;
            transform:
              translateY(-7px)
              scale(1.015);
            filter: blur(0);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
            filter: blur(0);
          }
        }

        @keyframes card-breathe {
          0%,
          100% {
            transform:
              translateY(0)
              scale(1);
          }

          50% {
            transform:
              translateY(-3px)
              scale(1.004);
          }
        }

        @keyframes instruction-arrive {
          from {
            opacity: 0;
            transform:
              translateY(8px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
          }
        }

        @keyframes cover-shine {
          from {
            transform:
              translateX(-110%);
          }

          to {
            transform:
              translateX(110%);
          }
        }

        @keyframes card-glow {
          0%,
          100% {
            opacity: 0.55;
            transform:
              scale(0.9);
          }

          50% {
            opacity: 0.85;
            transform:
              scale(1.08);
          }
        }

        @keyframes opening-dot {
          0% {
            box-shadow:
              0 0 0 0
              rgba(180, 130, 61, 0.42);
          }

          100% {
            box-shadow:
              0 0 0 12px
              rgba(180, 130, 61, 0);
          }
        }

        @keyframes actions-arrive {
          from {
            opacity: 0;
            transform:
              translateY(18px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
          }
        }

        @media (
          max-width: 720px
        ) {
          .hadiyad-brand {
            padding-top: 1rem;
          }

          .hadiyad-content {
            padding:
              1.6rem 0.65rem
              2rem;
          }

          .hadiyad-intro {
            margin-top: -1rem;
          }

          .hadiyad-message {
            font-size: 0.94rem;
          }

          .hadiyad-result {
            padding-top: 0.5rem;
          }

          .hadiyad-card-stage {
            margin-top: 1.35rem;
          }

          .is-showing-cover
            .hadiyad-card-book {
            width:
              min(
                86vw,
                25rem
              );
          }

          .is-opening
            .hadiyad-card-stage.is-portrait,
          .is-open
            .hadiyad-card-stage.is-portrait {
            width:
              min(
                96vw,
                44rem
              );
          }

          .is-opening
            .hadiyad-card-stage.is-landscape,
          .is-open
            .hadiyad-card-stage.is-landscape {
            width:
              min(
                96vw,
                52rem
              );
          }

          .hadiyad-card-book,
          .hadiyad-inside-right,
          .hadiyad-cover-panel,
          .hadiyad-cover-front,
          .hadiyad-cover-back {
            border-radius: 1.15rem;
          }

          .hadiyad-inside-right,
          .hadiyad-cover-front,
          .hadiyad-cover-back {
            border-width: 0.25rem;
          }

          .hadiyad-inside-image,
          .hadiyad-cover-image,
          .hadiyad-inside-photo-image,
          .hadiyad-inside-photo-finish {
            border-radius: 0.9rem;
          }

          .hadiyad-tap-instruction {
            width: 100%;
            margin-top: 1.25rem;
            padding:
              0 1rem;
          }

          .hadiyad-actions {
            margin-top: 1.6rem;
          }

          .hadiyad-card-title {
            font-size:
              clamp(
                1.65rem,
                7vw,
                2.5rem
              );
          }

          .hadiyad-special-ring-one {
            width: 16rem;
            height: 16rem;
          }

          .hadiyad-special-ring-two {
            width: 11rem;
            height: 11rem;
          }

          .hadiyad-special-ornament {
            top: 58%;
            width: 5rem;
            height: 5rem;
          }
        }

        @media (
          max-width: 420px
        ) {
          .hadiyad-content {
            padding-left: 0.35rem;
            padding-right: 0.35rem;
          }

          .hadiyad-result-heading {
            padding:
              0 0.75rem;
          }

          .hadiyad-opening-status {
            font-size: 0.72rem;
          }

          .hadiyad-actions {
            padding:
              0 0.75rem;
          }
        }

        @media (
          prefers-reduced-motion:
          reduce
        ) {
          .hadiyad-stage *,
          .hadiyad-stage *::before,
          .hadiyad-stage *::after {
            scroll-behavior:
              auto !important;
            animation-duration:
              0.01ms !important;
            animation-iteration-count:
              1 !important;
            transition-duration:
              0.01ms !important;
          }

          .is-opening
            .hadiyad-cover-panel,
          .is-open
            .hadiyad-cover-panel {
            transform:
              rotateY(-180deg);
          }

          .hadiyad-special-reveal {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}