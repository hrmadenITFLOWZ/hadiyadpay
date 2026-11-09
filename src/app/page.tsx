'use client';

import { useState, useEffect, Suspense } from 'react';
import CardBuilder from './components/CardBuilder';
import ReceivedCardModal from './components/ReceivedCardModal';

type Language = 'so' | 'en' | 'nl';

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('so');

  const content = {
    so: {
      title: 'HadiyadPay | Salaamo Dijitaal ah & Waayo-aragnimo',
      subtitle: 'Abuur oo u dir salaamo dijitaal ah oo qiimo leh, kuwo hiddaha iyo casriga ah oo loogu talagalay kuwa aad jeceshahay.',
      badge: '✨ Hiddaha & Casriga • Dhaqanka Soomaaliyeed',
      desc: 'Abuur oo u dir salaamo dijitaal ah oo shaqsi ah oo loogu talagalay kuwa aad jeceshahay.'
    },
    en: {
      title: 'HadiyadPay | Digital Greetings & Cultural Experiences',
      subtitle: 'Create and send thoughtful, customized digital greeting cards blended with heritage and modern warmth.',
      badge: '✨ Heritage & Modern Vibe • Somali Diaspora Hub',
      desc: 'Create and send thoughtful, customized digital greeting cards to your loved ones.'
    },
    nl: {
      title: 'HadiyadPay | Digitale Groeten & Culturele Ervaring',
      subtitle: 'Creëer en verstuur doordachte, gepersonaliseerde digitale wenskaarten met een rijke culturele warmte.',
      badge: '✨ Erfgoed & Moderne Vibe • Diaspora Platform',
      desc: 'Creëer en verstuur doordachte, gepersonaliseerde digitale wenskaarten naar je geliefden.'
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang') as Language;
    if (langParam === 'so' || langParam === 'en' || langParam === 'nl') {
      setCurrentLanguage(langParam);
    }
  }, []);

  useEffect(() => {
    document.title = content[currentLanguage].title;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', content[currentLanguage].desc);
    }
  }, [currentLanguage]);

  return (
    <main className="min-h-screen text-gray-900 selection:bg-emerald-600 selection:text-white pb-20 relative overflow-x-hidden">
      
      <Suspense fallback={null}>
        <ReceivedCardModal currentLanguage={currentLanguage} />
      </Suspense>

      {/* Language Switcher & Navigation Header */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <div className="flex bg-white/60 backdrop-blur-md p-1 rounded-2xl text-xs font-bold border border-white/40 shadow-lg shadow-black/5">
          {(['so', 'en', 'nl'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setCurrentLanguage(lang)}
              className={`px-3 py-1.5 rounded-xl transition-all duration-300 cursor-pointer uppercase ${
                currentLanguage === lang
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/20 scale-105'
                  : 'text-gray-600 hover:text-black hover:bg-black/5'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <header className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
        <div className="inline-block mb-3 px-4 py-1 rounded-full bg-emerald-900/5 border border-emerald-900/10 text-emerald-800 text-xs font-semibold tracking-wide shadow-sm animate-pulse">
          {content[currentLanguage].badge}
        </div>
        
        <div className="flex items-center justify-center gap-3.5 group cursor-pointer">
          <img 
            src="/images/logo.jpg" 
            alt="HadiyadPay Logo" 
            className="w-14 h-14 rounded-2xl object-cover shadow-xl border-2 border-white bg-white transition-transform duration-500 group-hover:scale-105"
          />
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-gray-900 via-emerald-950 to-gray-800 bg-clip-text text-transparent">
            Hadiyad<span className="text-emerald-700">Pay</span>
          </h1>
        </div>
        
        <p className="text-sm text-gray-600 font-medium max-w-md mx-auto mt-3 leading-relaxed">
          {content[currentLanguage].subtitle}
        </p>
      </header>

      <div className="mt-2">
        <CardBuilder currentLanguage={currentLanguage} />
      </div>
    </main>
  );
}