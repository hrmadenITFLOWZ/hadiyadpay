export interface CardOption {
  id: string;
  category: 'dhaqan' | 'cities';
  badge: { so: string; en: string };
  title: { so: string; en: string };
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
    title: { so: 'Dhalasho Wacan', en: 'Joyful Celebration' },
    // Feestelijke gouden en warme patronen (geen mensen)
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
    badge: { so: 'AROOS 🏺', en: 'WEDDING 🏺' },
    title: { so: 'Xaflada Arooska', en: 'Traditional Wedding Blessing' },
    // Handgemaakte keramische kunst en goudtinten
    bgImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop',
    defaultRecipient: { so: 'Arooska iyo Ardo', en: 'Bride & Groom' },
    defaultSender: { so: 'Qoyskaaga', en: 'Your Family' },
    defaultMessage: { 
      so: 'Hambalyo! Illahay ha idinka dhigo kuwii isku waara ee isu naxariista, gurigooduna noqdo mid barako leh. 🏺💍', 
      en: 'Congratulations! May Allah bless your union and fill your home with everlasting peace and happiness. 🏺💍' 
    }
  },
  {
    id: 'eid',
    category: 'dhaqan',
    badge: { so: 'EID MUBARAK 🌙', en: 'EID MUBARAK 🌙' },
    title: { so: 'Ciid Wacan', en: 'Blessed Eid Mubarak' },
    // Rijke islamitische geometrische patronen en lantaarns (geen mensen)
    bgImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop',
    defaultRecipient: { so: 'Dhamaan Qoyska', en: 'Family & Loved Ones' },
    defaultSender: { so: 'Aden & Qoyska', en: 'Aden & Family' },
    defaultMessage: { 
      so: 'Ciid Mubaarak! Illahay ha aqbalo amalkeenna suubban, idinkuna ciidda nabad iyo caafimaad ku gaadha. 🌙✨', 
      en: 'Eid Mubarak! May Allah accept our good deeds and bring peace and prosperity to your household. 🌙✨' 
    }
  },
  {
    id: 'taageero',
    category: 'cities',
    badge: { so: 'TAAGEERO 🤝', en: 'SUPPORT 🤝' },
    title: { so: 'Taageero & Dhiirigelin', en: 'Strength & Encouragement' },
    // Warme terracotta en aardse texturen
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
    // Stijlvolle gouden en feestelijke achtergrond
    bgImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
    defaultRecipient: { so: 'Ardayga Guuleystay', en: 'Graduate' },
    defaultSender: { so: 'Qoyska oo idil', en: 'Proud Family' },
    defaultMessage: { 
      so: 'Hambalyo qalinjabinta! Tani waa bilowga safar dheer oo ay ka buuxaan guulo waaweyn iyo mustaqbal dhalaalaya. 🎓🎉', 
      en: 'Congratulations on your graduation! This is just the beginning of an amazing journey of success. 🎓🎉' 
    }
  },
  {
    id: 'mahadsanid',
    category: 'dhaqan',
    badge: { so: 'MAHADSANID 🤎', en: 'THANK YOU 🤎' },
    title: { so: 'Mahadcelin Wacan', en: 'Heartfelt Gratitude' },
    // Prachtige handgemaakte terracotta elementen
    bgImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=800&auto=format&fit=crop',
    defaultRecipient: { so: 'Qof Qaali ah', en: 'Special Person' },
    defaultSender: { so: 'Mahadsanid', en: 'With Gratitude' },
    defaultMessage: { 
      so: 'Waan uga mahadcelinayaa garab istaaggaaga iyo deeqsinimadaada. Illahay ha kaa abaalmariyo khayr. 🤎🙏', 
      en: 'Deeply thankful for your constant support and kindness. Wishing you the absolute best. 🤎🙏' 
    }
  },
  {
    id: 'barako',
    category: 'cities',
    badge: { so: 'BARAKO 🐪', en: 'BLESSINGS 🐪' },
    title: { so: 'Barako & Nabad', en: 'Nomadic Heritage Sunset' },
    // Magische gouden woestijnzonsondergang
    bgImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop',
    defaultRecipient: { so: 'Reer Xamar / Reer Baadiye', en: 'Dear Family' },
    defaultSender: { so: 'Qoyska Yurub', en: 'The Family Abroad' },
    defaultMessage: { 
      so: 'Nabad, barako, iyo caafimaad ha dego gurigiinna. Waxaan idinkoo nabad qaba idiin rajeynayaa maalin wacan. 🐪🌿', 
      en: 'May peace, blessings, and good health dwell in your home. Wishing you a wonderful day ahead. 🐪🌿' 
    }
  },
  {
    id: 'caasimadda',
    category: 'cities',
    badge: { so: 'CAASIMADDA 🌆', en: 'COASTAL BREEZE 🌆' },
    title: { so: 'Caasimadda Sunset', en: 'Coastal Breeze & Palms' },
    // Palmbomen en oceanische zonsondergang
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    defaultRecipient: { so: 'Asxaabta Xeepta', en: 'Beach Friends' },
    defaultSender: { so: 'Salaan diirran ✨', en: 'Warm Greetings' },
    defaultMessage: { 
      so: 'Xeepta caanka ah iyo habeennada jawiga macaan leh. Nabad iyo caafimaad! 🌅☕', 
      en: 'The legendary breeze and cozy nights. Wishing you peace and wonderful times! 🌅☕' 
    }
  },
  {
    id: 'buuraleyda',
    category: 'cities',
    badge: { so: 'DHULKA HOOYO ⛰️', en: 'HOMELAND NATURE ⛰️' },
    title: { so: 'Dhulka Buuraleyda ah', en: 'Homeland Highlands' },
    // Prachtige weelderige bergen en natuur
    bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    defaultRecipient: { so: 'Dhamaan Ehelka', en: 'All Relatives' },
    defaultSender: { so: 'Qoraa Digfeer', en: 'From Afar' },
    defaultMessage: { 
      so: 'Hawa-mareenka iyo cimilada wacan ee dhulka hooyo. Xasuus iyo jacayl badan baan idinka soo dirayaa! ⛰️💚', 
      en: 'Thinking of the breathtaking landscapes and homelands. Sending so much love and memories your way! ⛰️💚' 
    }
  }
];