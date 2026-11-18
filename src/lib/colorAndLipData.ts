export type Undertone = 'warm' | 'cool' | 'neutral';
export type SkinDepth = 'light' | 'medium' | 'deep';
export type ContrastLevel = 'soft' | 'clear' | 'rich';

export type LipHydration = 'dehydrated' | 'balanced' | 'plump';
export type LipPigmentation = 'even' | 'two-tone' | 'pale';
export type LipSensitivity = 'sensitive' | 'normal';
export type LipEnvironment = 'ac-indoor' | 'uv-outdoor';
export type LipFinishPreference = 'sheer-balm' | 'satin-tint' | 'velvet-balm';

export interface ClientDiagnosticInput {
  clientName: string;
  consultantName: string;
  sessionDate: string;
  undertone: Undertone;
  depth: SkinDepth;
  contrast: ContrastLevel;
  hydration: LipHydration;
  pigmentation: LipPigmentation;
  sensitivity: LipSensitivity;
  environment: LipEnvironment;
  finishPreference: LipFinishPreference;
  notes: string;
}

export interface PaletteSwatch {
  name: string;
  hex: string;
  role: string;
}

export interface LipShadePrescription {
  id: string;
  name: string;
  hex: string;
  finish: string;
  naturalPigment: string;
  occasion: string;
  coverageNote: string;
}

export interface ColorToneProfile {
  id: string;
  toneName: string;
  toneFamily: string;
  headline: string;
  description: string;
  jewelryMetal: string;
  fabricFinish: string;
  swatches: PaletteSwatch[];
  avoidSwatches: { name: string; hex: string; reason: string }[];
  lipShades: LipShadePrescription[];
}

export interface LipCareActive {
  name: string;
  concentration: string;
  functionLabel: string;
  detail: string;
}

export interface LipCarePrescription {
  barrierStatus: string;
  barrierSummary: string;
  amRoutine: { step: string; title: string; detail: string }[];
  pmRoutine: { step: string; title: string; detail: string }[];
  weeklyRitual: string;
  actives: LipCareActive[];
  avoidIngredients: { name: string; reason: string }[];
}

export const STUDIO_IMAGES = {
  heroAtelier: '/src/assets/images/glossychuu_hero_clean_shade_1794979998185.jpg',
  naturalOils: '/src/assets/images/botanical_rosehip_oils_1794971672875.jpg',
  mineralPigments: '/src/assets/images/glossychuu_shaded_lineup_1794979982593.jpg',
  drapingSwatches: '/src/assets/images/consultant_draping_swatches_1794971672706.jpg',
} as const;

export const DEFAULT_CLIENT_INPUT: ClientDiagnosticInput = {
  clientName: '',
  consultantName: 'GlossyChuu!',
  sessionDate: new Date().toISOString().slice(0, 10),
  undertone: 'cool',
  depth: 'medium',
  contrast: 'soft',
  hydration: 'dehydrated',
  pigmentation: 'two-tone',
  sensitivity: 'sensitive',
  environment: 'ac-indoor',
  finishPreference: 'satin-tint',
  notes: '',
};

const TONE_CATALOG: Record<string, ColorToneProfile> = {
  'Light Peach': {
    id: 'light-peach',
    toneName: 'Light Peach Glow',
    toneFamily: 'Warm Soft',
    headline: 'Hangat, Jernih, dan Ringan Bercahaya',
    description:
      'Kompleksi dengan rona dasar keemasan lembut dan kontras wajah yang ringan. Warna pastel hangat yang jernih langsung mencerahkan area bawah mata dan bibir.',
    jewelryMetal: 'Light Champagne Gold & Polished Rose Gold',
    fabricFinish: 'Katun poplin halus, linen natural, sifon sutra ringan',
    swatches: [
      { name: 'Apricot Silk', hex: '#F3B391', role: 'Atasan Utama' },
      { name: 'Warm Ivory', hex: '#F5EFE2', role: 'Netral Dasar' },
      { name: 'Fresh Coral', hex: '#EB7D6B', role: 'Aksen Wajah' },
      { name: 'Sage Sprout', hex: '#9DB89A', role: 'Outerwear' },
      { name: 'Honey Camel', hex: '#C79F74', role: 'Tailoring' },
      { name: 'Periwinkle Mist', hex: '#8EA2D6', role: 'Aksen Segar' },
    ],
    avoidSwatches: [
      { name: 'Jet Black', hex: '#141414', reason: 'Terlalu berat dan menciptakan bayangan keras di garis rahang' },
      { name: 'Icy Fuchsia', hex: '#D8318B', reason: 'Terlalu dingin sehingga membuat bibir tampak keunguan pucat' },
      { name: 'Charcoal Slate', hex: '#434952', reason: 'Merendam kecerahan rona hangat alami kulit' },
    ],
    lipShades: [
      {
        id: 'ls-1',
        name: 'Nectarine Balm',
        hex: '#E27D66',
        finish: 'Sheer Gloss Balm',
        naturalPigment: 'Annatto Seed + Red Iron Oxide',
        occasion: 'Harian / Pagi',
        coverageNote: 'Memberikan kilau persik hangat yang menyatu dengan warna bibir asli.',
      },
      {
        id: 'ls-2',
        name: 'Petal Coral Tint',
        hex: '#DF6D63',
        finish: 'Satin Mineral Tint',
        naturalPigment: 'Hibiscus Sabdariffa + Mica Mineral',
        occasion: 'Kantor & Meeting',
        coverageNote: 'Mencerahkan kulit secara instan tanpa terasa tebal.',
      },
      {
        id: 'ls-3',
        name: 'Apricot Glaze',
        hex: '#DA8B70',
        finish: 'Dewy Oil-Balm',
        naturalPigment: 'Sea Buckthorn Oil + Kaolin',
        occasion: 'Kasual Akhir Pekan',
        coverageNote: 'Melembapkan bibir kering dengan sentuhan aprikot transparan.',
      },
      {
        id: 'ls-4',
        name: 'Warm Strawberry',
        hex: '#C95452',
        finish: 'Velvet Lip Balm',
        naturalPigment: 'Beetroot Extract + Carmine-Free Mineral',
        occasion: 'Acara Sore / Makan Malam',
        coverageNote: 'Merah stroberi hangat sebagai statement lembut yang tetap proporsional.',
      },
    ],
  },
  'Warm Honey': {
    id: 'warm-honey',
    toneName: 'Warm Honey Coral',
    toneFamily: 'Warm Bright',
    headline: 'Keemasan Cerah dengan Vitalitas Segar',
    description:
      'Memiliki kehangatan undertone yang kuat dan kejernihan warna sedang hingga tinggi. Pigmen karotenoid dan koral hangat berpadu harmonis dengan rona kulit.',
    jewelryMetal: 'Yellow Gold 18K & Brushed Brass',
    fabricFinish: 'Sutra matte, linen tenun hangat, katun rajut halus',
    swatches: [
      { name: 'Tangerine Silk', hex: '#E67A4D', role: 'Aksen Utama' },
      { name: 'Warm Sand', hex: '#D9C29C', role: 'Netral Dasar' },
      { name: 'Marigold Honey', hex: '#D99B38', role: 'Atasan Cerah' },
      { name: 'Leafy Olive', hex: '#7A8E4B', role: 'Outerwear' },
      { name: 'Warm Aqua', hex: '#4AA09B', role: 'Kontras Segar' },
      { name: 'Cinnamon Tan', hex: '#A56343', role: 'Aksesori Kulit' },
    ],
    avoidSwatches: [
      { name: 'Cool Lavender', hex: '#B19CD9', reason: 'Mengadu kontras dingin dan membuat kompleksi terlihat kusam' },
      { name: 'Pure Optic White', hex: '#FFFFFF', reason: 'Terlalu menyilaukan dibanding kehangatan kulit' },
      { name: 'Deep Burgundy', hex: '#541B2B', reason: 'Terlalu gelap dan bernuansa biru' },
    ],
    lipShades: [
      {
        id: 'ws-1',
        name: 'Persimmon Velvet',
        hex: '#D45E43',
        finish: 'Satin Mineral Tint',
        naturalPigment: 'Paprika Oleoresin + Red Iron Oxide',
        occasion: 'Presentasi & Acara Siang',
        coverageNote: 'Menghidupkan kompleksi tanpa memerlukan riasan mata berat.',
      },
      {
        id: 'ws-2',
        name: 'Golden Guava',
        hex: '#DB6F5E',
        finish: 'Sheer Gloss Balm',
        naturalPigment: 'Rosehip Oil + Mineral Coral',
        occasion: 'Harian / Santai',
        coverageNote: 'Formula tinggi asam lemak esensial untuk hidrasi 8 jam.',
      },
      {
        id: 'ws-3',
        name: 'Spiced Terracotta',
        hex: '#B85B45',
        finish: 'Velvet Lip Balm',
        naturalPigment: 'Burnt Sienna Mineral + Candelilla Wax',
        occasion: 'Profesional / Sore',
        coverageNote: 'Menyamarkan bibir two-tone dengan satu sapuan rata.',
      },
      {
        id: 'ws-4',
        name: 'Poppy Vermilion',
        hex: '#C64034',
        finish: 'Satin Mineral Tint',
        naturalPigment: 'Alkanet Root + Orange Iron Oxide',
        occasion: 'Acara Spesial',
        coverageNote: 'Merah tomat hangat yang membuat gigi tampak lebih cerah.',
      },
    ],
  },
  'Clear Apricot': {
    id: 'clear-apricot',
    toneName: 'Clear Apricot Pop',
    toneFamily: 'Warm Clear',
    headline: 'Kontras Jernih dengan Kehangatan Netral',
    description:
      'Fitur wajah memiliki ketegasan kontras antara warna mata, rambut, dan kulit dengan sentuhan hangat yang bersih. Warna jenuh namun jernih adalah kunci harmoni.',
    jewelryMetal: 'Bright Yellow Gold & Mixed Gold-Silver',
    fabricFinish: 'Satin terstruktur, silk twill, poplin presisi',
    swatches: [
      { name: 'Clear Coral', hex: '#EC5E58', role: 'Aksen Utama' },
      { name: 'Crisp Cream', hex: '#F6F1E7', role: 'Netral Terang' },
      { name: 'True Emerald', hex: '#1B8B6C', role: 'Statement' },
      { name: 'Cobalt Warm', hex: '#2864B4', role: 'Tailoring' },
      { name: 'Warm Charcoal', hex: '#3B3734', role: 'Netral Gelap' },
      { name: 'Mango Glow', hex: '#F0A438', role: 'Aksen' },
    ],
    avoidSwatches: [
      { name: 'Muddy Taupe', hex: '#94897E', reason: 'Warna keruh membuat kontras wajah kehilangan definisi' },
      { name: 'Dusty Mauve', hex: '#A5838B', reason: 'Terlalu redup dan abu-abu bagi rona jernih' },
      { name: 'Muted Mustard', hex: '#9B823B', reason: 'Membuat kulit tampak kelelahan' },
    ],
    lipShades: [
      {
        id: 'cs-1',
        name: 'Hibiscus Pop',
        hex: '#D8434E',
        finish: 'Satin Mineral Tint',
        naturalPigment: 'Hibiscus Anthocyanin + Titanium-Free Mineral',
        occasion: 'Harian / Statement',
        coverageNote: 'Kejernihan warna koral-merah yang langsung menyeimbangkan kontras mata.',
      },
      {
        id: 'cs-2',
        name: 'Watermelon Nectar',
        hex: '#E25E66',
        finish: 'Dewy Oil-Balm',
        naturalPigment: 'Watermelon Seed Oil + Beetroot',
        occasion: 'Siang Hari',
        coverageNote: 'Ringan dan bercahaya dengan efek plumping alami.',
      },
      {
        id: 'cs-3',
        name: 'Geranium Red',
        hex: '#C7383E',
        finish: 'Velvet Lip Balm',
        naturalPigment: 'Iron Oxide Blend + Jojoba Esters',
        occasion: 'Acara Formal',
        coverageNote: 'Merah cerah bernuansa hangat tanpa kesan kusam.',
      },
      {
        id: 'cs-4',
        name: 'Clear Peach',
        hex: '#DF7A66',
        finish: 'Sheer Gloss Balm',
        naturalPigment: 'Carrot Seed + Mineral Pink',
        occasion: 'Natural Look',
        coverageNote: 'Pilihan aman untuk tampilan no-makeup makeup yang segar.',
      },
    ],
  },
  'Sakura Milk': {
    id: 'sakura-milk',
    toneName: 'Sakura Milk Cool',
    toneFamily: 'Cool Soft',
    headline: 'Sejuk, Halus, dan Transparan Lembut',
    description:
      'Kulit memiliki rona dingin-netral dengan kontras lembut. Warna bernuansa mawar pudar, lavender sejuk, dan biru kabut memberikan ketenangan visual.',
    jewelryMetal: 'Brushed Silver, Platinum & White Gold',
    fabricFinish: 'Kasmir ringan, katun batiste, organza lembut',
    swatches: [
      { name: 'Rosewater', hex: '#DF9DA7', role: 'Atasan Utama' },
      { name: 'Alabaster Cool', hex: '#F3F2F4', role: 'Netral Terang' },
      { name: 'Powder Blue', hex: '#8CA8C8', role: 'Tailoring' },
      { name: 'Soft Mauve', hex: '#B48E9F', role: 'Aksen Lembut' },
      { name: 'Cool Dove', hex: '#9EA2A8', role: 'Netral Medium' },
      { name: 'Mint Frost', hex: '#9BC4B7', role: 'Aksen Segar' },
    ],
    avoidSwatches: [
      { name: 'Burnt Orange', hex: '#C45324', reason: 'Terlalu hangat dan mendominasi fitur wajah lembut' },
      { name: 'Pitch Black', hex: '#121214', reason: 'Menciptakan kontras berlebihan di sekitar bibir' },
      { name: 'Golden Yellow', hex: '#D9A12B', reason: 'Membuat kulit tampak kekuningan tidak merata' },
    ],
    lipShades: [
      {
        id: 'lsu-1',
        name: 'Rosewater Dew',
        hex: '#CD7D8A',
        finish: 'Sheer Gloss Balm',
        naturalPigment: 'Damask Rose Wax + Mineral Rose',
        occasion: 'Harian / Kantor',
        coverageNote: 'Mawar dingin lembut yang menyatu seperti warna bibir sehat alami.',
      },
      {
        id: 'lsu-2',
        name: 'Pink Camellia',
        hex: '#D48295',
        finish: 'Satin Mineral Tint',
        naturalPigment: 'Camellia Oil + Radish Root Pigment',
        occasion: 'Acara Siang',
        coverageNote: 'Mengurangi kesan pucat tanpa terlihat mencolok.',
      },
      {
        id: 'lsu-3',
        name: 'Raspberry Milk',
        hex: '#B8657B',
        finish: 'Velvet Lip Balm',
        naturalPigment: 'Red Raspberry Seed + Violet Mineral',
        occasion: 'Pertemuan Sore',
        coverageNote: 'Memberikan definisi lembut bagi garis bibir tipis.',
      },
      {
        id: 'lsu-4',
        name: 'Petal Sorbet',
        hex: '#C97B84',
        finish: 'Dewy Oil-Balm',
        naturalPigment: 'Squalane + Pink Clay',
        occasion: 'Akhir Pekan',
        coverageNote: 'Menenangkan bibir sensitif sambil memberi rona segar.',
      },
    ],
  },
  'Cool Rose': {
    id: 'cool-rose',
    toneName: 'Cool Raspberry Rose',
    toneFamily: 'Cool Clear',
    headline: 'Elegan Bernuansa Mawar Dingin & Berry Redup',
    description:
      'Undertone dingin yang jelas dengan kelembutan warna sedang. Pigmen plum sejuk, berry berembun, dan rosewood berdasar biru memancarkan kejernihan wajah.',
    jewelryMetal: 'Sterling Silver & White Gold',
    fabricFinish: 'Crepe de chine, wol halus sejuk, linen abu-abu lembut',
    swatches: [
      { name: 'Dusty Berry', hex: '#9D4E67', role: 'Aksen Bibir & Busana' },
      { name: 'Soft Slate', hex: '#5D697A', role: 'Netral Gelap' },
      { name: 'Cool Rose', hex: '#C67388', role: 'Atasan Utama' },
      { name: 'Slate Blue', hex: '#587A9E', role: 'Tailoring' },
      { name: 'Misty Plum', hex: '#7A5470', role: 'Outerwear' },
      { name: 'Ice Pearl', hex: '#EAECEF', role: 'Netral Terang' },
    ],
    avoidSwatches: [
      { name: 'Warm Mustard', hex: '#C68D2B', reason: 'Berlawanan dengan rona biru alami kulit' },
      { name: 'Terracotta Rust', hex: '#AE543A', reason: 'Terlihat terlalu oranye pada bibir' },
      { name: 'Warm Ivory', hex: '#EDE0C4', reason: 'Membuat kulit tampak kusam kekuningan' },
    ],
    lipShades: [
      {
        id: 'csu-1',
        name: 'Wild Mulberry',
        hex: '#9E4661',
        finish: 'Satin Mineral Tint',
        naturalPigment: 'Blackcurrant Extract + Plum Iron Oxide',
        occasion: 'Kantor / Profesional',
        coverageNote: 'Rona berry dingin elegan yang menutupi warna bibir tidak merata.',
      },
      {
        id: 'csu-2',
        name: 'Mauvewood Balm',
        hex: '#B06A7B',
        finish: 'Sheer Gloss Balm',
        naturalPigment: 'Rosehip + Purple Sweet Potato',
        occasion: 'Harian',
        coverageNote: 'MLBB (My Lips But Better) ideal untuk undertone sejuk.',
      },
      {
        id: 'csu-3',
        name: 'Crushed Cranberry',
        hex: '#94354F',
        finish: 'Velvet Lip Balm',
        naturalPigment: 'Cranberry Seed Oil + Mineral Berry',
        occasion: 'Malam / Formal',
        coverageNote: 'Merah berry berdasar biru yang membuat warna kulit tampak bersih.',
      },
      {
        id: 'csu-4',
        name: 'Plum Blossom',
        hex: '#8C526D',
        finish: 'Dewy Oil-Balm',
        naturalPigment: 'Elderberry + Shea Ester',
        occasion: 'Sore Hari',
        coverageNote: 'Memberikan kilau satin tanpa rasa lengket.',
      },
    ],
  },
  'Soft Mauve': {
    id: 'soft-mauve',
    toneName: 'Soft Mauve Dust',
    toneFamily: 'Neutral-Cool Soft',
    headline: 'Harmoni Netral-Dingin yang Tenang dan Redup',
    description:
      'Memiliki perpaduan undertone netral ke sejuk dengan tingkat kontras rendah-sedang. Warna mauve kecokelatan, dusty rose, dan cocoa sejuk adalah kekuatan utama.',
    jewelryMetal: 'Antique Silver, Pewter & Soft Rose Gold',
    fabricFinish: 'Suede halus, linen lembut, rajut matte',
    swatches: [
      { name: 'Dusty Rose', hex: '#B47B84', role: 'Atasan Utama' },
      { name: 'Cool Cocoa', hex: '#7A6566', role: 'Netral Gelap' },
      { name: 'Eucalyptus Mist', hex: '#7D968D', role: 'Outerwear' },
      { name: 'Muted Mauve', hex: '#947380', role: 'Aksen' },
      { name: 'Stone Greige', hex: '#C7C1BB', role: 'Netral Terang' },
      { name: 'Smoky Plum', hex: '#6F4F5E', role: 'Statement' },
    ],
    avoidSwatches: [
      { name: 'Neon Coral', hex: '#FF5B4D', reason: 'Terlalu mencolok dan mengalahkan kelembutan fitur wajah' },
      { name: 'Bright Tangerine', hex: '#EA6B27', reason: 'Mengganggu keseimbangan rona netral-sejuk' },
      { name: 'Stark Optic White', hex: '#FAFAFA', reason: 'Terlalu kontras dan tajam' },
    ],
    lipShades: [
      {
        id: 'ssu-1',
        name: 'Rosewood Cloud',
        hex: '#A76A73',
        finish: 'Velvet Lip Balm',
        naturalPigment: 'Rosewood Mineral + Kaolin Clay',
        occasion: 'Harian / Kantor',
        coverageNote: 'Hasil matte lembut seperti kelopak mawar kering.',
      },
      {
        id: 'ssu-2',
        name: 'Muted Fig Balm',
        hex: '#965F6B',
        finish: 'Sheer Gloss Balm',
        naturalPigment: 'Fig Seed Oil + Iron Oxide',
        occasion: 'Kasual',
        coverageNote: 'Memperbaiki tekstur garis bibir dengan sentuhan fig sejuk.',
      },
      {
        id: 'ssu-3',
        name: 'Smoky Tea Rose',
        hex: '#B37B7F',
        finish: 'Satin Mineral Tint',
        naturalPigment: 'Hibiscus + Cocoa Husk',
        occasion: 'Meeting / Profesional',
        coverageNote: 'Warna teh mawar netral yang aman di segala pencahayaan.',
      },
      {
        id: 'ssu-4',
        name: 'Soft Damson',
        hex: '#7F4A5B',
        finish: 'Velvet Lip Balm',
        naturalPigment: 'Elderberry + Mineral Plum',
        occasion: 'Malam / Resmi',
        coverageNote: 'Plum lembut yang tidak terasa terlalu gelap.',
      },
    ],
  },
  'Warm Rosewood': {
    id: 'warm-rosewood',
    toneName: 'Warm Rosewood Soft',
    toneFamily: 'Neutral-Warm Soft',
    headline: 'Kehangatan Organik yang Teduh dan Elegan',
    description:
      'Undertone netral-hangat dengan chroma lembut. Warna tanah yang halus seperti rosewood hangat, fig kecokelatan, dan peach redup menyatu mulus dengan rona kulit.',
    jewelryMetal: 'Matte Gold, Champagne Gold & Soft Bronze',
    fabricFinish: 'Linen washed, katun brushed, suede hangat',
    swatches: [
      { name: 'Warm Rosewood', hex: '#B46F65', role: 'Atasan & Bibir' },
      { name: 'Oatmeal Linen', hex: '#DDD2C0', role: 'Netral Terang' },
      { name: 'Olive Sage', hex: '#7C8567', role: 'Outerwear' },
      { name: 'Soft Terracotta', hex: '#C1775E', role: 'Aksen Hangat' },
      { name: 'Warm Taupe', hex: '#8A7668', role: 'Netral Gelap' },
      { name: 'Spiced Fig', hex: '#8E4E4B', role: 'Statement' },
    ],
    avoidSwatches: [
      { name: 'Electric Blue', hex: '#1F57D6', reason: 'Terlalu dingin dan mencolok dibanding rona bumi wajah' },
      { name: 'Cool Neon Pink', hex: '#E44E95', reason: 'Memisahkan warna bibir dari harmoni kulit' },
      { name: 'Stark Black', hex: '#111111', reason: 'Membuat bayangan wajah terlihat kaku' },
    ],
    lipShades: [
      {
        id: 'sau-1',
        name: 'Spiced Rosewood',
        hex: '#AC6057',
        finish: 'Satin Mineral Tint',
        naturalPigment: 'Sandalwood + Red & Yellow Iron Oxide',
        occasion: 'Kantor & Harian',
        coverageNote: 'Menetralkan area gelap di tepi bibir secara alami.',
      },
      {
        id: 'sau-2',
        name: 'Chai Peach Balm',
        hex: '#C47D6A',
        finish: 'Sheer Gloss Balm',
        naturalPigment: 'Sea Buckthorn + Cacao Butter',
        occasion: 'Pagi / Santai',
        coverageNote: 'Memberikan kelembapan tahan lama di ruangan ber-AC.',
      },
      {
        id: 'sau-3',
        name: 'Roasted Fig',
        hex: '#924D49',
        finish: 'Velvet Lip Balm',
        naturalPigment: 'Cinnamon Bark + Beetroot Mineral',
        occasion: 'Sore / Acara Semi-Formal',
        coverageNote: 'Kedalaman warna ara panggang yang hangat dan berkelas.',
      },
      {
        id: 'sau-4',
        name: 'Cinnamon Clay',
        hex: '#A75E49',
        finish: 'Satin Mineral Tint',
        naturalPigment: 'Terracotta Clay + Rosehip Seed Oil',
        occasion: 'Profesional',
        coverageNote: 'Nude hangat ideal untuk kulit medium hingga sawo matang.',
      },
    ],
  },
  'Spiced Terracotta': {
    id: 'spiced-terracotta',
    toneName: 'Spiced Terracotta Warm',
    toneFamily: 'Warm Rich',
    headline: 'Kaya Rempah Hangat dengan Kedalaman Alami',
    description:
      'Kehangatan keemasan yang kuat berpadu dengan intensitas warna bumi yang kaya. Pigmen terakota bakar, bata hangat, dan karamel rempah memancarkan pesona.',
    jewelryMetal: 'Antique Gold, Copper & Hammered Brass',
    fabricFinish: 'Wol bertekstur, sutra raw, tenun serat alami',
    swatches: [
      { name: 'Terracotta Clay', hex: '#B8543A', role: 'Aksen Utama' },
      { name: 'Camel Gold', hex: '#B8894A', role: 'Atasan' },
      { name: 'Moss Forest', hex: '#556941', role: 'Outerwear' },
      { name: 'Warm Cream', hex: '#EFE4CE', role: 'Netral Terang' },
      { name: 'Espresso Bark', hex: '#52382D', role: 'Netral Gelap' },
      { name: 'Amber Rust', hex: '#9D442E', role: 'Statement' },
    ],
    avoidSwatches: [
      { name: 'Icy Pastel Pink', hex: '#F0C6D8', reason: 'Terlihat kapur dan pucat kontras di atas rona hangat' },
      { name: 'Cool Silver Gray', hex: '#9FA5AE', reason: 'Memudarkan kilau keemasan alami kulit' },
      { name: 'Blue-Based Violet', hex: '#634A91', reason: 'Membuat bibir tampak kelabu' },
    ],
    lipShades: [
      {
        id: 'wau-1',
        name: 'Terracotta Nectar',
        hex: '#AF4E38',
        finish: 'Satin Mineral Tint',
        naturalPigment: 'Burnt Red Oxide + Annatto Oil',
        occasion: 'Harian / Profesional',
        coverageNote: 'Terakota kaya yang tidak membuat wajah terlihat kusam.',
      },
      {
        id: 'wau-2',
        name: 'Maple Brick',
        hex: '#9A3F32',
        finish: 'Velvet Lip Balm',
        naturalPigment: 'Alkanet Root + Cacao Mineral',
        occasion: 'Acara Sore / Malam',
        coverageNote: 'Merah bata hangat dengan daya tutup tinggi untuk bibir two-tone.',
      },
      {
        id: 'wau-3',
        name: 'Caramel Honey Balm',
        hex: '#B97154',
        finish: 'Sheer Gloss Balm',
        naturalPigment: 'Raw Honey Wax + Amber Mica',
        occasion: 'Kasual',
        coverageNote: 'Nutrisi intensif untuk bibir kering dan pecah-pecah.',
      },
      {
        id: 'wau-4',
        name: 'Saffron Chili',
        hex: '#A83B28',
        finish: 'Satin Mineral Tint',
        naturalPigment: 'Paprika + Deep Iron Oxide',
        occasion: 'Statement',
        coverageNote: 'Merah cabai hangat yang ikonik untuk rona wajah hangat kaya.',
      },
    ],
  },
  'Deep Cocoa': {
    id: 'deep-cocoa',
    toneName: 'Deep Cocoa Fig',
    toneFamily: 'Neutral-Warm Deep',
    headline: 'Intensitas Hangat-Netral dengan Kekayaan Pigmen',
    description:
      'Memiliki kedalaman warna wajah dan rambut yang kuat serta kehangatan lembut. Warna mahogany, merah wine hangat, dan plum kecokelatan terlihat paling mewah.',
    jewelryMetal: 'Rich Antique Gold & Burnished Bronze',
    fabricFinish: 'Beludru matte, wol padat, sutra twill gelap',
    swatches: [
      { name: 'Mahogany Wine', hex: '#7A2D32', role: 'Statement Bibir' },
      { name: 'Dark Espresso', hex: '#3B2823', role: 'Netral Gelap' },
      { name: 'Warm Ivory', hex: '#EAE0CE', role: 'Netral Terang' },
      { name: 'Pine Deep', hex: '#2D4A3E', role: 'Outerwear' },
      { name: 'Spiced Rust', hex: '#9D432E', role: 'Atasan' },
      { name: 'Burnished Gold', hex: '#A97A36', role: 'Aksen' },
    ],
    avoidSwatches: [
      { name: 'Pale Baby Blue', hex: '#B9D6EC', reason: 'Terlalu pucat dan dingin sehingga wajah kehilangan dimensi' },
      { name: 'Pastel Lilac', hex: '#D3BEDF', reason: 'Membuat bibir dan area sekitar mulut terlihat abu-abu' },
      { name: 'Neon Mint', hex: '#7BE8C6', reason: 'Terlalu artifisial dibanding kedalaman alami' },
    ],
    lipShades: [
      {
        id: 'dau-1',
        name: 'Mahogany Berry',
        hex: '#7C3236',
        finish: 'Velvet Lip Balm',
        naturalPigment: 'Black Iron Oxide + Hibiscus',
        occasion: 'Profesional / Malam',
        coverageNote: 'Cokelat-berry pekat yang menyatu sempurna pada kulit tan hingga deep.',
      },
      {
        id: 'dau-2',
        name: 'Brick Rosewood',
        hex: '#92443F',
        finish: 'Satin Mineral Tint',
        naturalPigment: 'Rosehip + Red Oxide',
        occasion: 'Harian / Kantor',
        coverageNote: 'Memberikan definisi bibir yang rapi dan terhidrasi.',
      },
      {
        id: 'dau-3',
        name: 'Cocoa Plum Balm',
        hex: '#84464A',
        finish: 'Sheer Gloss Balm',
        naturalPigment: 'Raw Cacao + Berry Extract',
        occasion: 'Kasual',
        coverageNote: 'Kesan sheer-plum hangat untuk tampilan tanpa usaha.',
      },
      {
        id: 'dau-4',
        name: 'Garnet Velvet',
        hex: '#8C272E',
        finish: 'Velvet Lip Balm',
        naturalPigment: 'Beetroot + Burnt Sienna',
        occasion: 'Formal',
        coverageNote: 'Merah garnet kaya yang mencerahkan seluruh kompleksi.',
      },
    ],
  },
  'Vivid Plum': {
    id: 'vivid-plum',
    toneName: 'Vivid Plum Cool',
    toneFamily: 'Cool Vivid',
    headline: 'Ketegasan Dingin Bercahaya Kristal',
    description:
      'Undertone sejuk berdasar biru dengan kontras yang bersih dan jelas. Warna berry dingin, fuchsia berkelas, dan crimson murni memberikan fokus tajam pada wajah.',
    jewelryMetal: 'Polished Platinum, Silver & White Gold',
    fabricFinish: 'Sutra halus mengilap, katun mercerized, wol gabardine',
    swatches: [
      { name: 'Crimson Berry', hex: '#9E2343', role: 'Aksen Bibir' },
      { name: 'Pure Ice White', hex: '#F7F8FA', role: 'Netral Terang' },
      { name: 'Royal Navy', hex: '#20365C', role: 'Tailoring' },
      { name: 'Pine Emerald', hex: '#146B56', role: 'Outerwear' },
      { name: 'Cool Plum', hex: '#6E2B57', role: 'Statement' },
      { name: 'Charcoal Ink', hex: '#2A2E35', role: 'Netral Gelap' },
    ],
    avoidSwatches: [
      { name: 'Warm Camel', hex: '#C49A6C', reason: 'Membuat kulit tampak pucat keabu-abuan' },
      { name: 'Peach Nude', hex: '#E3A487', reason: 'Warna bibir bernuansa oranye tampak terpisah dari rona dingin' },
      { name: 'Olive Mustard', hex: '#88833D', reason: 'Memberikan pantulan warna kusam di bawah dagu' },
    ],
    lipShades: [
      {
        id: 'cwi-1',
        name: 'Mulberry Ink',
        hex: '#8C2347',
        finish: 'Satin Mineral Tint',
        naturalPigment: 'Elderberry + Blue-Red Oxide',
        occasion: 'Kantor & Formal',
        coverageNote: 'Berry dingin pekat yang meningkatkan kejernihan kulit.',
      },
      {
        id: 'cwi-2',
        name: 'Cool Crimson',
        hex: '#A61E3A',
        finish: 'Velvet Lip Balm',
        naturalPigment: 'Hibiscus + Mineral Ruby',
        occasion: 'Presentasi & Malam',
        coverageNote: 'Merah rubi dingin yang menjadi signature paling kuat.',
      },
      {
        id: 'cwi-3',
        name: 'Frosted Rose Balm',
        hex: '#AC5972',
        finish: 'Sheer Gloss Balm',
        naturalPigment: 'Rose Wax + Squalane',
        occasion: 'Harian / Pagi',
        coverageNote: 'Rona mawar sejuk transparan untuk hidrasi harian.',
      },
      {
        id: 'cwi-4',
        name: 'Plum Wine',
        hex: '#6B2848',
        finish: 'Velvet Lip Balm',
        naturalPigment: 'Blackcurrant + Violet Oxide',
        occasion: 'Acara Malam',
        coverageNote: 'Memberikan kedalaman dramatis tanpa kesan berat.',
      },
    ],
  },
  'Clear Cherry': {
    id: 'clear-cherry',
    toneName: 'Clear Cherry Ruby',
    toneFamily: 'Cool High-Contrast',
    headline: 'Kontras Tinggi dengan Kejernihan Presisi',
    description:
      'Kontras alami sangat kuat antara iris mata, rambut, dan kulit dengan undertone netral-dingin. Warna murni yang jernih dan tegas adalah kunci daya tarik.',
    jewelryMetal: 'High-Shine White Gold, Platinum & Rhodium',
    fabricFinish: 'Satin terstruktur, taffeta, katun poplin crisp',
    swatches: [
      { name: 'Ruby Red', hex: '#B81D3A', role: 'Aksen Bibir' },
      { name: 'Optic White', hex: '#FFFFFF', role: 'Netral Terang' },
      { name: 'Obsidian Ink', hex: '#181A1F', role: 'Netral Gelap' },
      { name: 'Sapphire Clear', hex: '#1F4999', role: 'Tailoring' },
      { name: 'Fuchsia Clear', hex: '#B52B70', role: 'Aksen' },
      { name: 'Icy Mint', hex: '#C6EDE2', role: 'Kontras Cerah' },
    ],
    avoidSwatches: [
      { name: 'Dusty Beige', hex: '#BCAFA1', reason: 'Warna pudar menghilangkan ketajaman fitur wajah' },
      { name: 'Muted Sage', hex: '#88988A', reason: 'Terlalu redup dan membuat wajah terlihat datar' },
      { name: 'Earthy Terracotta', hex: '#AE5A41', reason: 'Berbenturan dengan kejernihan rona sejuk' },
    ],
    lipShades: [
      {
        id: 'clw-1',
        name: 'True Ruby Tint',
        hex: '#B81F3D',
        finish: 'Satin Mineral Tint',
        naturalPigment: 'Beetroot + Ruby Mineral',
        occasion: 'Harian / Statement',
        coverageNote: 'Merah sejati yang bersih dan seimbang untuk kontras tinggi.',
      },
      {
        id: 'clw-2',
        name: 'Cherry Glass Balm',
        hex: '#C63858',
        finish: 'Dewy Oil-Balm',
        naturalPigment: 'Sweet Cherry Seed Oil + Hibiscus',
        occasion: 'Siang Hari',
        coverageNote: 'Memberi efek kilau kaca alami tanpa silikon sintetis.',
      },
      {
        id: 'clw-3',
        name: 'Magenta Berry',
        hex: '#9E295E',
        finish: 'Velvet Lip Balm',
        naturalPigment: 'Pitaya Extract + Mineral Violet',
        occasion: 'Acara Spesial',
        coverageNote: 'Fuchsia berry yang memancarkan energi jernih.',
      },
      {
        id: 'clw-4',
        name: 'Clear Rose',
        hex: '#BD566D',
        finish: 'Sheer Gloss Balm',
        naturalPigment: 'Camellia + Rose Mineral',
        occasion: 'Minimalis',
        coverageNote: 'Mawar bersih untuk tampilan profesional ringan.',
      },
    ],
  },
  'Deep Cherry': {
    id: 'deep-cherry',
    toneName: 'Deep Black Cherry',
    toneFamily: 'Neutral-Cool Deep',
    headline: 'Kedalaman Dramatis Bernuansa Netral-Dingin',
    description:
      'Kompleksi dengan kedalaman dan kekayaan pigmen yang tegas, condong ke rona sejuk. Warna wine gelap, black cherry, dan plum pekat memberikan keseimbangan elegan.',
    jewelryMetal: 'Platinum, Dark Gunmetal & Polished Silver',
    fabricFinish: 'Sutra berat, wol kasmir gelap, kulit halus',
    swatches: [
      { name: 'Black Cherry', hex: '#6D1D34', role: 'Statement Bibir' },
      { name: 'Deep Charcoal', hex: '#23262B', role: 'Netral Gelap' },
      { name: 'Crisp Chalk', hex: '#F4F3F1', role: 'Netral Terang' },
      { name: 'Burgundy Ink', hex: '#7A223B', role: 'Aksen' },
      { name: 'Midnight Teal', hex: '#1B4B54', role: 'Outerwear' },
      { name: 'Royal Plum', hex: '#522546', role: 'Tailoring' },
    ],
    avoidSwatches: [
      { name: 'Pale Apricot', hex: '#F3C5AA', reason: 'Terlalu terang dan hangat sehingga tampak pucat di bibir' },
      { name: 'Dusty Oatmeal', hex: '#C6B9A6', reason: 'Mengurangi kedalaman alami fitur wajah' },
      { name: 'Warm Mustard', hex: '#C7922E', reason: 'Membuat rona kulit terlihat kusam' },
    ],
    lipShades: [
      {
        id: 'dwi-1',
        name: 'Black Cherry Velvet',
        hex: '#6C1E33',
        finish: 'Velvet Lip Balm',
        naturalPigment: 'Blackcurrant + Deep Iron Oxide',
        occasion: 'Formal & Malam',
        coverageNote: 'Ceri hitam pekat yang memberi harmoni sempurna pada tone kulit dalam.',
      },
      {
        id: 'dwi-2',
        name: 'Bordeaux Balm',
        hex: '#7E2B41',
        finish: 'Satin Mineral Tint',
        naturalPigment: 'Grape Skin Anthocyanin + Shea',
        occasion: 'Kantor / Harian',
        coverageNote: 'Merata di atas pigmentasi bibir gelap tanpa terlihat keabu-abuan.',
      },
      {
        id: 'dwi-3',
        name: 'Fig Noir Tint',
        hex: '#723A46',
        finish: 'Sheer Gloss Balm',
        naturalPigment: 'Fig Oil + Cacao Mineral',
        occasion: 'Kasual Harian',
        coverageNote: 'Nude gelap bernuansa plum untuk tampilan effortless.',
      },
      {
        id: 'dwi-4',
        name: 'Deep Garnet',
        hex: '#8E1F34',
        finish: 'Velvet Lip Balm',
        naturalPigment: 'Hibiscus + Mineral Crimson',
        occasion: 'Presentasi',
        coverageNote: 'Merah pekat berdasar dingin yang tegas dan bercahaya.',
      },
    ],
  },
};

export function resolveColorToneProfile(
  undertone: Undertone,
  depth: SkinDepth,
  contrast: ContrastLevel
): ColorToneProfile {
  if (undertone === 'warm') {
    if (depth === 'light') return TONE_CATALOG['Light Peach'];
    if (depth === 'medium') {
      if (contrast === 'clear') return TONE_CATALOG['Clear Apricot'];
      if (contrast === 'soft') return TONE_CATALOG['Warm Rosewood'];
      return TONE_CATALOG['Warm Honey'];
    }
    return contrast === 'rich' ? TONE_CATALOG['Deep Cocoa'] : TONE_CATALOG['Spiced Terracotta'];
  }

  if (undertone === 'cool') {
    if (depth === 'light') return TONE_CATALOG['Sakura Milk'];
    if (depth === 'medium') {
      if (contrast === 'clear') return TONE_CATALOG['Clear Cherry'];
      if (contrast === 'soft') return TONE_CATALOG['Soft Mauve'];
      return TONE_CATALOG['Cool Rose'];
    }
    return contrast === 'rich' ? TONE_CATALOG['Deep Cherry'] : TONE_CATALOG['Vivid Plum'];
  }

  if (depth === 'light') {
    return contrast === 'clear' ? TONE_CATALOG['Light Peach'] : TONE_CATALOG['Sakura Milk'];
  }
  if (depth === 'medium') {
    if (contrast === 'clear') return TONE_CATALOG['Clear Apricot'];
    if (contrast === 'rich') return TONE_CATALOG['Vivid Plum'];
    return TONE_CATALOG['Warm Rosewood'];
  }
  return contrast === 'rich' ? TONE_CATALOG['Deep Cherry'] : TONE_CATALOG['Deep Cocoa'];
}

export function buildLipCarePrescription(
  input: ClientDiagnosticInput
): LipCarePrescription {
  const isDehydrated = input.hydration === 'dehydrated';
  const isSensitive = input.sensitivity === 'sensitive';
  const isTwoTone = input.pigmentation === 'two-tone';
  const isOutdoor = input.environment === 'uv-outdoor';

  const barrierStatus = isDehydrated
    ? 'Barrier Melemah (Membutuhkan Lipid & Oklusif Intensif)'
    : input.hydration === 'balanced'
    ? 'Barrier Stabil (Fokus Proteksi Harian)'
    : 'Barrier Optimal (Pemeliharaan Kilau Alami)';

  const barrierSummary = isDehydrated
    ? 'Lapisan korneum bibir tidak memiliki kelenjar minyak alami. Diperlukan kombinasi humektan nabati, ceramide tumbuhan, dan lilin alami untuk mengunci kelembapan.'
    : 'Pertahankan keseimbangan hidrasi bibir dengan minyak nabati ringan non-komedogenik serta perlindungan dari oksidasi lingkungan.';

  const amRoutine = [
    {
      step: '01',
      title: 'Kompres Hangat & Hidrasi Dasar',
      detail: isSensitive
        ? 'Usap lembut dengan kapas lembap air mineral hangat, hindari pembersih berbusa atau SLS.'
        : 'Basahi bibir tipis dengan hidrosol mawar murni sebelum mengoleskan lapisan pelindung.',
    },
    {
      step: '02',
      title: 'Serum Lipid Ringan (Squalane + Rosehip)',
      detail: isTwoTone
        ? 'Aplikasikan 1 tetes Rosehip Seed Oil dingin untuk membantu meratakan rona bibir secara bertahap.'
        : 'Oleskan 1 tetes Squalane tebu sebagai humektan pengikat air di lapisan permukaan.',
    },
    {
      step: '03',
      title: isOutdoor
        ? 'Balm Pelindung Mineral Non-Nano + Shade'
        : 'Lip Balm Alami + Pigmen Mineral Pilihan',
      detail: isOutdoor
        ? 'Gunakan balm berbasis Zinc Oxide non-nano SPF 15 sebelum melapisi tint mineral agar pigmen tidak menggelap akibat UV.'
        : 'Kunci kelembapan dengan Shea Butter + Candelilla Wax, lalu lapisi shade pilihan sesuai tone warna wajah.',
    },
  ];

  const pmRoutine = [
    {
      step: '01',
      title: 'Pembersihan Minyak Nabati Lembut',
      detail: 'Angkat sisa pigmen mineral menggunakan Jojoba Oil atau Sweet Almond Oil tanpa menggosok keras.',
    },
    {
      step: '02',
      title: isTwoTone ? 'Masker Nutrisi Antioksidan Malam' : 'Lapisan Pemulih Bisabolol & Centella',
      detail: isTwoTone
        ? 'Oleskan campuran Licorice Root extract ringan & Rosehip oil untuk menenangkan stres oksidatif tepi bibir.'
        : 'Gunakan balm dengan Bisabolol chamomile 0.5% untuk meredakan micro-crack akibat udara dingin.',
    },
    {
      step: '03',
      title: 'Sleeping Occlusive Seal (Unrefined Shea)',
      detail: isDehydrated
        ? 'Tutup dengan lapisan tebal Unrefined Shea Butter + Beeswax/Candelilla sebagai masker semalaman.'
        : 'Oleskan lapisan tipis balm kaya ceramide nabati agar bibir kenyal saat bangun.',
    },
  ];

  const weeklyRitual = isDehydrated || isSensitive
    ? '1x per minggu: Gunakan masker madu mentah & oat koloidal selama 5 menit (TANPA scrub gula kasar yang dapat memicu micro-tear).'
    : '1x per minggu: Pijat lembut selama 30 detik menggunakan handuk muslin lembap + jojoba oil untuk mengangkat sel kulit mati.';

  const actives: LipCareActive[] = [
    {
      name: 'Cold-Pressed Rosehip Seed Oil',
      concentration: '5% – 10%',
      functionLabel: 'Perata Rona & Regenerasi',
      detail: 'Kaya asam linoleat dan pro-vitamin A alami untuk merawat bibir kering serta hiperpigmentasi ringan.',
    },
    {
      name: 'Unrefined Shea Butter',
      concentration: '25% – 40%',
      functionLabel: 'Oklusif Perbaikan Barrier',
      detail: 'Mengandung fraksi unsaponifiable alami yang mengunci transepidermal water loss sepanjang malam.',
    },
    {
      name: 'Sugarcane Squalane',
      concentration: '10% – 18%',
      functionLabel: 'Emolien Biomimetik',
      detail: 'Menyerap cepat tanpa rasa lengket dan aman untuk kulit bibir super sensitif.',
    },
    {
      name: 'Alpha-Bisabolol (Chamomile)',
      concentration: '0.3% – 0.8%',
      functionLabel: 'Penenang Iritasi',
      detail: 'Meredakan kemerahan, rasa perih, dan pengelupasan akibat udara ruangan ber-AC.',
    },
  ];

  const avoidIngredients = [
    {
      name: 'Menthol, Camphor & Eucalyptus',
      reason: 'Memberikan sensasi dingin sesaat namun memicu penguapan kelembapan dan iritasi kronis.',
    },
    {
      name: 'Fragrance / Parfum Sintetis & Essential Oil Tinggi',
      reason: 'Alergen tersering pada dermatitis kontak bibir (cheilitis).',
    },
    {
      name: 'Scrub Gula Kasar & AHA Konsentrasi Tinggi',
      reason: 'Struktur kulit bibir sangat tipis (3-5 lapis sel) sehingga rentan robek mikro dan menggelap.',
    },
  ];

  return {
    barrierStatus,
    barrierSummary,
    amRoutine,
    pmRoutine,
    weeklyRitual,
    actives,
    avoidIngredients,
  };
}

export interface ColorQuizQuestion {
  id: 'vein' | 'sun' | 'jewelry' | 'contrast' | 'lipCondition';
  stepNumber: string;
  question: string;
  helper: string;
  options: {
    id: string;
    label: string;
    detail: string;
  }[];
}

export type ColorQuizAnswers = Partial<Record<ColorQuizQuestion['id'], string>>;

export const COLOR_ANALYSIS_QUIZ: ColorQuizQuestion[] = [
  {
    id: 'vein',
    stepNumber: '01',
    question: 'Di bawah cahaya matahari alami, warna nadi di pergelangan tangan tampak dominan...',
    helper: 'Langkah pertama untuk mendeteksi suhu undertone kulit Anda.',
    options: [
      { id: 'warm', label: 'Kehijauan atau Zaitun', detail: 'Indikasi dasar Warm Undertone' },
      { id: 'cool', label: 'Biru atau Keunguan', detail: 'Indikasi dasar Cool Undertone' },
      { id: 'neutral', label: 'Campuran Biru & Hijau Seimbang', detail: 'Indikasi dasar Neutral Undertone' },
    ],
  },
  {
    id: 'sun',
    stepNumber: '02',
    question: 'Bagaimana reaksi alami kulit dan kedalaman rona wajah Anda?',
    helper: 'Menentukan kategori Skin Depth (Light, Medium, atau Tan-Deep).',
    options: [
      { id: 'light', label: 'Cerah (Fair-Light), mudah kemerahan saat terik', detail: 'Kedalaman Light — butuh pigmen halus tidak terlalu berat' },
      { id: 'medium', label: 'Kuning langsat hingga sawo matang cerah (Medium)', detail: 'Kedalaman Medium — fleksibel untuk satin maupun sheer' },
      { id: 'deep', label: 'Sawo matang gelap hingga cokelat kaya (Tan-Deep)', detail: 'Kedalaman Deep — butuh pigmen kaya agar tidak tampak pucat' },
    ],
  },
  {
    id: 'jewelry',
    stepNumber: '03',
    question: 'Saat membandingkan kain putih gading vs putih bersih dan emas vs perak, mana yang lebih mencerahkan?',
    helper: 'Mengonfirmasi ketepatan undertone pada area dagu dan bibir.',
    options: [
      { id: 'warm', label: 'Emas hangat & putih gading (Ivory)', detail: 'Mengurangi bayangan kusam di sekitar garis senyum' },
      { id: 'cool', label: 'Perak / White Gold & putih bersih', detail: 'Membuat warna mata dan bibir tampak jernih' },
      { id: 'neutral', label: 'Rose Gold / Champagne & putih tulang lembut', detail: 'Harmonis pada kedua suhu warna' },
    ],
  },
  {
    id: 'contrast',
    stepNumber: '04',
    question: 'Bagaimana tingkat kontras antara warna rambut asli, iris mata, dan kulit wajah?',
    helper: 'Menentukan karakter kejernihan warna yang paling menyatu.',
    options: [
      { id: 'soft', label: 'Lembut & menyatu (Soft / Muted)', detail: 'Warna dusty, rosewood, dan muted berry paling menyatu' },
      { id: 'clear', label: 'Cerah & kontras bersih (Clear / Bright)', detail: 'Warna jernih dan segar langsung menghidupkan wajah' },
      { id: 'rich', label: 'Tegas, pekat, dan berdimensi dalam (Rich / Deep)', detail: 'Warna fig pekat, mahogany, atau berry gelap terlihat mewah' },
    ],
  },
  {
    id: 'lipCondition',
    stepNumber: '05',
    question: 'Apa kondisi bibir dan hasil akhir lip balm yang paling Anda sukai?',
    helper: 'Menyesuaikan rekomendasi tekstur dan pilihan warna lip balm.',
    options: [
      { id: 'dry-satin', label: 'Bibir kering/two-tone · Suka hasil Satin rapi', detail: 'Fokus perbaikan barrier + perataan warna alami' },
      { id: 'sensitive-sheer', label: 'Bibir sensitif/ruang AC · Suka kilau Sheer ringan', detail: 'Bebas pewangi dengan hidrasi Squalane & Shea' },
      { id: 'outdoor-velvet', label: 'Aktivitas luar/butuh daya tutup · Suka Velvet halus', detail: 'Proteksi antioksidan dan pigmen mineral tahan lama' },
    ],
  },
];

export function scoreColorAnalysisQuiz(
  answers: ColorQuizAnswers,
  current: ClientDiagnosticInput
): ClientDiagnosticInput {
  let warmScore = 0;
  let coolScore = 0;
  let neutralScore = 0;

  if (answers.vein === 'warm') warmScore += 2;
  if (answers.vein === 'cool') coolScore += 2;
  if (answers.vein === 'neutral') neutralScore += 2;

  if (answers.jewelry === 'warm') warmScore += 1;
  if (answers.jewelry === 'cool') coolScore += 1;
  if (answers.jewelry === 'neutral') neutralScore += 1;

  let undertone: Undertone = current.undertone;
  if (warmScore > coolScore && warmScore > neutralScore) undertone = 'warm';
  else if (coolScore > warmScore && coolScore > neutralScore) undertone = 'cool';
  else undertone = 'neutral';

  const depth: SkinDepth =
    answers.sun === 'light' || answers.sun === 'medium' || answers.sun === 'deep'
      ? answers.sun
      : current.depth;

  const contrast: ContrastLevel =
    answers.contrast === 'soft' || answers.contrast === 'clear' || answers.contrast === 'rich'
      ? answers.contrast
      : current.contrast;

  let hydration = current.hydration;
  let pigmentation = current.pigmentation;
  let sensitivity = current.sensitivity;
  let environment = current.environment;
  let finishPreference = current.finishPreference;

  if (answers.lipCondition === 'dry-satin') {
    hydration = 'dehydrated';
    pigmentation = 'two-tone';
    finishPreference = 'satin-tint';
  } else if (answers.lipCondition === 'sensitive-sheer') {
    hydration = 'dehydrated';
    sensitivity = 'sensitive';
    environment = 'ac-indoor';
    finishPreference = 'sheer-balm';
  } else if (answers.lipCondition === 'outdoor-velvet') {
    environment = 'uv-outdoor';
    pigmentation = 'two-tone';
    finishPreference = 'velvet-balm';
  }

  return {
    ...current,
    undertone,
    depth,
    contrast,
    hydration,
    pigmentation,
    sensitivity,
    environment,
    finishPreference,
    notes: `Dikalibrasi melalui Tes Color Analysis GlossyChuu! (${new Date().toISOString().slice(0, 10)}).`,
  };
}

export type ShowcaseFilter = 'all' | 'cool' | 'warm' | 'neutral';

export interface ShowcaseShadeItem {
  undertoneLabel: 'Cool Tone' | 'Warm Tone' | 'Neutral Tone';
  undertone: Undertone;
  depth: SkinDepth;
  contrast: ContrastLevel;
  lipShade: LipShadePrescription;
}

export const LIP_SHADE_SHOWCASE: Record<ShowcaseFilter, ShowcaseShadeItem[]> = {
  all: [
    {
      undertoneLabel: 'Cool Tone',
      undertone: 'cool',
      depth: 'light',
      contrast: 'soft',
      lipShade: TONE_CATALOG['Sakura Milk'].lipShades[0],
    },
    {
      undertoneLabel: 'Warm Tone',
      undertone: 'warm',
      depth: 'light',
      contrast: 'soft',
      lipShade: TONE_CATALOG['Light Peach'].lipShades[0],
    },
    {
      undertoneLabel: 'Cool Tone',
      undertone: 'cool',
      depth: 'medium',
      contrast: 'rich',
      lipShade: TONE_CATALOG['Cool Rose'].lipShades[0],
    },
    {
      undertoneLabel: 'Warm Tone',
      undertone: 'warm',
      depth: 'medium',
      contrast: 'clear',
      lipShade: TONE_CATALOG['Clear Apricot'].lipShades[0],
    },
  ],
  cool: [
    {
      undertoneLabel: 'Cool Tone',
      undertone: 'cool',
      depth: 'light',
      contrast: 'soft',
      lipShade: TONE_CATALOG['Sakura Milk'].lipShades[0],
    },
    {
      undertoneLabel: 'Cool Tone',
      undertone: 'cool',
      depth: 'light',
      contrast: 'soft',
      lipShade: TONE_CATALOG['Sakura Milk'].lipShades[1],
    },
    {
      undertoneLabel: 'Cool Tone',
      undertone: 'cool',
      depth: 'medium',
      contrast: 'rich',
      lipShade: TONE_CATALOG['Cool Rose'].lipShades[0],
    },
    {
      undertoneLabel: 'Cool Tone',
      undertone: 'cool',
      depth: 'deep',
      contrast: 'soft',
      lipShade: TONE_CATALOG['Vivid Plum'].lipShades[1],
    },
  ],
  warm: [
    {
      undertoneLabel: 'Warm Tone',
      undertone: 'warm',
      depth: 'light',
      contrast: 'soft',
      lipShade: TONE_CATALOG['Light Peach'].lipShades[0],
    },
    {
      undertoneLabel: 'Warm Tone',
      undertone: 'warm',
      depth: 'medium',
      contrast: 'rich',
      lipShade: TONE_CATALOG['Warm Honey'].lipShades[0],
    },
    {
      undertoneLabel: 'Warm Tone',
      undertone: 'warm',
      depth: 'medium',
      contrast: 'clear',
      lipShade: TONE_CATALOG['Clear Apricot'].lipShades[0],
    },
    {
      undertoneLabel: 'Warm Tone',
      undertone: 'warm',
      depth: 'deep',
      contrast: 'soft',
      lipShade: TONE_CATALOG['Spiced Terracotta'].lipShades[0],
    },
  ],
  neutral: [
    {
      undertoneLabel: 'Neutral Tone',
      undertone: 'neutral',
      depth: 'medium',
      contrast: 'soft',
      lipShade: TONE_CATALOG['Warm Rosewood'].lipShades[0],
    },
    {
      undertoneLabel: 'Neutral Tone',
      undertone: 'neutral',
      depth: 'medium',
      contrast: 'soft',
      lipShade: TONE_CATALOG['Warm Rosewood'].lipShades[1],
    },
    {
      undertoneLabel: 'Neutral Tone',
      undertone: 'neutral',
      depth: 'deep',
      contrast: 'soft',
      lipShade: TONE_CATALOG['Deep Cocoa'].lipShades[0],
    },
    {
      undertoneLabel: 'Neutral Tone',
      undertone: 'neutral',
      depth: 'deep',
      contrast: 'rich',
      lipShade: TONE_CATALOG['Deep Cherry'].lipShades[0],
    },
  ],
};

