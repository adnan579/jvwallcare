import { useState, useEffect } from 'react';
import { Navbar, PageRoute } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { SeoHead } from './components/SeoHead';
import { CatalogPage } from './pages/CatalogPage';
import { AboutPage } from './pages/AboutPage';
import { AffiliationPage } from './pages/AffiliationPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { CATALOG_PRODUCTS, WallPuttyProduct } from './data/products';

function resolveInitialPage(): PageRoute {
  if (typeof window === 'undefined') return 'catalog';
  const path = window.location.pathname.toLowerCase();
  if (path.includes('admin')) return 'admin';
  if (path.includes('about')) return 'about';
  if (path.includes('affiliation') || path.includes('dealer')) return 'affiliation';
  if (path.includes('contact')) return 'contact';
  return 'catalog';
}

export default function App() {
  const [activePage, setActivePage] = useState<PageRoute>(resolveInitialPage);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [selectedModalProduct, setSelectedModalProduct] = useState<WallPuttyProduct | null>(null);
  const [orderProduct, setOrderProduct] = useState<string>(CATALOG_PRODUCTS[0].name);
  const [orderQuantity, setOrderQuantity] = useState<string>('');

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Listen to browser back/forward navigation
  useEffect(() => {
    const onPopState = () => {
      setActivePage(resolveInitialPage());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleNavigate = (page: PageRoute) => {
    setActivePage(page);
    const urlPath = page === 'catalog' ? '/' : `/${page}`;
    window.history.pushState({ page }, '', urlPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderProduct = (productName: string, quantityText?: string) => {
    setOrderProduct(productName);
    if (quantityText !== undefined) {
      setOrderQuantity(quantityText);
    }
    handleNavigate('contact');
  };

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <SeoHead activePage={activePage} />

      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
      />

      <main className="flex-1">
        {activePage === 'catalog' && (
          <CatalogPage
            onSelectProductForModal={(product) => setSelectedModalProduct(product)}
            onOrderProduct={(prod, qty) => handleOrderProduct(prod, qty)}
            onNavigateAffiliation={() => handleNavigate('affiliation')}
          />
        )}

        {activePage === 'about' && (
          <AboutPage
            onNavigateCatalog={() => handleNavigate('catalog')}
            onNavigateAffiliation={() => handleNavigate('affiliation')}
            onNavigateContact={() => handleNavigate('contact')}
          />
        )}

        {activePage === 'affiliation' && <AffiliationPage />}

        {activePage === 'contact' && (
          <ContactPage
            preselectedProduct={orderProduct}
            preselectedQuantity={orderQuantity}
          />
        )}

        {activePage === 'admin' && (
          <AdminPage onBackToSite={() => handleNavigate('catalog')} />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      <ProductModal
        product={selectedModalProduct}
        onClose={() => setSelectedModalProduct(null)}
        onOrderProduct={(productName) => handleOrderProduct(productName)}
      />
    </div>
  );
}
