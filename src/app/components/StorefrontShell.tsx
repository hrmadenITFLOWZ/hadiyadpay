'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { CardLanguage } from '../../lib/card-types';
import ReceivedCardModal from './ReceivedCardModal';

const StorefrontLanguageContext = createContext<CardLanguage>('so');

const languageNames: Record<CardLanguage, string> = {
  so: 'Somali',
  en: 'English',
  nl: 'Nederlands',
};

const navigationLabels: Record<CardLanguage, { nav: string; occasions: string; cards: string; top: string; language: string }> = {
  so: {
    nav: 'Hagidda bogga',
    occasions: 'Munaasabadaha',
    cards: 'Kaararka',
    top: 'Bilowga bogga',
    language: 'Dooro luqadda',
  },
  en: {
    nav: 'Main navigation',
    occasions: 'Occasions',
    cards: 'Cards',
    top: 'Back to top',
    language: 'Choose a language',
  },
  nl: {
    nav: 'Hoofdnavigatie',
    occasions: 'Gelegenheden',
    cards: 'Kaarten',
    top: 'Naar boven',
    language: 'Kies een taal',
  },
};

function isLanguage(value: string | null): value is CardLanguage {
  return value === 'so' || value === 'en' || value === 'nl';
}

export function useStorefrontLanguage(): CardLanguage {
  return useContext(StorefrontLanguageContext);
}

export default function StorefrontShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedLanguage = searchParams.get('lang');
  const language = isLanguage(requestedLanguage) ? requestedLanguage : 'so';
  const labels = navigationLabels[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (nextLanguage: CardLanguage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', nextLanguage);
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ''}${window.location.hash}`, { scroll: false });
  };

  return (
    <StorefrontLanguageContext.Provider value={language}>
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-md bg-white px-4 py-3 text-[#243d34] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {language === 'nl' ? 'Ga naar de inhoud' : language === 'en' ? 'Skip to content' : 'U gudub nuxurka'}
      </a>
      <div className="min-h-screen bg-background">
        <header className="border-b border-[#e8e4dc] bg-[#fbfaf7]">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <Link href={`/?lang=${language}`} className="flex w-fit items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#285347]">
              <Image
                src="/images/logo.jpg"
                alt=""
                aria-hidden="true"
                width={44}
                height={44}
                className="h-11 w-11 rounded-xl border border-[#d6c6a9] bg-white object-cover"
              />
              <span className="text-xl font-bold tracking-tight text-[#233c35]">
                Hadiyad<span className="text-[#9b7450]">Pay</span>
              </span>
            </Link>

            <nav aria-label={labels.nav} className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
              <div className="flex items-center gap-4 text-sm font-medium text-[#59655d]">
                <Link className="rounded px-1 py-2 hover:text-[#285347] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]" href={`/?lang=${language}#occasions`}>
                  {labels.occasions}
                </Link>
                <Link className="rounded px-1 py-2 hover:text-[#285347] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]" href={`/kaarten?lang=${language}`}>
                  {labels.cards}
                </Link>
              </div>

              <div role="group" aria-label={labels.language} className="flex rounded-full border border-[#e3ded4] bg-white p-1 text-xs font-semibold shadow-sm">
                {(['so', 'en', 'nl'] as const).map((nextLanguage) => (
                  <button
                    key={nextLanguage}
                    type="button"
                    aria-label={languageNames[nextLanguage]}
                    aria-pressed={language === nextLanguage}
                    onClick={() => changeLanguage(nextLanguage)}
                    className={`min-h-9 min-w-10 rounded-full px-3 uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#285347] ${
                      language === nextLanguage ? 'bg-[#285347] text-white' : 'text-[#59655d] hover:bg-[#f1eee8]'
                    }`}
                  >
                    {nextLanguage}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </header>

        <main id="main-content" className="px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:px-8">
          {children}
        </main>

        <footer className="border-t border-[#e8e4dc] bg-[#fbfaf7]">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-6 text-sm text-[#69746c] sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <p>HadiyadPay · {language === 'nl' ? 'Digitale kaarten voor bijzondere momenten' : language === 'en' ? 'Digital greeting cards' : 'Kaararka salaanta dijitaalka ah'}</p>
            <Link href={`/?lang=${language}`} className="rounded underline-offset-4 hover:text-[#285347] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">
              {labels.top} ↑
            </Link>
          </div>
        </footer>
      </div>
      <ReceivedCardModal currentLanguage={language} />
    </StorefrontLanguageContext.Provider>
  );
}
