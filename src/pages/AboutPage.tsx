import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  ArrowRight,
  Building2,
  Sparkles,
  Home,
  BookOpen,
  Image as ImageIcon,
  Clock,
  ZoomIn,
  X,
  Tag,
  Play,
} from 'lucide-react';
import { BRAND_ASSETS, COMPANY_INFO } from '../data/products';

export interface BlogArticle {
  id: number;
  slug: string;
  title: string;
  hindiSubtitle?: string | null;
  excerpt: string;
  content: string;
  category: string;
  coverImageUrl: string;
  mediaType: string;
  authorName: string;
  readTimeMinutes: number;
  seoKeywords?: string | null;
  status: string;
  createdAt?: string;
}

export interface GalleryMediaItem {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  mediaUrl: string;
  mediaType: string;
  featured: boolean;
  createdAt?: string;
}

const FALLBACK_BLOGS: BlogArticle[] = [
  {
    id: 1,
    slug: 'waterproof-blue-vs-extra-fine-teal-wall-putty-guide',
    title:
      'How to Choose Between J.V. Water Proof (Blue Pack) & Extra Fine (Teal Pack) 40 kg Wall Putty',
    hindiSubtitle:
      'जे. वी. वाटर प्रूफ (ब्लू पैक) बनाम एक्स्ट्रा फाइन (टील पैक) — सही चुनाव कैसे करें',
    excerpt:
      'A complete civil engineering and painter guide comparing J.V. Water Proof Wall Putty (JV-WP-40B) for damp-prone exteriors and J.V. Extra Fine Wall Putty (JV-EF-40T) for ultra-smooth luxury interiors.',
    content:
      'When preparing masonry plaster in residential homes (नया घर / पुराना घर) or commercial complexes (कमर्शियल बिल्डिंग), choosing the right polymer-modified white cement putty determines both topcoat paint consumption and 10-year dampness resistance.\n\n1. When to Specify the Navy Blue & Orange Pack (JV-WP-40B):\nFormulated with hydrophobic silicone-polymer additives, our 40 kg Water Proof Wall Putty is built for exterior facades, boundary walls, bathrooms, and ground-floor walls prone to monsoon capillary dampness. It delivers 12–15 sq. ft./kg coverage for 2 coats and prevents efflorescence and flaking.\n\n2. When to Specify the Teal Green & Orange Pack (JV-EF-40T):\nEngineered with 99% passing 325-mesh ultra-fine classification and anti-bacterial shield properties, our Teal Extra Fine Wall Putty produces a mirror-smooth 93%+ Hunter whiteness canvas that cuts luxury emulsion consumption by up to 25%.\n\n3. Standard 38% Water Mixing Rule:\nAlways add J.V. Wall Putty powder slowly into 36%–40% clean water (~15 Liters per 40 kg bag), stir mechanically for 10 minutes, let the paste mature for 5 minutes, and apply in two thin coats (total thickness <= 1.5 mm). No water curing is required after application.',
    category: 'Product Selection Guide',
    coverImageUrl: BRAND_ASSETS.dualBagsMockup,
    mediaType: 'image',
    authorName: 'J.V. Wall Care Technical Desk, Bhadohi',
    readTimeMinutes: 5,
    seoKeywords:
      'JV Wall Putty, waterproof wall putty 40kg, extra fine wall putty, white cement polymer putty Bhadohi UP',
    status: 'PUBLISHED',
  },
  {
    id: 2,
    slug: 'why-polymer-white-cement-putty-beats-traditional-cement-wash',
    title:
      'Why White Cement & Polymer Wall Putty Saves 25% Topcoat Paint Cost on New & Old Homes',
    hindiSubtitle: 'सफेद सीमेंट और पॉलीमर वाल पुट्टी से पेंट की खपत में 25% तक की बचत',
    excerpt:
      'Discover how J.V. Wall Care Udyog ISO 9001:2015 certified wall putty seals micro-pores in rough plaster, prevents hairline shrinkage cracks, and brings out true emulsion shade vibrancy.',
    content:
      'Many homeowners and contractors in Uttar Pradesh ask whether a traditional white cement wash is enough before painting. Laboratory testing at our Saripur, Gopiganj (Bhadohi) plant demonstrates four decisive advantages of polymer-modified J.V. Wall Putty:\n\n• Tensile Adhesion Strength >= 0.85 N/mm²: Redisperseable polymers lock into masonry pores so topcoat paints never peel or blister.\n• Zero Water Curing Required: Self-curing water-retentive polymers hydrate the white cement matrix naturally.\n• Super Whiteness (92%+ to 93%+): Eliminates the dull grey undertone of raw plaster so fewer coats of expensive topcoat emulsion are needed.\n• Anti-Fungal & Anti-Pill Protection: Protects both नया घर (New Home) and पुराना घर (Old Home) walls against monsoon black spots.',
    category: 'Site Application Protocol',
    coverImageUrl: BRAND_ASSETS.promotionalPoster,
    mediaType: 'image',
    authorName: 'Quality Control Lab, Gopiganj Plant',
    readTimeMinutes: 4,
    seoKeywords:
      'white cement wall putty benefits, wall putty coverage per kg, JV Wall Care Udyog Gopiganj Bhadohi',
    status: 'PUBLISHED',
  },
  {
    id: 3,
    slug: 'authorized-dealership-hardware-network-uttar-pradesh',
    title: 'Inside Our Saripur, Gopiganj Manufacturing Plant & 40 kg HDPE Packaging Standards',
    hindiSubtitle: 'सारीपुर, गोपीगंज (भदोही) फैक्ट्री डिस्पैच और 40 kg एचडीपीई पैकेजिंग मानक',
    excerpt:
      'How J.V. Wall Care Udyog ensures moisture-proof 40 kg laminated HDPE packaging, batch-tested ISO 9001:2015 consistency, and direct truckload dispatch for dealers across Uttar Pradesh.',
    content:
      'Every 40 kg sack of J.V. Wall Putty leaving our facility at 0, Gopiganj, Lohara Khas, Saripur, Bhadohi (U.P.) - 221303 undergoes strict sieve residue, whiteness, and setting-time verification.\n\nOur heavy-duty laminated woven HDPE bags protect the fine powder from ambient warehouse humidity for up to 12 months when stacked on dry wooden pallets. Hardware retailers (100-bag initial load) and District Wholesale Stockists (350-bag / 14 MT truckload) receive direct factory billing, promotional Hindi shop boards, and priority loading.',
    category: 'Manufacturing & Dealership',
    coverImageUrl: BRAND_ASSETS.realBagPhoto,
    mediaType: 'image',
    authorName: 'Plant Dispatch Desk, Bhadohi',
    readTimeMinutes: 4,
    seoKeywords:
      'wall putty dealership UP, wall putty manufacturer Bhadohi, 40kg wall putty wholesale',
    status: 'PUBLISHED',
  },
];

const FALLBACK_GALLERY: GalleryMediaItem[] = [
  {
    id: 1,
    title: 'Official Campaign Poster — जे. वी. वाल पुट्टी (सुंदरता की पहचान)',
    subtitle: 'नया घर | पुराना घर | कमर्शियल बिल्डिंग · 5 Quality Pillars',
    category: 'POSTER',
    mediaUrl: BRAND_ASSETS.promotionalPoster,
    mediaType: 'image',
    featured: true,
  },
  {
    id: 2,
    title: 'Dual 40 kg Catalog Packaging — Blue Water Proof & Teal Extra Fine',
    subtitle: 'White Cement & Polymer Based Interior & Exterior Wall Putty (Net Wt. 40 kg)',
    category: 'PACKAGING',
    mediaUrl: BRAND_ASSETS.dualBagsMockup,
    mediaType: 'image',
    featured: true,
  },
  {
    id: 3,
    title: 'Physical 40 kg Factory Sack — Saripur, Gopiganj, Bhadohi Plant',
    subtitle: 'Laminated Moisture-Resistant HDPE Sack Ready for Dealer Dispatch',
    category: 'PLANT',
    mediaUrl: BRAND_ASSETS.realBagPhoto,
    mediaType: 'image',
    featured: true,
  },
  {
    id: 4,
    title: 'Official J.V. Wall Putty Registered Brand Monogram',
    subtitle: 'Signature Teal & Safety Orange Identity of J.V. Wall Care Udyog',
    category: 'POSTER',
    mediaUrl: BRAND_ASSETS.logo,
    mediaType: 'image',
    featured: true,
  },
];

interface AboutPageProps {
  onNavigateCatalog: () => void;
  onNavigateAffiliation: () => void;
  onNavigateContact: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateCatalog,
  onNavigateAffiliation,
  onNavigateContact,
}) => {
  const [blogs, setBlogs] = useState<BlogArticle[]>(FALLBACK_BLOGS);
  const [galleryItems, setGalleryItems] = useState<GalleryMediaItem[]>(FALLBACK_GALLERY);
  const [galleryCategory, setGalleryCategory] = useState<string>('ALL');
  const [selectedBlog, setSelectedBlog] = useState<BlogArticle | null>(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryMediaItem | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/blogs')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.blogs && data.blogs.length > 0) {
          setBlogs(data.blogs);
        }
      })
      .catch(() => {
        // Keep seeded fallback blogs if offline
      });

    fetch('/api/gallery')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.gallery && data.gallery.length > 0) {
          setGalleryItems(data.gallery);
        }
      })
      .catch(() => {
        // Keep seeded fallback gallery if offline
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredGallery =
    galleryCategory === 'ALL'
      ? galleryItems
      : galleryItems.filter((item) => item.category === galleryCategory);

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* 1. Hero Banner */}
      <section className="py-10 sm:py-14 lg:py-18 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#06686B] dark:text-teal-400">
                <span>About {COMPANY_INFO.name}</span>
                <span aria-hidden="true">·</span>
                <span>{COMPANY_INFO.certification}</span>
              </div>

              <h1
                className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight"
                style={{ textWrap: 'balance' }}
              >
                Manufacturing Excellence in White Cement &amp; Polymer Wall Putty from Bhadohi, U.P.
              </h1>

              <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-4 border-l-orange-600 flex flex-wrap items-baseline gap-2.5">
                <span className="text-xl sm:text-2xl font-extrabold text-orange-600 dark:text-orange-400">
                  {COMPANY_INFO.hindiName}
                </span>
                <span className="text-slate-400">—</span>
                <span className="text-base sm:text-lg font-bold text-[#0B3B68] dark:text-teal-300">
                  {COMPANY_INFO.hindiTagline}
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Headquartered at{' '}
                <strong className="text-slate-900 dark:text-white">{COMPANY_INFO.address}</strong>,{' '}
                <strong>{COMPANY_INFO.name}</strong> is an ISO 9001:2015 certified Indian
                manufacturer dedicated to formulating high-whiteness, crack-resistant, and
                waterproof wall putty for residential and commercial architecture.
              </p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onNavigateCatalog}
                  className="min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#06686B] hover:bg-[#055255] dark:bg-teal-600 dark:hover:bg-teal-500 rounded-xl cursor-pointer"
                >
                  <span>View 40 kg Wall Putty Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onNavigateAffiliation}
                  className="min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl cursor-pointer"
                >
                  <span>Become an Affiliated Dealer</span>
                </button>
              </div>
            </div>

            {/* Right Column: Official Promotional Poster Card */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
              <div className="h-80 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center p-2">
                <img
                  src={BRAND_ASSETS.promotionalPoster}
                  alt="J.V. Wall Putty Official Campaign Poster"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span>Manufactured &amp; Marketed by J.V. Wall Care Udyog</span>
                <span className="font-mono-tabular font-semibold text-teal-700 dark:text-teal-400">
                  ISO 9001:2015
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 3 Building Segments from the Catalog */}
      <section className="py-12 sm:py-14 lg:py-18 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              All Wall Surface Use (Interior &amp; Exterior)
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Engineered for Every Construction Stage
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMPANY_INFO.segments.map((seg) => (
              <div
                key={seg.id}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl font-extrabold text-orange-600 dark:text-orange-400">
                    {seg.hindi}
                  </span>
                  <Home className="w-5 h-5 text-[#06686B] dark:text-teal-400" />
                </div>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  {seg.english}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {seg.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. OFFICIAL PLANT & PACKAGING GALLERY SECTION */}
      <section
        id="about-gallery"
        className="py-12 sm:py-14 lg:py-18 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#06686B] dark:text-teal-400">
                <ImageIcon className="w-4 h-4" />
                <span>Official Brand &amp; Plant Media Gallery</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Factory Packaging, Bags &amp; Campaign Gallery
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Inspect our 40 kg laminated HDPE sacks, official Hindi/English campaign posters, and
                plant dispatch media managed via our CMS.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl">
              {[
                { id: 'ALL', label: `All Media (${galleryItems.length})` },
                { id: 'PACKAGING', label: '40 kg Bags' },
                { id: 'PLANT', label: 'Bhadohi Plant' },
                { id: 'POSTER', label: 'Catalog Posters' },
              ].map((tab) => {
                const active = galleryCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setGalleryCategory(tab.id)}
                    className={`min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                      active
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGallery.map((item) => {
              const isLogo = item.mediaUrl.includes('97b0b9ac');
              return (
                <article
                  key={item.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xs"
                >
                  <div className="relative h-64 bg-slate-100 dark:bg-slate-800 p-3 flex items-center justify-center overflow-hidden">
                    {item.mediaType === 'video' ? (
                      <video
                        src={item.mediaUrl}
                        controls
                        className="h-full w-full object-contain rounded-lg"
                      />
                    ) : (
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className={`h-full w-full ${
                          isLogo
                            ? 'w-[125%] max-w-none object-cover object-[58%_48%]'
                            : 'object-contain'
                        }`}
                      />
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-mono-tabular font-bold uppercase tracking-wider bg-slate-900/80 text-orange-300 rounded-md">
                      {item.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedGalleryItem(item)}
                      className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900/85 hover:bg-slate-900 rounded-lg cursor-pointer"
                    >
                      {item.mediaType === 'video' ? (
                        <Play className="w-3.5 h-3.5" />
                      ) : (
                        <ZoomIn className="w-3.5 h-3.5" />
                      )}
                      <span>Inspect</span>
                    </button>
                  </div>
                  <div className="p-4 space-y-1">
                    <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                      {item.subtitle}
                    </p>
                    <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. TECHNICAL BLOG & WALL CARE KNOWLEDGE HUB */}
      <section
        id="about-blog"
        className="py-12 sm:py-14 lg:py-18 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#06686B] dark:text-teal-400">
                <BookOpen className="w-4 h-4" />
                <span>Technical Knowledge Hub &amp; Wall Care Blog</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Insights from J.V. Wall Care Technical Desk
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Read engineering guides on white cement polymer putty, dampness protection, 38%
                water mixing protocols, and dealership economics.
              </p>
            </div>
            <span className="text-xs font-mono-tabular font-semibold text-slate-500 dark:text-slate-400">
              {blogs.length} Published Articles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((post) => (
              <article
                key={post.id}
                className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="relative h-52 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 flex items-center justify-center overflow-hidden">
                    {post.mediaType === 'video' ? (
                      <video
                        src={post.coverImageUrl}
                        controls
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-contain"
                      />
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold bg-[#06686B] text-white rounded-md">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium truncate">{post.authorName}</span>
                      <span className="inline-flex items-center gap-1 font-mono-tabular shrink-0">
                        <Clock className="w-3.5 h-3.5 text-orange-600" />
                        <span>{post.readTimeMinutes} min read</span>
                      </span>
                    </div>

                    <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {post.title}
                    </h3>

                    {post.hindiSubtitle && (
                      <p className="text-xs font-bold text-orange-600 dark:text-orange-400">
                        {post.hindiSubtitle}
                      </p>
                    )}

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedBlog(post)}
                    className="min-h-[40px] inline-flex items-center gap-1.5 text-xs font-bold text-[#06686B] dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    <span>Read Full Technical Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 5 Core Quality Pillars & 4-Step Application Guide */}
      <section className="py-12 sm:py-14 lg:py-18 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#06686B] dark:text-teal-400">
              <Award className="w-4 h-4" />
              <span>Why Painters &amp; Engineers Trust J.V. Wall Putty</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              5 Catalog-Certified Quality Advantages
            </h2>
            <div className="space-y-3">
              {COMPANY_INFO.posterHighlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3.5"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#06686B] dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h3>
                      <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                        ({item.hindi})
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 dark:text-orange-400">
              <Sparkles className="w-4 h-4" />
              <span>Standard Site Application Protocol</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              4-Step Application Method for Best Finish
            </h2>

            <div className="space-y-3">
              {[
                {
                  step: '01. Surface Preparation & Pre-Wetting',
                  desc: 'Remove loose dust, grease, and flaking paint from the plastered wall. Pre-wet the surface lightly with clean water so the masonry is damp but free of standing water.',
                },
                {
                  step: '02. Mechanical or Hand Mixing (38% Water)',
                  desc: 'Slowly add J.V. Wall Putty powder to 36%–40% clean water (approx. 15 Liters per 40 kg bag). Stir for 10 minutes until a creamy lump-free paste forms, then let it mature for 5 minutes.',
                },
                {
                  step: '03. First Leveling Coat Application',
                  desc: 'Apply the first coat from bottom to top using a steel putty blade. Allow it to dry for at least 4–6 hours in normal weather conditions.',
                },
                {
                  step: '04. Second Coat & Fine Sanding',
                  desc: 'Apply the second thin coat horizontally to achieve an ultra-smooth finish (total 2-coat thickness <= 1.5 mm). After drying, gently level with fine waterproof emery paper (400+ grit) before painting.',
                },
              ].map((st, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1"
                >
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{st.step}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-xl bg-[#0B3B68] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-orange-300 font-semibold">
                  <Building2 className="w-4 h-4" />
                  <span>Visit Our Bhadohi Manufacturing Plant</span>
                </div>
                <p className="text-xs text-slate-200">{COMPANY_INFO.address}</p>
              </div>
              <button
                type="button"
                onClick={onNavigateContact}
                className="min-h-[44px] px-4 py-2.5 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-xl whitespace-nowrap shrink-0 cursor-pointer"
              >
                Contact Factory
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Reader Modal */}
      {selectedBlog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedBlog.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-5 sm:p-7 space-y-5 my-8">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-teal-50 dark:bg-teal-950 text-[#06686B] dark:text-teal-300 rounded-md">
                  {selectedBlog.category} · {selectedBlog.readTimeMinutes} min read
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedBlog.title}
                </h2>
                {selectedBlog.hindiSubtitle && (
                  <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                    {selectedBlog.hindiSubtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedBlog(null)}
                aria-label="Close blog article"
                className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-60 sm:h-72 bg-slate-100 dark:bg-slate-950 rounded-xl p-3 flex items-center justify-center overflow-hidden">
              {selectedBlog.mediaType === 'video' ? (
                <video
                  src={selectedBlog.coverImageUrl}
                  controls
                  className="h-full w-full object-contain"
                />
              ) : (
                <img
                  src={selectedBlog.coverImageUrl}
                  alt={selectedBlog.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {selectedBlog.content}
            </div>

            {selectedBlog.seoKeywords && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500">
                <Tag className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span>Keywords: {selectedBlog.seoKeywords}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gallery Lightbox Modal */}
      {selectedGalleryItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedGalleryItem.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                  {selectedGalleryItem.subtitle}
                </p>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  {selectedGalleryItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGalleryItem(null)}
                aria-label="Close gallery preview"
                className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-100 dark:bg-slate-950 rounded-xl p-3 flex items-center justify-center max-h-[70vh] overflow-hidden">
              {selectedGalleryItem.mediaType === 'video' ? (
                <video
                  src={selectedGalleryItem.mediaUrl}
                  controls
                  className="max-h-[65vh] w-auto object-contain"
                />
              ) : (
                <img
                  src={selectedGalleryItem.mediaUrl}
                  alt={selectedGalleryItem.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[65vh] w-auto object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
