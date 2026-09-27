export interface CardOption {
  id: string;
  category: 'dhaqan' | 'cities';
  badge: { so: string; en: string };
  title: { so: string; en: string };
  defaultMessage: { so: string; en: string };
  gradient: string;
}

export const cardOptions: CardOption[] = [
  // --- DECK 1: Dhaqan Vibes (Originele vrolijke kleuren & emoji's) ---
  {
    id: 'dhalasho',
    category: 'dhaqan',
    badge: { so: 'DHALASHO', en: 'BIRTHDAY' },
    title: { so: 'Dhalasho Wacan 🎉', en: 'Birthday Celebration 🎉' },
    defaultMessage: {
      so: 'Waxaan kuu rajeynayaa caafimaad, barako, iyo sannad kale oo ay ka buuxaan farxad, qosol, iyo guul weyn. 🎉✨',
      en: 'Wishing you health, blessings, and another year filled with happiness, laughter, and great success.'
    },
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #e11d48 100%)'
  },
  {
    id: 'aroos',
    category: 'dhaqan',
    badge: { so: 'AROOS', en: 'WEDDING' },
    title: { so: 'Xaflada Arooska 💍', en: 'Wedding & Union 💍' },
    defaultMessage: {
      so: 'Hambalyo arooska ku saabsan! Allah idinka yeero kuwii isu waara ee hela guri barako leh. 💍🕊️',
      en: 'Congratulations on your wedding! May Allah bless your union and fill your home with peace and joy.'
    },
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #d97706 100%)'
  },
  {
    id: 'eid',
    category: 'dhaqan',
    badge: { so: 'EID', en: 'EID' },
    title: { so: 'Eid Mubarak 🌙', en: 'Eid Mubarak 🌙' },
    defaultMessage: {
      so: 'Eid Mubaarak! Waxaan kuu rajeynayaa adiga iyo qoyskaagaba nabad, caafimaad, iyo barako badan. 🌙⭐',
      en: 'Eid Mubarak! May this joyous occasion bring peace, happiness, and prosperity to your family.'
    },
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)'
  },
  {
    id: 'taageero',
    category: 'dhaqan',
    badge: { so: 'TAAGEERO', en: 'SUPPORT' },
    title: { so: 'Taageero & Dhiirigelin 💪', en: 'Support & Encouragement 💪' },
    defaultMessage: {
      so: 'Waan kugula jirbaa mar walba. Ha welwelin, si adag u soco oo guushu waa kuu dhowdahay! 💪',
      en: 'I am always supporting you. Keep your head up, stay strong, and success is right around the corner!'
    },
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #2563eb 100%)'
  },
  {
    id: 'guul',
    category: 'dhaqan',
    badge: { so: 'GUUL', en: 'SUCCESS' },
    title: { so: 'Qalinjabin & Guul 🎓', en: 'Graduation & Success 🎓' },
    defaultMessage: {
      so: 'Hambalyo heerkan sare aad ka gaartay! Waxaan kuu rajeynayaa mustaqbal ifaya iyo guulo waaweyn. 🎓🚀',
      en: 'Congratulations on your incredible achievement! Wishing you a bright future and endless successes.'
    },
    gradient: 'linear-gradient(135deg, #a855f7 0%, #c084fc 50%, #9333ea 100%)'
  },
  {
    id: 'mahadcelin',
    category: 'dhaqan',
    badge: { so: 'MAHAD', en: 'THANKS' },
    title: { so: 'Mahadcelin Wacan 🙏', en: 'Heartfelt Thanks 🙏' },
    defaultMessage: {
      so: 'Waan ka mahadcelinayaa garab istaaggaaga iyo wanaaggaaga joogtada ah. Alle ha ku xafido! 🙏💛',
      en: 'Thank you so much for your constant support and kindness. May God protect you!'
    },
    gradient: 'linear-gradient(135deg, #eab308 0%, #f59e0b 50%, #ca8a04 100%)'
  },
  {
    id: 'barako',
    category: 'dhaqan',
    badge: { so: 'BARAKO', en: 'BLESSINGS' },
    title: { so: 'Barako & Nabad 🌟', en: 'Blessings & Peace 🌟' },
    defaultMessage: {
      so: 'Maalintaan qiimaha badan waxaa ka buuxa duco iyo barako adiga iyo reerkaagaba ku socota. 🌟🤲',
      en: 'Sending you prayers and blessings for a peaceful and joyous day ahead for you and your family.'
    },
    gradient: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #0d9488 100%)'
  },

  // --- DECK 2: Geel iyo Guri Vibes (Super popping, helder & energieke animatie kleuren) ---
  {
    id: 'mogadishu',
    category: 'cities',
    badge: { so: 'XAMAR', en: 'MOGADISHU' },
    title: { so: 'Xamar Cadde Sunset 🌇', en: 'Xamar Golden Hour 🌇' },
    defaultMessage: {
      so: 'Salaan diirran oo ka soo jeeda Xamar Cadde, caasimadda taariikhiga ah. Habeen wacan! 🌇🌊',
      en: 'Warm greetings straight from Xamar, the historic coastal capital. Good evening!'
    },
    gradient: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 50%, #ff512f 100%)'
  },
  {
    id: 'hargeisa',
    category: 'cities',
    badge: { so: 'HARGEISA', en: 'HARGEISA' },
    title: { so: 'Naasa Hablood Vibes ⛰️', en: 'Hargeisa Hills ⛰️' },
    defaultMessage: {
      so: 'Hambalyo iyo salaan qaali ah oo ka timid buuraha iyo jawiga degan ee Hargeysa. ⛰️✨',
      en: 'Special greetings and love sent from the iconic hills and cool breeze of Hargeisa.'
    },
    gradient: 'linear-gradient(135deg, #0ba360 0%, #3cba92 50%, #00b09b 100%)'
  },
  {
    id: 'kismayo',
    category: 'cities',
    badge: { so: 'KISMAYO', en: 'KISMAYO' },
    title: { so: 'Jubbada Hoose Palms 🌴', en: 'Tropical Coast 🌴' },
    defaultMessage: {
      so: 'Dabaylaha qabow ee xeebta Kismaayo iyo caleemaha timirta. Maalin wacan oo farxad leh! 🌴☀️',
      en: 'Cool tropical breeze and palm trees from Kismayo. Wishing you a wonderful day!'
    },
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 50%, #00b09b 100%)'
  },
  {
    id: 'geel',
    category: 'cities',
    badge: { so: 'GEEL & SAXAR', en: 'NOMADIC VIBES' },
    title: { so: 'Baadiye & Geel 🐪', en: 'Nomadic Horizon 🐪' },
    defaultMessage: {
      so: 'Nolol baadiye, hiddaha iyo dhaqanka suuban ee geelayda. Barako iyo nabad! 🐪🌾',
      en: 'Pure nomadic heritage and desert horizon vibes. Sending peace and traditional blessings!'
    },
    gradient: 'linear-gradient(135deg, #f7b733 0%, #fc4a1a 50%, #f7971e 100%)'
  },
  {
    id: 'bosaso',
    category: 'cities',
    badge: { so: 'BOSASO', en: 'BOSASO' },
    title: { so: 'Gacanka Cadmeed ⚓', en: 'Red Sea Port ⚓' },
    defaultMessage: {
      so: 'Badda Cas iyo hawada diirran ee dekadda ganacsiga Bosaso. Xusuus qaas ah! ⚓🌊',
      en: 'The Red Sea breeze and warm greetings from the bustling port city of Bosaso.'
    },
    gradient: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 50%, #00d2ff 100%)'
  },
  {
    id: 'berbera',
    category: 'cities',
    badge: { so: 'BERBERA', en: 'BERBERA' },
    title: { so: 'Berbera Beach Nights 🌊', en: 'Coastal Breeze 🌊' },
    defaultMessage: {
      so: 'Xeebta caanka ah iyo habeenada jawiga macaan leh ee Berbera. Nabad iyo caafimaad! 🌙✨',
      en: 'The stunning coastline and magical night atmosphere of Berbera beach. Peace and love!'
    },
    gradient: 'linear-gradient(135deg, #2af598 0%, #009efd 50%, #00c6ff 100%)'
  },
  {
    id: 'galkayo',
    category: 'cities',
    badge: { so: 'GALKAYO', en: 'MUDUG PULSE' },
    title: { so: 'Bartamaha Soomaaliya ✨', en: 'Heart of Mudug ✨' },
    defaultMessage: {
      so: 'Fariin diirran iyo salaan wadajir ah oo ka timid wadnaha Soomaaliya. Guul iyo barako! 💫🏙️',
      en: 'A warm message and greetings sent straight from the vibrant heart of Mudug.'
    },
    gradient: 'linear-gradient(135deg, #b224ef 0%, #7579ff 50%, #ff758c 100%)'
  }
];