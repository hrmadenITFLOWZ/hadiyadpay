'use client';

import { useState } from 'react';
import CardBuilder from './components/CardBuilder';

type Language = 'so' | 'en';

export default function Home() {
  // SO ingesteld als standaardtaal
  const [currentLanguage, setCurrentLanguage] = useState<Language>('so');

  const subtitles = {
    so: 'Dir salaamo dhijitaal ah oo shaqsi ah oo ay ku lammaan yihiin xawilaado lacagideed oo toos ah kuwa aad jeceshahay.',
    en: 'Send personal digital greetings combined with direct financial transfers to loved ones.',
  };

  return (
    <main className="min-h-screen text-gray-900 selection:bg-emerald-500 selection:text-white pb-16 relative overflow-x-hidden">
      {/* Taalselectie knoppen in de rechterbovenhoek (SO als eerste, dan EN) */}
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

      {/* Gecentreerde Header bovenaan */}
      <header className="max-w-4xl mx-auto px-4 pt-10 pb-6 text-center">
        <h1 className="text-2xl font-black tracking-wider text-gray-900 inline-block">
          HadiyadPay
        </h1>
        <p className="text-xs text-gray-600 font-medium max-w-sm mx-auto mt-1">
          {subtitles[currentLanguage]}
        </p>
      </header>

      {/* Hoofdsectie */}
      <div className="mt-2">
        <CardBuilder currentLanguage={currentLanguage} />
      </div>
    </main>
  );
}