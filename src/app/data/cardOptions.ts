export interface CardOption {
  id: string;
  title: Record<string, string>;
  category: 'birthday' | 'love' | 'wedding' | 'religious' | 'congratulations' | 'family' | 'ramadan' | 'success';
  gradient: string;
  badge: Record<string, string>;
  defaultMessage: Record<string, string>;
}

export const cardOptions: CardOption[] = [
  {
    id: 'birthday-1',
    title: {
      nl: 'Dhalasho Wacan - Birthday',
      en: 'Happy Birthday',
    },
    category: 'birthday',
    gradient: 'from-pink-600 to-rose-900',
    badge: {
      nl: 'DHALASHO',
      en: 'BIRTHDAY',
    },
    defaultMessage: {
      nl: 'Dhalasho Wacan! 🌸 Waxaan kuu rajeynaysaa caafimaad, barako, iyo sannad ay ka buuxaan farxad iyo guul weyn. 💐✨',
      en: 'Happy Birthday! Wishing you health, blessings, and a year full of joy and great success.',
    },
  },
  {
    id: 'wedding-1',
    title: {
      nl: 'Aroos Wacan - Wedding Blessings',
      en: 'Wedding Celebration',
    },
    category: 'wedding',
    gradient: 'from-orange-600 to-amber-800',
    badge: {
      nl: 'AROOS',
      en: 'WEDDING',
    },
    defaultMessage: {
      nl: 'Ilaahay ha idinku barakeeyo, hana isu kiin dhowro. Aroos mubarak oo ay ka buuxdo nabad iyo barwaaqo! 💍🕊️',
      en: 'May Allah bless your union and keep you together. Wishing you a blessed wedding full of peace and prosperity!',
    },
  },
  {
    id: 'ciid-1',
    title: {
      nl: 'Ciid Mubaarak - Eid Celebration',
      en: 'Eid Mubarak',
    },
    category: 'religious',
    gradient: 'from-emerald-600 to-teal-950',
    badge: {
      nl: 'CIID',
      en: 'EID',
    },
    defaultMessage: {
      nl: 'Ciid Mubaarak! Allah ha naga aqbalo mana wada gaarsiiyo sanad kale oo nabad iyo caafimaad qab ah. 🌙⭐',
      en: 'Eid Mubarak! May Allah accept our good deeds and bring you endless peace, joy, and health.',
    },
  },
  {
    id: 'ramadan-1',
    title: {
      nl: 'Ramadaan Kariim - Holy Month',
      en: 'Ramadan Kareem',
    },
    category: 'ramadan',
    gradient: 'from-indigo-900 via-purple-900 to-slate-900',
    badge: {
      nl: 'RAMADAAN',
      en: 'RAMADAN',
    },
    defaultMessage: {
      nl: 'Ramadaan Kariim! Bisha barakeysan ee Ramadaan ha idinku soo aado nabad, cafis iyo iimaan buuxa. 🤲🌙',
      en: 'Ramadan Kareem! May this blessed month bring peace, forgiveness, and immense faith to your household.',
    },
  },
  {
    id: 'hooyo-1',
    title: {
      nl: 'Hooyo Macaan - Mother & Family',
      en: 'Dearest Mother',
    },
    category: 'family',
    gradient: 'from-red-600 to-pink-900',
    badge: {
      nl: 'HOOYO',
      en: 'MOTHER',
    },
    defaultMessage: {
      nl: 'Hooyo macaaneey, waxaad tahay nolosheena iyo naxariisteena. Ilaahay cimrigaaga ha dheereeyo oo caafimaad ha ku siiyo! ❤️',
      en: 'Dearest Mother, you are our life and comfort. May Allah grant you long life, health, and endless happiness!',
    },
  },
  {
    id: 'support-1',
    title: {
      nl: 'Taageero - Financial Support',
      en: 'Support & Remittance',
    },
    category: 'congratulations',
    gradient: 'from-purple-600 to-indigo-900',
    badge: {
      nl: 'TAAGEERO',
      en: 'SUPPORT',
    },
    defaultMessage: {
      nl: 'Waxyar oo jacayl iyo taageero ah oo ka yimid dibadda. Adeer/Eedoow ha idinku anfaco! 💸🤝',
      en: 'A small token of love and financial support sent from afar. Hope this brings ease and smiles!',
    },
  },
  {
    id: 'success-1',
    title: {
      nl: 'Guul Wacan - Graduation & Success',
      en: 'Success & Graduation',
    },
    category: 'success',
    gradient: 'from-blue-600 to-cyan-900',
    badge: {
      nl: 'GUUL',
      en: 'SUCCESS',
    },
    defaultMessage: {
      nl: ' Hambalyo! Waxaan kuu rajeynayaa guulo hor leh iyo in dadaalkaaga midhihiisa aad gurato. Aad ayaan kuugu hanweynahay! 🎓🌟',
      en: 'Congratulations on your milestone! Wishing you continuous success and fulfillment in all your future endeavors.',
    },
  },
];