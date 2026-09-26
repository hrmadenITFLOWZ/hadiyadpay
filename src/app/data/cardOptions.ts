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
      nl: 'Verjaardag',
      en: 'Birthday',
    },
    category: 'birthday',
    gradient: 'from-pink-600 to-rose-900',
    badge: {
      nl: 'DHALASHO',
      en: 'DHALASHO',
    },
    defaultMessage: {
      nl: 'Dhalasho Wacan! 🌸 Waxaan kuu rajeynaysaa caafimaad, barako, iyo sannad ay ka buuxaan farxad iyo guul weyn. 💐✨',
      en: 'Dhalasho Wacan! 🌸 Waxaan kuu rajeynaysaa caafimaad, barako, iyo sannad ay ka buuxaan farxad iyo guul weyn. 💐✨',
    },
  },
  {
    id: 'wedding-1',
    title: {
      nl: 'Bruiloft',
      en: 'Wedding',
    },
    category: 'wedding',
    gradient: 'from-orange-600 to-amber-800',
    badge: {
      nl: 'AROOS',
      en: 'AROOS',
    },
    defaultMessage: {
      nl: 'Ilaahay ha idinku barakeeyo, hana isu kiin dhowro. Aroos mubarak oo ay ka buuxdo nabad iyo barwaaqo! 💍🕊️',
      en: 'Ilaahay ha idinku barakeeyo, hana isu kiin dhowro. Aroos mubarak oo ay ka buuxdo nabad iyo barwaaqo! 💍🕊️',
    },
  },
  {
    id: 'ciid-1',
    title: {
      nl: 'Religieus / Eid',
      en: 'Religious / Eid',
    },
    category: 'religious',
    gradient: 'from-emerald-600 to-teal-950',
    badge: {
      nl: 'CIID',
      en: 'CIID',
    },
    defaultMessage: {
      nl: 'Ciid Mubaarak! Allah ha naga aqbalo mana wada gaarsiiyo sanad kale oo nabad iyo caafimaad qab ah. 🌙⭐',
      en: 'Ciid Mubaarak! Allah ha naga aqbalo mana wada gaarsiiyo sanad kale oo nabad iyo caafimaad qab ah. 🌙⭐',
    },
  },
  {
    id: 'ramadan-1',
    title: {
      nl: 'Ramadan',
      en: 'Ramadan',
    },
    category: 'ramadan',
    gradient: 'from-indigo-900 via-purple-900 to-slate-900',
    badge: {
      nl: 'RAMADAAN',
      en: 'RAMADAAN',
    },
    defaultMessage: {
      nl: 'Ramadaan Kariim! Bisha barakeysan ee Ramadaan ha idinku soo aado nabad, cafis iyo iimaan buuxa. 🤲🌙',
      en: 'Ramadaan Kariim! Bisha barakeysan ee Ramadaan ha idinku soo aado nabad, cafis iyo iimaan buuxa. 🤲🌙',
    },
  },
  {
    id: 'hooyo-1',
    title: {
      nl: 'Familie / Moeder',
      en: 'Family / Mother',
    },
    category: 'family',
    gradient: 'from-red-600 to-pink-900',
    badge: {
      nl: 'HOOYO',
      en: 'HOOYO',
    },
    defaultMessage: {
      nl: 'Hooyo macaaneey, waxaad tahay nolosheena iyo naxariisteena. Ilaahay cimrigaaga ha dheereeyo oo caafimaad ha ku siiyo! ❤️',
      en: 'Hooyo macaaneey, waxaad tahay nolosheena iyo naxariisteena. Ilaahay cimrigaaga ha dheereeyo oo caafimaad ha ku siiyo! ❤️',
    },
  },
  {
    id: 'support-1',
    title: {
      nl: 'Ondersteuning',
      en: 'Support',
    },
    category: 'congratulations',
    gradient: 'from-purple-600 to-indigo-900',
    badge: {
      nl: 'TAAGEERO',
      en: 'TAAGEERO',
    },
    defaultMessage: {
      nl: 'Waxyar oo jacayl iyo taageero ah oo ka yimid dibadda. Adeer/Eedoow ha idinku anfaco! 💸🤝',
      en: 'Waxyar oo jacayl iyo taageero ah oo ka yimid dibadda. Adeer/Eedoow ha idinku anfaco! 💸🤝',
    },
  },
  {
    id: 'success-1',
    title: {
      nl: 'Succes / Diploma',
      en: 'Success / Graduation',
    },
    category: 'success',
    gradient: 'from-blue-600 to-cyan-900',
    badge: {
      nl: 'GUUL',
      en: 'GUUL',
    },
    defaultMessage: {
      nl: 'Hambalyo! Waxaan kuu rajeynayaa guulo hor leh iyo in dadaalkaaga midhihiisa aad gurato. Aad ayaan kuugu hanweynahay! 🎓🌟',
      en: 'Hambalyo! Waxaan kuu rajeynayaa guulo hor leh iyo in dadaalkaaga midhihiisa aad gurato. Aad ayaan kuugu hanweynahay! 🎓🌟',
    },
  },
];