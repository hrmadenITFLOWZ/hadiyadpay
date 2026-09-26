export interface CardOption {
  id: string;
  title: Record<string, string>;
  category: 'birthday' | 'love' | 'wedding' | 'religious' | 'congratulations';
  gradient: string;
  badge: Record<string, string>;
  isFree: boolean;
  price?: number;
}

export const cardOptions: CardOption[] = [
  {
    id: 'bday-classic',
    title: {
      nl: 'Dhalasho - Klassieke Verjaardag',
      en: 'Birthday - Classic Greeting',
    },
    category: 'birthday',
    gradient: 'from-emerald-800 to-emerald-950',
    badge: {
      nl: 'GRATIS',
      en: 'FREE',
    },
    isFree: true,
  },
  {
    id: 'bday-gold-luxe',
    title: {
      nl: 'Dhalasho - Luxe Gouden Editie',
      en: 'Birthday - Luxe Gold Edition',
    },
    category: 'birthday',
    gradient: 'from-amber-600 via-yellow-700 to-amber-900',
    badge: {
      nl: 'PREMIUM (€ 1,49)',
      en: 'PREMIUM (€ 1.49)',
    },
    isFree: false,
    price: 1.49,
  },
  {
    id: 'love-rose',
    title: {
      nl: 'Jacayl - Warme Liefde',
      en: 'Love - Warm Affection',
    },
    category: 'love',
    gradient: 'from-rose-700 to-pink-950',
    badge: {
      nl: 'GRATIS',
      en: 'FREE',
    },
    isFree: true,
  },
  {
    id: 'wedding-aaroos',
    title: {
      nl: 'Aaroos - Koninklijk Huwelijk',
      en: 'Wedding - Royal Celebration',
    },
    category: 'wedding',
    gradient: 'from-teal-700 via-emerald-800 to-cyan-950',
    badge: {
      nl: 'PREMIUM (€ 1,49)',
      en: 'PREMIUM (€ 1.49)',
    },
    isFree: false,
    price: 1.49,
  },
  {
    id: 'congrats-emerald',
    title: {
      nl: 'Barako - Voorspoed & Zegen',
      en: 'Blessings & Success',
    },
    category: 'congratulations',
    gradient: 'from-emerald-600 via-teal-700 to-green-900',
    badge: {
      nl: 'PREMIUM (€ 1,49)',
      en: 'PREMIUM (€ 1.49)',
    },
    isFree: false,
    price: 1.49,
  },
];