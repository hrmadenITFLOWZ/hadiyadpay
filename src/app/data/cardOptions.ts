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
      nl: 'Verjaardag 🎂',
      en: 'Birthday 🎂',
    },
    category: 'birthday',
    gradient: 'from-pink-600 via-rose-600 to-red-700',
    badge: {
      nl: 'DHALASHO 🎉',
      en: 'DHALASHO 🎉',
    },
    defaultMessage: {
      nl: 'Dhalasho Wacan! 🌸🎂 Waxaan kuu rajeynaysaa caafimaad, barako, iyo sannad kale oo ay ka buuxaan farxad, qosol, iyo guul weyn. 💐✨🎈',
      en: 'Dhalasho Wacan! 🌸🎂 Waxaan kuu rajeynaysaa caafimaad, barako, iyo sannad kale oo ay ka buuxaan farxad, qosol, iyo guul weyn. 💐✨🎈',
    },
  },
  {
    id: 'wedding-1',
    title: {
      nl: 'Bruiloft 💍',
      en: 'Wedding 💍',
    },
    category: 'wedding',
    gradient: 'from-orange-600 via-amber-600 to-yellow-700',
    badge: {
      nl: 'AROOS 🕊️',
      en: 'AROOS 🕊️',
    },
    defaultMessage: {
      nl: 'Ilaahay ha idinku barakeeyo, hana isu kiin dhowro oo jacayl nabad qabta idin siiyo. Aroos mubaarak oo ay ka buuxdo barwaaqo! 💍🕊️💐❤️',
      en: 'Ilaahay ha idinku barakeeyo, hana isu kiin dhowro oo jacayl nabad qabta idin siiyo. Aroos mubaarak oo ay ka buuxdo barwaaqo! 💍🕊️💐❤️',
    },
  },
  {
    id: 'ciid-1',
    title: {
      nl: 'Religieus / Eid 🌙',
      en: 'Religious / Eid 🌙',
    },
    category: 'religious',
    gradient: 'from-emerald-600 via-teal-700 to-cyan-900',
    badge: {
      nl: 'CIID ⭐',
      en: 'CIID ⭐',
    },
    defaultMessage: {
      nl: 'Ciid Mubaarak! 🌙✨ Allah ha naga aqbalo ibadaheena mana wada gaarsiiyo sanad kale oo nabad, caafimaad, iyo barako qabta ah. 🤲⭐🎉',
      en: 'Ciid Mubaarak! 🌙✨ Allah ha naga aqbalo ibadaheena mana wada gaarsiiyo sanad kale oo nabad, caafimaad, iyo barako qabta ah. 🤲⭐🎉',
    },
  },
  {
    id: 'ramadan-1',
    title: {
      nl: 'Ramadan 🌙',
      en: 'Ramadan 🌙',
    },
    category: 'ramadan',
    gradient: 'from-indigo-900 via-purple-800 to-slate-900',
    badge: {
      nl: 'RAMADAAN 🤲',
      en: 'RAMADAAN 🤲',
    },
    defaultMessage: {
      nl: 'Ramadaan Kariim! 🌙🕌 Bisha barakeysan ee Ramadaan ha idinku soo aado nabad, cafis, ducada la aqbalay, iyo iimaan buuxa. 🤲📿✨',
      en: 'Ramadaan Kariim! 🌙🕌 Bisha barakeysan ee Ramadaan ha idinku soo aado nabad, cafis, ducada la aqbalay, iyo iimaan buuxa. 🤲📿✨',
    },
  },
  {
    id: 'hooyo-1',
    title: {
      nl: 'Familie / Moeder ❤️',
      en: 'Family / Mother ❤️',
    },
    category: 'family',
    gradient: 'from-red-600 via-rose-700 to-pink-800',
    badge: {
      nl: 'HOOYO 🌹',
      en: 'HOOYO 🌹',
    },
    defaultMessage: {
      nl: 'Hooyo macaaneey, waxaad tahay nolosheena, tiirkeena iyo naxariisteena. Ilaahay cimrigaaga ha dheereeyo oo caafimaad iyo qoys farxad leh ha ku siiyo! ❤️🌹🥰',
      en: 'Hooyo macaaneey, waxaad tahay nolosheena, tiirkeena iyo naxariisteena. Ilaahay cimrigaaga ha dheereeyo oo caafimaad iyo qoys farxad leh ha ku siiyo! ❤️🌹🥰',
    },
  },
  {
    id: 'support-1',
    title: {
      nl: 'Ondersteuning 💸',
      en: 'Support 💸',
    },
    category: 'congratulations',
    gradient: 'from-purple-600 via-indigo-700 to-blue-900',
    badge: {
      nl: 'TAAGEERO 🤝',
      en: 'TAAGEERO 🤝',
    },
    defaultMessage: {
      nl: 'Waxyar oo jacayl, duco, iyo taageero maaliyadeed ah oo ka yimid dibadda. Adeer/Eedoow ha idinku anfaco oo dhibka ha idinka saaro! 💸🤝🤗🌟',
      en: 'Waxyar oo jacayl, duco, iyo taageero maaliyadeed ah oo ka yimid dibadda. Adeer/Eedoow ha idinku anfaco oo dhibka ha idinka saaro! 💸🤝🤗🌟',
    },
  },
  {
    id: 'success-1',
    title: {
      nl: 'Succes / Diploma 🎓',
      en: 'Success / Graduation 🎓',
    },
    category: 'success',
    gradient: 'from-blue-600 via-sky-700 to-indigo-900',
    badge: {
      nl: 'GUUL 🏆',
      en: 'GUUL 🏆',
    },
    defaultMessage: {
      nl: 'Hambalyo weyn! 🎓🎉 Waxaan kuu rajeynayaa guulo hor leh iyo in dadaalkaaga midhihiisa aad gurato. Aad ayaan kuugu hanweynahay! 🌟🚀💪',
      en: 'Hambalyo weyn! 🎓🎉 Waxaan kuu rajeynayaa guulo hor leh iyo in dadaalkaaga midhihiisa aad gurato. Aad ayaan kuugu hanweynahay! 🌟🚀💪',
    },
  },
];