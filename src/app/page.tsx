'use client';

import { useState, useEffect, Suspense } from 'react';
import CardBuilder from './components/CardBuilder';
import ReceivedCardModal from './components/ReceivedCardModal';

type Language = 'so' | 'en' | 'nl';

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('so');

  const content = {
    so: {
      title: 'HadiyadPay | E-Cards & Xawilaad Dhaqameed',
      banner: '✨ Ku soo dhowow HadiyadPay • Xarunta E-Cards & Hadiyadaha Dhaqanka',
      heading: 'Salaamo Dijitaal ah & Waayo-aragnimo',
      desc: 'Abuur oo u dir salaamo dijitaal ah oo qiimo leh, oo ay ku lammaan tahay xawilaad degdeg ah.'
    },
    en: {
      title: 'HadiyadPay | Cultural E-Cards & Instant Remittance',
      banner: '✨ Welcome to HadiyadPay • Heritage E-Cards & Celebration Hub',
      heading: 'Digital Greetings & Cultural Experiences',
      desc: 'Create and send thoughtful digital greeting cards seamlessly integrated with instant remittance.'
    },
    nl: {
      title: 'HadiyadPay | Culturele E-Cards & Overboeking',
      banner: '✨ Welkom bij HadiyadPay • Culturele E-Cards & Vieringen Platform',
      heading: 'Digitale Groeten & Culturele Ervaring',
      desc: 'Creëer doordachte digitale wenskaarten gecombineerd met directe overboekingen.'
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
    <main 
      className="min-h-screen text-stone-800 selection:bg-amber-400 selection:text-stone-900 pb-20 relative overflow-x-hidden"
      style={{
        backgroundColor: '#faf8f5',
        backgroundImage: 'radial-gradient(circle at 50% 0%, #fffbf5 0%, #f7f3ed 60%, #eee8df 100%)',
        backgroundAttachment: 'fixed'
      }}
    >
      
      <Suspense fallback={null}>
        <ReceivedCardModal currentLanguage={currentLanguage} />
      </Suspense>

      {/* Frisse, vrolijke topbalk in warme zand- en goudtinten */}
      <div className="w-full bg-[#f3efe6] border-b border-stone-200 text-xs py-2.5 px-4 text-center text-stone-600 font-medium tracking-wide shadow-xs">
        {content[currentLanguage].banner}
      </div>

      <header className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200/80 mb-8">
        <div className="flex items-center gap-3.5">
          <img 
            src="/images/logo.jpg" 
            alt="HadiyadPay Logo" 
            className="w-12 h-12 rounded-2xl object-cover shadow-md border border-amber-300 bg-white"
          />
          <div>
            <h1 className="text-2xl font-black tracking-tight text-stone-900">
              Hadiyad<span className="text-amber-600">Pay</span>
            </h1>
            <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">Modern Cultural E-Cards</p>
          </div>
        </div>

        {/* Vrolijke, moderne taalwisselaar */}
        <div className="flex bg-white p-1 rounded-xl text-xs font-bold border border-stone-200 shadow-sm">
          {(['so', 'en', 'nl'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setCurrentLanguage(lang)}
              className={`px-3.5 py-1.5 rounded-lg transition-all uppercase ${
                currentLanguage === lang
                  ? 'bg-amber-500 text-white font-black shadow-sm'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </header>

      <div className="w-full">
        <CardBuilder currentLanguage={currentLanguage} />
      </div>
    </main>
  );
}