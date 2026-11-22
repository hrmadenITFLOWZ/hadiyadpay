import {
  type CardOption,
} from '../../lib/card-types';

export {
  cardOccasions,
  occasionLabels,
  type CardCategory,
  type CardOccasion,
  type CardOption,
} from '../../lib/card-types';

export const cardOptions: CardOption[] = [
  {
    id:
      'dhalasho',

    slug:
      'birthday-greeting',

    category:
      'celebrations',

    occasion:
      'birthday',

    searchTerms: [
      'dhalasho',
      'birthday',
      'cake',
      'celebration',
    ],

    recipientTypes: [
      'friend',
      'family',
    ],

    styles: [
      'illustrated',
    ],

    colors: [
      'terracotta',
      'gold',
    ],

    languages: [
      'so',
      'en',
      'nl',
    ],

    orientation:
      'portrait',

    featured:
      true,

    badge: {
      so:
        'DHALASHO 🎂',

      en:
        'BIRTHDAY 🎂',

      nl:
        'VERJAARDAG 🎂',
    },

    title: {
      so:
        'Dhalasho Wacan',

      en:
        'Festive Birthday Celebration',

      nl:
        'Feestelijke verjaardag',
    },

    description: {
      so:
        'Kaar farxad leh oo loogu dabaaldego maalinta dhalashada.',

      en:
        'A joyful card to celebrate someone’s birthday.',

      nl:
        'Een vrolijke kaart om een verjaardag te vieren.',
    },

    artwork: {
      type:
        'local-image',

      src:
        '/images/cards/birthday.svg',

      alt: {
        so:
          'Farshaxan dhalasho oo midabbo diirran leh',

        en:
          'Warm-toned original birthday artwork',

        nl:
          'Originele verjaardagsillustratie in warme tinten',
      },

      focalPoint:
        'center',

      owner:
        'hadiyadpay',
    },

    defaultRecipient: {
      so:
        'Saxiib Qaali',

      en:
        'Dear Friend',

      nl:
        'Lieve vriend',
    },

    defaultSender: {
      so:
        'Walaalkaa / Saaxiibkaa',

      en:
        'Your Friend',

      nl:
        'Je vriend',
    },

    defaultMessage: {
      so:
        'Waxaan kuu rajeynayaa caafimaad, barako, iyo sannad kale oo ay ka buuxaan farxad, qosol, iyo guul weyn. 🎂✨',

      en:
        'Wishing you health, blessings, and another year filled with immense joy and success! 🎂✨',

      nl:
        'Ik wens je gezondheid, zegeningen en een jaar vol plezier en mooie momenten! 🎂✨',
    },
  },

  {
    id:
      'aroos',

    slug:
      'somali-wedding',

    category:
      'celebrations',

    occasion:
      'wedding',

    searchTerms: [
      'aroos',
      'wedding',
      'marriage',
      'traditional',
    ],

    recipientTypes: [
      'partner',
      'family',
    ],

    styles: [
      'traditional',
      'ornamental',
    ],

    colors: [
      'gold',
      'terracotta',
    ],

    languages: [
      'so',
      'en',
      'nl',
    ],

    orientation:
      'landscape',

    featured:
      true,

    badge: {
      so:
        'AROOS & DHAQAN 🏺',

      en:
        'WEDDING & HERITAGE 🏺',

      nl:
        'BRUILOFT & ERFGOED 🏺',
    },

    title: {
      so:
        'Xaflada Arooska & Dhaqanka',

      en:
        'Traditional Somali Wedding',

      nl:
        'Traditionele Somalische bruiloft',
    },

    description: {
      so:
        'Hambalyo aroos oo leh quruxda dhaqanka.',

      en:
        'A wedding greeting with a heritage-inspired design.',

      nl:
        'Een huwelijksgroet met een ontwerp geïnspireerd op erfgoed.',
    },

    artwork: {
      type:
        'local-image',

      src:
        '/images/cards/wedding.svg',

      alt: {
        so:
          'Farshaxan aroos oo dahab iyo ciid ah',

        en:
          'Original wedding artwork in gold and sand tones',

        nl:
          'Originele bruiloftsillustratie in goud- en zandtinten',
      },

      focalPoint:
        'center',

      owner:
        'hadiyadpay',
    },

    defaultRecipient: {
      so:
        'Arooska iyo Ardo',

      en:
        'Bride & Groom',

      nl:
        'Bruid en bruidegom',
    },

    defaultSender: {
      so:
        'Qoyskaaga',

      en:
        'Your Family',

      nl:
        'Je familie',
    },

    defaultMessage: {
      so:
        'Hambalyo! Illahay ha idinka dhigo kuwii isku waara ee isu naxariista, gurigooduna noqdo mid barako leh. 🏺💍',

      en:
        'Congratulations! May Allah bless your union and fill your home with everlasting peace and happiness. 🏺💍',

      nl:
        'Van harte gefeliciteerd! Moge jullie huis gevuld zijn met vrede, liefde en geluk. 🏺💍',
    },
  },

  {
    id:
      'henna',

    slug:
      'henna-night',

    category:
      'celebrations',

    occasion:
      'henna',

    searchTerms: [
      'xafxad',
      'henna',
      'gold',
      'celebration',
    ],

    recipientTypes: [
      'friend',
      'family',
    ],

    styles: [
      'ornamental',
      'floral',
    ],

    colors: [
      'terracotta',
      'rose',
    ],

    languages: [
      'so',
      'en',
      'nl',
    ],

    orientation:
      'portrait',

    badge: {
      so:
        'XAFXAD & HENNA ✨',

      en:
        'HENNA NIGHT ✨',

      nl:
        'HENNAFEEST ✨',
    },

    title: {
      so:
        'Habeenka Henna & Dahab',

      en:
        'Henna & Gold Night',

      nl:
        'Henna- en gouden avond',
    },

    description: {
      so:
        'Naqshad qurux badan oo loogu dabaaldego habeenka henna.',

      en:
        'A celebratory design for a special henna night.',

      nl:
        'Een feestelijk ontwerp voor een bijzondere henna-avond.',
    },

    artwork: {
      type:
        'local-image',

      src:
        '/images/cards/henna.svg',

      alt: {
        so:
          'Farshaxan henna oo casaan iyo dahab ah',

        en:
          'Original henna artwork in rose and gold',

        nl:
          'Originele henna-illustratie in roze en goud',
      },

      focalPoint:
        'center',

      owner:
        'hadiyadpay',
    },

    defaultRecipient: {
      so:
        'Saxiibaddii Qaaliga ahayd',

      en:
        'Dearest',

      nl:
        'Lieve vriendin',
    },

    defaultSender: {
      so:
        'Asxaabtaada',

      en:
        'Your Friends',

      nl:
        'Je vrienden',
    },

    defaultMessage: {
      so:
        'Habeen qurux badan oo ay ka buuxaan heeso dhaqameed, farxad, iyo henna cajiib ah! ✨ Handasaad wacan! 🤎',

      en:
        'A beautiful night filled with traditional songs, joy, and stunning henna patterns! ✨ Wishing you the best! 🤎',

      nl:
        'Een mooie avond vol vreugde, muziek en prachtige hennapatronen! ✨ Geniet ervan! 🤎',
    },
  },

  {
    id:
      'eid',

    slug:
      'eid-mubarak',

    category:
      'celebrations',

    occasion:
      'eid',

    searchTerms: [
      'ciid',
      'eid',
      'mubarak',
      'blessed',
    ],

    recipientTypes: [
      'family',
      'friend',
    ],

    styles: [
      'geometric',
      'ornamental',
    ],

    colors: [
      'blue',
      'gold',
    ],

    languages: [
      'so',
      'en',
      'nl',
    ],

    orientation:
      'landscape',

    badge: {
      so:
        'CIID WACAN 🌙',

      en:
        'EID MUBARAK 🌙',

      nl:
        'EID MUBARAK 🌙',
    },

    title: {
      so:
        'Ciid Wacan & Barako',

      en:
        'Blessed Eid Mubarak',

      nl:
        'Gezegende Eid Mubarak',
    },

    description: {
      so:
        'Kaar Ciid oo ay ku dheehan tahay nabad iyo barako.',

      en:
        'An Eid greeting celebrating peace and blessings.',

      nl:
        'Een Eid-groet vol wensen van vrede en zegeningen.',
    },

    artwork: {
      type:
        'local-image',

      src:
        '/images/cards/eid.svg',

      alt: {
        so:
          'Habeen buluug ah oo dayax iyo xiddigo leh',

        en:
          'Original night-sky artwork with a crescent and stars',

        nl:
          'Originele nachthemelillustratie met maan en sterren',
      },

      focalPoint:
        'center',

      owner:
        'hadiyadpay',
    },

    defaultRecipient: {
      so:
        'Dhamaan Qoyska',

      en:
        'Family & Loved Ones',

      nl:
        'Familie en dierbaren',
    },

    defaultSender: {
      so:
        'Aden & Qoyska',

      en:
        'Aden & Family',

      nl:
        'Aden en familie',
    },

    defaultMessage: {
      so:
        'Ciid Mubaarak! Illahay ha aqbalo amalkeenna suubban, idinkuna ciidda nabad iyo caafimaad ku gaadha. 🌙✨',

      en:
        'Eid Mubarak! May Allah accept our good deeds and bring peace and prosperity to your household. 🌙✨',

      nl:
        'Eid Mubarak! Moge deze dag vrede en voorspoed brengen voor jullie allemaal. 🌙✨',
    },
  },

  {
    id:
      'haargab',

    slug:
      'heritage-craft',

    category:
      'celebrations',

    occasion:
      'heritage',

    searchTerms: [
      'hiddha',
      'heritage',
      'craft',
      'tradition',
    ],

    recipientTypes: [
      'family',
      'friend',
    ],

    styles: [
      'traditional',
      'geometric',
    ],

    colors: [
      'terracotta',
      'neutral',
    ],

    languages: [
      'so',
      'en',
      'nl',
    ],

    orientation:
      'portrait',

    badge: {
      so:
        'HIDDHA & DHAQAN 🧺',

      en:
        'HERITAGE ART 🧺',

      nl:
        'ERFGOED 🧺',
    },

    title: {
      so:
        'Dhaqanka Hiddaha Hooyo',

      en:
        'Handicraft Heritage',

      nl:
        'Handwerk en erfgoed',
    },

    description: {
      so:
        'Naqshad xushmeyneysa hiddaha iyo farsamada gacanta.',

      en:
        'A design celebrating heritage and handcrafted patterns.',

      nl:
        'Een ontwerp dat erfgoed en handgemaakte patronen eert.',
    },

    artwork: {
      type:
        'local-image',

      src:
        '/images/cards/heritage.svg',

      alt: {
        so:
          'Farshaxan asal ah oo leh qaabab dhaxal dhaqameed',

        en:
          'Original artwork with heritage-inspired geometric patterns',

        nl:
          'Originele illustratie met geometrische erfgoedpatronen',
      },

      focalPoint:
        'center',

      owner:
        'hadiyadpay',
    },

    defaultRecipient: {
      so:
        'Ehelka iyo Asxaabta',

      en:
        'Family & Friends',

      nl:
        'Familie en vrienden',
    },

    defaultSender: {
      so:
        'HadiyadPay',

      en:
        'HadiyadPay Team',

      nl:
        'Team HadiyadPay',
    },

    defaultMessage: {
      so:
        'Qiimaha hiddaha iyo dhaqanka iyo xusuusta dalkeenna hooyo oo qalbiga ku weyn. 🧺🤎',

      en:
        'Celebrating our rich heritage, traditions, and timeless cultural craftsmanship. 🧺🤎',

      nl:
        'Een groet die ons erfgoed, onze tradities en vakmanschap viert. 🧺🤎',
    },
  },

  {
    id:
      'taageero',

    slug:
      'encouragement',

    category:
      'milestones',

    occasion:
      'encouragement',

    searchTerms: [
      'taageero',
      'support',
      'encouragement',
      'strength',
    ],

    recipientTypes: [
      'friend',
      'colleague',
    ],

    styles: [
      'minimal',
      'geometric',
    ],

    colors: [
      'green',
      'blue',
    ],

    languages: [
      'so',
      'en',
      'nl',
    ],

    orientation:
      'landscape',

    badge: {
      so:
        'TAAGEERO 🤝',

      en:
        'SUPPORT 🤝',

      nl:
        'STEUN 🤝',
    },

    title: {
      so:
        'Taageero & Dhiirigelin',

      en:
        'Strength & Encouragement',

      nl:
        'Kracht en aanmoediging',
    },

    description: {
      so:
        'Fariin taageero iyo dhiirigelin u ah qof kuu dhow.',

      en:
        'A supportive note for someone who matters to you.',

      nl:
        'Een bemoedigende boodschap voor iemand die je dierbaar is.',
    },

    artwork: {
      type:
        'local-image',

      src:
        '/images/cards/encouragement.svg',

      alt: {
        so:
          'Qorrax soo bax cagaar iyo buluug ah',

        en:
          'Original sunrise artwork in green and blue',

        nl:
          'Originele zonsopgangillustratie in groen en blauw',
      },

      focalPoint:
        'center',

      owner:
        'hadiyadpay',
    },

    defaultRecipient: {
      so:
        'Saxiibkey',

      en:
        'My Friend',

      nl:
        'Mijn vriend',
    },

    defaultSender: {
      so:
        'Walaalkii',

      en:
        'Your Brother',

      nl:
        'Je broer',
    },

    defaultMessage: {
      so:
        'Mar walba garabkaaga ayaan taaganahay. Guul iyo gobanimo ayaan kuu rajeynayaa hawlahaaga cusub! 🤝🌟',

      en:
        'Always standing by your side. Wishing you strength, success, and prosperity in all your endeavors! 🤝🌟',

      nl:
        'Ik sta achter je. Ik wens je kracht, succes en vertrouwen bij alles wat je doet! 🤝🌟',
    },
  },

  {
    id:
      'guul',

    slug:
      'graduation-success',

    category:
      'milestones',

    occasion:
      'graduation',

    searchTerms: [
      'qalinjabin',
      'graduation',
      'success',
      'graduate',
    ],

    recipientTypes: [
      'graduate',
      'family',
    ],

    styles: [
      'illustrated',
      'geometric',
    ],

    colors: [
      'blue',
      'gold',
    ],

    languages: [
      'so',
      'en',
      'nl',
    ],

    orientation:
      'portrait',

    badge: {
      so:
        'GUUL 🎓',

      en:
        'SUCCESS 🎓',

      nl:
        'SUCCES 🎓',
    },

    title: {
      so:
        'Qalinjabin & Guul',

      en:
        'Graduation & Success',

      nl:
        'Afstuderen en succes',
    },

    description: {
      so:
        'Hambalyo guul waxbarasho iyo bilow cusub.',

      en:
        'Celebrate an academic milestone and a new beginning.',

      nl:
        'Vier een mijlpaal en een nieuw begin.',
    },

    artwork: {
      type:
        'local-image',

      src:
        '/images/cards/graduation.svg',

      alt: {
        so:
          'Koofiyad qalinjabin iyo xiddigo dahab ah',

        en:
          'Original graduation cap artwork with gold stars',

        nl:
          'Originele illustratie van een afstudeerhoed met gouden sterren',
      },

      focalPoint:
        'center',

      owner:
        'hadiyadpay',
    },

    defaultRecipient: {
      so:
        'Ardayga Guuleystay',

      en:
        'Graduate',

      nl:
        'Geslaagde',
    },

    defaultSender: {
      so:
        'Qoyska oo idil',

      en:
        'Proud Family',

      nl:
        'Trots van je familie',
    },

    defaultMessage: {
      so:
        'Hambalyo qalinjabinta! Tani waa bilowga safar dheer oo ay ka buuxaan guulo waaweyn iyo mustaqbal dhalaalaya. 🎓🎉',

      en:
        'Congratulations on your graduation! This is just the beginning of an amazing journey of success. 🎓🎉',

      nl:
        'Gefeliciteerd met je diploma! Dit is het begin van een mooie reis vol nieuwe kansen. 🎓🎉',
    },
  },

  {
    id:
      'barako',

    slug:
      'peace-and-blessings',

    category:
      'milestones',

    occasion:
      'blessings',

    searchTerms: [
      'barako',
      'blessings',
      'peace',
      'family',
    ],

    recipientTypes: [
      'family',
      'friend',
    ],

    styles: [
      'ornamental',
      'minimal',
    ],

    colors: [
      'terracotta',
      'gold',
    ],

    languages: [
      'so',
      'en',
      'nl',
    ],

    orientation:
      'landscape',

    badge: {
      so:
        'BARAKO 🐪',

      en:
        'BLESSINGS 🐪',

      nl:
        'ZEGENINGEN 🐪',
    },

    title: {
      so:
        'Barako & Nabad',

      en:
        'Nomadic Heritage Sunset',

      nl:
        'Zonsondergang en zegeningen',
    },

    description: {
      so:
        'Fariin nabad, caafimaad iyo barako.',

      en:
        'A warm message wishing peace, health, and blessings.',

      nl:
        'Een warme wens voor vrede, gezondheid en zegeningen.',
    },

    artwork: {
      type:
        'local-image',

      src:
        '/images/cards/blessings.svg',

      alt: {
        so:
          'Qorrax dhac ku dul dhacaysa buuraha saxaraha',

        en:
          'Original sunset artwork over desert hills',

        nl:
          'Originele zonsondergang boven woestijnheuvels',
      },

      focalPoint:
        'center',

      owner:
        'hadiyadpay',
    },

    defaultRecipient: {
      so:
        'Reer Xamar / Reer Baadiye',

      en:
        'Dear Family',

      nl:
        'Lieve familie',
    },

    defaultSender: {
      so:
        'Qoyska Yurub',

      en:
        'The Family Abroad',

      nl:
        'De familie in Europa',
    },

    defaultMessage: {
      so:
        'Nabad, barako, iyo caafimaad ha dego gurigiinna. Waxaan idinkoo nabad qaba idiin rajeynayaa maalin wacan. 🐪🌿',

      en:
        'May peace, blessings, and good health dwell in your home. Wishing you a wonderful day ahead. 🐪🌿',

      nl:
        'Moge vrede, zegeningen en gezondheid bij jullie thuis zijn. Ik wens jullie een mooie dag. 🐪🌿',
    },
  },

  {
    id:
      'just-because-01',

    slug:
      'a-little-hadiyad',

    category:
      'milestones',

    occasion:
      'just-because',

    searchTerms: [
      'just because',
      'zomaar',
      'hadiyad',
      'gift',
      'thinking of you',
      'special',
    ],

    recipientTypes: [
      'friend',
      'family',
      'partner',
    ],

    styles: [
      'illustrated',
      'floral',
    ],

    colors: [
      'rose',
      'terracotta',
      'neutral',
    ],

    languages: [
      'so',
      'en',
      'nl',
    ],

    orientation:
      'portrait',

    featured:
      true,

    badge: {
      so:
        'HADIYAD YAR 🎁',

      en:
        'JUST BECAUSE 🎁',

      nl:
        'ZOMAAR 🎁',
    },

    title: {
      so:
        'Hadiyad Yar',

      en:
        'A Little Hadiyad',

      nl:
        'Een Hadiyad, zomaar',
    },

    description: {
      so:
        'Hadiyad yar oo loogu talagalay qof qalbigaaga ku jira.',

      en:
        'A thoughtful little Hadiyad for someone special.',

      nl:
        'Een kleine, persoonlijke Hadiyad voor iemand die bijzonder is.',
    },

    artwork: {
      type:
        'local-image',

      src:
        '/images/cards/just-because-01.png',

      alt: {
        so:
          'Farshaxan hadiyad diirran oo loogu talagalay qof gaar ah',

        en:
          'Warm illustrated gift artwork for someone special',

        nl:
          'Warme cadeau-illustratie voor een bijzonder persoon',
      },

      focalPoint:
        'center',

      owner:
        'hadiyadpay',
    },

    defaultRecipient: {
      so: '',
      en: '',
      nl: '',
    },

    defaultSender: {
      so: '',
      en: '',
      nl: '',
    },

    defaultMessage: {
      so: '',
      en: '',
      nl: '',
    },
  },

  {
    id:
      'just-because-02',

    slug:
      'something-special-for-you',

    category:
      'milestones',

    occasion:
      'just-because',

    searchTerms: [
      'just because',
      'zomaar',
      'special',
      'thinking of you',
      'friend',
      'family',
    ],

    recipientTypes: [
      'friend',
      'family',
      'partner',
    ],

    styles: [
      'illustrated',
      'ornamental',
    ],

    colors: [
      'terracotta',
      'gold',
      'neutral',
    ],

    languages: [
      'so',
      'en',
      'nl',
    ],

    orientation:
      'portrait',

    badge: {
      so:
        'QOF GAAR AH ✨',

      en:
        'SOMEONE SPECIAL ✨',

      nl:
        'VOOR IEMAND BIJZONDERS ✨',
    },

    title: {
      so:
        'Adiga Ayaan Ku Xusuustay',

      en:
        'Something Special for You',

      nl:
        'Iets bijzonders voor jou',
    },

    description: {
      so:
        'Kaar diirran oo lagu xusuusinayo qof qiimihiisa.',

      en:
        'A warm card to remind someone how much they matter.',

      nl:
        'Een warme kaart om iemand te laten weten hoe bijzonder diegene is.',
    },

    artwork: {
      type:
        'local-image',

      src:
        '/images/cards/just-because-02.png',

      alt: {
        so:
          'Farshaxan qurux badan oo loogu talagalay qof gaar ah',

        en:
          'Premium illustrated artwork for someone special',

        nl:
          'Premium illustratie voor iemand die bijzonder is',
      },

      focalPoint:
        'center',

      owner:
        'hadiyadpay',
    },

    defaultRecipient: {
      so: '',
      en: '',
      nl: '',
    },

    defaultSender: {
      so: '',
      en: '',
      nl: '',
    },

    defaultMessage: {
      so: '',
      en: '',
      nl: '',
    },
  },

  {
    id:
      'just-because-brighter',

    slug:
      'you-make-the-world-brighter',

    category:
      'milestones',

    occasion:
      'just-because',

    searchTerms: [
      'just because',
      'brighter',
      'reminder',
      'encouragement',
      'zomaar',
      'xasuus',
    ],

    recipientTypes: [
      'friend',
      'family',
      'partner',
      'colleague',
    ],

    styles: [
      'minimal',
      'illustrated',
    ],

    colors: [
      'rose',
      'gold',
      'neutral',
    ],

    languages: [
      'so',
      'en',
      'nl',
    ],

    orientation:
      'portrait',

    featured:
      true,

    badge: {
      so:
        'XASUUS YAR ☀️',

      en:
        'A LITTLE REMINDER ☀️',

      nl:
        'EEN KLEINE HERINNERING ☀️',
    },

    title: {
      so:
        'Adigaa Dunida Iftiimiya',

      en:
        'You Make the World Brighter',

      nl:
        'Jij maakt de wereld mooier',
    },

    description: {
      so:
        'Xasuus yar oo qof gaar ah loogu sheegayo inuu dunida iftiimiyo.',

      en:
        'A small reminder for someone who makes the world brighter.',

      nl:
        'Een kleine herinnering voor iemand die de wereld mooier maakt.',
    },

    artwork: {
      type:
        'local-image',

      src:
        '/images/cards/just-because-brighter-en.png',

      localizedSrc: {
        so:
          '/images/cards/just-because-brighter-so.png',
      },

      alt: {
        so:
          'Kaar ay ku qoran tahay Xasuus yar Adigaa dunida iftiimiya',

        en:
          'Greeting card saying you make the world brighter',

        nl:
          'Wenskaart met een warme boodschap over de wereld mooier maken',
      },

      focalPoint:
        'center',

      owner:
        'hadiyadpay',
    },

    defaultRecipient: {
      so: '',
      en: '',
      nl: '',
    },

    defaultSender: {
      so: '',
      en: '',
      nl: '',
    },

    defaultMessage: {
      so: '',
      en: '',
      nl: '',
    },
  },

  {
    id:
      'love-whole-heart',

    slug:
      'you-have-my-whole-heart',

    category:
      'milestones',

    occasion:
      'love',

    searchTerms: [
      'love',
      'heart',
      'jacayl',
      'qalbi',
      'partner',
      'romantic',
    ],

    recipientTypes: [
      'partner',
    ],

    styles: [
      'illustrated',
      'minimal',
    ],

    colors: [
      'rose',
      'terracotta',
      'neutral',
    ],

    languages: [
      'so',
      'en',
      'nl',
    ],

    orientation:
      'portrait',

    featured:
      true,

    badge: {
      so:
        'QALBIGAYGA ❤️',

      en:
        'MY WHOLE HEART ❤️',

      nl:
        'MIJN HELE HART ❤️',
    },

    title: {
      so:
        'Qalbigayga Oo Dhan Adigaa Leh',

      en:
        'You Have My Whole Heart',

      nl:
        'Jij hebt mijn hele hart',
    },

    description: {
      so:
        'Kaar jacayl oo qalbiga oo dhan lagula wadaagayo qofka aad jeceshahay.',

      en:
        'A heartfelt romantic card for the person who has your whole heart.',

      nl:
        'Een liefdevolle kaart voor degene die jouw hele hart heeft.',
    },

    artwork: {
      type:
        'local-image',

      src:
        '/images/cards/love-01-en.png',

      localizedSrc: {
        so:
          '/images/cards/love-02-so.png',
      },

      alt: {
        so:
          'Kaar jacayl oo ay ku qoran tahay Qalbigayga oo dhan adigaa leh',

        en:
          'Romantic card saying you have my whole heart',

        nl:
          'Romantische kaart over je hele hart aan iemand geven',
      },

      focalPoint:
        'center',

      owner:
        'hadiyadpay',
    },

    defaultRecipient: {
      so: '',
      en: '',
      nl: '',
    },

    defaultSender: {
      so: '',
      en: '',
      nl: '',
    },

    defaultMessage: {
      so: '',
      en: '',
      nl: '',
    },
  },

  {
    id:
      'love-across-distance',

    slug:
      'love-across-every-mile',

    category:
      'milestones',

    occasion:
      'love',

    searchTerms: [
      'love',
      'distance',
      'miles',
      'far away',
      'jacayl',
      'long distance',
    ],

    recipientTypes: [
      'partner',
      'family',
    ],

    styles: [
      'geometric',
      'ornamental',
    ],

    colors: [
      'rose',
      'terracotta',
      'neutral',
    ],

    languages: [
      'so',
      'en',
      'nl',
    ],

    orientation:
      'portrait',

    badge: {
      so:
        'JACAYL MEEL KASTA 💜',

      en:
        'LOVE ACROSS EVERY MILE 💜',

      nl:
        'LIEFDE OP ELKE AFSTAND 💜',
    },

    title: {
      so:
        'Meel Kasta Oo Aad Joogto',

      en:
        'Love Across Every Mile',

      nl:
        'Liefde over elke afstand',
    },

    description: {
      so:
        'Kaar jacayl oo loogu talagalay qof meel fog jooga.',

      en:
        'A love card for someone special, no matter the distance.',

      nl:
        'Een liefdeskaart voor iemand die ver weg maar toch dichtbij is.',
    },

    artwork: {
      type:
        'local-image',

      src:
        '/images/cards/love-02-en.png',

      localizedSrc: {
        so:
          '/images/cards/love-01-so.png',
      },

      alt: {
        so:
          'Kaar jacayl oo ay ku qoran tahay meel kasta oo aad joogto',

        en:
          'Love greeting card celebrating connection across distance',

        nl:
          'Liefdeskaart over verbonden blijven op afstand',
      },

      focalPoint:
        'center',

      owner:
        'hadiyadpay',
    },

    defaultRecipient: {
      so: '',
      en: '',
      nl: '',
    },

    defaultSender: {
      so: '',
      en: '',
      nl: '',
    },

    defaultMessage: {
      so: '',
      en: '',
      nl: '',
    },
  },

  {
    id:
      'love-see-you-soon',

    slug:
      'see-you-soon-my-love',

    category:
      'milestones',

    occasion:
      'love',

    searchTerms: [
      'love',
      'see you soon',
      'miss you',
      'jacayl',
      'distance',
      'partner',
    ],

    recipientTypes: [
      'partner',
    ],

    styles: [
      'minimal',
      'illustrated',
    ],

    colors: [
      'terracotta',
      'rose',
      'neutral',
    ],

    languages: [
      'so',
      'en',
      'nl',
    ],

    orientation:
      'portrait',

    badge: {
      so:
        'DHAWAAN AYAAN KU ARKI DOONAA 💕',

      en:
        'SEE YOU SOON 💕',

      nl:
        'TOT SNEL 💕',
    },

    title: {
      so:
        'Dhawaan Ayaan Ku Arki Doonaa',

      en:
        'See You Soon, My Love',

      nl:
        'Tot snel, mijn lief',
    },

    description: {
      so:
        'Kaar jacayl oo loogu talagalay qof aad u xiisay.',

      en:
        'A romantic card for someone you cannot wait to see again.',

      nl:
        'Een romantische kaart voor iemand die je snel weer wilt zien.',
    },

    artwork: {
      type:
        'local-image',

      src:
        '/images/cards/love-03-en.png',

      localizedSrc: {
        so:
          '/images/cards/love-03-so.png',
      },

      alt: {
        so:
          'Kaar jacayl oo leh fariin ku saabsan in dhawaan la kulmo',

        en:
          'Romantic card saying see you soon my love',

        nl:
          'Romantische kaart met de boodschap tot snel mijn lief',
      },

      focalPoint:
        'center',

      owner:
        'hadiyadpay',
    },

    defaultRecipient: {
      so: '',
      en: '',
      nl: '',
    },

    defaultSender: {
      so: '',
      en: '',
      nl: '',
    },

    defaultMessage: {
      so: '',
      en: '',
      nl: '',
    },
  },

  {
    id:
      'wedding-celebration',

    slug:
      'somali-wedding-celebration',

    category:
      'celebrations',

    occasion:
      'wedding',

    searchTerms: [
      'aroos',
      'wedding',
      'marriage',
      'celebration',
      'family',
      'friends',
    ],

    recipientTypes: [
      'partner',
      'family',
      'friend',
    ],

    styles: [
      'illustrated',
      'traditional',
      'ornamental',
    ],

    colors: [
      'green',
      'gold',
      'neutral',
    ],

    languages: [
      'so',
      'en',
      'nl',
    ],

    orientation:
      'portrait',

    featured:
      true,

    badge: {
      so:
        'DABAALDEGGA AROOSKA 💍',

      en:
        'WEDDING CELEBRATION 💍',

      nl:
        'BRUILOFTSVIERING 💍',
    },

    title: {
      so:
        'Dabaaldegga Arooska',

      en:
        'Celebrating Together',

      nl:
        'Samen het huwelijk vieren',
    },

    description: {
      so:
        'Farshaxan aroos oo farxad, qoys iyo saaxiibo isu keenaya.',

      en:
        'A joyful wedding scene celebrating the couple with family and friends.',

      nl:
        'Een warme huwelijksviering met het bruidspaar, familie en vrienden.',
    },

    artwork: {
      type:
        'local-image',

      src:
        '/images/cards/wedding-celebration.png',

      alt: {
        so:
          'Farshaxan aroos oo lammaanaha iyo martida muujinaya',

        en:
          'Illustrated wedding celebration with the couple and guests',

        nl:
          'Geïllustreerde huwelijksviering met het bruidspaar en gasten',
      },

      focalPoint:
        'center',

      owner:
        'hadiyadpay',
    },

    defaultRecipient: {
      so: '',
      en: '',
      nl: '',
    },

    defaultSender: {
      so: '',
      en: '',
      nl: '',
    },

    defaultMessage: {
      so: '',
      en: '',
      nl: '',
    },
  },

  {
    id:
      'henna-celebration',

    slug:
      'elegant-henna-celebration',

    category:
      'celebrations',

    occasion:
      'henna',

    searchTerms: [
      'henna',
      'xafxad',
      'celebration',
      'wedding',
      'gold',
      'somali',
    ],

    recipientTypes: [
      'friend',
      'family',
    ],

    styles: [
      'illustrated',
      'traditional',
      'ornamental',
    ],

    colors: [
      'rose',
      'gold',
      'terracotta',
    ],

    languages: [
      'so',
      'en',
      'nl',
    ],

    orientation:
      'portrait',

    badge: {
      so:
        'HABEENKA HENNA ✨',

      en:
        'HENNA CELEBRATION ✨',

      nl:
        'HENNAFEEST ✨',
    },

    title: {
      so:
        'Habeenka Henna',

      en:
        'Elegant Henna Celebration',

      nl:
        'Elegant hennafeest',
    },

    description: {
      so:
        'Farshaxan qurux badan oo loogu talagalay habeenka henna.',

      en:
        'An elegant illustrated design for a memorable henna celebration.',

      nl:
        'Een elegante illustratie voor een bijzondere henna-avond.',
    },

    artwork: {
      type:
        'local-image',

      src:
        '/images/cards/henna-celebration.png',

      alt: {
        so:
          'Farshaxan qurux badan oo loogu talagalay habeenka henna',

        en:
          'Elegant illustrated henna celebration artwork',

        nl:
          'Elegante illustratie voor een hennafeest',
      },

      focalPoint:
        'center',

      owner:
        'hadiyadpay',
    },

    defaultRecipient: {
      so: '',
      en: '',
      nl: '',
    },

    defaultSender: {
      so: '',
      en: '',
      nl: '',
    },

    defaultMessage: {
      so: '',
      en: '',
      nl: '',
    },
  },

  {
    id:
      'heritage-flower-pot',

    slug:
      'heritage-floral-vase',

    category:
      'celebrations',

    occasion:
      'heritage',

    searchTerms: [
      'dhaqan',
      'heritage',
      'flowers',
      'vase',
      'culture',
      'traditional',
    ],

    recipientTypes: [
      'friend',
      'family',
    ],

    styles: [
      'floral',
      'traditional',
      'geometric',
    ],

    colors: [
      'blue',
      'terracotta',
      'gold',
    ],

    languages: [
      'so',
      'en',
      'nl',
    ],

    orientation:
      'portrait',

    badge: {
      so:
        'DHAQAN & UBAX 🌺',

      en:
        'HERITAGE & FLOWERS 🌺',

      nl:
        'ERFGOED & BLOEMEN 🌺',
    },

    title: {
      so:
        'Ubaxa Dhaqanka',

      en:
        'Heritage in Bloom',

      nl:
        'Erfgoed in bloei',
    },

    description: {
      so:
        'Farshaxan ubax iyo weel dhaqameed oo midabbo diirran leh.',

      en:
        'A handcrafted floral design inspired by heritage patterns.',

      nl:
        'Een handgeschilderd bloemontwerp geïnspireerd op erfgoedpatronen.',
    },

    artwork: {
      type:
        'local-image',

      src:
        '/images/cards/heritage-flower-pot.png',

      alt: {
        so:
          'Weel ubax leh oo lagu qurxiyey qaabab dhaqameed',

        en:
          'Floral vase artwork with heritage-inspired geometric patterns',

        nl:
          'Bloemenvaas met geometrische patronen geïnspireerd op erfgoed',
      },

      focalPoint:
        'center',

      owner:
        'hadiyadpay',
    },

    defaultRecipient: {
      so: '',
      en: '',
      nl: '',
    },

    defaultSender: {
      so: '',
      en: '',
      nl: '',
    },

    defaultMessage: {
      so: '',
      en: '',
      nl: '',
    },
  },
];