import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { BRAND_ASSETS, COMPANY_INFO } from '../data/products';

export type PageRoute = 'catalog' | 'about' | 'affiliation' | 'contact';

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
  const navItems: { id: PageRoute; label: string }[] = [
    { id: 'catalog', label: 'Wall Putty Catalog' },
    { id: 'about', label: 'About Us' },
    { id: 'affiliation', label: 'Dealership Affiliation' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      {/* Top accent stripe echoing the Teal & Orange catalog geometry */}
      <div className="h-1 w-full bg-gradient-to-r from-[#06686B] via-[#EA580C] to-[#0B3B68]" />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8 px-4 sm:px-6 py-3">
        {/* Zone 1: Brand Title + Given Logo (single line) */}
        <button
          type="button"
          onClick={() => onNavigate('catalog')}
          className="flex items-center gap-2.5 sm:gap-3 text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 rounded"
        >
          <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700 bg-[#f7f7f5] flex items-center justify-center shrink-0">
            <img
              src={BRAND_ASSETS.logo}
              alt="J.V. Wall Care Udyog Official Logo"
              referrerPolicy="no-referrer"
              className="w-[130%] h-full max-w-none object-cover object-[58%_38%]"
            />
          </span>
          <span>{COMPANY_INFO.name}</span>
        </button>

        {/* Zone 2: 4 concise single-line text navigation links */}
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
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 border-b-2 ${
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

        {/* Zone 3: Theme Switcher (Moon/Sun) + Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('affiliation')}
            className="px-3.5 sm:px-4 py-2 text-xs font-semibold text-white bg-[#06686B] hover:bg-[#055255] dark:bg-teal-600 dark:hover:bg-teal-500 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Dealership Inquiry
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Strip (Visible only on small viewports) */}
      <nav
        aria-label="Mobile Page Navigation"
        className="flex md:hidden items-center justify-around border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2 py-1.5 overflow-x-auto"
      >
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                isActive
                  ? 'bg-[#06686B] text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
