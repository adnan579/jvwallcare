import React, { useState } from 'react';
import {
  Phone,
  ArrowRight,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  FileText,
  Calculator,
  Droplets,
  Package,
  Home,
  ZoomIn,
  X,
  Sparkles,
} from 'lucide-react';
import {
  BRAND_ASSETS,
  CATALOG_PRODUCTS,
  COMPANY_INFO,
  WallPuttyProduct,
} from '../data/products';
import {
  BuildingCondition,
  PuttyGradeSelection,
  calculateMaterialEstimate,
  filterCatalogProducts,
} from '../utils/calculator';

interface CatalogPageProps {
  onSelectProductForModal: (product: WallPuttyProduct) => void;
  onOrderProduct: (productName: string, quantityText?: string) => void;
  onNavigateAffiliation: () => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  onSelectProductForModal,
  onOrderProduct,
  onNavigateAffiliation,
}) => {
  const [variantFilter, setVariantFilter] = useState<'all' | 'blue-navy' | 'teal-green'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculator state
  const [areaSqFt, setAreaSqFt] = useState<string>('2800');
  const [puttyGrade, setPuttyGrade] = useState<PuttyGradeSelection>(
    'jv-waterproof-wall-putty-blue'
  );
  const [buildingCondition, setBuildingCondition] = useState<BuildingCondition>('new-home');
  const [coats, setCoats] = useState<2 | 3>(2);

  // Lightbox state
  const [lightboxImage, setLightboxImage] = useState<{
    title: string;
    subtitle: string;
    url: string;
  } | null>(null);

  const filteredProducts = filterCatalogProducts(CATALOG_PRODUCTS, variantFilter, searchQuery);

  const numericArea = parseFloat(areaSqFt) || 0;
  const estimate = calculateMaterialEstimate({
    areaSqFt: numericArea,
    puttyGrade,
    buildingCondition,
    coats,
  });

  return (
    <div className="space-y-0">
      {/* 1. CATALOG-ALIGNED HERO SECTION */}
      <section className="relative bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Subtle architectural background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -right-28 w-96 h-96 rounded-full bg-[#06686B]/6 dark:bg-teal-500/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-orange-500/5 dark:bg-orange-500/5 blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left 7 Columns: Official Catalog Identity & Value Proposition */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6 sm:space-y-7">
              <div className="space-y-4 sm:space-y-5">
                {/* Unboxed Catalog Trust Metadata */}
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5 text-[#06686B] dark:text-teal-400 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                    <span>{COMPANY_INFO.certification}</span>
                  </span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                    |
                  </span>
                  <span>{COMPANY_INFO.shortAddress}</span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                    |
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {COMPANY_INFO.origin}
                  </span>
                </div>

                {/* Display Title */}
                <h1
                  className="font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]"
                  style={{ fontSize: 'clamp(1.85rem, 3.8vw, 3.25rem)', textWrap: 'balance' }}
                >
                  J.V. Wall Putty — White Cement &amp; Polymer Based Wall Protection.
                </h1>

                {/* Official Hindi Tagline Card styled after the Catalog Poster Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 border-l-4 border-l-orange-600 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-3">
                    <div className="flex flex-wrap items-baseline gap-2.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-orange-600 dark:text-orange-400 tracking-tight">
                        {COMPANY_INFO.hindiName}
                      </span>
                      <span className="text-slate-400" aria-hidden="true">
                        —
                      </span>
                      <span className="text-base sm:text-xl font-bold text-[#0B3B68] dark:text-teal-300">
                        {COMPANY_INFO.hindiTagline}
                      </span>
                    </div>
                    <span className="text-xs font-mono-tabular font-bold text-[#06686B] dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md self-start sm:self-auto">
                      Net Wt. 40 kg (When Packed)
                    </span>
                  </div>

                  {/* Bottom Bar from Poster: नया घर | पुराना घर | कमर्शियल बिल्डिंग */}
                  <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                      <span>नया घर (New Home)</span>
                    </span>
                    <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">
                      |
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#06686B] dark:bg-teal-400" />
                      <span>पुराना घर (Old Home)</span>
                    </span>
                    <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">
                      |
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0B3B68] dark:bg-sky-400" />
                      <span>कमर्शियल बिल्डिंग (Commercial)</span>
                    </span>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  Manufactured &amp; marketed by{' '}
                  <strong className="font-semibold text-slate-900 dark:text-white">
                    J.V. Wall Care Udyog
                  </strong>{' '}
                  at our Saripur, Gopiganj facility in Bhadohi, Uttar Pradesh. Available in two
                  specialized 40 kg architectural grades: our{' '}
                  <strong className="text-[#0B3B68] dark:text-sky-400">
                    Navy Blue Water Proof Pack
                  </strong>{' '}
                  and our{' '}
                  <strong className="text-[#06686B] dark:text-teal-400">
                    Teal Green Extra Fine Pack
                  </strong>{' '}
                  for interior and exterior walls.
                </p>

                {/* 5 Core Catalog Pillars from the Poster Left Column */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                  {COMPANY_INFO.posterHighlights.map((pillar, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl bg-white dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs flex flex-col justify-between ${
                        i === 4 ? 'col-span-2 sm:col-span-1' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-mono-tabular font-bold text-slate-400 dark:text-slate-500">
                          0{i + 1}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                          {pillar.title}
                        </p>
                        <p className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 mt-0.5">
                          {pillar.hindi}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary CTA & Direct Contact Strip */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      onOrderProduct('J.V. Water Proof Wall Putty (Blue & Orange Pack)')
                    }
                    className="min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#06686B] hover:bg-[#055255] dark:bg-teal-600 dark:hover:bg-teal-500 rounded-xl shadow-xs cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Order 40 kg Wall Putty</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={onNavigateAffiliation}
                    className="min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Apply for Dealership Affiliation</span>
                  </button>

                  <a
                    href={`tel:+91${COMPANY_INFO.phone}`}
                    className="min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100 bg-orange-50/80 dark:bg-slate-800/60 sm:bg-transparent border border-orange-200/80 dark:border-slate-700 sm:border-transparent rounded-xl hover:text-orange-600 dark:hover:text-orange-400 whitespace-nowrap shrink-0"
                  >
                    <Phone className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="font-mono-tabular">{COMPANY_INFO.phoneFormatted}</span>
                  </a>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-start sm:items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#06686B] dark:text-teal-400 shrink-0 mt-0.5 sm:mt-0" />
                    <span>
                      <strong className="text-slate-900 dark:text-white">Factory Address:</strong>{' '}
                      {COMPANY_INFO.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold shrink-0">
                    <ShieldCheck className="w-4 h-4 text-orange-600" />
                    <span>All Wall Surface Use</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Catalog Poster & Dual Bag Card with Teal/Orange/Navy Styling */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              {/* Top Brand Banner styled after the J.V. Catalog Header */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-[#06686B] via-[#08546C] to-[#0B3B68] border-b-2 border-orange-500 text-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-13 h-12 sm:w-15 sm:h-13 rounded-xl overflow-hidden bg-[#f7f7f5] border border-white/25 flex items-center justify-center shrink-0">
                    <img
                      src={BRAND_ASSETS.logo}
                      alt="J.V. Wall Putty Official Logo"
                      referrerPolicy="no-referrer"
                      className="w-[125%] h-full max-w-none object-cover object-[56%_48%]"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-orange-300 uppercase tracking-wider">
                      Official Provided Catalog
                    </p>
                    <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                      J.V. WALL PUTTY (40 kg)
                    </h2>
                    <p className="text-xs text-teal-100">
                      Interior &amp; Exterior · White Cement &amp; Polymer Based
                    </p>
                  </div>
                </div>
              </div>

              {/* Dual 40kg Bags Image Showcase */}
              <div className="p-4 sm:p-5 bg-slate-50/60 dark:bg-slate-900 flex-1 flex flex-col justify-between gap-4">
                <div className="relative flex-1 min-h-[220px] sm:min-h-[280px] rounded-xl overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-white p-3 flex items-center justify-center">
                  <img
                    src={BRAND_ASSETS.dualBagsMockup}
                    alt="J.V. Water Proof Wall Putty (Blue) and Extra Fine Wall Putty (Teal) 40kg Catalog Bags"
                    referrerPolicy="no-referrer"
                    className="w-full h-full max-h-[290px] object-contain"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxImage({
                        title: '40 kg Dual Packaging Mockup (Blue & Teal)',
                        subtitle: 'Water Proof Wall Putty & Extra Fine Wall Putty',
                        url: BRAND_ASSETS.dualBagsMockup,
                      })
                    }
                    className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-white bg-slate-900/80 hover:bg-slate-900 rounded-lg cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Zoom Bags</span>
                  </button>
                </div>

                {/* Two Catalog Variant Callouts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 border-t-2 border-t-[#0B3B68]">
                    <div className="flex items-center justify-between gap-1.5 text-xs font-bold text-[#0B3B68] dark:text-sky-400">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        <span>Blue Pack (40 kg)</span>
                      </span>
                      <span className="text-[10px] font-mono-tabular text-slate-400">JV-WP-40B</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                      Water Proof Wall Putty
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Water Proof · Wind Resistant · Anti-Pill · Anti-Cracking
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 border-t-2 border-t-[#06686B]">
                    <div className="flex items-center justify-between gap-1.5 text-xs font-bold text-[#06686B] dark:text-teal-400">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        <span>Teal Pack (40 kg)</span>
                      </span>
                      <span className="text-[10px] font-mono-tabular text-slate-400">JV-EF-40T</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                      Extra Fine Wall Putty
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Water Resistant · Smooth Finish · Anti-Fungal · Anti-Bacterial
                    </p>
                  </div>
                </div>

                {/* Official Packaging Footer Strip */}
                <div className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70 flex items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Manufactured &amp; Marketed by J.V. Wall Care Udyog
                  </span>
                  <span className="font-mono-tabular font-semibold text-orange-600 dark:text-orange-400 shrink-0">
                    ISO 9001:2015
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROVIDED CATALOG SHOWCASE (STRICTLY THE UPLOADED J.V. WALL PUTTY VARIANTS) */}
      <section
        id="catalog-products"
        className="py-12 lg:py-18 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#06686B] dark:text-teal-400">
                <span>01. Official J.V. Wall Putty Catalog</span>
                <span aria-hidden="true">·</span>
                <span>40 kg Laminated HDPE Series</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Manufactured Wall Putty Variants
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Inspect the exact specifications, bag markings, and performance properties from our
                official J.V. Wall Care Udyog catalog.
              </p>
            </div>

            {/* Variant Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
              <div
                role="tablist"
                aria-label="Filter J.V. Wall Putty catalog variants"
                className="grid grid-cols-3 sm:flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl"
              >
                {[
                  { id: 'all', label: 'Both Packs (2)' },
                  { id: 'blue-navy', label: 'Blue Pack' },
                  { id: 'teal-green', label: 'Teal Pack' },
                ].map((tab) => {
                  const active = variantFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={active}
                      type="button"
                      onClick={() =>
                        setVariantFilter(tab.id as 'all' | 'blue-navy' | 'teal-green')
                      }
                      className={`min-h-[40px] px-2.5 sm:px-3.5 py-2 text-xs font-semibold rounded-lg cursor-pointer whitespace-nowrap truncate ${
                        active
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <input
                type="search"
                aria-label="Search catalog specifications"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search features (e.g., anti-pill)..."
                className="min-h-[42px] px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          {/* 2-Column Detailed Catalog Cards matching the Blue & Teal Bag Aesthetic */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              const isBlue = product.packVariant === 'blue-navy';
              return (
                <article
                  key={product.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs"
                >
                  <div>
                    {/* Top Diagonal-Inspired Color Band matching the Pack Color (Navy Blue vs Teal Green + Orange) */}
                    <div
                      className={`px-5 sm:px-6 py-4 text-white flex items-center justify-between gap-3 border-b-2 border-orange-500 ${
                        isBlue
                          ? 'bg-gradient-to-r from-[#0B3B68] via-[#0E4B82] to-[#C2410C]'
                          : 'bg-gradient-to-r from-[#06686B] via-[#098286] to-[#C2410C]'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="text-[11px] font-mono-tabular uppercase tracking-wider text-orange-200 block truncate">
                          {product.packColorLabel} · {product.code}
                        </span>
                        <h3 className="font-display text-base sm:text-xl font-extrabold text-white mt-0.5 leading-snug">
                          {product.name}
                        </h3>
                      </div>
                      <span className="text-xs font-mono-tabular font-bold bg-black/30 border border-white/15 px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0">
                        40 kg Pack
                      </span>
                    </div>

                    <div className="p-5 sm:p-6 space-y-6">
                      {/* Image + Core Tagline Split */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                        <div className="sm:col-span-5 h-52 sm:h-56 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 p-3 flex items-center justify-center">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-contain"
                          />
                        </div>

                        <div className="sm:col-span-7 space-y-3">
                          <p className="text-sm sm:text-base font-extrabold text-orange-600 dark:text-orange-400">
                            {product.hindiName}
                          </p>
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                            {product.tagline}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {product.shortDescription}
                          </p>

                          {/* 3 Orange Bottom Badges printed on front of the bag */}
                          <div className="pt-1">
                            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                              Front-of-Bag Protection Shields:
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              {product.bagBadges.map((b, i) => (
                                <div
                                  key={i}
                                  className="px-2 py-2 rounded-lg bg-orange-50/90 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-center"
                                >
                                  <span className="text-[11px] sm:text-xs font-bold text-orange-800 dark:text-orange-300 block leading-tight">
                                    {b}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Side-of-Bag Feature Callouts (5th item spans 2 columns on sm+ so no empty gap) */}
                      <div className="space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Printed Bag Performance Callouts
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {product.sideIcons.map((feat, idx) => (
                            <div
                              key={idx}
                              className={`flex items-start gap-2.5 text-xs p-3 rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 ${
                                idx === 4 ? 'sm:col-span-2' : ''
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#06686B] dark:text-teal-400 shrink-0 mt-0.5" />
                              <div className="min-w-0">
                                <strong className="text-slate-900 dark:text-white block">
                                  {feat.title}
                                </strong>
                                <span className="text-slate-600 dark:text-slate-400 block mt-0.5">
                                  {feat.detail}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Coverage & Mixing Summary */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-100/80 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/60 text-xs">
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block mb-0.5">
                            Coverage (2 Coats):
                          </span>
                          <strong className="font-mono-tabular text-slate-900 dark:text-white block">
                            {product.coverageRate}
                          </strong>
                        </div>
                        <div className="pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-700 sm:pl-3">
                          <span className="text-slate-500 dark:text-slate-400 block mb-0.5">
                            Surface Suitability:
                          </span>
                          <strong className="text-slate-900 dark:text-white block">
                            {product.surfaceUse}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 sm:px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => onSelectProductForModal(product)}
                      className="min-h-[44px] px-4 py-2.5 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-teal-600 hover:text-teal-700 dark:hover:text-teal-400 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-[#06686B] dark:text-teal-400" />
                      <span>Full Bag Specifications</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOrderProduct(product.name)}
                      className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#06686B] hover:bg-[#055255] dark:bg-teal-600 dark:hover:bg-teal-500 rounded-xl cursor-pointer"
                    >
                      <span>Inquire / Order 40 kg Bags</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE 40 KG WALL PUTTY BAG ESTIMATOR */}
      <section className="py-12 sm:py-14 lg:py-18 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-8 space-y-6">
              <div className="space-y-2 border-b border-slate-200 dark:border-slate-700 pb-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#06686B] dark:text-teal-400">
                  <Calculator className="w-4 h-4" />
                  <span>02. J.V. Wall Putty 40 kg Bag Calculator</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Estimate 40 kg Sacks for Your Building
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Calculate exact 40 kg bags and clean mixing water needed for नया घर (New Home),
                  पुराना घर (Old Home), or कमर्शियल बिल्डिंग (Commercial Building).
                </p>
              </div>

              {/* Building Type Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  1. Select Building Segment (From Catalog)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'new-home', hindi: 'नया घर', eng: 'New Home (+5%)' },
                    { id: 'old-home', hindi: 'पुराना घर', eng: 'Old Home (+15%)' },
                    {
                      id: 'commercial-building',
                      hindi: 'कमर्शियल बिल्डिंग',
                      eng: 'Commercial (+8%)',
                    },
                  ].map((b) => {
                    const active = buildingCondition === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBuildingCondition(b.id as BuildingCondition)}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer ${
                          active
                            ? 'bg-[#06686B] text-white border-[#06686B]'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">{b.hindi}</span>
                          <Home
                            className={`w-3.5 h-3.5 ${
                              active ? 'text-orange-300' : 'text-slate-400'
                            }`}
                          />
                        </div>
                        <p
                          className={`text-xs mt-1 ${
                            active ? 'text-teal-100' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {b.eng}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pack Variant & Coats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="calc-putty-grade"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                  >
                    2. Select J.V. Catalog Pack
                  </label>
                  <select
                    id="calc-putty-grade"
                    value={puttyGrade}
                    onChange={(e) => setPuttyGrade(e.target.value as PuttyGradeSelection)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-sm font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="jv-waterproof-wall-putty-blue">
                      Blue Pack — J.V. Water Proof Wall Putty (40 kg)
                    </option>
                    <option value="jv-extra-fine-wall-putty-teal">
                      Teal Pack — J.V. Extra Fine Wall Putty (40 kg)
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    3. Number of Putty Coats
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[2, 3].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCoats(c as 2 | 3)}
                        className={`min-h-[44px] py-2.5 px-3 text-xs font-semibold rounded-xl border cursor-pointer ${
                          coats === c
                            ? 'bg-slate-900 dark:bg-teal-600 text-white border-slate-900 dark:border-teal-600'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {c} Coats ({c === 2 ? 'Standard' : 'Rough Wall'})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Wall Area Input */}
              <div className="space-y-2">
                <label
                  htmlFor="calc-area-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                >
                  4. Total Wall &amp; Ceiling Area (sq. ft.)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="calc-area-input"
                    type="number"
                    min="0"
                    step="100"
                    value={areaSqFt}
                    onChange={(e) => setAreaSqFt(e.target.value)}
                    className="flex-1 min-h-[44px] px-4 py-2.5 text-base font-mono-tabular font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                  <div className="grid grid-cols-4 sm:flex items-center gap-1.5">
                    {[1500, 2800, 5000, 10000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAreaSqFt(String(preset))}
                        className="min-h-[44px] px-2 sm:px-3 py-2 text-xs font-mono-tabular font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-center"
                      >
                        {preset.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Result Output */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0B3B68] via-[#094769] to-[#06686B] text-white rounded-2xl p-6 sm:p-8 space-y-5 border border-slate-800 shadow-sm">
              <div className="border-b border-white/15 pb-4">
                <p className="text-xs font-semibold text-orange-300 uppercase tracking-wider">
                  Estimated J.V. Wall Putty Requirement
                </p>
                <h3 className="font-display text-lg font-bold text-white mt-1">
                  {estimate.selectedGradeName}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/25 border border-white/10">
                  <div className="flex items-center gap-1.5 text-xs text-slate-200">
                    <Package className="w-3.5 h-3.5 text-orange-400" />
                    <span>40 kg Bags Needed</span>
                  </div>
                  <p
                    data-testid="calc-packs-output"
                    className="text-3xl font-extrabold font-mono-tabular text-white mt-1.5"
                  >
                    {estimate.bags40KgRequired}
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">Net Wt. 40 kg Sacks</p>
                </div>

                <div className="p-4 rounded-xl bg-black/25 border border-white/10">
                  <span className="text-xs text-slate-200 block">Total Putty Weight</span>
                  <p
                    data-testid="calc-weight-output"
                    className="text-3xl font-extrabold font-mono-tabular text-orange-400 mt-1.5"
                  >
                    {estimate.totalKg.toLocaleString()} kg
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Includes +{estimate.wastageFactorPercent}% buffer
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-200 pt-2 border-t border-white/15">
                <div className="flex justify-between">
                  <span>Coverage Benchmark ({coats} Coats):</span>
                  <span className="font-mono-tabular font-semibold">
                    {estimate.effectiveCoveragePerKg} sq. ft. / kg
                  </span>
                </div>
                <div className="flex justify-between text-teal-200">
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5" />
                    <span>Clean Water for Mixing (38%):</span>
                  </span>
                  <span className="font-mono-tabular font-bold">
                    ~{estimate.waterLitersRequired} Liters
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-200 bg-black/25 p-3.5 rounded-xl leading-relaxed">
                {estimate.summaryNote}
              </p>

              <button
                type="button"
                disabled={estimate.bags40KgRequired === 0}
                onClick={() =>
                  onOrderProduct(
                    estimate.selectedGradeName,
                    `${estimate.bags40KgRequired} Bags × 40 kg (${estimate.totalKg} kg for ${numericArea} sq.ft.)`
                  )
                }
                className="w-full min-h-[48px] py-3.5 px-5 inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl cursor-pointer"
              >
                <span>Proceed to Order These {estimate.bags40KgRequired} Bags</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. UPLOADED CATALOG & PACKAGING GALLERY */}
      <section className="py-12 sm:py-14 lg:py-18 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#06686B] dark:text-teal-400">
              <span>03. Provided Catalog Sheets &amp; Packaging</span>
              <span aria-hidden="true">·</span>
              <span>Saripur, Gopiganj, Bhadohi (U.P.)</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Official J.V. Wall Putty Catalog &amp; Bag Gallery
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Click any official catalog sheet or 40 kg bag photograph below to inspect full-size
              packaging markings and Hindi/English specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Official Catalog Poster — जे. वी. वाल पुट्टी',
                subtitle: 'सुंदरता की पहचान · नया घर | पुराना घर | कमर्शियल बिल्डिंग',
                url: BRAND_ASSETS.promotionalPoster,
                fit: 'object-contain',
              },
              {
                title: '40 kg Dual Packaging Mockup (Blue & Teal)',
                subtitle: 'Water Proof Wall Putty & Extra Fine Wall Putty',
                url: BRAND_ASSETS.dualBagsMockup,
                fit: 'object-contain',
              },
              {
                title: 'Physical 40 kg Factory Bag (Bhadohi Unit)',
                subtitle: 'Saripur, Gopiganj, Bhadohi (U.P.) - 221303',
                url: BRAND_ASSETS.realBagPhoto,
                fit: 'object-contain',
              },
              {
                title: 'Official J.V. Wall Putty Brand Logo',
                subtitle: 'Registered Teal & Orange Monogram',
                url: BRAND_ASSETS.logo,
                fit: 'w-[125%] max-w-none object-cover object-[58%_48%]',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xs"
              >
                <div className="relative h-64 bg-slate-100 dark:bg-slate-800 p-3 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className={`h-full w-full ${item.fit}`}
                  />
                  <button
                    type="button"
                    onClick={() => setLightboxImage(item)}
                    className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900/85 hover:bg-slate-900 rounded-lg cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>
                </div>
                <div className="p-4 space-y-1">
                  <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                    {item.subtitle}
                  </p>
                  <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {lightboxImage && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={lightboxImage.title}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                    {lightboxImage.subtitle}
                  </p>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    {lightboxImage.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  aria-label="Close image preview"
                  className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-slate-100 dark:bg-slate-950 rounded-xl p-3 flex items-center justify-center max-h-[70vh] overflow-hidden">
                <img
                  src={lightboxImage.url}
                  alt={lightboxImage.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[65vh] w-auto object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
