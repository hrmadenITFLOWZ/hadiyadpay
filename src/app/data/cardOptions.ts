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
  // --- DECK 1: Dhaqan Vibes (Originele ontwerpen met sfeervolle foto's) ---
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
    title: { so: 'Xaflada Arooska', en: 'Wedding & Union' },
    defaultMessage: {
      so: 'Hambalyo arooska ku saabsan! Allah idinka yeero kuwii isu waara ee hela guri barako leh. 💍🕊️',
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

  // --- DECK 2: Geel iyo Guri Vibes (Met strakke diepe sfeer en unieke landschappen) ---
  {
    id: 'mogadishu',
    category: 'cities',
    badge: { so: 'XAMAR', en: 'MOGADISHU' },
    title: { so: 'Xamar Cadde Sunset', en: 'Xamar Golden Hour' },
    defaultMessage: {
      so: 'Salaan diirran oo ka soo jeeda Xamar Cadde, caasimadda taariikhiga ah. Habeen wacan! 🌇🌊',
      en: 'Warm greetings straight from Xamar, the historic coastal capital. Good evening!'
    },
    gradient: 'from-amber-600 via-orange-600 to-red-700',
    bgImage: 'https://images.unsplash.com/photo-1516026662394-266d5b060609?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'hargeisa',
    category: 'cities',
    badge: { so: 'HARGEISA', en: 'HARGEISA' },
    title: { so: 'Naasa Hablood Vibes', en: 'Hargeisa Hills' },
    defaultMessage: {
      so: 'Hambalyo iyo salaan qaali ah oo ka timid buuraha iyo jawiga degan ee Hargeysa. ⛰️✨',
      en: 'Special greetings and love sent from the iconic hills and cool breeze of Hargeisa.'
    },
    gradient: 'from-emerald-700 via-teal-800 to-cyan-900',
    bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'kismayo',
    category: 'cities',
    badge: { so: 'KISMAYO', en: 'KISMAYO' },
    title: { so: 'Jubbada Hoose Palms', en: 'Tropical Coast' },
    defaultMessage: {
      so: 'Dabaylaha qabow ee xeebta Kismaayo iyo caleemaha timirta. Maalin wacan oo farxad leh! 🌴☀️',
      en: 'Cool tropical breeze and palm trees from Kismayo. Wishing you a wonderful day!'
    },
    gradient: 'from-emerald-600 via-green-800 to-teal-950',
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'geel',
    category: 'cities',
    badge: { so: 'GEEL & SAXAR', en: 'NOMADIC VIBES' },
    title: { so: 'Baadiye & Geel', en: 'Nomadic Horizon' },
    defaultMessage: {
      so: 'Nolol baadiye, hiddaha iyo dhaqanka suuban ee geelayda. Barako iyo nabad! 🐪🌾',
      en: 'Pure nomadic heritage and desert horizon vibes. Sending peace and traditional blessings!'
    },
    gradient: 'from-yellow-600 via-amber-700 to-stone-900',
    bgImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'bosaso',
    category: 'cities',
    badge: { so: 'BOSASO', en: 'BOSASO' },
    title: { so: 'Gacanka Cadmeed', en: 'Red Sea Port' },
    defaultMessage: {
      so: 'Badda Cas iyo hawada diirran ee dekadda ganacsiga Bosaso. Xusuus qaas ah! ⚓🌊',
      en: 'The Red Sea breeze and warm greetings from the bustling port city of Bosaso.'
    },
    gradient: 'from-blue-600 via-indigo-800 to-slate-950',
    bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'berbera',
    category: 'cities',
    badge: { so: 'BERBERA', en: 'BERBERA' },
    title: { so: 'Berbera Beach Nights', en: 'Coastal Breeze' },
    defaultMessage: {
      so: 'Xeebta caanka ah iyo habeenada jawiga macaan leh ee Berbera. Nabad iyo caafimaad! 🌙✨',
      en: 'The stunning coastline and magical night atmosphere of Berbera beach. Peace and love!'
    },
    gradient: 'from-sky-600 via-blue-800 to-indigo-950',
    bgImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'galkayo',
    category: 'cities',
    badge: { so: 'GALKAYO', en: 'MUDUG PULSE' },
    title: { so: 'Bartamaha Soomaaliya', en: 'Heart of Mudug' },
    defaultMessage: {
      so: 'Fariin diirran iyo salaan wadajir ah oo ka timid wadnaha Soomaaliya. Guul iyo barako! 💫🏙️',
      en: 'A warm message and greetings sent straight from the vibrant heart of Mudug.'
    },
    gradient: 'from-purple-700 via-indigo-900 to-zinc-950',
    bgImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1000&auto=format&fit=crop'
  }
];