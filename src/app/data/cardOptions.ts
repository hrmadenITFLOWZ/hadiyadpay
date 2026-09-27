export interface CardOption {
  id: string;
  category: 'dhaqan' | 'cities';
  badge: { so: string; en: string };
  title: { so: string; en: string };
  defaultMessage: { so: string; en: string };
  gradient: string;
  bgImage: string;
}

export const cardOptions: CardOption[] = [
  // --- DECK 1: Dhaqan Vibes (7 items) ---
  {
    id: 'dhalasho',
    category: 'dhaqan',
    badge: { so: 'DHALASHO', en: 'BIRTHDAY' },
    title: { so: 'Dhalasho Wacan', en: 'Birthday Celebration' },
    defaultMessage: {
      so: 'Waxaan kuu rajeynayaa caafimaad, barako, iyo sannad kale oo ay ka buuxaan farxad, qosol, iyo guul weyn. 🎉✨',
      en: 'Wishing you health, blessings, and another year filled with happiness, laughter, and great success.'
    },
    gradient: 'from-pink-600 via-rose-500 to-red-500',
    bgImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'aroos',
    category: 'dhaqan',
    badge: { so: 'AROOS', en: 'WEDDING' },
    title: { so: 'Xaflada Aroosaka', en: 'Wedding & Union' },
    defaultMessage: {
      so: 'Hambalyo arooska ku saabsan! Allah idinka yeero kuwii isu waara ee hela gurio barako leh. 💍🕊️',
      en: 'Congratulations on your wedding! May Allah bless your union and fill your home with peace and joy.'
    },
    gradient: 'from-amber-600 via-orange-500 to-yellow-600',
    bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'eid',
    category: 'dhaqan',
    badge: { so: 'EID', en: 'EID' },
    title: { so: 'Eid Mubarak', en: 'Eid Mubarak' },
    defaultMessage: {
      so: 'Eid Mubaarak! Waxaan kuu rajeynayaa adiga iyo qoyskaagaba nabad, caafimaad, iyo barako badan. 🌙⭐',
      en: 'Eid Mubarak! May this joyous occasion bring peace, happiness, and prosperity to your family.'
    },
    gradient: 'from-emerald-700 via-teal-600 to-cyan-700',
    bgImage: 'https://images.unsplash.com/photo-1564769625615-f02b0e223407?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'taageero',
    category: 'dhaqan',
    badge: { so: 'TAAGEERO', en: 'SUPPORT' },
    title: { so: 'Taageero & Dhiirigelin', en: 'Support & Encouragement' },
    defaultMessage: {
      so: 'Waan kugula jirbaa mar walba. Ha welwelin, si adag u soco oo guushu waa kuu dhowdahay! 💪',
      en: 'I am always supporting you. Keep your head up, stay strong, and success is right around the corner!'
    },
    gradient: 'from-blue-600 via-indigo-600 to-violet-700',
    bgImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'guul',
    category: 'dhaqan',
    badge: { so: 'GUUL', en: 'SUCCESS' },
    title: { so: 'Qalinjabin & Guul', en: 'Graduation & Success' },
    defaultMessage: {
      so: 'Hambalyo heerkan sare aad ka gaartay! Waxaan kuu rajeynayaa mustaqbal ifaya iyo guulo waaweyn. 🎓🚀',
      en: 'Congratulations on your incredible achievement! Wishing you a bright future and endless successes.'
    },
    gradient: 'from-purple-600 via-fuchsia-600 to-pink-600',
    bgImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'mahadcelin',
    category: 'dhaqan',
    badge: { so: 'MAHAD', en: 'THANKS' },
    title: { so: 'Mahadcelin Wacan', en: 'Heartfelt Thanks' },
    defaultMessage: {
      so: 'Waan ka mahadcelinayaa garab istaaggaaga iyo wanaaggaaga joogtada ah. Alle ha ku xafido! 🙏💛',
      en: 'Thank you so much for your constant support and kindness. May God protect you!'
    },
    gradient: 'from-amber-500 via-yellow-500 to-lime-600',
    bgImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'barako',
    category: 'dhaqan',
    badge: { so: 'BARAKO', en: 'BLESSINGS' },
    title: { so: 'Barako & Nabad', en: 'Blessings & Peace' },
    defaultMessage: {
      so: 'Maalintaan qiimaha badan waxaa ka buuxa duco iyo barako adiga iyo reerkaagaba ku socota. 🌟🤲',
      en: 'Sending you prayers and blessings for a peaceful and joyous day ahead for you and your family.'
    },
    gradient: 'from-teal-600 via-emerald-600 to-green-700',
    bgImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop'
  },

  // --- DECK 2: Somali Cities & Animated Vibes (7 items) ---
  {
    id: 'mogadishu',
    category: 'cities',
    badge: { so: 'XAMAR', en: 'MOGADISHU' },
    title: { so: 'Mogadishu Sunset', en: 'Mogadishu Sunset' },
    defaultMessage: {
      so: 'Salaan diirran oo ka soo jeeda Xamar Cadde, caasimadda quruxda badan. Habeen wacan! 🌇🌊',
      en: 'Warm greetings straight from Xamar, the beautiful capital city. Good evening!'
    },
    gradient: 'from-cyan-600 via-sky-600 to-blue-800',
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'hargeisa',
    category: 'cities',
    badge: { so: 'HARGEISA', en: 'HARGEISA' },
    title: { so: 'Hargeisa Lights', en: 'Hargeisa Heights' },
    defaultMessage: {
      so: 'Hambalyo iyo salaan qaali ah oo ka timid buuraha taariikhiga ah ee Hargeysa. ⛰️✨',
      en: 'Special greetings and love sent from the historic hills and lights of Hargeisa.'
    },
    gradient: 'from-slate-700 via-indigo-800 to-zinc-900',
    bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'kismayo',
    category: 'cities',
    badge: { so: 'KISMAYO', en: 'KISMAYO' },
    title: { so: 'Kismayo Coast', en: 'Tropical Breeze' },
    defaultMessage: {
      so: 'Dabaylaha qabow ee xeebta Kismaayo iyo jawiga degan. Maalin wacan oo farxad leh! 🌴☀️',
      en: 'Cool coastal breeze and great vibes from Kismayo. Wishing you a wonderful day!'
    },
    gradient: 'from-blue-500 via-teal-600 to-slate-900',
    bgImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'garowe',
    category: 'cities',
    badge: { so: 'GAROWE', en: 'GAROWE' },
    title: { so: 'Garowe Horizon', en: 'Sunrise Glow' },
    defaultMessage: {
      so: 'Iftiinka subaxnimo iyo barakada ka socota magaalada nabadda ee Garowe. 🌅💛',
      en: 'Morning light and blessings coming straight from the peaceful city of Garowe.'
    },
    gradient: 'from-amber-600 via-orange-600 to-red-900',
    bgImage: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'bosaso',
    category: 'cities',
    badge: { so: 'BOSASO', en: 'BOSASO' },
    title: { so: 'Bosaso Port', en: 'Red Sea Vibe' },
    defaultMessage: {
      so: 'Gacanka Cadmeed iyo hawada diirran ee dekadda Bosaso. Xusuus qaas ah! ⚓🌊',
      en: 'The Red Sea breeze and warm greetings from the bustling port city of Bosaso.'
    },
    gradient: 'from-teal-600 via-cyan-700 to-blue-950',
    bgImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'berbera',
    category: 'cities',
    badge: { so: 'BERBERA', en: 'BERBERA' },
    title: { so: 'Berbera Breeze', en: 'Coastal Nights' },
    defaultMessage: {
      so: 'Xeebta quruxda badan iyo jawiga habeenkii ee Berbera. Nabad iyo caafimaad! 🌴🌙',
      en: 'The stunning coastline and magical night atmosphere of Berbera. Peace and love!'
    },
    gradient: 'from-sky-600 via-blue-700 to-indigo-950',
    bgImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'galkayo',
    category: 'cities',
    badge: { so: 'GALKAYO', en: 'GALKAYO' },
    title: { so: 'Galkayo Pulse', en: 'Heart of Mudug' },
    defaultMessage: {
      so: 'Fariin diirran iyo salaan wadajir ah oo ka timid bartamaha Soomaaliya. Guul! 💫🏙️',
      en: 'A warm message and greetings sent straight from the vibrant heart of Mudug.'
    },
    gradient: 'from-violet-800 via-purple-900 to-slate-950',
    bgImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop'
  }
];