import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Menu,
  X,
  Layers,
  Building2,
  Handshake,
  PhoneCall,
  Phone,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { BRAND_ASSETS, COMPANY_INFO } from '../data/products';

export type PageRoute = 'catalog' | 'about' | 'affiliation' | 'contact' | 'admin';

interface NavbarProps {
  activePage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  isDark,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: {
    id: PageRoute;
    label: string;
    shortLabel: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'catalog',
      label: 'Wall Putty Catalog',
      shortLabel: 'Catalog',
      subtitle: 'Blue Waterproof & Teal Extra Fine 40 kg Packs',
      icon: Layers,
    },
    {
      id: 'about',
      label: 'About Us',
      shortLabel: 'About',
      subtitle: 'Bhadohi Manufacturing Plant & ISO 9001:2015',
      icon: Building2,
    },
    {
      id: 'affiliation',
      label: 'Dealership Affiliation',
      shortLabel: 'Dealership',
      subtitle: 'Authorized Dealer & District Stockist Onboarding',
      icon: Handshake,
    },
    {
      id: 'contact',
      label: 'Contact',
      shortLabel: 'Contact',
      subtitle: 'Direct Factory Dispatch & Order Inquiry',
      icon: PhoneCall,
    },
  ];

  const handleMobileNav = (page: PageRoute) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top App Bar (56px on Mobile, Full 3-Zone Contract on Desktop) */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="h-1 w-full bg-gradient-to-r from-[#06686B] via-[#EA580C] to-[#0B3B68]" />

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 md:gap-8 px-4 sm:px-6 h-[54px] md:h-auto md:py-3">
          {/* Zone 1: Brand Title + Official Logo */}
          <button
            type="button"
            onClick={() => handleMobileNav('catalog')}
            className="flex items-center gap-2.5 text-sm sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 rounded"
          >
            <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700 bg-[#f7f7f5] flex items-center justify-center shrink-0">
              <img
                src={BRAND_ASSETS.logo}
                alt="J.V. Wall Care Udyog Official Logo"
                referrerPolicy="no-referrer"
                className="w-[130%] h-full max-w-none object-cover object-[58%_38%]"
              />
            </span>
            <span className="truncate max-w-[190px] sm:max-w-none">{COMPANY_INFO.name}</span>
          </button>

          {/* Zone 2: Desktop Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium"
          >
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`whitespace-nowrap shrink-0 cursor-pointer py-1 border-b-2 ${
                    isActive
                      ? 'border-orange-600 text-teal-800 dark:text-teal-400 font-semibold'
                      : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Theme Toggle + Desktop CTA / Mobile Drawer Trigger (44x44px touch hitboxes) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="min-w-[40px] min-h-[40px] sm:min-w-[42px] sm:min-h-[42px] flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer shrink-0"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Desktop Primary CTA */}
            <button
              type="button"
              onClick={() => onNavigate('affiliation')}
              className="hidden md:inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold text-white bg-[#06686B] hover:bg-[#055255] dark:bg-teal-600 dark:hover:bg-teal-500 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
            >
              Dealership Inquiry
            </button>

            {/* Mobile Menu Drawer Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-[#06686B] text-white cursor-pointer shrink-0"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="fixed inset-0 z-50 md:hidden flex flex-col bg-slate-950/60 backdrop-blur-xs"
        >
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {COMPANY_INFO.name}
                </p>
                <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                  {COMPANY_INFO.hindiName} — {COMPANY_INFO.hindiTagline}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close mobile menu"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav aria-label="Mobile Drawer Navigation" className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleMobileNav(item.id)}
                    className={`w-full min-h-[54px] p-3 rounded-xl border text-left flex items-center justify-between gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-[#06686B] text-white border-[#06686B]'
                        : 'bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-5 h-5 shrink-0 ${
                          isActive ? 'text-orange-300' : 'text-[#06686B] dark:text-teal-400'
                        }`}
                      />
                      <div>
                        <span className="text-sm font-bold block">{item.label}</span>
                        <span
                          className={`text-xs block ${
                            isActive ? 'text-teal-100' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {item.subtitle}
                        </span>
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-[#06686B] dark:text-teal-400 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </div>
              <a
                href={`tel:+91${COMPANY_INFO.phone}`}
                className="w-full min-h-[46px] rounded-xl bg-orange-600 text-white font-bold flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Factory: {COMPANY_INFO.phoneFormatted}</span>
              </a>
            </div>
          </div>

          {/* Click outside backdrop to close */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Fixed Bottom Tab Bar for One-Handed Mobile Thumb Navigation (< md viewports) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-4 items-center h-16 px-1"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleMobileNav(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`min-h-[48px] flex flex-col items-center justify-center rounded-lg cursor-pointer ${
                isActive
                  ? 'text-[#06686B] dark:text-teal-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div
                className={`px-3 py-0.5 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-teal-50 dark:bg-teal-950/80' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] tracking-tight mt-0.5 whitespace-nowrap">
                {item.shortLabel}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
