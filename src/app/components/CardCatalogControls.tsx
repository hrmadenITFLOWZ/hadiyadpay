'use client';

import { useState } from 'react';
import {
  cardColors,
  cardStyles,
  occasionLabels,
  recipientTypes,
  type CardLanguage,
  type CatalogFilters,
} from '../../lib/card-types';
import { cardOptions } from '../data/cardOptions';
import {
  isCardColor,
  isCardLanguage,
  isCardOccasion,
  isCardOrientation,
  isCardStyle,
  isCatalogCategory,
  isCatalogSort,
  isRecipientType,
} from '../../lib/catalog';
import useDialogAccessibility from '../hooks/useDialogAccessibility';

interface CardCatalogControlsProps {
  language: CardLanguage;
  filters: CatalogFilters;
  resultCount: number;
  activeFilterCount: number;
  hasFilters: boolean;
  onChange: (filters: CatalogFilters) => void;
  onClear: () => void;
}

const copy = {
  so: {
    search: 'Raadi kaarar',
    searchPlaceholder: 'Raadi munaasabad ama naqshad',
    filters: 'Shaandhooyin',
    category: 'Qaybta',
    allCategories: 'Dhammaan qaybaha',
    celebrations: 'Dabaaldegyo',
    milestones: 'Guul & dhiirigelin',
    occasion: 'Munaasabad',
    allOccasions: 'Dhammaan munaasabadaha',
    recipient: 'Qofka qaataha ah',
    allRecipients: 'Qof kasta',
    style: 'Qaabka',
    allStyles: 'Dhammaan qaababka',
    color: 'Midabka',
    allColors: 'Dhammaan midabbada',
    language: 'Luqadda kaarka',
    allLanguages: 'Dhammaan luqadaha',
    orientation: 'Jihada',
    allOrientations: 'Dhammaan jihada',
    sort: 'Kala hormari',
    allSort: 'Kuwa la doortay',
    nameAsc: 'Magaca (A ilaa Z)',
    nameDesc: 'Magaca (Z ilaa A)',
    clear: 'Nadiifi dhammaan',
    done: 'Waa dhammaatay',
    result: 'kaar ayaa la helay',
    results: 'kaar ayaa la helay',
  },
  en: {
    search: 'Search cards',
    searchPlaceholder: 'Search occasions or designs',
    filters: 'Filters',
    category: 'Category',
    allCategories: 'All categories',
    celebrations: 'Celebrations',
    milestones: 'Milestones',
    occasion: 'Occasion',
    allOccasions: 'All occasions',
    recipient: 'Recipient',
    allRecipients: 'Anyone',
    style: 'Style',
    allStyles: 'All styles',
    color: 'Color',
    allColors: 'All colors',
    language: 'Card language',
    allLanguages: 'All languages',
    orientation: 'Orientation',
    allOrientations: 'All orientations',
    sort: 'Sort by',
    allSort: 'Featured first',
    nameAsc: 'Name (A to Z)',
    nameDesc: 'Name (Z to A)',
    clear: 'Clear all',
    done: 'Done',
    result: 'card found',
    results: 'cards found',
  },
  nl: {
    search: 'Kaarten zoeken',
    searchPlaceholder: 'Zoek op gelegenheid of ontwerp',
    filters: 'Filters',
    category: 'Categorie',
    allCategories: 'Alle categorieën',
    celebrations: 'Feestelijke momenten',
    milestones: 'Mijlpalen',
    occasion: 'Gelegenheid',
    allOccasions: 'Alle gelegenheden',
    recipient: 'Voor wie',
    allRecipients: 'Iedereen',
    style: 'Stijl',
    allStyles: 'Alle stijlen',
    color: 'Kleur',
    allColors: 'Alle kleuren',
    language: 'Kaarttaal',
    allLanguages: 'Alle talen',
    orientation: 'Oriëntatie',
    allOrientations: 'Alle oriëntaties',
    sort: 'Sorteren op',
    allSort: 'Uitgelicht eerst',
    nameAsc: 'Naam (A tot Z)',
    nameDesc: 'Naam (Z tot A)',
    clear: 'Alles wissen',
    done: 'Gereed',
    result: 'kaart gevonden',
    results: 'kaarten gevonden',
  },
} satisfies Record<CardLanguage, Record<string, string>>;

const recipientLabels = {
  so: { friend: 'Saaxiib', family: 'Qoys', partner: 'Lammaane', colleague: 'Shaqaale', graduate: 'Arday qalinjabiyey' },
  en: { friend: 'Friend', family: 'Family', partner: 'Partner', colleague: 'Colleague', graduate: 'Graduate' },
  nl: { friend: 'Vriend', family: 'Familie', partner: 'Partner', colleague: 'Collega', graduate: 'Afgestudeerde' },
} satisfies Record<CardLanguage, Record<(typeof recipientTypes)[number], string>>;

const styleLabels = {
  so: { illustrated: 'Sawir leh', traditional: 'Dhaqan', floral: 'Ubaxyo', minimal: 'Fudud', ornamental: 'Qurxin', geometric: 'Joomatari' },
  en: { illustrated: 'Illustrated', traditional: 'Traditional', floral: 'Floral', minimal: 'Minimal', ornamental: 'Ornamental', geometric: 'Geometric' },
  nl: { illustrated: 'Geïllustreerd', traditional: 'Traditioneel', floral: 'Bloemen', minimal: 'Minimalistisch', ornamental: 'Decoratief', geometric: 'Geometrisch' },
} satisfies Record<CardLanguage, Record<(typeof cardStyles)[number], string>>;

const colorLabels = {
  so: { green: 'Cagaar', blue: 'Buluug', gold: 'Dahab', rose: 'Casaan khafiif ah', terracotta: 'Dhoobo', neutral: 'Dhexdhexaad' },
  en: { green: 'Green', blue: 'Blue', gold: 'Gold', rose: 'Rose', terracotta: 'Terracotta', neutral: 'Neutral' },
  nl: { green: 'Groen', blue: 'Blauw', gold: 'Goud', rose: 'Roze', terracotta: 'Terracotta', neutral: 'Neutraal' },
} satisfies Record<CardLanguage, Record<(typeof cardColors)[number], string>>;

const catalogOccasions = [...new Set(cardOptions.map((card) => card.occasion))];

export default function CardCatalogControls({
  language,
  filters,
  resultCount,
  activeFilterCount,
  hasFilters,
  onChange,
  onClear,
}: CardCatalogControlsProps) {
  const [isMobileDialogOpen, setIsMobileDialogOpen] = useState(false);
  const text = copy[language];
  const closeMobileDialog = () => setIsMobileDialogOpen(false);
  const dialogRef = useDialogAccessibility<HTMLDivElement>(isMobileDialogOpen, closeMobileDialog);

  const update = <Key extends keyof CatalogFilters>(key: Key, value: CatalogFilters[Key]) => {
    onChange({ ...filters, [key]: value });
  };

  const renderFilterFields = (prefix: string) => (
    <>
      <label className="block text-sm font-semibold text-[#29443a]">
        {text.category}
        <select
          id={`${prefix}-category`}
          value={filters.category}
          onChange={(event) => {
            const value = event.target.value;
            update('category', value === 'all' ? 'all' : isCatalogCategory(value) ? value : 'all');
          }}
          className="mt-1.5 min-h-12 w-full rounded-xl border border-[#d9ded8] bg-white px-4 text-sm font-normal text-[#243d34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
        >
          <option value="all">{text.allCategories}</option>
          <option value="celebrations">{text.celebrations}</option>
          <option value="milestones">{text.milestones}</option>
        </select>
      </label>

      <label className="block text-sm font-semibold text-[#29443a]">
        {text.occasion}
        <select
          id={`${prefix}-occasion`}
          value={filters.occasion}
          onChange={(event) => {
            const value = event.target.value;
            update('occasion', value === 'all' ? 'all' : isCardOccasion(value) ? value : 'all');
          }}
          className="mt-1.5 min-h-12 w-full rounded-xl border border-[#d9ded8] bg-white px-4 text-sm font-normal text-[#243d34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
        >
          <option value="all">{text.allOccasions}</option>
          {catalogOccasions.map((occasion) => <option key={occasion} value={occasion}>{occasionLabels[occasion][language]}</option>)}
        </select>
      </label>

      <label className="block text-sm font-semibold text-[#29443a]">
        {text.recipient}
        <select
          id={`${prefix}-recipient`}
          value={filters.recipient}
          onChange={(event) => {
            const value = event.target.value;
            update('recipient', value === 'all' ? 'all' : isRecipientType(value) ? value : 'all');
          }}
          className="mt-1.5 min-h-12 w-full rounded-xl border border-[#d9ded8] bg-white px-4 text-sm font-normal text-[#243d34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
        >
          <option value="all">{text.allRecipients}</option>
          {recipientTypes.map((recipient) => <option key={recipient} value={recipient}>{recipientLabels[language][recipient]}</option>)}
        </select>
      </label>

      <label className="block text-sm font-semibold text-[#29443a]">
        {text.style}
        <select
          id={`${prefix}-style`}
          value={filters.style}
          onChange={(event) => {
            const value = event.target.value;
            update('style', value === 'all' ? 'all' : isCardStyle(value) ? value : 'all');
          }}
          className="mt-1.5 min-h-12 w-full rounded-xl border border-[#d9ded8] bg-white px-4 text-sm font-normal text-[#243d34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
        >
          <option value="all">{text.allStyles}</option>
          {cardStyles.map((style) => <option key={style} value={style}>{styleLabels[language][style]}</option>)}
        </select>
      </label>

      <label className="block text-sm font-semibold text-[#29443a]">
        {text.color}
        <select
          id={`${prefix}-color`}
          value={filters.color}
          onChange={(event) => {
            const value = event.target.value;
            update('color', value === 'all' ? 'all' : isCardColor(value) ? value : 'all');
          }}
          className="mt-1.5 min-h-12 w-full rounded-xl border border-[#d9ded8] bg-white px-4 text-sm font-normal text-[#243d34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
        >
          <option value="all">{text.allColors}</option>
          {cardColors.map((color) => <option key={color} value={color}>{colorLabels[language][color]}</option>)}
        </select>
      </label>

      <label className="block text-sm font-semibold text-[#29443a]">
        {text.language}
        <select
          id={`${prefix}-language`}
          value={filters.language}
          onChange={(event) => {
            const value = event.target.value;
            update('language', value === 'all' ? 'all' : isCardLanguage(value) ? value : 'all');
          }}
          className="mt-1.5 min-h-12 w-full rounded-xl border border-[#d9ded8] bg-white px-4 text-sm font-normal text-[#243d34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
        >
          <option value="all">{text.allLanguages}</option>
          <option value="so">Somali</option>
          <option value="en">English</option>
          <option value="nl">Nederlands</option>
        </select>
      </label>

      <label className="block text-sm font-semibold text-[#29443a]">
        {text.orientation}
        <select
          id={`${prefix}-orientation`}
          value={filters.orientation}
          onChange={(event) => {
            const value = event.target.value;
            update('orientation', value === 'all' ? 'all' : isCardOrientation(value) ? value : 'all');
          }}
          className="mt-1.5 min-h-12 w-full rounded-xl border border-[#d9ded8] bg-white px-4 text-sm font-normal text-[#243d34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
        >
          <option value="all">{text.allOrientations}</option>
          <option value="portrait">{language === 'nl' ? 'Staand' : language === 'so' ? 'Taagan' : 'Portrait'}</option>
          <option value="landscape">{language === 'nl' ? 'Liggend' : language === 'so' ? 'Jiifa' : 'Landscape'}</option>
        </select>
      </label>

      <label className="block text-sm font-semibold text-[#29443a]">
        {text.sort}
        <select
          id={`${prefix}-sort`}
          value={filters.sort}
          onChange={(event) => {
            const value = event.target.value;
            if (isCatalogSort(value)) update('sort', value);
          }}
          className="mt-1.5 min-h-12 w-full rounded-xl border border-[#d9ded8] bg-white px-4 text-sm font-normal text-[#243d34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
        >
          <option value="featured">{text.allSort}</option>
          <option value="name-asc">{text.nameAsc}</option>
          <option value="name-desc">{text.nameDesc}</option>
        </select>
      </label>
    </>
  );

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label htmlFor="card-search" className="block min-w-0 flex-1 text-sm font-semibold text-[#29443a]">
          {text.search}
          <input
            id="card-search"
            type="search"
            value={filters.query}
            maxLength={100}
            placeholder={text.searchPlaceholder}
            onChange={(event) => update('query', event.target.value)}
            className="mt-1.5 min-h-12 w-full rounded-xl border border-[#d9ded8] bg-white px-4 text-sm font-normal text-[#243d34] placeholder:text-[#828b84] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
          />
        </label>
        <button
          type="button"
          onClick={() => setIsMobileDialogOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isMobileDialogOpen}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#cad5cc] bg-white px-4 text-sm font-semibold text-[#29443a] hover:bg-[#f5f7f4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347] md:hidden"
        >
          {text.filters}
          {activeFilterCount > 0 && <span className="rounded-full bg-[#285347] px-2 py-0.5 text-xs text-white">{activeFilterCount}</span>}
        </button>
      </div>

      <div className="hidden grid-cols-2 gap-3 md:grid lg:grid-cols-4">
        {renderFilterFields('desktop')}
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

      {isMobileDialogOpen && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 md:hidden">
          <div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-filters-title"
            className="max-h-[90dvh] w-full overflow-y-auto rounded-t-3xl bg-[#fbfaf7] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 id="mobile-filters-title" className="font-serif text-2xl text-[#263e36]">{text.filters}</h2>
              <button
                type="button"
                onClick={closeMobileDialog}
                aria-label={language === 'nl' ? 'Filters sluiten' : language === 'so' ? 'Xir shaandhooyinka' : 'Close filters'}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl text-[#29443a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
              >
                ×
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {renderFilterFields('mobile')}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  onClear();
                  closeMobileDialog();
                }}
                className="min-h-12 rounded-xl border border-[#cad5cc] bg-white px-4 text-sm font-semibold text-[#29443a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
              >
                {text.clear}
              </button>
              <button
                type="button"
                onClick={closeMobileDialog}
                className="min-h-12 rounded-xl bg-[#285347] px-4 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285347]"
              >
                {text.done}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
