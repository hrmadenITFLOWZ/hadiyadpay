"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

import type { CardLanguage, CardOption } from "../../lib/card-types";

import {
  PHOTO_FRAME_SIZES,
  type EditorPosition,
  type EditorSideState,
  type EditorStickerChanges,
  type EditorTextLayer,
} from "../../lib/card-editor";

import CardArtworkLayer from "./CardArtworkLayer";
import CardComposition from "./CardComposition";

type SelectedEditorLayer = "photo" | "text" | "sticker";

interface OpenCardPreviewProps {
  card: CardOption;
  language: CardLanguage;
  inside: EditorSideState;
  isOpen: boolean;
  interactive?: boolean;
  showEditGuides?: boolean;
  activeTextLayer?: EditorTextLayer;
  selectedLayer?: SelectedEditorLayer;
  selectedStickerId?: string | null;

  onOpen?: () => void;

  onClose?: () => void;

  onRequestPhoto?: () => void;

  onTextSelect?: (layer: EditorTextLayer) => void;

  onTextPositionChange?: (
    layer: EditorTextLayer,
    position: EditorPosition,
    recordHistory: boolean,
  ) => void;

  onPhotoSelect?: () => void;

  onPhotoPositionChange?: (
    position: EditorPosition,
    recordHistory: boolean,
  ) => void;

  onStickerSelect?: (stickerId: string) => void;

  onStickerChange?: (
    stickerId: string,
    changes: EditorStickerChanges,
    recordHistory: boolean,
  ) => void;

  onStickerRemove?: (stickerId: string) => void;
}

interface PhotoDragState {
  pointerId: number;

  startClientX: number;
  startClientY: number;

  startPhotoX: number;
  startPhotoY: number;

  currentPhotoX: number;
  currentPhotoY: number;

  moved: boolean;
}

const REVEAL_AUDIO_PATH = "/audio/wedding-henna-reveal.m4a";

const REVEAL_AUDIO_VOLUME = 0.35;

const REVEAL_FADE_START_MS = 5600;

const REVEAL_STOP_MS = 6200;

const REVEAL_EFFECT_DURATION_MS = 3200;

const revealParticles = [
  {
    left: "3%",
    top: "78%",
    size: 14,
    delay: 0,
    color: "#a8754f",
  },
  {
    left: "8%",
    top: "62%",
    size: 9,
    delay: 120,
    color: "#8a4d55",
  },
  {
    left: "14%",
    top: "85%",
    size: 11,
    delay: 210,
    color: "#c4a36a",
  },
  {
    left: "20%",
    top: "70%",
    size: 7,
    delay: 330,
    color: "#6f7a64",
  },
  {
    left: "27%",
    top: "90%",
    size: 10,
    delay: 160,
    color: "#9b644d",
  },
  {
    left: "73%",
    top: "88%",
    size: 10,
    delay: 140,
    color: "#9b644d",
  },
  {
    left: "80%",
    top: "70%",
    size: 7,
    delay: 300,
    color: "#6f7a64",
  },
  {
    left: "86%",
    top: "84%",
    size: 11,
    delay: 220,
    color: "#c4a36a",
  },
  {
    left: "92%",
    top: "61%",
    size: 9,
    delay: 110,
    color: "#8a4d55",
  },
  {
    left: "97%",
    top: "77%",
    size: 14,
    delay: 20,
    color: "#a8754f",
  },
] as const;

export default function OpenCardPreview({
  card,
  language,
  inside,
  isOpen,
  interactive = false,
  showEditGuides = false,
  activeTextLayer = "message",
  selectedLayer = "text",
  selectedStickerId = null,
  onOpen,
  onClose,
  onRequestPhoto,
  onTextSelect,
  onTextPositionChange,
  onPhotoSelect,
  onPhotoPositionChange,
  onStickerSelect,
  onStickerChange,
  onStickerRemove,
}: OpenCardPreviewProps) {
  const photoDragRef = useRef<PhotoDragState | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fadeTimerRef = useRef<number | null>(null);

  const stopTimerRef = useRef<number | null>(null);

  const effectTimerRef = useRef<number | null>(null);

  const effectRemoveTimerRef = useRef<number | null>(null);

  const fadeIntervalRef = useRef<number | null>(null);

  const [revealEffectActive, setRevealEffectActive] = useState(false);

  const [revealEffectVisible, setRevealEffectVisible] = useState(false);

  const text = {
    so: {
      open: "Fur kaarka",

      close: "Xir kaarka",

      insideLeft: "Sawirka gudaha",

      photo: "Ku dar sawir",

      addPhoto: "Guji halkan si aad sawir ugu darto Hadiyaddaada.",

      choosePhoto: "Dooro sawir",

      movePhoto: "Jiido sawirka si aad u hagaajiso qaybta muuqata",
    },

    en: {
      open: "Open card",

      close: "Close card",

      insideLeft: "Inside photo",

      photo: "Add a photo",

      addPhoto: "Click here to add a personal photo to your Hadiyad.",

      choosePhoto: "Choose a photo",

      movePhoto: "Drag the photo to adjust the visible area",
    },

    nl: {
      open: "Open kaart",

      close: "Sluit kaart",

      insideLeft: "Foto binnenin",

      photo: "Voeg een foto toe",

      addPhoto:
        "Klik hier om een persoonlijke foto aan je Hadiyad toe te voegen.",

      choosePhoto: "Kies een foto",

      movePhoto: "Sleep de foto om het zichtbare gedeelte aan te passen",
    },
  }[language];

  const isWeddingHennaCard =
    card.occasion === "wedding" || card.occasion === "henna";

  const coverAspectRatio = card.orientation === "portrait" ? "2 / 3" : "4 / 3";

  const photo = inside.photo;

  const hasUsablePhoto = Boolean(photo?.src && !photo.requiresReselection);

  const framePercent = photo
    ? PHOTO_FRAME_SIZES[photo.frameSize]
    : PHOTO_FRAME_SIZES.large;

  const frameInsetPercent = (100 - framePercent) / 2;

  const clearRevealTimers = () => {
    if (fadeTimerRef.current !== null) {
      window.clearTimeout(fadeTimerRef.current);

      fadeTimerRef.current = null;
    }

    if (stopTimerRef.current !== null) {
      window.clearTimeout(stopTimerRef.current);

      stopTimerRef.current = null;
    }

    if (effectTimerRef.current !== null) {
      window.clearTimeout(effectTimerRef.current);

      effectTimerRef.current = null;
    }

    if (effectRemoveTimerRef.current !== null) {
      window.clearTimeout(effectRemoveTimerRef.current);

      effectRemoveTimerRef.current = null;
    }

    if (fadeIntervalRef.current !== null) {
      window.clearInterval(fadeIntervalRef.current);

      fadeIntervalRef.current = null;
    }
  };

  const stopRevealAudio = () => {
    clearRevealTimers();

    const audio = audioRef.current;

    if (audio) {
      audio.pause();

      audio.currentTime = 0;

      audio.volume = REVEAL_AUDIO_VOLUME;
    }

    setRevealEffectActive(false);

    setRevealEffectVisible(false);
  };

  const scheduleRevealAudioStop = () => {
    if (fadeTimerRef.current !== null) {
      window.clearTimeout(fadeTimerRef.current);
    }

    if (stopTimerRef.current !== null) {
      window.clearTimeout(stopTimerRef.current);
    }

    if (fadeIntervalRef.current !== null) {
      window.clearInterval(fadeIntervalRef.current);

      fadeIntervalRef.current = null;
    }

    fadeTimerRef.current = window.setTimeout(() => {
      const fadeDuration = REVEAL_STOP_MS - REVEAL_FADE_START_MS;

      const fadeStepMs = 50;

      const totalSteps = Math.max(1, Math.ceil(fadeDuration / fadeStepMs));

      let currentStep = 0;

      fadeIntervalRef.current = window.setInterval(() => {
        currentStep += 1;

        const progress = Math.min(1, currentStep / totalSteps);

        if (audioRef.current) {
          audioRef.current.volume = Math.max(
            0,
            REVEAL_AUDIO_VOLUME * (1 - progress),
          );
        }

        if (progress >= 1 && fadeIntervalRef.current !== null) {
          window.clearInterval(fadeIntervalRef.current);

          fadeIntervalRef.current = null;
        }
      }, fadeStepMs);
    }, REVEAL_FADE_START_MS);

    stopTimerRef.current = window.setTimeout(() => {
      const currentAudio = audioRef.current;

      if (currentAudio) {
        currentAudio.pause();

        currentAudio.currentTime = 0;

        currentAudio.volume = REVEAL_AUDIO_VOLUME;
      }

      if (fadeIntervalRef.current !== null) {
        window.clearInterval(fadeIntervalRef.current);

        fadeIntervalRef.current = null;
      }
    }, REVEAL_STOP_MS);
  };

  const startRevealAudio = () => {
    if (!isWeddingHennaCard) {
      return;
    }

    let audio = audioRef.current;

    if (!audio) {
      audio = new Audio(REVEAL_AUDIO_PATH);

      audio.preload = "auto";

      audioRef.current = audio;
    }

    audio.pause();

    audio.currentTime = 0;

    audio.volume = REVEAL_AUDIO_VOLUME;

    const playback = audio.play();

    scheduleRevealAudioStop();

    if (playback && typeof playback.catch === "function") {
      void playback.catch(() => {
        if (fadeTimerRef.current !== null) {
          window.clearTimeout(fadeTimerRef.current);

          fadeTimerRef.current = null;
        }

        if (stopTimerRef.current !== null) {
          window.clearTimeout(stopTimerRef.current);

          stopTimerRef.current = null;
        }
      });
    }
  };

  const startRevealEffect = () => {
    if (!isWeddingHennaCard) {
      return;
    }

    if (effectTimerRef.current !== null) {
      window.clearTimeout(effectTimerRef.current);
    }

    if (effectRemoveTimerRef.current !== null) {
      window.clearTimeout(effectRemoveTimerRef.current);
    }

    setRevealEffectVisible(true);

    setRevealEffectActive(false);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setRevealEffectActive(true);
      });
    });

    effectTimerRef.current = window.setTimeout(() => {
      setRevealEffectActive(false);

      effectRemoveTimerRef.current = window.setTimeout(() => {
        setRevealEffectVisible(false);
      }, 700);
    }, REVEAL_EFFECT_DURATION_MS);
  };

  const handleOpen = () => {
    if (isWeddingHennaCard) {
      startRevealAudio();

      startRevealEffect();
    }

    onOpen?.();
  };

  const handleClose = () => {
    stopRevealAudio();

    onClose?.();
  };

  useEffect(() => {
    if (!isWeddingHennaCard || typeof Audio === "undefined") {
      return;
    }

    const audio = new Audio(REVEAL_AUDIO_PATH);

    audio.preload = "auto";

    audio.volume = REVEAL_AUDIO_VOLUME;

    audio.load();

    audioRef.current = audio;

    return () => {
      clearRevealTimers();

      audio.pause();

      audio.removeAttribute("src");

      audio.load();

      audioRef.current = null;
    };
  }, [isWeddingHennaCard]);

  useEffect(() => {
    if (!isOpen) {
      stopRevealAudio();
    }
  }, [isOpen]);

  const clampPercentage = (value: number): number =>
    Math.min(100, Math.max(0, value));

  const handlePhotoPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (
      !interactive ||
      !photo ||
      photo.requiresReselection ||
      !onPhotoPositionChange
    ) {
      return;
    }

    event.preventDefault();

    onPhotoSelect?.();

    event.currentTarget.setPointerCapture(event.pointerId);

    photoDragRef.current = {
      pointerId: event.pointerId,

      startClientX: event.clientX,

      startClientY: event.clientY,

      startPhotoX: photo.x,

      startPhotoY: photo.y,

      currentPhotoX: photo.x,

      currentPhotoY: photo.y,

      moved: false,
    };
  };

  const handlePhotoPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = photoDragRef.current;

    if (!drag || drag.pointerId !== event.pointerId || !onPhotoPositionChange) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();

    if (bounds.width <= 0 || bounds.height <= 0) {
      return;
    }

    event.preventDefault();

    const deltaX = ((event.clientX - drag.startClientX) / bounds.width) * 100;

    const deltaY = ((event.clientY - drag.startClientY) / bounds.height) * 100;

    const nextX = clampPercentage(drag.startPhotoX - deltaX);

    const nextY = clampPercentage(drag.startPhotoY - deltaY);

    drag.currentPhotoX = nextX;

    drag.currentPhotoY = nextY;

    if (
      Math.abs(event.clientX - drag.startClientX) > 2 ||
      Math.abs(event.clientY - drag.startClientY) > 2
    ) {
      drag.moved = true;
    }

    onPhotoPositionChange(
      {
        x: nextX,

        y: nextY,
      },
      false,
    );
  };

  const finishPhotoDrag = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = photoDragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (drag.moved && onPhotoPositionChange) {
      onPhotoPositionChange(
        {
          x: drag.currentPhotoX,

          y: drag.currentPhotoY,
        },
        true,
      );
    }

    photoDragRef.current = null;
  };

  if (!isOpen) {
    return (
      <div className="relative mx-auto w-full max-w-[34rem]">
        <button
          type="button"
          onClick={handleOpen}
          aria-label={text.open}
          className="group block w-full touch-manipulation rounded-[1.7rem] [-webkit-tap-highlight-color:transparent] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#285347]"
        >
          <div
            className="relative w-full overflow-hidden rounded-[1.7rem] border border-[#ded7cc] bg-[#f7f1e8] shadow-xl transition duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl"
            style={{
              aspectRatio: coverAspectRatio,
            }}
          >
            <CardArtworkLayer
              artwork={card.artwork}
              language={language}
              decorative={false}
              overlay={false}
              fit="contain"
              backgroundColor="#f7f1e8"
            />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden">
      {revealEffectVisible && isWeddingHennaCard && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
        >
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ${
              revealEffectActive ? "opacity-100" : "opacity-0"
            }`}
            style={{
              background:
                "radial-gradient(circle at 50% 48%, rgba(181,139,79,0.24), rgba(118,61,66,0.10) 36%, transparent 68%)",
            }}
          />

          <div
            className={`absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c7a368]/30 transition-all duration-[1800ms] ease-out ${
              revealEffectActive ? "scale-150 opacity-0" : "scale-75 opacity-70"
            }`}
          />

          <div
            className={`absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#884e57]/25 transition-all delay-150 duration-[1900ms] ease-out ${
              revealEffectActive
                ? "scale-[1.8] opacity-0"
                : "scale-50 opacity-60"
            }`}
          />

          <div
            className={`absolute -bottom-24 -left-20 hidden h-72 w-72 rounded-full opacity-0 blur-3xl transition-all duration-[2200ms] md:block ${
              revealEffectActive
                ? "translate-x-24 -translate-y-32 scale-125 opacity-30"
                : ""
            }`}
            style={{
              background:
                "radial-gradient(circle, rgba(137,75,82,0.72), transparent 68%)",
            }}
          />

          <div
            className={`absolute -bottom-24 -right-20 hidden h-72 w-72 rounded-full opacity-0 blur-3xl transition-all duration-[2200ms] md:block ${
              revealEffectActive
                ? "-translate-x-24 -translate-y-32 scale-125 opacity-30"
                : ""
            }`}
            style={{
              background:
                "radial-gradient(circle, rgba(187,143,78,0.68), transparent 68%)",
            }}
          />

          {revealParticles.map((particle, index) => (
            <span
              key={`${particle.left}-${particle.top}-${index}`}
              className={`absolute rounded-full transition-all duration-[1800ms] ease-out md:shadow-[0_0_14px_rgba(184,140,84,0.38)] ${
                revealEffectActive
                  ? "-translate-y-48 scale-0 opacity-0"
                  : "translate-y-0 scale-100 opacity-70"
              }`}
              style={{
                left: particle.left,

                top: particle.top,

                width: `${particle.size}px`,

                height: `${particle.size}px`,

                backgroundColor: particle.color,

                transitionDelay: `${particle.delay}ms`,
              }}
            />
          ))}
        </div>
      )}

      <div
        className={`relative z-0 mx-auto flex h-full max-h-full w-full max-w-5xl snap-x snap-mandatory items-center overflow-x-auto overflow-y-hidden border bg-[#fffdf9] shadow-[0_20px_55px_rgba(38,42,39,0.18)] transition-shadow duration-700 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:aspect-[4/3] md:h-auto md:grid-cols-2 md:items-stretch md:overflow-hidden ${
          revealEffectActive && isWeddingHennaCard
            ? "border-[#c7a368] shadow-[0_32px_90px_rgba(111,63,59,0.32)]"
            : "border-[#d9d0c2]"
        }`}
      >
        <section
          aria-label={text.insideLeft}
          className="relative h-full min-h-0 w-full min-w-full shrink-0 snap-center overflow-hidden border-r border-[#ded5c8] bg-[#fffdf9] md:h-full md:w-full md:min-w-0 md:shrink"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(145deg, #fffdf9 0%, #fffaf0 55%, #f8f2e8 100%)",
            }}
          />

          {hasUsablePhoto && photo?.src ? (
            <button
              type="button"
              disabled={!interactive}
              data-editor-layer="photo"
              aria-label={text.movePhoto}
              aria-pressed={interactive && selectedLayer === "photo"}
              tabIndex={interactive && showEditGuides ? 0 : -1}
              onFocus={onPhotoSelect}
              onClick={onPhotoSelect}
              onPointerDown={handlePhotoPointerDown}
              onPointerMove={handlePhotoPointerMove}
              onPointerUp={finishPhotoDrag}
              onPointerCancel={finishPhotoDrag}
              className={`absolute overflow-hidden bg-[#eee5d8] transition-[inset,box-shadow] duration-300 ${
                interactive
                  ? "touch-none cursor-grab active:cursor-grabbing"
                  : "cursor-default"
              } ${
                interactive && selectedLayer === "photo" && showEditGuides
                  ? "ring-2 ring-[#285347] ring-offset-2 ring-offset-[#fffaf0]"
                  : ""
              } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]`}
              style={{
                inset: `${frameInsetPercent}%`,
              }}
            >
              <img
                src={photo.src}
                alt=""
                draggable={false}
                className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
                style={{
                  objectPosition: `${photo.x}% ${photo.y}%`,

                  transform: `scale(${Math.max(
                    1,
                    photo.scale,
                  )}) rotate(${photo.rotation}deg)`,

                  transformOrigin: `${photo.x}% ${photo.y}%`,
                }}
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5"
              />

              {interactive && showEditGuides && (
                <>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 border border-dashed border-white/80"
                  />

                  <div className="pointer-events-none absolute inset-x-4 bottom-4 flex justify-center">
                    <span className="rounded-full border border-white/60 bg-black/45 px-3 py-1.5 text-[10px] font-semibold text-white shadow-sm backdrop-blur-sm">
                      {text.movePhoto}
                    </span>
                  </div>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onRequestPhoto}
              className="absolute inset-0 cursor-pointer bg-transparent transition hover:bg-[#285347]/[0.025] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#285347]"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[5%] rounded-[1rem] border border-[#ddc79f]/60"
              />

              <div className="hidden">
                <div
                  aria-hidden="true"
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#d8bd8d] bg-white/80 font-serif text-2xl text-[#9a7441] shadow-sm transition group-hover:scale-105 group-hover:shadow-md"
                >
                  â™¡
                </div>

                <p className="mt-5 font-serif text-lg text-[#594b3f]">
                  {text.photo}
                </p>

                <p className="mx-auto mt-2 max-w-[15rem] text-xs leading-5 text-[#8a7765]">
                  {text.addPhoto}
                </p>

                <span className="mt-4 inline-flex min-h-9 items-center justify-center rounded-full bg-white/85 px-4 text-xs font-semibold text-[#285347] shadow-sm transition group-hover:bg-white">
                  <span aria-hidden="true" className="mr-1.5">
                    +
                  </span>

                  {text.choosePhoto}
                </span>
              </div>
            </button>
          )}
        </section>

        <section className="relative h-full min-h-0 w-full min-w-full shrink-0 snap-center overflow-hidden bg-[#fffdf9] md:h-full md:w-full md:min-w-0 md:shrink">
          <CardComposition
            card={card}
            language={language}
            cardSide="inside"
            side={{
              ...inside,

              photo: null,

              stickers: inside.stickers ?? [],
            }}
            interactive={interactive}
            showEditGuides={showEditGuides}
            activeTextLayer={activeTextLayer}
            selectedLayer={selectedLayer}
            selectedStickerId={selectedStickerId}
            onTextSelect={onTextSelect}
            onTextPositionChange={onTextPositionChange}
            onStickerSelect={onStickerSelect}
            onStickerChange={onStickerChange}
            onStickerRemove={onStickerRemove}
          />
        </section>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-30 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-black/15 to-transparent shadow-[0_0_10px_rgba(0,0,0,0.14)]"
        />
      </div>
    </div>
  );
}
