import {
  cardOccasions,
  occasionLabels,
  type CardOccasion,
} from '../data/cardOptions';

type Language = 'so' | 'en' | 'nl';
export type CardSort = 'featured' | 'name-asc' | 'name-desc';

function isCardOccasion(value: string): value is CardOccasion {
  return cardOccasions.some((occasion) => occasion === value);
}

function isCardSort(value: string): value is CardSort {
  return value === 'featured' || value === 'name-asc' || value === 'name-desc';
}

interface CardCatalogControlsProps {
  language: Language;
  query: string;
  occasion: CardOccasion | 'all';
  sort: CardSort;
  resultCount: number;
  hasFilters: boolean;
  onQueryChange: (value: string) => void;
  onOccasionChange: (value: CardOccasion | 'all') => void;
  onSortChange: (value: CardSort) => void;
  onClear: () => void;
}

const copy = {
  so: {
    search: 'Raadi kaarar',
    searchPlaceholder: 'Raadi munaasabad ama naqshad',
    occasion: 'Munaasabad',
    allOccasions: 'Dhammaan munaasabadaha',
    sort: 'Kala hormari',
    featured: 'Kuwa la doortay',
    nameAsc: 'Magaca (A ilaa Z)',
    nameDesc: 'Magaca (Z ilaa A)',
    result: 'kaar ayaa la helay',
    results: 'kaar ayaa la helay',
    clear: 'Nadiifi shaandhooyinka',
  },
  en: {
    search: 'Search cards',
    searchPlaceholder: 'Search occasions or designs',
    occasion: 'Occasion',
    allOccasions: 'All occasions',
    sort: 'Sort by',
    featured: 'Featured first',
    nameAsc: 'Name (A to Z)',
    nameDesc: 'Name (Z to A)',
    result: 'card found',
    results: 'cards found',
    clear: 'Clear filters',
  },
  nl: {
    search: 'Kaarten zoeken',
    searchPlaceholder: 'Zoek op gelegenheid of ontwerp',
    occasion: 'Gelegenheid',
    allOccasions: 'Alle gelegenheden',
    sort: 'Sorteren op',
    featured: 'Uitgelicht eerst',
    nameAsc: 'Naam (A tot Z)',
    nameDesc: 'Naam (Z tot A)',
    result: 'kaart gevonden',
    results: 'kaarten gevonden',
    clear: 'Filters wissen',
  },
} satisfies Record<Language, Record<string, string>>;

export default function CardCatalogControls({
  language,
  query,
  occasion,
  sort,
  resultCount,
  hasFilters,
  onQueryChange,
  onOccasionChange,
  onSortChange,
  onClear,
}: CardCatalogControlsProps) {
  const text = copy[language];
  const occasionLanguage = language;

  return (
    <div className="mb-6 space-y-4">
      <div className="grid gap-3 md:grid-cols-[minmax(14rem,2fr)_minmax(12rem,1fr)_minmax(12rem,1fr)]">
        <div>
          <label htmlFor="card-search" className="mb-1.5 block text-sm font-semibold text-[#29443a]">
            {text.search}
          </label>
          <input
            id="card-search"
            type="search"
            value={query}
            maxLength={100}
            placeholder={text.searchPlaceholder}
            onChange={(event) => onQueryChange(event.target.value)}
            className="min-h-12 w-full rounded-xl border border-[#d9ded8] bg-white px-4 text-sm text-[#243d34] placeholder:text-[#828b84] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
          />
        </div>
        <div>
          <label htmlFor="card-occasion-filter" className="mb-1.5 block text-sm font-semibold text-[#29443a]">
            {text.occasion}
          </label>
          <select
            id="card-occasion-filter"
            value={occasion}
            onChange={(event) => {
              const value = event.target.value;
              onOccasionChange(value === 'all' || isCardOccasion(value) ? value : 'all');
            }}
            className="min-h-12 w-full rounded-xl border border-[#d9ded8] bg-white px-4 text-sm text-[#243d34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
          >
            <option value="all">{text.allOccasions}</option>
            {cardOccasions.map((cardOccasion) => (
              <option key={cardOccasion} value={cardOccasion}>
                {occasionLabels[cardOccasion][occasionLanguage]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="card-sort" className="mb-1.5 block text-sm font-semibold text-[#29443a]">
            {text.sort}
          </label>
          <select
            id="card-sort"
            value={sort}
            onChange={(event) => {
              const value = event.target.value;
              if (isCardSort(value)) onSortChange(value);
            }}
            className="min-h-12 w-full rounded-xl border border-[#d9ded8] bg-white px-4 text-sm text-[#243d34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
          >
            <option value="featured">{text.featured}</option>
            <option value="name-asc">{text.nameAsc}</option>
            <option value="name-desc">{text.nameDesc}</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="text-sm text-[#68756c]">
          {resultCount} {resultCount === 1 ? text.result : text.results}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="min-h-10 rounded-lg px-3 text-sm font-semibold text-[#285347] underline underline-offset-4 hover:text-[#173d32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
          >
            {text.clear}
          </button>
        )}
      </div>
    </div>
  );
}
