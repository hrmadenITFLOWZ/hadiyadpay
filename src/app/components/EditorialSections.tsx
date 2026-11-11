type Language = 'so' | 'en' | 'nl';

interface EditorialSectionsProps {
  currentLanguage: Language;
}

const copy = {
  so: {
    eyebrow: 'FUDUD',
    title: 'Kaarkaaga, qaabkaaga',
    steps: [
      { title: 'Dooro naqshad', description: 'Ka bilow kaar ku habboon munaasabadda.' },
      { title: 'Ku dar fariin', description: 'Ku qor magacyada iyo erayada aad rabto.' },
      { title: 'La wadaag', description: 'U dir kaarkaaga gaarka ah qofka aad jeceshahay.' },
    ],
    closingTitle: 'Erayadaada ha noqdaan hadiyadda.',
    closingText: 'Soo hel naqshad aad ka bilaabi karto fariintaada gaarka ah.',
    action: 'Baadh kaararka',
  },
  en: {
    eyebrow: 'A SIMPLE WAY TO MAKE IT PERSONAL',
    title: 'Your card, your words',
    steps: [
      { title: 'Choose a design', description: 'Start with a card that suits the occasion.' },
      { title: 'Make it yours', description: 'Add the names and message you want to share.' },
      { title: 'Share your card', description: 'Send your personalized card to someone you care about.' },
    ],
    closingTitle: 'Let your words be the gift.',
    closingText: 'Find a design and begin writing a message that feels like you.',
    action: 'Browse the cards',
  },
  nl: {
    eyebrow: 'ZO MAAK JE HET PERSOONLIJK',
    title: 'Jouw kaart, jouw woorden',
    steps: [
      { title: 'Kies een ontwerp', description: 'Begin met een kaart die bij het moment past.' },
      { title: 'Maak hem persoonlijk', description: 'Voeg de namen en boodschap toe die je wilt delen.' },
      { title: 'Deel je kaart', description: 'Deel je persoonlijke kaart met iemand die je dierbaar is.' },
    ],
    closingTitle: 'Laat jouw woorden het cadeau zijn.',
    closingText: 'Kies een ontwerp en begin aan een boodschap die bij jou past.',
    action: 'Bekijk de kaarten',
  },
} satisfies Record<Language, {
  eyebrow: string;
  title: string;
  steps: Array<{ title: string; description: string }>;
  closingTitle: string;
  closingText: string;
  action: string;
}>;

export default function EditorialSections({ currentLanguage }: EditorialSectionsProps) {
  const text = copy[currentLanguage];

  return (
    <>
      <section aria-labelledby="how-it-works-heading" className="mx-auto w-full max-w-7xl py-8 sm:py-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#718078]">{text.eyebrow}</p>
          <h2 id="how-it-works-heading" className="mt-3 font-serif text-3xl text-[#263e36] sm:text-4xl">
            {text.title}
          </h2>
        </div>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {text.steps.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-[#e8e4dc] bg-white p-6 sm:p-7">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8efe9] text-sm font-bold text-[#35594b]"
              >
                0{index + 1}
              </span>
              <h3 className="mt-5 font-serif text-2xl text-[#29443a]">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#707a72]">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="editorial-cta-heading"
        className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 rounded-[1.75rem] bg-[#294d41] px-6 py-9 text-white sm:px-10 sm:py-11 md:flex-row md:items-center"
      >
        <div className="max-w-2xl">
          <h2 id="editorial-cta-heading" className="font-serif text-3xl leading-tight sm:text-4xl">
            {text.closingTitle}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
            {text.closingText}
          </p>
        </div>
        <a
          href="#card-catalog"
          className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[#f3ead9] px-6 text-sm font-semibold text-[#294d41] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          {text.action}
        </a>
      </section>
    </>
  );
}
