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
  | 'preparing'
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
  5600;

const AUDIO_STOP_MS =
  6200;

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

    preparing:
      'Waqtigaaga gaarka ah ayaa bilaabmaya…',

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

    preparing:
      'Your special moment is beginning…',

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

    preparing:
      'Jouw bijzondere moment begint…',

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
    left: '5%',
    top: '80%',
    size: 11,
    delay: 0,
    color: '#a66f54',
  },
  {
    left: '12%',
    top: '66%',
    size: 8,
    delay: 100,
    color: '#7f4d59',
  },
  {
    left: '20%',
    top: '88%',
    size: 9,
    delay: 180,
    color: '#c09a5f',
  },
  {
    left: '28%',
    top: '74%',
    size: 7,
    delay: 260,
    color: '#687461',
  },
  {
    left: '72%',
    top: '74%',
    size: 7,
    delay: 240,
    color: '#687461',
  },
  {
    left: '80%',
    top: '88%',
    size: 9,
    delay: 160,
    color: '#c09a5f',
  },
  {
    left: '88%',
    top: '66%',
    size: 8,
    delay: 80,
    color: '#7f4d59',
  },
  {
    left: '95%',
    top: '80%',
    size: 11,
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

  const isPreparing =
    revealState ===
    'preparing';

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

  const scheduleRevealAudioStop =
    () => {
      clearAudioTimers();

      fadeStartTimerRef.current =
        window.setTimeout(
          () => {
            const fadeDuration =
              AUDIO_STOP_MS -
              AUDIO_FADE_START_MS;

            const numberOfSteps =
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
                  const audio =
                    audioRef.current;

                  if (!audio) {
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

                    return;
                  }

                  currentStep +=
                    1;

                  const progress =
                    Math.min(
                      1,
                      currentStep /
                        numberOfSteps,
                    );

                  audio.volume =
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
            const audio =
              audioRef.current;

            if (audio) {
              audio.pause();

              audio.currentTime =
                0;

              audio.volume =
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

  const playRevealAudioFromUserGesture =
    () => {
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

      const playPromise =
        audio.play();

      scheduleRevealAudioStop();

      if (
        playPromise &&
        typeof playPromise.catch ===
          'function'
      ) {
        void playPromise.catch(
          (error) => {
            clearAudioTimers();

            console.warn(
              'Wedding and Henna reveal audio could not start',
              {
                errorType:
                  error instanceof Error
                    ? error.name
                    : 'unknown',
              },
            );
          },
        );
      }
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
                650,
              );
          },
          EFFECT_END_MS,
        );
    };

  useEffect(
    () => {
      if (
        typeof Image ===
        'undefined'
      ) {
        return;
      }

      const preloadImage = (
        source: string,
      ) => {
        const image =
          new Image();

        image.src =
          source;

        if (
          typeof image.decode ===
          'function'
        ) {
          void image.decode().catch(
            () =>
              undefined,
          );
        }
      };

      preloadImage(
        coverUrl,
      );

      preloadImage(
        insidePhotoUrl,
      );

      preloadImage(
        insideUrl,
      );
    },
    [
      coverUrl,
      insidePhotoUrl,
      insideUrl,
    ],
  );

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
        new Audio();

      audio.preload =
        'auto';

      audio.src =
        WEDDING_HENNA_AUDIO;

      audio.volume =
        AUDIO_START_VOLUME;

      audio.load();

      audioRef.current =
        audio;

      return () => {
        clearAudioTimers();
        clearEffectTimers();

        audio.pause();

        audio.removeAttribute(
          'src',
        );

        audio.load();

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
        isOpeningRef.current
      ) {
        return;
      }

      isOpeningRef.current =
        true;

      if (
        hasWeddingHennaReveal
      ) {
        playRevealAudioFromUserGesture();

        setRevealState(
          'preparing',
        );

        startRevealEffect();

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
        isPreparing
          ? 'is-preparing'
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
                  : isPreparing
                    ? text.preparing
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
                    decoding="async"
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
                      decoding="async"
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
                      decoding="async"
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

                {isPreparing && (
                  <div
                    aria-hidden="true"
                    className="hadiyad-preparing-overlay"
                  >
                    <span className="hadiyad-preparing-pulse" />
                  </div>
                )}
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

              {(isPreparing ||
                isOpening) && (
                <div
                  aria-live="polite"
                  className="hadiyad-opening-status"
                >
                  <span
                    aria-hidden="true"
                    className="hadiyad-opening-dot"
                  />

                  <span>
                    {isPreparing
                      ? text.preparing
                      : text.opening}
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
          display: flex;
          min-height: 100svh;
          flex-direction: column;
          overflow-x: hidden;
          isolation: isolate;
          color: #263e36;
          background:
            radial-gradient(
              circle at 50% 28%,
              rgba(255, 250, 239, 0.98),
              rgba(244, 237, 223, 0.96) 42%,
              rgba(226, 215, 194, 0.98) 100%
            );
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

        .hadiyad-ambient {
          position: absolute;
          z-index: -2;
          width: 28rem;
          height: 28rem;
          border-radius: 999px;
          opacity: 0.62;
          filter: blur(75px);
          transition:
            transform 1800ms ease,
            opacity 1800ms ease;
        }

        .hadiyad-ambient-left {
          top: -10rem;
          left: -12rem;
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
          pointer-events: none;
          opacity: 0.16;
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
          border:
            1px solid
            rgba(184, 145, 81, 0.38);
          border-radius: 1rem;
          background:
            rgba(255, 253, 248, 0.78);
          box-shadow:
            0 10px 30px
            rgba(53, 73, 63, 0.12);
          color: #285347;
          font-family:
            Georgia,
            serif;
          font-size: 1.1rem;
          font-weight: 700;
          backdrop-filter:
            blur(14px);
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
          color: #897b6c;
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
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
          color: #9a7441;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.25em;
          text-transform: uppercase;
        }

        .hadiyad-title {
          max-width: 32rem;
          margin:
            1rem auto 0;
          color: #243d34;
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
          text-wrap: balance;
        }

        .hadiyad-message {
          max-width: 29rem;
          margin:
            1.25rem auto 0;
          color: #65726c;
          font-size: 1rem;
          line-height: 1.75;
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
          padding:
            0.9rem 1.6rem;
          cursor: pointer;
          touch-action:
            manipulation;
          background:
            linear-gradient(
              135deg,
              #315f51,
              #1f4439
            );
          box-shadow:
            0 18px 50px
            rgba(40, 83, 71, 0.28);
          color: white;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
          -webkit-tap-highlight-color:
            transparent;
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
          color: #243d34;
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

        .is-preparing
          .hadiyad-card-stage.is-portrait,
        .is-opening
          .hadiyad-card-stage.is-portrait,
        .is-open
          .hadiyad-card-stage.is-portrait {
          max-width: 58rem;
        }

        .is-preparing
          .hadiyad-card-stage.is-landscape,
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
          opacity: 0.7;
          filter: blur(55px);
          transform: scale(0.9);
          background:
            rgba(224, 181, 101, 0.5);
          animation:
            card-glow
            2.8s ease-in-out
            infinite;
        }

        .has-wedding-henna-reveal.is-preparing
          .hadiyad-card-glow,
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
          transition:
            transform 220ms ease,
            filter 220ms ease;
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

        .is-preparing
          .hadiyad-card-book,
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

        .hadiyad-card-book.is-interactive {
          cursor: pointer;
          touch-action:
            manipulation;
          user-select: none;
          -webkit-user-select:
            none;
          -webkit-tap-highlight-color:
            transparent;
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
        }

        .is-showing-cover
          .hadiyad-inside-right {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
        }

        .is-preparing
          .hadiyad-inside-right,
        .is-opening
          .hadiyad-inside-right,
        .is-open
          .hadiyad-inside-right {
          opacity: 1;
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
        }

        .hadiyad-inside-image {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 1.5rem;
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
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

        .hadiyad-cover-image,
        .hadiyad-inside-photo-image {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 1.5rem;
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
        }

        .hadiyad-cover-image {
          object-fit: fill;
        }

        .hadiyad-inside-photo-image {
          object-fit: cover;
          object-position: center;
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
          opacity: 0;
          background:
            linear-gradient(
              180deg,
              transparent,
              rgba(82, 59, 29, 0.34),
              transparent
            );
          transition:
            opacity 500ms ease;
        }

        .is-opening
          .hadiyad-card-spine,
        .is-open
          .hadiyad-card-spine {
          opacity: 1;
        }

        .hadiyad-preparing-overlay {
          position: absolute;
          inset: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: inherit;
          pointer-events: none;
          background:
            radial-gradient(
              circle at center,
              rgba(218, 181, 112, 0.14),
              transparent 60%
            );
        }

        .hadiyad-preparing-pulse {
          width: 3rem;
          height: 3rem;
          border:
            1px solid
            rgba(192, 151, 83, 0.55);
          border-radius: 999px;
          animation:
            preparing-pulse
            1200ms ease-out
            infinite;
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
          font-size: 0.9rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          line-height: 1.45;
          text-transform: uppercase;
        }

        .hadiyad-tap-hint {
          margin:
            0.6rem 0 0;
          color: #52655d;
          font-family:
            Georgia,
            serif;
          font-size: 1.05rem;
          line-height: 1.5;
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
        }

        .hadiyad-opening-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 999px;
          background: #b4823d;
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
          color: #364d44;
          font-family:
            Georgia,
            serif;
          font-size: 1.35rem;
        }

        .hadiyad-save-button {
          display: inline-flex;
          width: 100%;
          min-height: 3.6rem;
          align-items: center;
          justify-content: center;
          border-radius: 1.15rem;
          padding:
            0.9rem 1.4rem;
          background:
            linear-gradient(
              135deg,
              #315f51,
              #1f4439
            );
          box-shadow:
            0 16px 40px
            rgba(40, 83, 71, 0.23);
          color: white;
          font-size: 0.88rem;
          font-weight: 800;
          text-decoration: none;
        }

        .hadiyad-save-hint {
          margin:
            0.8rem 0 0;
          color: #747f79;
          font-size: 0.82rem;
          line-height: 1.6;
        }

        .hadiyad-footer {
          position: relative;
          z-index: 12;
          padding:
            0 1rem 1.4rem;
          color: #918778;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-align: center;
        }

        .hadiyad-special-reveal {
          position: fixed;
          inset: 0;
          z-index: 100;
          overflow: hidden;
          pointer-events: none;
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
            transform 1800ms ease-out,
            opacity 1800ms ease;
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
        }

        .hadiyad-special-reveal.is-active
          .hadiyad-special-ring {
          opacity: 0;
          transform:
            translate(-50%, -50%)
            scale(2.4);
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
            transform 2200ms ease;
        }

        .hadiyad-special-bloom-left {
          left: -11rem;
          background:
            radial-gradient(
              circle,
              rgba(128, 72, 79, 0.74),
              transparent 68%
            );
        }

        .hadiyad-special-bloom-right {
          right: -11rem;
          background:
            radial-gradient(
              circle,
              rgba(194, 150, 83, 0.72),
              transparent 68%
            );
        }

        .hadiyad-special-reveal.is-active
          .hadiyad-special-bloom {
          opacity: 0.3;
          transform:
            translateY(-8rem)
            scale(1.25);
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
          transform:
            rotate(45deg);
          transition:
            transform 1700ms ease-out,
            opacity 1700ms ease;
          transition-delay:
            var(--particle-delay);
        }

        .hadiyad-special-reveal.is-active
          .hadiyad-special-particle {
          opacity: 0;
          transform:
            translateY(-11rem)
            rotate(165deg)
            scale(0.2);
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
          from {
            opacity: 0;
            transform:
              translateY(45px)
              scale(0.88);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes card-breathe {
          0%,
          100% {
            transform:
              translateY(0);
          }

          50% {
            transform:
              translateY(-3px);
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
          from {
            box-shadow:
              0 0 0 0
              rgba(180, 130, 61, 0.42);
          }

          to {
            box-shadow:
              0 0 0 12px
              rgba(180, 130, 61, 0);
          }
        }

        @keyframes preparing-pulse {
          from {
            opacity: 0.85;
            transform:
              scale(0.68);
          }

          to {
            opacity: 0;
            transform:
              scale(1.4);
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
              1.6rem 0.5rem
              2rem;
          }

          .hadiyad-intro {
            margin-top: -1rem;
          }

          .hadiyad-result {
            padding-top: 0.5rem;
          }

          .hadiyad-result-heading {
            padding:
              0 0.75rem;
          }

          .hadiyad-card-title {
            font-size:
              clamp(
                1.65rem,
                7vw,
                2.5rem
              );
          }

          /*
           * Mobiele stabiele layout:
           *
           * preparing, opening en open
           * gebruiken exact dezelfde stage.
           */
          .hadiyad-card-stage {
            width:
              min(
                96vw,
                44rem
              );
            max-width: none;
            margin-top: 1.35rem;
            perspective: 1600px;
            transition: none;
          }

          .hadiyad-card-stage.is-landscape {
            width:
              min(
                96vw,
                52rem
              );
            max-width: none;
          }

          .is-showing-cover
            .hadiyad-card-stage {
            width:
              min(
                86vw,
                25rem
              );
          }

          .is-preparing
            .hadiyad-card-stage,
          .is-opening
            .hadiyad-card-stage,
          .is-open
            .hadiyad-card-stage {
            width:
              min(
                96vw,
                44rem
              );
          }

          .is-preparing
            .hadiyad-card-stage.is-landscape,
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

          .is-preparing
            .hadiyad-card-book,
          .is-opening
            .hadiyad-card-book,
          .is-open
            .hadiyad-card-book {
            width: 50%;
            margin-left: 50%;
            aspect-ratio: auto;
            animation: none;
            transition: none;
          }

          .is-showing-cover
            .hadiyad-card-book {
            width: 100%;
            margin: 0;
          }

          .hadiyad-card-book {
            border-radius: 1.15rem;
            filter:
              drop-shadow(
                0 18px 28px
                rgba(38, 62, 54, 0.2)
              );
          }

          .hadiyad-card-book.is-interactive:hover,
          .hadiyad-card-book.is-interactive:active {
            transform: none;
          }

          .hadiyad-card-glow {
            opacity: 0.5;
            filter: blur(20px);
            animation: none;
          }

          .hadiyad-inside-right,
          .hadiyad-cover-panel,
          .hadiyad-cover-front,
          .hadiyad-cover-back {
            border-radius: 1.15rem;
          }

          .hadiyad-inside-right,
          .hadiyad-cover-front,
          .hadiyad-cover-back {
            border-width: 0.22rem;
          }

          .hadiyad-inside-image,
          .hadiyad-cover-image,
          .hadiyad-inside-photo-image,
          .hadiyad-inside-photo-finish {
            border-radius: 0.9rem;
          }

          /*
           * Alleen de cover transformeren.
           * Geen breedte- of marginovergang
           * tijdens de eigenlijke draai.
           */
          .hadiyad-cover-panel {
            transition:
              transform 1050ms
              cubic-bezier(
                0.65,
                0,
                0.22,
                1
              );
          }

          .hadiyad-special-bloom {
            display: none;
          }

          .hadiyad-special-ring {
            transition-duration:
              1300ms;
          }

          .hadiyad-special-particle {
            box-shadow: none;
            transition-duration:
              1200ms;
          }

          .hadiyad-tap-instruction {
            width: 100%;
            margin-top: 1.25rem;
            padding:
              0 1rem;
          }

          .hadiyad-opening-status {
            margin-top: 1rem;
          }

          .hadiyad-actions {
            margin-top: 1.6rem;
            padding:
              0 0.75rem;
          }
        }

        @media (
          max-width: 420px
        ) {
          .hadiyad-content {
            padding-left: 0.25rem;
            padding-right: 0.25rem;
          }

          .hadiyad-opening-status {
            font-size: 0.72rem;
          }
        }

        @media (
          prefers-reduced-motion:
          reduce
        ) {
          .hadiyad-stage *,
          .hadiyad-stage *::before,
          .hadiyad-stage *::after {
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