'use client';

import {
  useRef,
  useState,
} from 'react';

import type {
  CardLanguage,
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
}

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
  const [
    revealState,
    setRevealState,
  ] =
    useState<RevealState>(
      'closed',
    );

  const hasStartedRef =
    useRef(false);

  const text =
    copy[language];

  const encodedToken =
    encodeURIComponent(
      token,
    );

  const baseCardUrl =
    `/api/share/${encodedToken}/download`;

  const coverUrl =
    `${baseCardUrl}?side=cover`;

  const insideUrl =
    `${baseCardUrl}?side=inside`;

  const downloadUrl =
    `${baseCardUrl}?side=inside&download=1`;

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

  const handleOpen =
    async () => {
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
        () => null,
      );

      await sleep(
        1500,
      );

      setRevealState(
        'opening',
      );

      await sleep(
        1250,
      );

      setRevealState(
        'open',
      );
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
      }`}
    >
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

      <div
        aria-hidden="true"
        className="hadiyad-stars"
      >
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

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
              onClick={() =>
                void handleOpen()
              }
              className="hadiyad-open-button"
            >
              <span>
                {text.openButton}
              </span>

              <span
                aria-hidden="true"
                className="hadiyad-button-star"
              >
                ✦
              </span>
            </button>
          </div>
        )}

        {hasCardStarted && (
          <div className="hadiyad-result">
            <div className="hadiyad-result-heading">
              <p className="hadiyad-eyebrow">
                {isOpen
                  ? text.revealed
                  : text.opening}
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

              <div className="hadiyad-card-book">
                <div className="hadiyad-inside-panel">
                  <img
                    src={insideUrl}
                    alt={cardTitle}
                    className="hadiyad-inside-image"
                  />
                </div>

                <div className="hadiyad-cover-panel">
                  <div className="hadiyad-cover-front">
                    <img
                      src={coverUrl}
                      alt=""
                      aria-hidden="true"
                      className="hadiyad-cover-image"
                    />

                    <div
                      aria-hidden="true"
                      className="hadiyad-cover-shine"
                    />
                  </div>

                  <div
                    aria-hidden="true"
                    className="hadiyad-cover-back"
                  >
                    <div className="hadiyad-cover-back-pattern" />

                    <div className="hadiyad-cover-back-mark">
                      H
                    </div>
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className="hadiyad-card-spine"
                />
              </div>

              {!isOpen && (
                <div
                  aria-live="polite"
                  className="hadiyad-opening-status"
                >
                  <span className="hadiyad-opening-dot" />

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
                  href={downloadUrl}
                  className="hadiyad-save-button"
                >
                  <span>
                    {text.save}
                  </span>

                  <span aria-hidden="true">
                    ↓
                  </span>
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

        .has-card-started .hadiyad-ambient-left {
          transform:
            translate3d(
              4rem,
              2rem,
              0
            )
            scale(1.2);
        }

        .has-card-started .hadiyad-ambient-right {
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

        .hadiyad-stars span {
          position: absolute;
          display: block;
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #b4823d;
          box-shadow:
            0 0 18px
            rgba(180, 130, 61, 0.7);
          animation:
            hadiyad-float
            4s ease-in-out
            infinite;
        }

        .hadiyad-stars span:nth-child(1) {
          left: 12%;
          top: 19%;
        }

        .hadiyad-stars span:nth-child(2) {
          right: 14%;
          top: 24%;
          animation-delay: 0.5s;
        }

        .hadiyad-stars span:nth-child(3) {
          left: 20%;
          bottom: 18%;
          animation-delay: 1.1s;
        }

        .hadiyad-stars span:nth-child(4) {
          right: 21%;
          bottom: 23%;
          animation-delay: 1.6s;
        }

        .hadiyad-stars span:nth-child(5) {
          left: 8%;
          top: 58%;
          width: 4px;
          height: 4px;
          animation-delay: 2s;
        }

        .hadiyad-stars span:nth-child(6) {
          right: 10%;
          top: 56%;
          width: 4px;
          height: 4px;
          animation-delay: 2.4s;
        }

        .is-opening .hadiyad-stars span {
          animation:
            hadiyad-burst
            1250ms ease
            forwards;
        }

        .hadiyad-brand {
          position: relative;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.4rem 1rem 0;
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
          backdrop-filter: blur(14px);
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
          margin: 1rem auto 0;
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
          letter-spacing: -0.035em;
          color: #243d34;
          text-wrap: balance;
        }

        .hadiyad-message {
          max-width: 29rem;
          margin: 1.25rem auto 0;
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
          gap: 0.8rem;
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
        .hadiyad-save-button:focus-visible {
          outline:
            3px solid #285347;
          outline-offset: 5px;
        }

        .hadiyad-button-star {
          font-size: 1.1rem;
          animation:
            hadiyad-star-pulse
            1.8s ease-in-out
            infinite;
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
          perspective: 2200px;
        }

        .hadiyad-card-stage.is-portrait {
          max-width: 29rem;
        }

        .hadiyad-card-stage.is-landscape {
          max-width: 48rem;
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
            2.2s ease-in-out
            infinite;
        }

        .hadiyad-card-book {
          position: relative;
          width: 100%;
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
        }

        .hadiyad-inside-panel {
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
            ),
            filter 1200ms ease;
          will-change:
            transform;
        }

        .is-showing-cover .hadiyad-cover-panel {
          transform:
            rotateY(0deg);
        }

        .is-opening .hadiyad-cover-panel,
        .is-open .hadiyad-cover-panel {
          transform:
            rotateY(-178deg);
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
          background: #f7efe0;
          box-shadow:
            inset 0 0 0 1px
            rgba(181, 139, 75, 0.22);
        }

        .hadiyad-cover-back {
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(
              145deg,
              #fffdf7,
              #eee0c9
            );
          transform:
            rotateY(180deg);
          box-shadow:
            inset 0 0 45px
            rgba(136, 95, 40, 0.12);
        }

        .hadiyad-cover-back-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.2;
          background-image:
            linear-gradient(
              30deg,
              transparent 48%,
              rgba(164, 115, 52, 0.22) 49%,
              rgba(164, 115, 52, 0.22) 51%,
              transparent 52%
            ),
            linear-gradient(
              -30deg,
              transparent 48%,
              rgba(40, 83, 71, 0.14) 49%,
              rgba(40, 83, 71, 0.14) 51%,
              transparent 52%
            );
          background-size:
            52px 90px;
        }

        .hadiyad-cover-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
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
            1200ms 250ms
            ease-out both;
        }

        .hadiyad-cover-back-mark {
          position: relative;
          z-index: 2;
          display: flex;
          width: 5rem;
          height: 5rem;
          align-items: center;
          justify-content: center;
          border:
            1px solid
            rgba(177, 128, 57, 0.42);
          border-radius: 999px;
          background:
            rgba(255, 255, 255, 0.62);
          color: #285347;
          font-family:
            Georgia,
            serif;
          font-size: 2rem;
          box-shadow:
            0 18px 45px
            rgba(72, 53, 28, 0.12);
          backdrop-filter:
            blur(8px);
        }

        .hadiyad-card-spine {
          position: absolute;
          z-index: 8;
          left: 0.4rem;
          top: 4%;
          bottom: 4%;
          width: 2px;
          border-radius: 999px;
          background:
            linear-gradient(
              180deg,
              transparent,
              rgba(82, 59, 29, 0.26),
              transparent
            );
          opacity: 0;
          transition:
            opacity 500ms ease;
        }

        .is-opening .hadiyad-card-spine,
        .is-open .hadiyad-card-spine {
          opacity: 1;
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
          width: 0.55rem;
          height: 0.55rem;
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
          gap: 0.75rem;
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

        @keyframes hadiyad-float {
          0%,
          100% {
            transform:
              translateY(0)
              scale(1);
            opacity: 0.4;
          }

          50% {
            transform:
              translateY(-10px)
              scale(1.35);
            opacity: 0.9;
          }
        }

        @keyframes hadiyad-burst {
          0% {
            transform:
              scale(1);
            opacity: 0.8;
          }

          100% {
            transform:
              translateY(-45px)
              scale(2.6);
            opacity: 0;
          }
        }

        @keyframes hadiyad-star-pulse {
          0%,
          100% {
            transform:
              scale(0.9);
            opacity: 0.65;
          }

          50% {
            transform:
              scale(1.25);
            opacity: 1;
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
          max-width: 640px
        ) {
          .hadiyad-brand {
            padding-top: 1rem;
          }

          .hadiyad-content {
            padding:
              1.6rem 1rem
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

          .hadiyad-card-book,
          .hadiyad-inside-panel,
          .hadiyad-cover-panel,
          .hadiyad-cover-front,
          .hadiyad-cover-back {
            border-radius: 1.45rem;
          }

          .hadiyad-inside-panel,
          .hadiyad-cover-front,
          .hadiyad-cover-back {
            border-width: 0.35rem;
          }

          .hadiyad-inside-image,
          .hadiyad-cover-image {
            border-radius: 1.1rem;
          }

          .hadiyad-actions {
            margin-top: 1.6rem;
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

          .is-opening .hadiyad-cover-panel,
          .is-open .hadiyad-cover-panel {
            transform:
              rotateY(-178deg);
          }
        }
      `}</style>
    </main>
  );
}