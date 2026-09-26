// src/app/data/cardOptions.ts

export interface Occasion {
  id: string;
  title: string;
  category: string;
  bgGradient: string;
  pattern: string;
  defaultMessage: string;
}

export const OCCASIONS: Occasion[] = [
  {
    id: 'dhalasho',
    title: 'Dhalasho Farxad Leh',
    category: 'Dhalasho • Birthday',
    bgGradient: 'from-emerald-700 via-teal-800 to-green-900',
    pattern: '🎂',
    defaultMessage: 'Dhalasho Wacan! 🌸 Waxaan kuu rajeynayaa caafimaad, barako, iyo sannad ay ka buuxaan farxad iyo guul weyn. 💐✨',
  },
  {
    id: 'jacayl',
    title: 'Jacayl & Xusuus',
    category: 'Jacayl • Love',
    bgGradient: 'from-rose-600 via-pink-700 to-red-900',
    pattern: '💖',
    defaultMessage: 'Qaaligay, waxaad tahay nolosheyda iyo farxaddayda. 🌹 Adiga ayaan kuu hibeeyay jacaylkan iyo ubaxan quruxda badan. 💐❤️',
  },
  {
    id: 'aroos',
    title: 'Aroos Wacan & Barako',
    category: 'Aaroos • Wedding',
    bgGradient: 'from-amber-600 via-orange-700 to-red-900',
    pattern: '💍',
    defaultMessage: 'Hambalyo! 🌷 Waxaan idiin rajeynayaa nolol qoys oo waarta, oo ay ka buuxaan jacayl, ubax iyo barwaaqo. 💐🥂',
  },
  {
    id: 'taageero',
    title: 'Taageero Qoys (Remittance)',
    category: 'Taageero • Support',
    bgGradient: 'from-indigo-700 via-purple-800 to-slate-900',
    pattern: '🤝',
    defaultMessage: 'Walaal, waa yar oo naxariis ah oo aan idiinka soo diray dibadda iyadoo ay weheliso duco iyo ubax. 🙏🌸 Noloshu ha idiin fududaato.',
  },
  {
    id: 'ciid',
    title: 'Ciid Mubaarak',
    category: 'Ciid • Celebration',
    bgGradient: 'from-cyan-600 via-blue-700 to-indigo-900',
    pattern: '🌙',
    defaultMessage: 'Ciid Mubaarak! 🌺 Waxaan kuu rajeynayaa maalmo farxad leh adiga iyo qoyskaagaba oo ay buuxiyaan ubax iyo nabad. 🌷✨',
  },
];