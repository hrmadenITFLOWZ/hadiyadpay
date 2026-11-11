import { cardOptions } from '../data/cardOptions';
import CardArtworkLayer from './CardArtworkLayer';

type Language = 'so' | 'en' | 'nl';

interface StorefrontHeroProps {
  currentLanguage: Language;
}

const copy = {
  so: {
    eyebrow: 'KAARAR SALAAN OO SHAQSI AH',
    title: 'Eray yar. Xusuus weyn.',
    description: 'Dooro naqshad, qor fariin kuu gaar ah, kadibna la wadaag qof aad jeceshahay.',
    primaryAction: 'Eeg kaararka',
    secondaryAction: 'Dooro munaasabad',
    previewLabel: 'FARIIN GAAR AH',
    previewTitle: 'Dhalasho Wacan',
    previewMessage: 'Maalin farxad leh iyo sannad barako leh!',
    previewFrom: 'Adiga',
    previewAlt: 'Tusaale kaarka salaanta dijitaalka ah',
  },
  en: {
    eyebrow: 'PERSONAL DIGITAL GREETING CARDS',
    title: 'A few words. A lasting moment.',
    description: 'Choose a design, write a personal message, and share it with someone you care about.',
    primaryAction: 'Explore the cards',
    secondaryAction: 'Choose an occasion',
    previewLabel: 'A NOTE FOR YOU',
    previewTitle: 'Happy Birthday',
    previewMessage: 'Wishing you a joyful day and a year full of good things.',
    previewFrom: 'From you',
    previewAlt: 'Digital greeting card example',
  },
  nl: {
    eyebrow: 'PERSOONLIJKE DIGITALE KAARTEN',
    title: 'Een klein gebaar. Een blijvende herinnering.',
    description: 'Kies een ontwerp, schrijf een persoonlijke boodschap en deel je kaart.',
    primaryAction: 'Bekijk de kaarten',
    secondaryAction: 'Kies een gelegenheid',
    previewLabel: 'EEN PERSOONLIJK BERICHT',
    previewTitle: 'Van harte gefeliciteerd',
    previewMessage: 'Ik wens je een mooie dag en een jaar vol fijne momenten.',
    previewFrom: 'Van jou',
    previewAlt: 'Voorbeeld van een digitale wenskaart',
  },
} satisfies Record<Language, Record<string, string>>;

export default function StorefrontHero({ currentLanguage }: StorefrontHeroProps) {
  const text = copy[currentLanguage];

  return (
    <section
      id="hero"
      aria-labelledby="storefront-hero-title"
      className="mx-auto grid w-full max-w-7xl items-center gap-10 overflow-hidden rounded-[2rem] bg-[#eee8dc] px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-16 lg:py-16"
    >
      <div className="relative z-10 max-w-2xl">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#527369]">
          {text.eyebrow}
        </p>
        <h1
          id="storefront-hero-title"
          className="max-w-xl font-serif text-4xl font-medium leading-[1.08] tracking-tight text-[#233c35] sm:text-5xl lg:text-6xl"
        >
          {text.title}
        </h1>
        <p className="mt-6 max-w-lg text-base leading-7 text-[#59655d] sm:text-lg">
          {text.description}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="#card-catalog"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#285347] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#1e4238] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#285347]"
          >
            {text.primaryAction}
          </a>
          <a
            href="#occasions"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#9aa99e] px-7 text-sm font-semibold text-[#29483e] transition-colors hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#285347]"
          >
            {text.secondaryAction}
          </a>
        </div>
      </div>

      <div
        role="img"
        aria-label={text.previewAlt}
        className="relative mx-auto flex aspect-[1.08/1] w-full max-w-[31rem] items-center justify-center overflow-hidden rounded-[1.75rem] bg-[#d2bda0] p-5 sm:p-8"
      >
        <CardArtworkLayer artwork={cardOptions[0].artwork} language={currentLanguage} />
        <div aria-hidden="true" className="absolute inset-3 rounded-[1.4rem] border border-white/50" />
        <div className="relative w-full max-w-sm rounded-2xl border border-white/50 bg-[#fffdf8]/95 px-6 py-8 text-center shadow-2xl backdrop-blur-sm sm:px-9 sm:py-10">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#8b7654]">
            {text.previewLabel}
          </p>
          <p aria-hidden="true" className="my-4 text-3xl text-[#b77d57]">✳</p>
          <h2 className="font-serif text-2xl leading-tight text-[#29483e] sm:text-3xl">
            {text.previewTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-[#657168]">
            {text.previewMessage}
          </p>
          <p className="mt-7 border-t border-[#e6dfd3] pt-4 text-xs font-medium text-[#788177]">
            {text.previewFrom}
          </p>
        </div>
      </div>
    </section>
  );
}
