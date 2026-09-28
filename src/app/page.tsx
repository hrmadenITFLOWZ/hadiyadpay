'use client';

import { useState, useEffect, Suspense } from 'react';
import CardBuilder from './components/CardBuilder';
import ReceivedCardModal from './components/ReceivedCardModal';

type Language = 'so' | 'en';

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const content = {
    so: {
      title: 'HadiyadPay | Salaamo Dijitaal ah & Kaarka E-Card',
      subtitle: 'Abuur oo u dir salaamo dijitaal ah oo shaqsi ah oo loogu talagalay kuwa aad jeceshahay.',
      desc: 'Abuur oo u dir salaamo dijitaal ah oo shaqsi ah oo loogu talagalay kuwa aad jeceshahay.'
    },
    en: {
      title: 'HadiyadPay | Personalized Digital Greetings & E-Cards',
      subtitle: 'Create and send thoughtful, customized digital greeting cards to your loved ones.',
      desc: 'Create and send thoughtful, customized digital greeting cards to your loved ones.'
    }
  };

  // Dynamisch de paginatitel en meta-beschrijving aanpassen aan de gekozen taal
  useEffect(() => {
    document.title = content[currentLanguage].title;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', content[currentLanguage].desc);
    }
  }, [currentLanguage]);

  return (
    <main className="min-h-screen text-gray-900 selection:bg-emerald-500 selection:text-white pb-16 relative overflow-x-hidden">
      
      {/* Ontvanger Kaart Modal ingepakt in Suspense */}
      <Suspense fallback={null}>
        <ReceivedCardModal currentLanguage={currentLanguage} />
      </Suspense>

      {/* Taalselectie knoppen in de rechterbovenhoek */}
      <div className="absolute top-6 right-6 z-20">
        <div className="flex bg-black/10 backdrop-blur-md p-1 rounded-xl text-xs font-bold border border-black/10 shadow-sm">
          <button
            onClick={() => setCurrentLanguage('so')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              currentLanguage === 'so'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-gray-700 hover:text-black'
            }`}
          >
            SO
          </button>
          <button
            onClick={() => setCurrentLanguage('en')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              currentLanguage === 'en'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-gray-700 hover:text-black'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Gecentreerde Header bovenaan met Logo */}
      <header className="max-w-4xl mx-auto px-4 pt-10 pb-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <img 
            src="/images/og-cover.jpg" 
            alt="HadiyadPay Logo" 
            className="w-12 h-12 rounded-full object-cover shadow-md border border-gray-300"
            onError={(e) => {
              // Fallback als de browser 'og-cover.jpg' niet direct kan laden
              console.error("Logo kon niet worden geladen op het opgegeven pad.");
            }}
          />
          <h1 className="text-2xl font-black tracking-wider text-gray-900">
            HadiyadPay
          </h1>
        </div>
        <p className="text-xs text-gray-600 font-medium max-w-sm mx-auto mt-2">
          {content[currentLanguage].subtitle}
        </p>
      </header>

      {/* Hoofdsectie */}
      <div className="mt-2">
        <CardBuilder currentLanguage={currentLanguage} />
      </div>
    </main>
  );
}