export interface CardOption {
  id: string;
  title: { so: string; en: string };
  badge: { so: string; en: string };
  gradient: string;
  bgImage: string;
  defaultMessage: { so: string; en: string };
}

export const cardOptions: CardOption[] = [
  {
    id: 'dhalasho',
    title: { so: 'Dhalasho Wacan', en: 'Birthday Celebration' },
    badge: { so: 'DHALASHO 🎂', en: 'BIRTHDAY 🎂' },
    gradient: 'from-rose-600 via-pink-600 to-red-700',
    bgImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    defaultMessage: {
      so: 'Waxaan kuu rajeynayaa caafimaad, barako, iyo sannad kale oo ay ka buuxaan farxad, qosol, iyo guul weyn. 🎉✨',
      en: 'Wishing you health, blessings, and another year filled with joy, laughter, and great success. 🎉✨',
    },
  },
  {
    id: 'aroos',
    title: { so: 'Xaflada Aroosaka', en: 'Wedding & Union' },
    badge: { so: 'AROOS 💍', en: 'WEDDING 💍' },
    gradient: 'from-amber-600 via-orange-600 to-yellow-700',
    bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    defaultMessage: {
      so: 'Hambalyo arooska ku saabsan! Allaha idinka yeero kuwii isu waara ee hela gurio barako leh. 💍🕊️',
      en: 'Congratulations on your wedding! May Allah bless your union with endless happiness and prosperity. 💍🕊️',
    },
  },
  {
    id: 'eid',
    title: { so: 'Ciid Mubarak', en: 'Eid Mubarak' },
    badge: { so: 'CIID 🌙', en: 'EID 🌙' },
    gradient: 'from-emerald-700 via-teal-700 to-cyan-800',
    bgImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80',
    defaultMessage: {
      so: 'Ciid Mubarak! Allaha naga aqbal adeecadeena asagana ha ina barakeeyo sanadaha soo socda. 🌙⭐',
      en: 'Eid Mubarak! May this joyous occasion bring peace, happiness, and prosperity to your family. 🌙⭐',
    },
  },
  {
    id: 'taageero',
    title: { so: 'Taageero & Dhiirigelin', en: 'Support & Encouragement' },
    badge: { so: 'TAAGEERO 💪', en: 'SUPPORT 💪' },
    gradient: 'from-purple-700 via-indigo-700 to-blue-800',
    bgImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    defaultMessage: {
      so: 'Waan kugula jiraa xilli kasta. Adkeysi iyo guul baan kuu rajeynayaa! 💪✨',
      en: 'Standing with you every step of the way. Wishing you strength and success! 💪✨',
    },
  },
];