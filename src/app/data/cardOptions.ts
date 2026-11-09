export interface CardOption {
  id: string;
  category: 'dhaqan' | 'cities';
  badge: { so: string; en: string };
  title: { so: string | { so: string; en: string }; en: string };
  gradient?: string;
  bgImage?: string;
  defaultRecipient: { so: string; en: string };
  defaultSender: { so: string; en: string };
  defaultMessage: { so: string; en: string };
}

export const cardOptions: CardOption[] = [
  {
    id: 'dhalasho',
    category: 'dhaqan',
    badge: { so: 'DHALASHO 🎂', en: 'BIRTHDAY 🎂' },
    title: { so: 'Dhalasho Wacan', en: 'Festive Celebration' },
    bgImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop',
    defaultRecipient: { so: 'Saxiib Qaali', en: 'Dear Friend' },
    defaultSender: { so: 'Walaalkaa / Saaxiibkaa', en: 'Your Friend' },
    defaultMessage: { 
      so: 'Waxaan kuu rajeynayaa caafimaad, barako, iyo sannad kale oo ay ka buuxaan farxad, qosol, iyo guul weyn. 🎂✨', 
      en: 'Wishing you health, blessings, and another year filled with immense joy and success! 🎂✨' 
    }
  },
  {
    id: 'aroos',
    category: 'dhaqan',
    badge: { so: 'AROOS & DHAQAN 🏺', en: 'WEDDING & HERITAGE 🏺' },
    title: { so: 'Xaflada Arooska & Dhaqanka', en: 'Traditional Wedding Celebration' },
    // Warme goudtinten, traditionele stoffen en feestelijke sfeer (geen westerse personen)
    bgImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
    defaultRecipient: { so: 'Arooska iyo Ardo', en: 'Bride & Groom' },
    defaultSender: { so: 'Qoyskaaga', en: 'Your Family' },
    defaultMessage: { 
      so: 'Hambalyo! Illahay ha idinka dhigo kuwii isku waara ee isu naxariista, gurigooduna noqdo mid barako leh. 🏺💍', 
      en: 'Congratulations! May Allah bless your union and fill your home with everlasting peace and happiness. 🏺💍' 
    }
  },
  {
    id: 'henna',
    category: 'dhaqan',
    badge: { so: 'XAFXAD & HENNA ✨', en: 'HENNA NIGHT ✨' },
    title: { so: 'Habeenka Henna & Dahab', en: 'Henna & Gold Night' },
    // Prachtige rijke patronen geïnspireerd op traditionele hennafeesten
    bgImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop',
    defaultRecipient: { so: 'Saxiibaddii Qaaliga ahayd', en: 'Dearest' },
    defaultSender: { so: 'Asxaabtaada', en: 'Your Friends' },
    defaultMessage: { 
      so: 'Habeen qurux badan oo ay ka buuxaan heeso dhaqameed, farxad, iyo henna cajiib ah! ✨ Handasaad wacan! 🤎', 
      en: 'A beautiful night filled with traditional songs, joy, and stunning henna patterns! ✨ Wishing you the best! 🤎' 
    }
  },
  {
    id: 'eid',
    category: 'dhaqan',
    badge: { so: 'CIID WACAN 🌙', en: 'EID MUBARAK 🌙' },
    title: { so: 'Ciid Wacan & Barako', en: 'Blessed Eid Mubarak' },
    // Sfeervolle gouden lantaarns en oosterse ornamenten
    bgImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop',
    defaultRecipient: { so: 'Dhamaan Qoyska', en: 'Family & Loved Ones' },
    defaultSender: { so: 'Aden & Qoyska', en: 'Aden & Family' },
    defaultMessage: { 
      so: 'Ciid Mubaarak! Illahay ha aqbalo amalkeenna suubban, idinkuna ciidda nabad iyo caafimaad ku gaadha. 🌙✨', 
      en: 'Eid Mubarak! May Allah accept our good deeds and bring peace and prosperity to your household. 🌙✨' 
    }
  },
  {
    id: 'haargab',
    category: 'dhaqan',
    badge: { so: 'HIDDHA & DHAQAN 🧺', en: 'HERITAGE ART 🧺' },
    title: { so: 'Dhaqanka Hiddaha Hooyo', en: 'Traditional Handicraft Heritage' },
    // Handgemaakte kunst en traditionele manden
    bgImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop',
    defaultRecipient: { so: 'Ehelka iyo Asxaabta', en: 'Family & Friends' },
    defaultSender: { so: 'HadiyadPay', en: 'HadiyadPay Team' },
    defaultMessage: { 
      so: 'Qiimaha hiddaha iyo dhaqanka iyo xusuusta dalkeenna hooyo oo qalbiga ku weyn. 🧺🤎', 
      en: 'Celebrating our rich heritage, traditions, and timeless cultural craftsmanship. 🧺🤎' 
    }
  },
  {
    id: 'taageero',
    category: 'cities',
    badge: { so: 'TAAGEERO 🤝', en: 'SUPPORT 🤝' },
    title: { so: 'Taageero & Dhiirigelin', en: 'Strength & Encouragement' },
    bgImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop',
    defaultRecipient: { so: 'Saxiibkey', en: 'My Friend' },
    defaultSender: { so: 'Walaalkii', en: 'Your Brother' },
    defaultMessage: { 
      so: 'Mar walba garabkaaga ayaan taaganahay. Guul iyo gobanimo ayaan kuu rajeynayaa hawlahaaga cusub! 🤝🌟', 
      en: 'Always standing by your side. Wishing you strength, success, and prosperity in all your endeavors! 🤝🌟' 
    }
  },
  {
    id: 'guul',
    category: 'cities',
    badge: { so: 'GUUL 🎓', en: 'SUCCESS 🎓' },
    title: { so: 'Qalinjabin & Guul', en: 'Milestone & Success' },
    bgImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
    defaultRecipient: { so: 'Ardayga Guuleystay', en: 'Graduate' },
    defaultSender: { so: 'Qoyska oo idil', en: 'Proud Family' },
    defaultMessage: { 
      so: 'Hambalyo qalinjabinta! Tani waa bilowga safar dheer oo ay ka buuxaan guulo waaweyn iyo mustaqbal dhalaalaya. 🎓🎉', 
      en: 'Congratulations on your graduation! This is just the beginning of an amazing journey of success. 🎓🎉' 
    }
  },
  {
    id: 'barako',
    category: 'cities',
    badge: { so: 'BARAKO 🐪', en: 'BLESSINGS 🐪' },
    title: { so: 'Barako & Nabad', en: 'Nomadic Heritage Sunset' },
    bgImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop',
    defaultRecipient: { so: 'Reer Xamar / Reer Baadiye', en: 'Dear Family' },
    defaultSender: { so: 'Qoyska Yurub', en: 'The Family Abroad' },
    defaultMessage: { 
      so: 'Nabad, barako, iyo caafimaad ha dego gurigiinna. Waxaan idinkoo nabad qaba idiin rajeynayaa maalin wacan. 🐪🌿', 
      en: 'May peace, blessings, and good health dwell in your home. Wishing you a wonderful day ahead. 🐪🌿' 
    }
  }
];