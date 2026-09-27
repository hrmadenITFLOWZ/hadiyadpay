export interface CardOption {
  id: string;
  category: 'dhaqan' | 'cities';
  badge: { so: string; en: string };
  title: { so: string; en: string };
  defaultRecipient: { so: string; en: string };
  defaultSender: { so: string; en: string };
  defaultMessage: { so: string; en: string };
  gradient?: string;
  bgImage?: string;
}

export const cardOptions: CardOption[] = [
  // --- DECK 1: Dhaqan Vibes ---
  {
    id: 'dhalasho',
    category: 'dhaqan',
    badge: { so: 'DHALASHO', en: 'BIRTHDAY' },
    title: { so: 'Dhalasho Wacan 🎉✨', en: 'Birthday Celebration 🎉✨' },
    defaultRecipient: { so: 'Saxiib Qaali 🎂', en: 'Dear Friend 🎂' },
    defaultSender: { so: 'Walaalkaa / Saaxiibkaa ✨', en: 'Your Friend ✨' },
    defaultMessage: {
      so: 'Waxaan kuu rajeynayaa caafimaad, barako, iyo sannad kale oo ay ka buuxaan farxad, qosol, iyo guul weyn. 🎉✨',
      en: 'Wishing you health, blessings, and another year filled with happiness, laughter, and great success.'
    },
    gradient: 'linear-gradient(135deg, #be185d 0%, #9f1239 100%)'
  },
  {
    id: 'aroos',
    category: 'dhaqan',
    badge: { so: 'AROOS', en: 'WEDDING' },
    title: { so: 'Xaflada Arooska 💍🕊️', en: 'Wedding & Union 💍🕊️' },
    defaultRecipient: { so: 'Lamaanaha Cusub 💍', en: 'The Happy Couple 💍' },
    defaultSender: { so: 'Asxaabtaada & Ehelka 💛', en: 'Friends & Loved Ones 💛' },
    defaultMessage: {
      so: 'Hambalyo arooska ku saabsan! Allah idinka yeero kuwii isu waara ee hela guri barako leh. 💍🕊️',
      en: 'Congratulations on your wedding! May Allah bless your union and fill your home with peace and joy.'
    },
    gradient: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)'
  },
  {
    id: 'eid',
    category: 'dhaqan',
    badge: { so: 'EID', en: 'EID' },
    title: { so: 'Eid Mubarak 🌙⭐', en: 'Eid Mubarak 🌙⭐' },
    defaultRecipient: { so: 'Saxiibkey Qaali 🌙', en: 'Dear Friend 🌙' },
    defaultSender: { so: 'Saaxiibkaaga ka maqan ⭐', en: 'Your Friend Abroad ⭐' },
    defaultMessage: {
      so: 'Eid Mubaarak! Waxaan kuu rajeynayaa adiga iyo dadkaaga ku hareeraysan nabad, caafimaad, iyo barako badan. 🌙⭐',
      en: 'Eid Mubarak! May this joyous occasion bring peace, happiness, and prosperity to you and your loved ones.'
    },
    gradient: 'linear-gradient(135deg, #047857 0%, #065f46 100%)'
  },
  {
    id: 'taageero',
    category: 'dhaqan',
    badge: { so: 'TAAGEERO', en: 'SUPPORT' },
    title: { so: 'Taageero & Dhiirigelin 💪', en: 'Support & Encouragement 💪' },
    defaultRecipient: { so: 'Aqoonyahan Qaali 💪', en: 'Dear Friend 💪' },
    defaultSender: { so: 'Taageerahaaga Joogtada ah 🤝', en: 'Your Constant Supporter 🤝' },
    defaultMessage: {
      so: 'Waan kugula jirbaa mar walba. Ha welwelin, si adag u soco oo guushu waa kuu dhowdahay! 💪',
      en: 'I am always supporting you. Keep your head up, stay strong, and success is right around the corner!'
    },
    gradient: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)'
  },
  {
    id: 'guul',
    category: 'dhaqan',
    badge: { so: 'GUUL', en: 'SUCCESS' },
    title: { so: 'Qalinjabin & Guul 🎓🚀', en: 'Graduation & Success 🎓🚀' },
    defaultRecipient: { so: 'Dr. / Injineer Cusub 🎓', en: 'Graduate Star 🎓' },
    defaultSender: { so: 'Taageerahaaga Gaarka ah 🚀', en: 'Your Proud Supporter 🚀' },
    defaultMessage: {
      so: 'Hambalyo heerkan sare aad ka gaartay! Waxaan kuu rajeynayaa mustaqbal ifaya iyo guulo waaweyn. 🎓🚀',
      en: 'Congratulations on your incredible achievement! Wishing you a bright future and endless successes.'
    },
    gradient: 'linear-gradient(135deg, #6b21a8 0%, #581c87 100%)'
  },
  {
    id: 'mahadcelin',
    category: 'dhaqan',
    badge: { so: 'MAHAD', en: 'THANKS' },
    title: { so: 'Mahadcelin Wacan 🙏💛', en: 'Heartfelt Thanks 🙏💛' },
    defaultRecipient: { so: 'Saxiibka Wanaagsan 🙏', en: 'Kind Friend 🙏' },
    defaultSender: { so: 'Mahadsanid Qaali 💛', en: 'Grateful Friend 💛' },
    defaultMessage: {
      so: 'Waan ka mahadcelinayaa garab istaaggaaga iyo wanaaggaaga joogtada ah. Alle ha ku xafido! 🙏💛',
      en: 'Thank you so much for your constant support and kindness. May God protect you!'
    },
    gradient: 'linear-gradient(135deg, #b45309 0%, #92400e 100%)'
  },
  {
    id: 'barako',
    category: 'dhaqan',
    badge: { so: 'BARAKO', en: 'BLESSINGS' },
    title: { so: 'Barako & Nabad 🌟🤲', en: 'Blessings & Peace 🌟🤲' },
    defaultRecipient: { so: 'Asxaabta Qaali ah 🌟', en: 'Dear Friends 🌟' },
    defaultSender: { so: 'Duco & Salaam 🤲', en: 'Prayers & Blessings 🤲' },
    defaultMessage: {
      so: 'Maalintaan qiimaha badan waxaa ka buuxa duco iyo barako adiga iyo dadkaaga ku Xiga ku socota. 🌟🤲',
      en: 'Sending you prayers and blessings for a peaceful and joyous day ahead.'
    },
    gradient: 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)'
  },

  // --- DECK 2: Geel iyo Guri Vibes ---
  {
    id: 'mogadishu',
    category: 'cities',
    badge: { so: 'CAASIMADDA', en: 'CAPITAL VIBES' },
    title: { so: 'Caasimadda Sunset 🌇', en: 'Golden Hour Sunset 🌇' },
    defaultRecipient: { so: 'Ehelka & Asxaabta Qaali 🌇', en: 'Dear Friends & Family 🌇' },
    defaultSender: { so: 'Saaxiibkaaga fog 🌊', en: 'From Afar 🌊' },
    defaultMessage: {
      so: 'Salaan diirran oo ka soo jeeda caasimadda taariikhiga ah ee quruxda badan. Habeen wacan! 🌇🌊',
      en: 'Warm greetings straight from the historic coastal capital. Good evening!'
    },
    bgImage: 'https://images.unsplash.com/photo-1516026662394-266d5b060609?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'hargeisa',
    category: 'cities',
    badge: { so: 'BUURAHA', en: 'HIGHLANDS' },
    title: { so: 'Dhulka Buuraleyda ah ⛰️', en: 'Scenic Hills ⛰️' },
    defaultRecipient: { so: 'Asxaabta Wanaagsan ⛰️', en: 'Special Friends ⛰️' },
    defaultSender: { so: 'Saaxiibkaaga fog ✨', en: 'Your Friend ✨' },
    defaultMessage: {
      so: 'Hambalyo iyo salaan qaali ah oo ka timid buuraha iyo jawiga degan. ⛰️✨',
      en: 'Special greetings and love sent from the iconic hills and cool breeze.'
    },
    bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'kismayo',
    category: 'cities',
    badge: { so: 'XEEBTA', en: 'COASTAL BREEZE' },
    title: { so: 'Jubbada Palms 🌴', en: 'Tropical Coast 🌴' },
    defaultRecipient: { so: 'Asxaabta Xeebta 🌴', en: 'Coastal Friends 🌴' },
    defaultSender: { so: 'Walaalkaa ☀️', en: 'Your Brother ☀️' },
    defaultMessage: {
      so: 'Dabaylaha qabow ee xeebta iyo caleemaha timirta. Maalin wacan oo farxad leh! 🌴☀️',
      en: 'Cool tropical breeze and palm trees. Wishing you a wonderful day!'
    },
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'geel',
    category: 'cities',
    badge: { so: 'HIDDE & DHAQAN', en: 'NOMADIC VIBES' },
    title: { so: 'Baadiye & Geel 🐪', en: 'Nomadic Horizon 🐪' },
    defaultRecipient: { so: 'Geeljiraha Guud 🐪', en: 'Nomadic Community 🐪' },
    defaultSender: { so: 'Hiddaha & Dhaqanka 🌾', en: 'Heritage Lover 🌾' },
    defaultMessage: {
      so: 'Nolol baadiye, hiddaha iyo dhaqanka suuban. Barako iyo nabad! 🐪🌾',
      en: 'Pure nomadic heritage and desert horizon vibes. Sending peace and traditional blessings!'
    },
    bgImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'bosaso',
    category: 'cities',
    badge: { so: 'DEKADDA', en: 'PORT CITY' },
    title: { so: 'Dekadda Ganacsiga ⚓', en: 'Seaside Port ⚓' },
    defaultRecipient: { so: 'Asxaabta Dekadda ⚓', en: 'Port Friends ⚓' },
    defaultSender: { so: 'Ganacsade / Saaxiib 🌊', en: 'Your Partner 🌊' },
    defaultMessage: {
      so: 'Badda iyo hawada diirran ee dekadda ganacsiga. Xusuus qaas ah! ⚓🌊',
      en: 'The sea breeze and warm greetings from the bustling port city.'
    },
    bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'berbera',
    category: 'cities',
    badge: { so: 'XEEBTA CAS', en: 'BEACH NIGHTS' },
    title: { so: 'Habeenada Xeebta 🌊', en: 'Coastal Breeze 🌊' },
    defaultRecipient: { so: 'Asxaabta Xeebta 🌊', en: 'Beach Friends 🌊' },
    defaultSender: { so: 'Salaan diirran ✨', en: 'Warm Greetings ✨' },
    defaultMessage: {
      so: 'Xeebta caanka ah iyo habeenada jawiga macaan leh. Nabad iyo caafimaad! 🌙✨',
      en: 'The stunning coastline and magical night atmosphere. Peace and love!'
    },
    bgImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'galkayo',
    category: 'cities',
    badge: { so: 'BARTAMAHA', en: 'HEARTLAND' },
    title: { so: 'Bartamaha Dalka ✨', en: 'Heart of the Region ✨' },
    defaultRecipient: { so: 'Asxaabta Qaali ✨', en: 'Dear Friends ✨' },
    defaultSender: { so: 'Wadajir & Nabad 💫', en: 'Solidarity 💫' },
    defaultMessage: {
      so: 'Fariin diirran iyo salaan wadajir ah oo ka timid bartamaha dalka. Guul iyo barako! 💫🏙️',
      en: 'A warm message and greetings sent straight from the vibrant heart of the region.'
    },
    bgImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1000&auto=format&fit=crop'
  }
];