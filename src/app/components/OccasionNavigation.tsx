import type { CardOption } from '../data/cardOptions';

type CategoryFilter = 'all' | CardOption['category'];
type Language = 'so' | 'en' | 'nl';

interface OccasionNavigationProps {
  currentLanguage: Language;
  activeCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
}

const occasions = {
  so: [
    { id: 'all', icon: '✳', title: 'Dhammaan kaararka', description: 'Eeg naqshad kasta' },
    { id: 'celebrations', icon: '♡', title: 'Dabaaldegyo', description: 'Aroos, ciid iyo farxad' },
    { id: 'milestones', icon: '✦', title: 'Guul & dhiirigelin', description: 'Munaasabadaha nolosha' },
  ],
  en: [
    { id: 'all', icon: '✳', title: 'All cards', description: 'Browse every design' },
    { id: 'celebrations', icon: '♡', title: 'Celebrations', description: 'Weddings, Eid and more' },
    { id: 'milestones', icon: '✦', title: 'Milestones', description: 'Encouragement and success' },
  ],
  nl: [
    { id: 'all', icon: '✳', title: 'Alle kaarten', description: 'Bekijk alle ontwerpen' },
    { id: 'celebrations', icon: '♡', title: 'Feestelijke momenten', description: 'Bruiloft, Eid en meer' },
    { id: 'milestones', icon: '✦', title: 'Mijlpalen', description: 'Aanmoediging en succes' },
  ],
} satisfies Record<Language, Array<{ id: CategoryFilter; icon: string; title: string; description: string }>>;

const sectionTitles: Record<Language, { eyebrow: string; title: string }> = {
  so: { eyebrow: 'KAARKA KU HABBOON', title: 'U dooro munaasabaddaada' },
  en: { eyebrow: 'FIND THE RIGHT CARD', title: 'Choose an occasion' },
  nl: { eyebrow: 'VIND DE JUISTE KAART', title: 'Kies een gelegenheid' },
};

export default function OccasionNavigation({
  currentLanguage,
  activeCategory,
  onCategoryChange,
}: OccasionNavigationProps) {
  const text = sectionTitles[currentLanguage];

  return (
    <section id="occasions" aria-labelledby="occasion-heading" className="mx-auto w-full max-w-7xl scroll-mt-8">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#718078]">{text.eyebrow}</p>
        <h2 id="occasion-heading" className="mt-2 font-serif text-3xl text-[#263e36] sm:text-4xl">
          {text.title}
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {occasions[currentLanguage].map((occasion) => (
          <button
            key={occasion.id}
            type="button"
            aria-pressed={activeCategory === occasion.id}
            aria-controls="card-catalog"
            onClick={() => onCategoryChange(occasion.id)}
            className={`group flex min-h-24 items-center gap-4 rounded-2xl border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347] sm:p-5 ${
              activeCategory === occasion.id
                ? 'border-[#285347] bg-[#e6eee8]'
                : 'border-[#e8e4dc] bg-white hover:border-[#9eafa3] hover:bg-[#fbfaf7]'
            }`}
          >
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f0e9dd] font-serif text-2xl text-[#9b7450]"
            >
              {occasion.icon}
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-[#29443a]">{occasion.title}</span>
              <span className="mt-1 block text-sm text-[#747d75]">{occasion.description}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
