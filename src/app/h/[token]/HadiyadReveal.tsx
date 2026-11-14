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
  | 'celebrating'
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
  ] = useState<RevealState>(
    'closed',
  );

  const text =
    copy[language];

  const encodedToken =
    encodeURIComponent(token);

  const cardUrl =
    `/api/share/${encodedToken}/download`;

  const downloadUrl =
    `${cardUrl}?download=1`;

  const isOpening =
    revealState === 'opening';

  const isCelebrating =
    revealState ===
    'celebrating';

  const isOpen =
    revealState === 'open';

  const isRevealActive =
    isOpening ||
    isCelebrating;

  const handleOpen =
    async () => {
      if (
        revealState !==
        'closed'
      ) {
        return;
      }

      setRevealState(
        'opening',
      );

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
        sleep(1650),
      ]);

      setRevealState(
        'celebrating',
      );

      await sleep(900);

      setRevealState(
        'open',
      );
    };

  return (
    <main
      className={`hadiyad-stage ${
        isRevealActive
          ? 'is-opening'
          : ''
      } ${
        isCelebrating
          ? 'is-celebrating'
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

      {isCelebrating && (
        <div
          aria-hidden="true"
          className="hadiyad-climax"
        >
          <div className="hadiyad-climax-glow" />

          <div className="hadiyad-climax-shine" />

          <div className="hadiyad-climax-ring hadiyad-climax-ring-one" />
          <div className="hadiyad-climax-ring hadiyad-climax-ring-two" />
          <div className="hadiyad-climax-ring hadiyad-climax-ring-three" />

          <div className="hadiyad-climax-symbol">
            <span>H</span>
          </div>

          <div className="hadiyad-climax-particles">
            <span>✦</span>
            <span>✦</span>
            <span>✧</span>
            <span>✦</span>
            <span>✧</span>
            <span>✦</span>
            <span>✦</span>
            <span>✧</span>
            <span>✦</span>
            <span>✧</span>
            <span>✦</span>
            <span>✦</span>
          </div>
        </div>
      )}

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
        {!isOpen && (
          <div className="hadiyad-intro">
            <p className="hadiyad-eyebrow">
              {text.eyebrow}
            </p>

            <h1 className="hadiyad-title">
              {isRevealActive
                ? text.opening
                : text.closedTitle}
            </h1>

            <p className="hadiyad-message">
              {text.closedMessage}
            </p>

            <button
              type="button"
              onClick={() =>
                void handleOpen()
              }
              disabled={isRevealActive}
              className="hadiyad-open-button"
            >
              <span>
                {isRevealActive
                  ? text.opening
                  : text.openButton}
              </span>

              {!isRevealActive && (
                <span
                  aria-hidden="true"
                  className="hadiyad-button-star"
                >
                  ✦
                </span>
              )}
            </button>
          </div>
        )}

        {!isOpen && (
          <div
            aria-hidden="true"
            className="gift-scene"
          >
            <div className="gift-glow" />

            <div className="gift-card-shadow" />

            <div className="gift-card-preview">
              <div className="gift-card-pattern" />

              <div className="gift-card-mark">
                H
              </div>

              <div className="gift-card-spark gift-card-spark-one">
                ✦
              </div>

              <div className="gift-card-spark gift-card-spark-two">
                ✧
              </div>
            </div>

            <div className="gift-envelope">
              <div className="gift-envelope-back" />

              <div className="gift-envelope-paper">
                <span>H</span>
              </div>

              <div className="gift-envelope-left" />
              <div className="gift-envelope-right" />
              <div className="gift-envelope-front" />

              <div className="gift-envelope-flap">
                <span>✦</span>
              </div>
            </div>
          </div>
        )}

        {isOpen && (
          <div className="hadiyad-result">
            <div className="hadiyad-result-heading">
              <p className="hadiyad-eyebrow">
                {text.revealed}
              </p>

              <h1 className="hadiyad-card-title">
                {cardTitle}
              </h1>
            </div>

            <div
              className={`hadiyad-card-frame ${
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
                aria-hidden="true"
                className="hadiyad-card-rays"
              />

              <img
                src={cardUrl}
                alt={cardTitle}
                className="hadiyad-card-image"
              />

              <div
                aria-hidden="true"
                className="hadiyad-card-finish-particles"
              >
                <span>✦</span>
                <span>✧</span>
                <span>✦</span>
                <span>✧</span>
              </div>
            </div>

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
          overflow: hidden;
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

        .is-opening .hadiyad-ambient-left {
          transform:
            translate3d(
              4rem,
              2rem,
              0
            )
            scale(1.25);
        }

        .is-opening .hadiyad-ambient-right {
          transform:
            translate3d(
              -4rem,
              -2rem,
              0
            )
            scale(1.25);
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
          transition:
            opacity 500ms ease,
            transform 500ms ease;
        }

        .is-opening .hadiyad-brand {
          opacity: 0.35;
          transform: translateY(-8px);
        }

        .is-celebrating .hadiyad-brand {
          opacity: 0;
        }

        .hadiyad-monogram {
          display: flex;
          width: 2.7rem;
          height: 2.7rem;
          align-items: center;
          justify-content: center;
          border-radius: 1rem;
          border: 1px solid
            rgba(184, 145, 81, 0.38);
          background:
            rgba(255, 253, 248, 0.78);
          box-shadow:
            0 10px 30px
            rgba(53, 73, 63, 0.12);
          backdrop-filter: blur(14px);
          font-family: Georgia, serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #285347;
        }

        .hadiyad-brand-name {
          font-family: Georgia, serif;
          font-size: 1.1rem;
          line-height: 1;
        }

        .hadiyad-brand-label {
          margin-top: 0.3rem;
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
          max-width: 72rem;
          margin: 0 auto;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.25rem;
        }

        .hadiyad-intro {
          position: relative;
          z-index: 12;
          width: 100%;
          max-width: 34rem;
          text-align: center;
          transition:
            opacity 650ms ease,
            transform 650ms ease,
            filter 650ms ease;
        }

        .is-opening .hadiyad-intro {
          opacity: 0;
          transform:
            translateY(-18px)
            scale(0.96);
          filter: blur(6px);
          pointer-events: none;
        }

        .hadiyad-eyebrow {
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #9a7441;
        }

        .hadiyad-title {
          max-width: 32rem;
          margin: 1rem auto 0;
          font-family: Georgia, serif;
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
          padding: 0.9rem 1.6rem;
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
            box-shadow 180ms ease,
            opacity 180ms ease;
        }

        .hadiyad-open-button:hover {
          transform: translateY(-3px);
          box-shadow:
            0 23px 55px
            rgba(40, 83, 71, 0.32);
        }

        .hadiyad-open-button:disabled {
          cursor: wait;
          opacity: 0.7;
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

        .gift-scene {
          position: absolute;
          z-index: 15;
          left: 50%;
          top: 54%;
          width:
            min(
              78vw,
              21rem
            );
          height: 17rem;
          opacity: 0;
          pointer-events: none;
          transform:
            translate(-50%, -38%)
            scale(0.72);
          transition:
            opacity 350ms ease,
            transform 350ms ease,
            filter 400ms ease;
        }

        .is-opening .gift-scene {
          opacity: 1;
          transform:
            translate(-50%, -50%)
            scale(1);
        }

        .is-celebrating .gift-scene {
          opacity: 0;
          transform:
            translate(-50%, -68%)
            scale(1.28);
          filter: blur(12px);
        }

        .gift-glow {
          position: absolute;
          left: 50%;
          top: 47%;
          width: 16rem;
          height: 16rem;
          border-radius: 999px;
          background:
            radial-gradient(
              circle,
              rgba(255, 236, 177, 0.95),
              rgba(219, 167, 76, 0.28) 38%,
              transparent 70%
            );
          filter: blur(16px);
          opacity: 0;
          transform:
            translate(-50%, -50%)
            scale(0.4);
          animation:
            gift-glow
            1600ms 500ms
            ease forwards;
        }

        .gift-envelope {
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 100%;
          height: 12.3rem;
          transform:
            translateX(-50%);
          perspective: 900px;
          filter:
            drop-shadow(
              0 28px 28px
              rgba(49, 58, 49, 0.22)
            );
        }

        .gift-envelope-back {
          position: absolute;
          inset: 0;
          border-radius:
            1.1rem 1.1rem
            1.35rem 1.35rem;
          background:
            linear-gradient(
              145deg,
              #e7d2a9,
              #c59d5c
            );
        }

        .gift-envelope-paper {
          position: absolute;
          z-index: 2;
          left: 8%;
          right: 8%;
          top: 8%;
          height: 78%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.7rem;
          background:
            linear-gradient(
              160deg,
              #fffdf7,
              #f2e8d6
            );
          box-shadow:
            0 10px 24px
            rgba(77, 57, 31, 0.12);
          color: #bb9456;
          font-family: Georgia, serif;
          font-size: 2rem;
          font-weight: 700;
          animation:
            gift-paper-rise
            1650ms 650ms
            cubic-bezier(
              0.2,
              0.85,
              0.25,
              1
            )
            forwards;
        }

        .gift-envelope-left,
        .gift-envelope-right,
        .gift-envelope-front {
          position: absolute;
          z-index: 5;
          inset: 0;
          border-radius:
            0 0
            1.35rem 1.35rem;
        }

        .gift-envelope-left {
          clip-path:
            polygon(
              0 0,
              52% 52%,
              0 100%
            );
          background: #d7b77f;
        }

        .gift-envelope-right {
          clip-path:
            polygon(
              100% 0,
              48% 52%,
              100% 100%
            );
          background: #cfa86a;
        }

        .gift-envelope-front {
          clip-path:
            polygon(
              0 100%,
              50% 46%,
              100% 100%
            );
          background:
            linear-gradient(
              160deg,
              #e2c28e,
              #bd914f
            );
        }

        .gift-envelope-flap {
          position: absolute;
          z-index: 6;
          left: 0;
          right: 0;
          top: 0;
          height: 63%;
          display: flex;
          align-items: center;
          justify-content: center;
          clip-path:
            polygon(
              0 0,
              100% 0,
              50% 100%
            );
          border-radius:
            1.1rem 1.1rem 0 0;
          background:
            linear-gradient(
              160deg,
              #ead3a7,
              #c79c5a
            );
          color: #72542e;
          font-size: 1.4rem;
          transform-origin: top;
          backface-visibility: hidden;
          animation:
            gift-flap-open
            900ms 280ms
            cubic-bezier(
              0.4,
              0,
              0.2,
              1
            )
            forwards;
        }

        .gift-card-preview {
          position: absolute;
          z-index: 1;
          left: 50%;
          top: 1rem;
          width: 68%;
          height: 13rem;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border:
            1px solid
            rgba(255, 255, 255, 0.8);
          border-radius: 1.1rem;
          background:
            linear-gradient(
              160deg,
              #fffdf8,
              #e8ddc9
            );
          box-shadow:
            0 30px 60px
            rgba(36, 61, 52, 0.22);
          opacity: 0;
          transform:
            translate(-50%, 8rem)
            rotate(-3deg)
            scale(0.76);
          animation:
            gift-card-rise
            1450ms 850ms
            cubic-bezier(
              0.16,
              1,
              0.3,
              1
            )
            forwards;
        }

        .gift-card-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.24;
          background:
            radial-gradient(
              circle at 20% 20%,
              #e8bf72 0 4%,
              transparent 4.5%
            ),
            radial-gradient(
              circle at 80% 76%,
              #9aac94 0 7%,
              transparent 7.5%
            );
        }

        .gift-card-mark {
          position: relative;
          z-index: 2;
          display: flex;
          width: 4rem;
          height: 4rem;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          border:
            1px solid
            rgba(184, 145, 81, 0.5);
          background:
            rgba(255, 253, 247, 0.72);
          color: #285347;
          font-family: Georgia, serif;
          font-size: 1.7rem;
        }

        .gift-card-spark {
          position: absolute;
          z-index: 3;
          color: #b47d32;
        }

        .gift-card-spark-one {
          left: 18%;
          top: 20%;
        }

        .gift-card-spark-two {
          right: 18%;
          bottom: 20%;
        }

        .gift-card-shadow {
          position: absolute;
          left: 50%;
          bottom: -1rem;
          width: 85%;
          height: 3rem;
          border-radius: 999px;
          background:
            rgba(34, 54, 46, 0.26);
          filter: blur(20px);
          transform:
            translateX(-50%);
        }

        .hadiyad-climax {
          position: fixed;
          z-index: 80;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          pointer-events: none;
          background:
            radial-gradient(
              circle at center,
              rgba(255, 253, 244, 0.99),
              rgba(231, 209, 164, 0.9) 32%,
              rgba(40, 83, 71, 0.36) 74%,
              rgba(23, 44, 37, 0.54)
            );
          animation:
            climax-background
            900ms ease-out both;
        }

        .hadiyad-climax-glow {
          position: absolute;
          width:
            min(
              120vw,
              42rem
            );
          height:
            min(
              120vw,
              42rem
            );
          border-radius: 999px;
          background:
            radial-gradient(
              circle,
              rgba(255, 251, 220, 1) 0%,
              rgba(247, 215, 144, 0.92) 20%,
              rgba(210, 160, 73, 0.4) 45%,
              transparent 72%
            );
          filter: blur(8px);
          animation:
            climax-glow
            900ms
            cubic-bezier(
              0.16,
              1,
              0.3,
              1
            )
            both;
        }

        .hadiyad-climax-shine {
          position: absolute;
          width: 200%;
          height: 5rem;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.92),
              transparent
            );
          filter: blur(7px);
          transform:
            rotate(-18deg)
            translateX(-65%);
          animation:
            climax-shine
            800ms ease-out
            both;
        }

        .hadiyad-climax-symbol {
          position: relative;
          z-index: 5;
          display: flex;
          width: 7rem;
          height: 7rem;
          align-items: center;
          justify-content: center;
          border:
            1px solid
            rgba(170, 122, 54, 0.55);
          border-radius: 999px;
          background:
            rgba(255, 253, 247, 0.88);
          box-shadow:
            0 0 0 14px
            rgba(255, 248, 224, 0.32),
            0 30px 80px
            rgba(64, 48, 26, 0.2);
          color: #285347;
          font-family: Georgia, serif;
          font-size: 3rem;
          font-weight: 700;
          animation:
            climax-symbol
            900ms
            cubic-bezier(
              0.16,
              1,
              0.3,
              1
            )
            both;
        }

        .hadiyad-climax-symbol span {
          animation:
            climax-symbol-letter
            900ms ease-out
            both;
        }

        .hadiyad-climax-ring {
          position: absolute;
          border:
            2px solid
            rgba(184, 130, 61, 0.64);
          border-radius: 999px;
        }

        .hadiyad-climax-ring-one {
          width: 9rem;
          height: 9rem;
          animation:
            climax-ring
            900ms ease-out
            both;
        }

        .hadiyad-climax-ring-two {
          width: 9rem;
          height: 9rem;
          animation:
            climax-ring
            900ms 100ms
            ease-out both;
        }

        .hadiyad-climax-ring-three {
          width: 9rem;
          height: 9rem;
          animation:
            climax-ring
            900ms 200ms
            ease-out both;
        }

        .hadiyad-climax-particles span {
          position: absolute;
          left: 50%;
          top: 50%;
          color: #ae7730;
          font-size: 1.35rem;
          text-shadow:
            0 0 16px
            rgba(255, 228, 163, 0.9);
          animation:
            climax-particle
            900ms
            cubic-bezier(
              0.16,
              1,
              0.3,
              1
            )
            both;
        }

        .hadiyad-climax-particles span:nth-child(1) {
          --particle-x: -9rem;
          --particle-y: -8rem;
        }

        .hadiyad-climax-particles span:nth-child(2) {
          --particle-x: 0rem;
          --particle-y: -11rem;
          animation-delay: 35ms;
        }

        .hadiyad-climax-particles span:nth-child(3) {
          --particle-x: 9rem;
          --particle-y: -7rem;
          animation-delay: 70ms;
        }

        .hadiyad-climax-particles span:nth-child(4) {
          --particle-x: 12rem;
          --particle-y: 1rem;
          animation-delay: 105ms;
        }

        .hadiyad-climax-particles span:nth-child(5) {
          --particle-x: 8rem;
          --particle-y: 9rem;
          animation-delay: 140ms;
        }

        .hadiyad-climax-particles span:nth-child(6) {
          --particle-x: 0rem;
          --particle-y: 11rem;
          animation-delay: 175ms;
        }

        .hadiyad-climax-particles span:nth-child(7) {
          --particle-x: -9rem;
          --particle-y: 8rem;
          animation-delay: 210ms;
        }

        .hadiyad-climax-particles span:nth-child(8) {
          --particle-x: -12rem;
          --particle-y: 0rem;
          animation-delay: 245ms;
        }

        .hadiyad-climax-particles span:nth-child(9) {
          --particle-x: -6rem;
          --particle-y: -12rem;
          animation-delay: 90ms;
        }

        .hadiyad-climax-particles span:nth-child(10) {
          --particle-x: 6rem;
          --particle-y: -12rem;
          animation-delay: 150ms;
        }

        .hadiyad-climax-particles span:nth-child(11) {
          --particle-x: 12rem;
          --particle-y: 7rem;
          animation-delay: 220ms;
        }

        .hadiyad-climax-particles span:nth-child(12) {
          --particle-x: -12rem;
          --particle-y: 7rem;
          animation-delay: 280ms;
        }

        .hadiyad-result {
          width: 100%;
          animation:
            result-arrive
            900ms
            cubic-bezier(
              0.16,
              1,
              0.3,
              1
            )
            both;
        }

        .hadiyad-result-heading {
          text-align: center;
          animation:
            heading-arrive
            750ms ease-out
            both;
        }

        .hadiyad-card-title {
          margin-top: 0.65rem;
          font-family: Georgia, serif;
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

        .hadiyad-card-frame {
          position: relative;
          margin:
            1.75rem auto 0;
          border-radius: 2rem;
          padding: 0.5rem;
          border:
            1px solid
            rgba(255, 255, 255, 0.82);
          background:
            rgba(255, 255, 255, 0.5);
          box-shadow:
            0 35px 100px
            rgba(38, 62, 54, 0.25);
          backdrop-filter: blur(16px);
          animation:
            card-grand-arrival
            1350ms 100ms
            cubic-bezier(
              0.16,
              1,
              0.3,
              1
            )
            both;
        }

        .hadiyad-card-frame.is-portrait {
          width:
            min(
              100%,
              29rem
            );
        }

        .hadiyad-card-frame.is-landscape {
          width:
            min(
              100%,
              48rem
            );
        }

        .hadiyad-card-glow {
          position: absolute;
          inset: 8%;
          z-index: -1;
          border-radius: 999px;
          background:
            rgba(224, 181, 101, 0.48);
          filter: blur(55px);
          animation:
            final-card-glow
            1600ms ease-out
            both;
        }

        .hadiyad-card-rays {
          position: absolute;
          z-index: -2;
          left: 50%;
          top: 50%;
          width: 160%;
          aspect-ratio: 1;
          opacity: 0;
          background:
            repeating-conic-gradient(
              from 0deg,
              rgba(194, 146, 63, 0.18)
              0deg 5deg,
              transparent
              5deg 17deg
            );
          mask-image:
            radial-gradient(
              circle,
              transparent 0 24%,
              black 26% 55%,
              transparent 72%
            );
          transform:
            translate(-50%, -50%)
            rotate(0deg);
          animation:
            final-card-rays
            1500ms 100ms
            ease-out both;
        }

        .hadiyad-card-image {
          position: relative;
          z-index: 2;
          display: block;
          width: 100%;
          height: auto;
          border-radius: 1.55rem;
        }

        .hadiyad-card-finish-particles span {
          position: absolute;
          z-index: 5;
          color: #b47d32;
          font-size: 1.3rem;
          opacity: 0;
          animation:
            finish-particle
            1300ms 400ms
            ease-out both;
        }

        .hadiyad-card-finish-particles span:nth-child(1) {
          left: -4%;
          top: 14%;
        }

        .hadiyad-card-finish-particles span:nth-child(2) {
          right: -4%;
          top: 22%;
          animation-delay: 520ms;
        }

        .hadiyad-card-finish-particles span:nth-child(3) {
          left: 5%;
          bottom: 10%;
          animation-delay: 640ms;
        }

        .hadiyad-card-finish-particles span:nth-child(4) {
          right: 5%;
          bottom: 9%;
          animation-delay: 760ms;
        }

        .hadiyad-actions {
          width:
            min(
              100%,
              29rem
            );
          margin: 2.1rem auto 0;
          text-align: center;
          animation:
            actions-arrive
            700ms 900ms
            ease both;
        }

        .hadiyad-moment {
          margin-bottom: 1rem;
          font-family: Georgia, serif;
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
          padding: 0.9rem 1.4rem;
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
          transform: translateY(-2px);
          box-shadow:
            0 21px 46px
            rgba(40, 83, 71, 0.28);
        }

        .hadiyad-save-hint {
          margin-top: 0.8rem;
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
            transform: scale(1);
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
            transform: scale(0.9);
            opacity: 0.65;
          }

          50% {
            transform: scale(1.25);
            opacity: 1;
          }
        }

        @keyframes gift-flap-open {
          0% {
            transform:
              rotateX(0deg);
          }

          100% {
            transform:
              rotateX(178deg);
          }
        }

        @keyframes gift-paper-rise {
          0% {
            transform:
              translateY(0);
          }

          100% {
            transform:
              translateY(-7rem);
          }
        }

        @keyframes gift-card-rise {
          0% {
            opacity: 0;
            transform:
              translate(-50%, 8rem)
              rotate(-3deg)
              scale(0.76);
          }

          65% {
            opacity: 1;
            transform:
              translate(-50%, -1.8rem)
              rotate(1.5deg)
              scale(1.03);
          }

          100% {
            opacity: 1;
            transform:
              translate(-50%, -1rem)
              rotate(0deg)
              scale(1);
          }
        }

        @keyframes gift-glow {
          0% {
            opacity: 0;
            transform:
              translate(-50%, -50%)
              scale(0.4);
          }

          100% {
            opacity: 1;
            transform:
              translate(-50%, -50%)
              scale(1.35);
          }
        }

        @keyframes climax-background {
          0% {
            opacity: 0;
          }

          22% {
            opacity: 1;
          }

          78% {
            opacity: 1;
          }

          100% {
            opacity: 0;
          }
        }

        @keyframes climax-glow {
          0% {
            opacity: 0;
            transform:
              scale(0.18);
          }

          48% {
            opacity: 1;
            transform:
              scale(1.12);
          }

          100% {
            opacity: 0;
            transform:
              scale(1.75);
          }
        }

        @keyframes climax-shine {
          0% {
            opacity: 0;
            transform:
              rotate(-18deg)
              translateX(-65%);
          }

          35% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform:
              rotate(-18deg)
              translateX(65%);
          }
        }

        @keyframes climax-symbol {
          0% {
            opacity: 0;
            transform:
              scale(0.45)
              rotate(-9deg);
          }

          46% {
            opacity: 1;
            transform:
              scale(1.12)
              rotate(2deg);
          }

          72% {
            opacity: 1;
            transform:
              scale(1)
              rotate(0deg);
          }

          100% {
            opacity: 0;
            transform:
              scale(1.28);
          }
        }

        @keyframes climax-symbol-letter {
          0% {
            transform:
              scale(0.5);
          }

          55% {
            transform:
              scale(1.16);
          }

          100% {
            transform:
              scale(1);
          }
        }

        @keyframes climax-ring {
          0% {
            opacity: 0.9;
            transform:
              scale(0.35);
          }

          100% {
            opacity: 0;
            transform:
              scale(3.2);
          }
        }

        @keyframes climax-particle {
          0% {
            opacity: 0;
            transform:
              translate(-50%, -50%)
              scale(0.3)
              rotate(0deg);
          }

          30% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform:
              translate(
                calc(
                  -50% +
                  var(--particle-x)
                ),
                calc(
                  -50% +
                  var(--particle-y)
                )
              )
              scale(1.55)
              rotate(135deg);
          }
        }

        @keyframes result-arrive {
          0% {
            opacity: 0;
            transform:
              translateY(38px);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0);
          }
        }

        @keyframes heading-arrive {
          0% {
            opacity: 0;
            transform:
              translateY(-16px);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0);
          }
        }

        @keyframes card-grand-arrival {
          0% {
            opacity: 0;
            transform:
              translateY(90px)
              scale(0.68)
              rotate(-4deg);
            filter: blur(12px);
          }

          45% {
            opacity: 1;
            transform:
              translateY(-12px)
              scale(1.04)
              rotate(1deg);
            filter: blur(0);
          }

          72% {
            transform:
              translateY(4px)
              scale(0.992)
              rotate(-0.25deg);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              scale(1)
              rotate(0deg);
            filter: blur(0);
          }
        }

        @keyframes final-card-glow {
          0% {
            opacity: 0;
            transform:
              scale(0.45);
          }

          45% {
            opacity: 1;
            transform:
              scale(1.25);
          }

          100% {
            opacity: 0.7;
            transform:
              scale(1);
          }
        }

        @keyframes final-card-rays {
          0% {
            opacity: 0;
            transform:
              translate(-50%, -50%)
              rotate(0deg)
              scale(0.4);
          }

          45% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform:
              translate(-50%, -50%)
              rotate(22deg)
              scale(1.15);
          }
        }

        @keyframes finish-particle {
          0% {
            opacity: 0;
            transform:
              translateY(20px)
              scale(0.4)
              rotate(0deg);
          }

          40% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform:
              translateY(-35px)
              scale(1.4)
              rotate(90deg);
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

          .gift-scene {
            top: 58%;
          }

          .hadiyad-result {
            padding-top: 0.8rem;
          }

          .hadiyad-card-frame {
            margin-top: 1.35rem;
            border-radius: 1.5rem;
            padding: 0.35rem;
          }

          .hadiyad-card-image {
            border-radius: 1.2rem;
          }

          .hadiyad-actions {
            margin-top: 1.6rem;
          }

          .hadiyad-climax-symbol {
            width: 6rem;
            height: 6rem;
            font-size: 2.5rem;
          }

          .hadiyad-climax-particles {
            transform: scale(0.78);
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
        }
      `}</style>
    </main>
  );
}