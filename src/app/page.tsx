'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import CardBuilder from './components/CardBuilder';
import ReceivedCardModal from './components/ReceivedCardModal';

type Language = 'so' | 'en' | 'nl';

const content: Record<Language, { title: string; banner: string; desc: string; skip: string }> = {
  so: {
    title: 'HadiyadPay | Kaararka Salaanta Dijitaalka ah',
    banner: '✨ Ku soo dhowow HadiyadPay • Kaararka Salaanta Dijitaalka ah',
    desc: 'Samee oo la wadaag kaar salaaneed dijitaal ah oo loogu talagalay munaasabad gaar ah.',
    skip: 'U gudub nuxurka',
  },
  en: {
    title: 'HadiyadPay | Digital Greeting Cards',
    banner: '✨ Welcome to HadiyadPay • Digital Greeting Cards',
    desc: 'Create and share a personalized digital greeting card for a special moment.',
    skip: 'Skip to content',
  },
  nl: {
    title: 'HadiyadPay | Digitale kaarten voor bijzondere momenten',
    banner: '✨ Welkom bij HadiyadPay • Digitale kaarten voor bijzondere momenten',
    desc: 'Maak en deel een persoonlijke digitale kaart voor een bijzonder moment.',
    skip: 'Ga naar de inhoud',
  },
};

const navigation: Record<Language, { label: string; occasions: string; cards: string; top: string; language: string }> = {
  so: { label: 'Hagidda bogga', occasions: 'Munaasabadaha', cards: 'Kaararka', top: 'Bilowga bogga', language: 'Dooro luqadda' },
  en: { label: 'Main navigation', occasions: 'Occasions', cards: 'Cards', top: 'Back to top', language: 'Choose language' },
  nl: { label: 'Hoofdnavigatie', occasions: 'Gelegenheden', cards: 'Kaarten', top: 'Naar boven', language: 'Kies een taal' },
};

function isLanguage(value: string | null): value is Language {
  return value === 'so' || value === 'en' || value === 'nl';
}

function HomeContent() {
  const searchParams = useSearchParams();
  const queryLanguage = searchParams.get('lang');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const currentLanguage = selectedLanguage ?? (isLanguage(queryLanguage) ? queryLanguage : 'so');

  useEffect(() => {
    document.title = content[currentLanguage].title;
    document.documentElement.lang = currentLanguage;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', content[currentLanguage].desc);
    }
  }, [currentLanguage]);

  return (
    <>
      <ReceivedCardModal currentLanguage={currentLanguage} />
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-md bg-white px-4 py-3 text-[#243d34] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {content[currentLanguage].skip}
      </a>
      <div className="min-h-screen bg-background">

        <div role="note" className="border-b border-[#e7e2d7] bg-[#eee8dc] px-4 py-2.5 text-center text-xs font-medium tracking-wide text-[#59655d]">
          {content[currentLanguage].banner}
        </div>

        <header className="border-b border-[#e8e4dc] bg-[#fbfaf7]">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <a href="#hero" className="flex w-fit items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#285347]">
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
            </a>

            <nav aria-label={navigation[currentLanguage].label} className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
              <div className="flex items-center gap-4 text-sm font-medium text-[#59655d]">
                <a className="rounded px-1 py-2 hover:text-[#285347] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]" href="#occasions">
                  {navigation[currentLanguage].occasions}
                </a>
                <a className="rounded px-1 py-2 hover:text-[#285347] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]" href="#card-catalog">
                  {navigation[currentLanguage].cards}
                </a>
              </div>

              <div role="group" aria-label={navigation[currentLanguage].language} className="flex rounded-full border border-[#e3ded4] bg-white p-1 text-xs font-semibold shadow-sm">
                {(['so', 'en', 'nl'] as Language[]).map((lang) => (
                  <button
                    type="button"
                    key={lang}
                    aria-pressed={currentLanguage === lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`min-h-9 min-w-10 rounded-full px-3 uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#285347] ${
                      currentLanguage === lang
                        ? 'bg-[#285347] text-white'
                        : 'text-[#59655d] hover:bg-[#f1eee8]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </header>

        <main id="main-content" className="px-0 pb-12 pt-6 sm:pt-8">
          <CardBuilder currentLanguage={currentLanguage} />
        </main>

        <footer className="border-t border-[#e8e4dc] bg-[#fbfaf7]">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-6 text-sm text-[#69746c] sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <p>HadiyadPay · {content[currentLanguage].title.replace('HadiyadPay | ', '')}</p>
            <a href="#hero" className="rounded underline-offset-4 hover:text-[#285347] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]">
              {navigation[currentLanguage].top} ↑
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}