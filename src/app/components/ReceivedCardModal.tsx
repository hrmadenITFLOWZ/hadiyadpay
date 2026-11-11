'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { cardOptions } from '../data/cardOptions';
import useDialogAccessibility from '../hooks/useDialogAccessibility';
import CardArtworkLayer from './CardArtworkLayer';
import type { CardLanguage } from '../../lib/card-types';

type Language = CardLanguage;

interface ReceivedCardData {
  cardId: string;
  to: string;
  from: string;
  msg: string;
}

interface ReceivedCardModalProps {
  currentLanguage: Language;
}

const MAX_LEGACY_PAYLOAD_LENGTH = 4096;
const ALLOWED_LEGACY_KEYS = new Set(['c', 't', 'f', 'm']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function decodeCardData(encodedData: string | null): ReceivedCardData | null {
  if (!encodedData || encodedData.length === 0 || encodedData.length > MAX_LEGACY_PAYLOAD_LENGTH) return null;
  if (!/^[A-Za-z0-9_-]+$/.test(encodedData)) return null;

  try {
    const normalized = encodedData.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const json = decodeURIComponent(atob(padded));
    const parsed: unknown = JSON.parse(json);

    if (!isRecord(parsed)) return null;
    if (Object.keys(parsed).length !== ALLOWED_LEGACY_KEYS.size) return null;
    if (!Object.keys(parsed).every((key) => ALLOWED_LEGACY_KEYS.has(key))) return null;

    const card = cardOptions.find((option) => option.id === parsed.c);
    if (!card || typeof parsed.t !== 'string' || typeof parsed.f !== 'string' || typeof parsed.m !== 'string') {
      return null;
    }

    if (parsed.t.length > 80 || parsed.f.length > 80 || parsed.m.length > 800) return null;
    if (parsed.t.trim().length === 0 || parsed.f.trim().length === 0 || parsed.m.trim().length === 0) return null;

    return {
      cardId: card.id,
      to: parsed.t,
      from: parsed.f,
      msg: parsed.m,
    };
  } catch {
    return null;
  }
}

export default function ReceivedCardModal({ currentLanguage }: ReceivedCardModalProps) {
  const searchParams = useSearchParams();
  const legacyDataParam = searchParams.get('data');
  const [hashDataParam, setHashDataParam] = useState<string | null>(null);

  useEffect(() => {
    const readCardHash = () => {
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      setHashDataParam(hashParams.get('card'));
    };

    readCardHash();
    window.addEventListener('hashchange', readCardHash);
    return () => window.removeEventListener('hashchange', readCardHash);
  }, []);

  const dataParam = legacyDataParam ?? hashDataParam;
  const cardData = useMemo(() => decodeCardData(dataParam), [dataParam]);
  const langParam = searchParams.get('lang');
  const cardLang: Language =
    langParam === 'so' || langParam === 'en' || langParam === 'nl'
      ? langParam
      : currentLanguage;
  const [dismissedData, setDismissedData] = useState<string | null>(null);
  const isOpen = Boolean(cardData && dataParam && dataParam !== dismissedData);
  const handleClose = () => {
    if (!dataParam) return;
    setDismissedData(dataParam);
    const params = new URLSearchParams(window.location.search);
    params.delete('data');
    const query = params.toString();
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    hashParams.delete('card');
    const hash = hashParams.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;
    window.history.replaceState({}, document.title, nextUrl);
    setHashDataParam(null);
  };
  const dialogRef = useDialogAccessibility<HTMLElement>(isOpen, handleClose);

  if (!isOpen || !cardData || !dataParam) return null;

  const selectedCardOption = cardOptions.find((option) => option.id === cardData.cardId) ?? cardOptions[0];
  const langKey = cardLang;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="received-card-heading"
        className="bg-gray-900 border border-white/10 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label={cardLang === 'so' ? 'Xir kaarka' : 'Close card'}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center mb-6 mt-2">
          <span className="text-[10px] uppercase font-bold tracking-widest bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-full">
            {cardLang === 'so' ? '🎁 HADIYADPAY FARIIN GAAR AH' : '🎁 HADIYADPAY SPECIAL DELIVERY'}
          </span>
          <h2 id="received-card-heading" className="text-2xl font-black text-white mt-3">
            {cardLang === 'so' ? 'Waa lagusoo diray Kaar Gaar ah!' : "You've Received a Special Card!"}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {cardLang === 'so'
              ? 'Kaar salaan iyo layaab leh ayaa lagusoo hagaajiyay.'
              : 'A thoughtful greeting card and surprise have been sent to you.'}
          </p>
        </div>

        <div className="w-full p-6 rounded-2xl text-white shadow-2xl flex flex-col justify-between relative overflow-hidden min-h-[340px]">
          <CardArtworkLayer artwork={selectedCardOption.artwork} language={cardLang} />
          <div className="flex justify-between items-center z-10">
            <span className="text-[10px] tracking-widest uppercase bg-black/30 px-3 py-1 rounded-md backdrop-blur-md font-bold border border-white/20">
              HADIYADPAY • {selectedCardOption.badge[langKey] || selectedCardOption.badge.en}
            </span>
            <span className="text-base animate-bounce">✨</span>
          </div>

          <div className="my-3 z-10">
            <p className="text-[10px] uppercase tracking-wider opacity-90 mb-1 font-semibold">
              {cardLang === 'so' ? 'MAGACA QAATAHA:' : 'TO:'}
            </p>
            <h3 className="text-xl font-black tracking-wide drop-shadow-md">{cardData.to}</h3>
          </div>

          <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/20 my-2 shadow-inner z-10">
            <p className="text-sm italic font-light leading-relaxed">&ldquo;{cardData.msg}&rdquo;</p>
          </div>

          <div className="mt-4 flex justify-between items-end border-t border-white/20 pt-3 z-10">
            <div>
              <p className="text-[10px] uppercase tracking-wider opacity-90 font-semibold">
                {cardLang === 'so' ? 'MAGACA DIRAHA:' : 'FROM:'}
              </p>
              <p className="text-xs font-bold">{cardData.from}</p>
            </div>
            <span className="text-[10px] opacity-90 font-bold bg-white/20 px-2 py-0.5 rounded">
              HADIYADPAY
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="w-full mt-5 py-3.5 px-4 font-bold rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm text-white bg-gradient-to-r from-rose-600 to-orange-600 hover:brightness-110 cursor-pointer"
        >
          <span>
            🚀 {cardLang === 'so' ? 'Abuur Kaarkaaga Xiga / Adeegso HadiyadPay' : 'Explore HadiyadPay & Send Your Own'}
          </span>
        </button>
      </section>
    </div>
  );
}
