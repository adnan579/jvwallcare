import React from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Building2,
  Sparkles,
  Home,
} from 'lucide-react';
import { BRAND_ASSETS, COMPANY_INFO } from '../data/products';

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
  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Hero Banner */}
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

      {/* 3 Building Segments from the Catalog */}
      <section className="py-14 lg:py-18 border-b border-slate-200 dark:border-slate-800">
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
                className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3"
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

      {/* 5 Core Quality Pillars & Application Guide */}
      <section className="py-14 lg:py-18 bg-slate-50 dark:bg-slate-950">
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
                className="px-4 py-2.5 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
              >
                Contact Factory
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
