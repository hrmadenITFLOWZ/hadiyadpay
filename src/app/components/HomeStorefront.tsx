'use client';

import Link from 'next/link';

import AnimatedCardShowcase from './AnimatedCardShowcase';
import EditorialSections from './EditorialSections';
import StorefrontHero from './StorefrontHero';
import { useStorefrontLanguage } from './StorefrontShell';

const copy = {
  nl: {
    occasionEyebrow: 'VIND JOUW MOMENT',
    occasionTitle: 'Waar wil je een kaart voor sturen?',
    occasionDescription:
      'Begin bij het moment. Ontdek daarna een kaart die past bij de persoon, stijl en boodschap.',

    wedding: 'Bruiloft',
    weddingCardDescription: 'Aroos, Nikah en felicitaties',

    birthday: 'Verjaardag',
    birthdayDescription: 'Een persoonlijke verjaardagsgroet',

    henna: 'Henna',
    hennaDescription: 'Voor een bijzondere henna-avond',

    eid: 'Eid',
    eidDescription: 'Warme wensen voor Eid',

    graduation: 'Afstuderen',
    graduationDescription: 'Vier een nieuwe mijlpaal',

    blessings: 'Zegeningen',
    blessingsDescription: 'Een warme wens voor dierbaren',

    weddingEyebrow: 'BRUILOFT IN DE SPOTLIGHT',
    weddingTitle: 'Voor meer dan alleen de trouwdag.',
    weddingSpotlightDescription:
      'Een bruiloft bestaat uit meerdere bijzondere momenten. HadiyadPay bouwt daarom een collectie voor de hele reis, van de eerste aankondiging tot een persoonlijke felicitatie.',

    saveTheDate: 'Save the Date',
    invitations: 'Uitnodigingen',
    nikah: 'Nikah',
    hennaWedding: 'Henna',
    walima: 'Walima',
    congratulations: 'Felicitatie',

    weddingCta: 'Ontdek bruiloftskaarten',
    allCards: 'Bekijk alle kaarten',
    explore: 'Ontdek',
  },

  en: {
    occasionEyebrow: 'FIND YOUR MOMENT',
    occasionTitle: 'What would you like to send a card for?',
    occasionDescription:
      'Start with the moment. Then discover a card that fits the person, style and message.',

    wedding: 'Wedding',
    weddingCardDescription: 'Wedding, Nikah and congratulations',

    birthday: 'Birthday',
    birthdayDescription: 'A personal birthday greeting',

    henna: 'Henna',
    hennaDescription: 'For a special henna night',

    eid: 'Eid',
    eidDescription: 'Warm wishes for Eid',

    graduation: 'Graduation',
    graduationDescription: 'Celebrate a new milestone',

    blessings: 'Blessings',
    blessingsDescription: 'A warm wish for loved ones',

    weddingEyebrow: 'WEDDING SPOTLIGHT',
    weddingTitle: 'For more than just the wedding day.',
    weddingSpotlightDescription:
      'A wedding journey contains many meaningful moments. HadiyadPay is building a collection for the whole journey, from the first announcement to a personal congratulation.',

    saveTheDate: 'Save the Date',
    invitations: 'Invitations',
    nikah: 'Nikah',
    hennaWedding: 'Henna',
    walima: 'Walima',
    congratulations: 'Congratulations',

    weddingCta: 'Explore wedding cards',
    allCards: 'View all cards',
    explore: 'Explore',
  },

  so: {
    occasionEyebrow: 'DOORO MUNAASABADDA',
    occasionTitle: 'Maxaad kaar u diraysaa?',
    occasionDescription:
      'Ka bilow munaasabadda, dabadeed dooro kaar ku habboon qofka, qaabka iyo fariinta.',

    wedding: 'Aroos',
    weddingCardDescription: 'Aroos, Nikah iyo hambalyo',

    birthday: 'Dhalasho',
    birthdayDescription: 'Hambalyo dhalasho oo gaar ah',

    henna: 'Henna',
    hennaDescription: 'Habeen henna oo gaar ah',

    eid: 'Ciid',
    eidDescription: 'Hambalyo iyo duco Ciid',

    graduation: 'Qalinjabin',
    graduationDescription: 'U dabaaldeg guul cusub',

    blessings: 'Barako',
    blessingsDescription: 'Duco iyo rajo wanaagsan',

    weddingEyebrow: 'AROOSKA',
    weddingTitle: 'Wax ka badan maalinta arooska.',
    weddingSpotlightDescription:
      'Safarka aroosku wuxuu leeyahay waqtiyo badan oo gaar ah. HadiyadPay waxay dhisaysaa ururin kaarar ah oo la socda safarka oo dhan.',

    saveTheDate: 'Save the Date',
    invitations: 'Casuumad',
    nikah: 'Nikah',
    hennaWedding: 'Henna',
    walima: 'Walima',
    congratulations: 'Hambalyo',

    weddingCta: 'Eeg kaararka arooska',
    allCards: 'Eeg dhammaan kaararka',
    explore: 'Eeg',
  },
};

export default function HomeStorefront() {
  const language = useStorefrontLanguage();
  const text = copy[language];

  const occasions = [
    {
      label: text.wedding,
      description: text.weddingCardDescription,
      href: `/kaarten/huwelijk?lang=${language}`,
      symbol: '◇',
      featured: true,
    },
    {
      label: text.birthday,
      description: text.birthdayDescription,
      href: `/kaarten/verjaardag?lang=${language}`,
      symbol: '✦',
      featured: false,
    },
    {
      label: text.henna,
      description: text.hennaDescription,
      href: `/kaarten/hennafeest?lang=${language}`,
      symbol: '◌',
      featured: false,
    },
    {
      label: text.eid,
      description: text.eidDescription,
      href: `/kaarten/eid?lang=${language}`,
      symbol: '☾',
      featured: false,
    },
    {
      label: text.graduation,
      description: text.graduationDescription,
      href: `/kaarten/afstuderen?lang=${language}`,
      symbol: '✧',
      featured: false,
    },
    {
      label: text.blessings,
      description: text.blessingsDescription,
      href: `/kaarten/zegeningen?lang=${language}`,
      symbol: '○',
      featured: false,
    },
  ];

  const weddingMoments = [
    text.saveTheDate,
    text.invitations,
    text.nikah,
    text.hennaWedding,
    text.walima,
    text.congratulations,
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col pb-12">
      <StorefrontHero currentLanguage={language} />

      <AnimatedCardShowcase />

      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#7f6b62]">
              {text.occasionEyebrow}
            </p>

            <h2 className="mt-3 font-serif text-4xl leading-tight text-[#263e36] sm:text-5xl">
              {text.occasionTitle}
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6c7771] sm:text-base">
              {text.occasionDescription}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {occasions.map((occasion) => (
              <Link
                key={occasion.href}
                href={occasion.href}
                className={`group flex min-h-[145px] items-start gap-4 rounded-[1.5rem] border p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#285347] ${
                  occasion.featured
                    ? 'border-[#285347] bg-[#e6eee9]'
                    : 'border-[#ddd9cf] bg-[#fffdf9] hover:border-[#aebdb5]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1e7d8] text-xl text-[#9a704b]"
                >
                  {occasion.symbol}
                </span>

                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-serif text-xl text-[#29443a]">
                    {occasion.label}
                  </span>

                  <span className="mt-1 text-sm leading-6 text-[#798079]">
                    {occasion.description}
                  </span>

                  <span className="mt-auto pt-4 text-xs font-bold uppercase tracking-[0.14em] text-[#285347]">
                    {text.explore} →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-5 overflow-hidden rounded-[2rem] bg-[#1f4037] text-white sm:mx-8 lg:mx-12">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-14 lg:py-20">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#e4c99e]">
              {text.weddingEyebrow}
            </p>

            <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-[1.08] text-white sm:text-5xl">
              {text.weddingTitle}
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
              {text.weddingSpotlightDescription}
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {weddingMoments.map((moment) => (
                <span
                  key={moment}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-[#f7efe2]"
                >
                  {moment}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={`/kaarten/huwelijk?lang=${language}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f3e4ca] px-5 py-2.5 text-sm font-bold text-[#29443a] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
              >
                {text.weddingCta}
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                href={`/kaarten?lang=${language}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
              >
                {text.allCards}
              </Link>
            </div>
          </div>

          <div
            className="relative min-h-[330px]"
            aria-hidden="true"
          >
            <div className="absolute left-[7%] top-[12%] h-[240px] w-[170px] rotate-[-6deg] rounded-[1.6rem] border border-white/15 bg-[#c58c70] shadow-2xl sm:h-[280px] sm:w-[195px]" />

            <div className="absolute right-[8%] top-0 h-[250px] w-[180px] rotate-[6deg] rounded-[1.6rem] border border-white/15 bg-[#ead9bc] shadow-2xl sm:h-[300px] sm:w-[210px]" />

            <div className="absolute bottom-0 left-1/2 h-[245px] w-[175px] -translate-x-1/2 rounded-[1.6rem] border border-white/20 bg-[#9c594f] shadow-2xl sm:h-[290px] sm:w-[205px]">
              <div className="flex h-full items-center justify-center px-6 text-center">
                <div>
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.24em] text-[#f0d8b4]">
                    HADIYADPAY
                  </p>

                  <p className="mt-4 font-serif text-2xl leading-tight text-white">
                    {text.wedding}
                  </p>

                  <p className="mt-3 text-xs leading-5 text-white/70">
                    {text.nikah} · {text.hennaWedding} · {text.walima}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-12 sm:mt-16">
        <EditorialSections currentLanguage={language} />
      </div>
    </div>
  );
}