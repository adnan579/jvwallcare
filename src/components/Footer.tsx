import React from 'react';
import { BRAND_ASSETS, COMPANY_INFO } from '../data/products';
import { PageRoute } from './Navbar';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0B3B68] dark:bg-slate-950 text-slate-200 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/15">
          {/* Col 1: Brand & Address */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md overflow-hidden bg-[#f7f7f5] p-0.5 shrink-0">
                <img
                  src={BRAND_ASSETS.logo}
                  alt="J.V. Wall Care Udyog Logo"
                  referrerPolicy="no-referrer"
                  className="w-[130%] h-full max-w-none object-cover object-[58%_38%]"
                />
              </div>
              <div>
                <p className="font-display text-base font-bold text-white">{COMPANY_INFO.name}</p>
                <p className="text-xs text-orange-300 font-semibold">
                  {COMPANY_INFO.hindiName} — {COMPANY_INFO.hindiTagline}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Manufactured &amp; Marketed by {COMPANY_INFO.name}. White Cement &amp; Polymer Based
              Water Proof Wall Putty and Extra Fine Wall Putty (Net Wt. 40 kg) for Interior &amp;
              Exterior Wall Surfaces.
            </p>
            <p className="text-xs text-white font-medium">{COMPANY_INFO.address}</p>
          </div>

          {/* Col 2: Provided Catalog Variants */}
          <div className="md:col-span-4 space-y-2 text-xs">
            <p className="font-semibold text-orange-300 uppercase tracking-wider">
              Official 40 kg Wall Putty Catalog
            </p>
            <ul className="space-y-1.5 text-slate-200">
              <li>J.V. Water Proof Wall Putty — Blue &amp; Orange 40 kg Pack</li>
              <li>J.V. Wall Putty (Extra Fine) — Teal &amp; Orange 40 kg Pack</li>
              <li>नया घर (New Home) · पुराना घर (Old Home) · कमर्शियल बिल्डिंग</li>
              <li>Super Whiteness · Crack Resistant · Smooth Finish · Eco Friendly</li>
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div className="md:col-span-3 space-y-2 text-xs">
            <p className="font-semibold text-orange-300 uppercase tracking-wider">
              Factory Contact
            </p>
            <p>
              Phone:{' '}
              <a
                href={`tel:+91${COMPANY_INFO.phone}`}
                className="font-mono-tabular font-bold text-white hover:underline"
              >
                {COMPANY_INFO.phoneFormatted}
              </a>
            </p>
            <p>
              Email:{' '}
              <a
                href={`mailto:${COMPANY_INFO.emailPrimary}`}
                className="font-mono-tabular text-slate-200 hover:underline"
              >
                {COMPANY_INFO.emailPrimary}
              </a>
            </p>
            <p className="text-slate-300 pt-1">
              {COMPANY_INFO.certification} · {COMPANY_INFO.origin}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <p>
            &copy; {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => onNavigate('catalog')}
              className="hover:text-white cursor-pointer"
            >
              Wall Putty Catalog
            </button>
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="hover:text-white cursor-pointer"
            >
              About Us
            </button>
            <button
              type="button"
              onClick={() => onNavigate('affiliation')}
              className="hover:text-white cursor-pointer"
            >
              Dealership Affiliation
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="hover:text-white cursor-pointer"
            >
              Contact Page
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
