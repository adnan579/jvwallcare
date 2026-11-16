export interface TechnicalSpec {
  parameter: string;
  value: string;
  standard?: string;
}

export interface WallPuttyProduct {
  id: string;
  code: string;
  name: string;
  hindiName: string;
  packVariant: 'blue-navy' | 'teal-green' | 'factory-sack';
  packColorLabel: string;
  accentHex: string;
  tagline: string;
  formulationType: string;
  surfaceUse: string;
  netWeight: string;
  shortDescription: string;
  detailedDescription: string;
  coverageRate: string;
  waterMixingRatio: string;
  potLife: string;
  imageUrl: string;
  bagBadges: string[];
  sideIcons: {
    title: string;
    detail: string;
  }[];
  technicalSpecs: TechnicalSpec[];
}

export const BRAND_ASSETS = {
  logo: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.21.59_PM_97b0b9ac.jpeg',
  dualBagsMockup: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.22.00_PM_05cafad8.jpeg',
  realBagPhoto: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.22.04_PM_54420459.jpeg',
  promotionalPoster: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.21.59_PM__1__14b9e24f.jpeg',
} as const;

export const COMPANY_INFO = {
  name: 'J.V. Wall Care Udyog',
  brandMark: 'J.V. WALL PUTTY',
  hindiName: 'जे. वी. वाल पुट्टी',
  hindiTagline: 'सुंदरता की पहचान',
  address: '0, Gopiganj, Lohara Khas, Saripur, Bhadohi, Uttar Pradesh, 221303',
  shortAddress: 'Saripur, Gopiganj, Bhadohi (U.P.) - 221303',
  phone: '8896587151',
  phoneFormatted: '+91 88965 87151',
  emailPrimary: 'j.v.wallcare01@gmail.com',
  emailSecondary: 'jvwallcare@gmail.com',
  certification: 'An ISO 9001:2015 Certified Company',
  origin: 'Make in India',
  swachhBharat: 'Swachh Bharat — Ek Kadam Swachhata Ki Ore',
  segments: [
    {
      id: 'new-home',
      hindi: 'नया घर',
      english: 'New Home Construction',
      description: 'Fresh cement plaster leveling with deep pore sealing and brilliant base whiteness.',
    },
    {
      id: 'old-home',
      hindi: 'पुराना घर',
      english: 'Old Home Renovation',
      description: 'Repairs surface undulations, hairline cracks, and dampness before repainting.',
    },
    {
      id: 'commercial-building',
      hindi: 'कमर्शियल बिल्डिंग',
      english: 'Commercial Buildings',
      description: 'High-durability exterior & interior protection against wind, rain, and peeling.',
    },
  ],
  posterHighlights: [
    {
      title: 'Super Whiteness',
      hindi: 'सुपर सफेदी',
      description: '93.5%+ Hunter whiteness delivers true topcoat paint shade with fewer coats.',
    },
    {
      title: 'Crack Resistant',
      hindi: 'क्रैक रेजिस्टेंट',
      description: 'Polymer-reinforced matrix prevents shrinkage and hairline plaster cracks.',
    },
    {
      title: 'Smooth Finish',
      hindi: 'स्मूथ फिनिश',
      description: 'Ultra-fine micronized particles create a buttery, mirror-smooth wall surface.',
    },
    {
      title: 'Strong Adhesion',
      hindi: 'मजबूत पकड़',
      description: 'Tenacious chemical & mechanical bond with plastered brick and concrete walls.',
    },
    {
      title: 'Eco Friendly',
      hindi: 'इको फ्रेंडली',
      description: 'Zero-VOC, lead-free, and breathable formulation safe for applicators and homes.',
    },
  ],
} as const;

/**
 * Strictly the J.V. Wall Putty Catalog items provided in the user's uploaded images.
 */
export const CATALOG_PRODUCTS: WallPuttyProduct[] = [
  {
    id: 'jv-waterproof-wall-putty-blue',
    code: 'JV-WP-40B',
    name: 'J.V. Water Proof Wall Putty (Blue & Orange Pack)',
    hindiName: 'जे. वी. वाटर प्रूफ वाल पुट्टी — 40 kg',
    packVariant: 'blue-navy',
    packColorLabel: 'Signature Navy Blue & Orange Diagonal Pack',
    accentHex: '#0B3B68',
    tagline: 'White Cement & Polymer Based Water Proof Putty',
    formulationType: 'White Cement & Redispersible Polymer Based Waterproof Putty',
    surfaceUse: 'All Wall Surface Use (Interior & Exterior)',
    netWeight: 'Net Wt. 40 kg (When Packed)',
    shortDescription:
      'Engineered with hydrophobic polymers and white cement for exterior facades and damp-prone interior walls. Protects against moisture seepage, peeling, and fungal growth.',
    detailedDescription:
      'As featured in the official J.V. Wall Care Udyog catalog (Blue & Orange 40 kg pack), this waterproof grade combines high-purity white cement with imported water-repellent polymers. It seals masonry pores, resists wind-driven rain, prevents topcoat flaking (Anti-Pill), and delivers an ultra-smooth architectural base.',
    coverageRate: '12 – 15 sq. ft. / kg (for 2 coats at 1.5 mm max thickness)',
    waterMixingRatio: '36% – 40% clean water (approx. 14.5 – 16 Liters per 40 kg bag)',
    potLife: '2 – 2.5 Hours after mixing',
    imageUrl: BRAND_ASSETS.realBagPhoto,
    bagBadges: ['Water Proof', 'Wind Resistant', 'Anti-Pill'],
    sideIcons: [
      { title: 'Superior / Quick Easy Application', detail: 'Effortless trowel glide with minimal rebound loss' },
      { title: 'Ultra Smooth & Long Lasting Finish', detail: 'Feather-smooth surface ready for luxury emulsions' },
      { title: 'Excellent Bonding & Stain Resistance', detail: 'High tensile bond that resists surface staining' },
      { title: 'Anti-Cracking', detail: 'Prevents shrinkage cracks on interior & exterior plaster' },
      { title: 'Anti-Fungal', detail: 'Inhibits algae and fungal black spots in humid zones' },
    ],
    technicalSpecs: [
      { parameter: 'Product Type', value: 'White Cement & Polymer Based Water Proof Putty' },
      { parameter: 'Recommended Surfaces', value: 'Interior & Exterior Plastered / Concrete Walls' },
      { parameter: 'Standard Pack Size', value: '40 kg HDPE Laminated Bag (Use No Hooks)' },
      { parameter: 'Whiteness Index', value: '93.5%+ Minimum', standard: 'IS 8042' },
      { parameter: 'Tensile Adhesion Strength', value: '> 1.15 N/mm² at 28 Days', standard: 'EN 1015-12' },
      { parameter: 'Water Absorption Resistance', value: 'Waterproof Pore-Sealing Grade', standard: 'EN 1062-3' },
      { parameter: 'Quality Certification', value: 'ISO 9001:2015 Certified Company' },
    ],
  },
  {
    id: 'jv-extra-fine-wall-putty-teal',
    code: 'JV-EF-40T',
    name: 'J.V. Wall Putty — Extra Fine Finish (Teal & Orange Pack)',
    hindiName: 'जे. वी. वाल पुट्टी (एक्स्ट्रा फाइन) — 40 kg',
    packVariant: 'teal-green',
    packColorLabel: 'Signature Teal Green & Orange Diagonal Pack',
    accentHex: '#06686B',
    tagline: 'Water Cement & Polymer Based Extra Fine Putty',
    formulationType: 'Water Cement & Polymer Based Extra Fine Putty',
    surfaceUse: 'All Wall Surface Use (Interior & Exterior)',
    netWeight: 'Net Wt. 40 kg (When Packed)',
    shortDescription:
      'Extra-fine polymer wall putty formulated for silky-smooth interior and exterior walls with anti-bacterial, anti-fungal, and water-resistant protection.',
    detailedDescription:
      'As showcased in the official J.V. Wall Care Udyog catalog (Teal & Orange 40 kg pack), this Extra Fine grade is micron-classified for rapid application and a mirror-smooth architectural finish. It incorporates anti-bacterial and anti-fungal protection alongside water and wind resistance.',
    coverageRate: '14 – 16 sq. ft. / kg (for 2 coats on smooth plaster)',
    waterMixingRatio: '38% – 40% clean water (approx. 15 – 16 Liters per 40 kg bag)',
    potLife: '2 – 2.5 Hours after mixing',
    imageUrl: BRAND_ASSETS.dualBagsMockup,
    bagBadges: ['Water Resistant', 'Wind Resistant', 'Smooth Finish'],
    sideIcons: [
      { title: 'Fast Application', detail: 'Rapid mixing and high daily sq. ft. applicator productivity' },
      { title: 'Water Resistant', detail: 'Protects walls from ambient humidity and dampness' },
      { title: 'Excellent Surface Finish', detail: 'Extra-fine particle classification eliminates pinholes' },
      { title: 'Anti-Fungal Protection', detail: 'Prevents mold and fungal colonization on walls' },
      { title: 'Anti-Bacterial Shield', detail: 'Hygienic wall finish ideal for homes, schools & offices' },
    ],
    technicalSpecs: [
      { parameter: 'Product Type', value: 'Water Cement & Polymer Based Putty (Extra Fine)' },
      { parameter: 'Recommended Surfaces', value: 'Interior & Exterior Walls and Ceilings' },
      { parameter: 'Standard Pack Size', value: '40 kg Moisture-Resistant Pack' },
      { parameter: 'Whiteness Index', value: '94.5%+ Super Whiteness', standard: 'IS 8042' },
      { parameter: 'Fineness Grade', value: 'Extra Fine (< 0.5% residue on 45 µm sieve)' },
      { parameter: 'Hygiene Protection', value: 'Dual Anti-Fungal & Anti-Bacterial Action' },
      { parameter: 'Quality Certification', value: 'ISO 9001:2015 Certified · Make in India' },
    ],
  },
];
