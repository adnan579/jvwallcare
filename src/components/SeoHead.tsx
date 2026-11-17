import React, { useEffect } from 'react';
import { PageRoute } from './Navbar';

interface SeoHeadProps {
  activePage: PageRoute;
}

const SEO_CONFIG: Record<
  PageRoute,
  {
    title: string;
    description: string;
    keywords: string;
    robots: string;
  }
> = {
  catalog: {
    title: 'J.V. Wall Care Udyog – 40 kg Waterproof & Extra Fine Wall Putty',
    description:
      'Explore the official J.V. Wall Putty 40 kg catalog from J.V. Wall Care Udyog, Gopiganj, Bhadohi (U.P.). Compare Blue Water Proof & Teal Extra Fine Wall Putty and estimate bags.',
    keywords:
      'JV Wall Putty catalog, waterproof wall putty 40kg price, extra fine wall putty, white cement polymer putty Bhadohi, जे. वी. वाल पुट्टी',
    robots: 'index, follow',
  },
  about: {
    title: 'About J.V. Wall Care Udyog – Plant, Gallery & Technical Blog | Bhadohi',
    description:
      'Learn about J.V. Wall Care Udyog in Saripur, Gopiganj, Bhadohi (U.P.). Browse our ISO 9001:2015 wall care blog, 4-step site application guide, and factory packaging gallery.',
    keywords:
      'About JV Wall Care Udyog, wall putty blog India, how to apply wall putty, wall putty factory Gopiganj Bhadohi, wall putty gallery',
    robots: 'index, follow',
  },
  affiliation: {
    title: 'Wall Putty Dealership & Distributor Affiliation – J.V. Wall Care Udyog',
    description:
      'Apply for an authorized J.V. Wall Putty retail dealership (100 bags) or district wholesale stockist territory (350 bags) directly with our Bhadohi, U.P. manufacturing plant.',
    keywords:
      'wall putty dealership Uttar Pradesh, wall putty distributor inquiry, hardware paint dealer franchise India, JV Wall Care dealership',
    robots: 'index, follow',
  },
  contact: {
    title: 'Contact J.V. Wall Care Udyog – Direct Factory Order Desk (Bhadohi, UP)',
    description:
      'Contact J.V. Wall Care Udyog at 0, Gopiganj, Lohara Khas, Saripur, Bhadohi, UP 221303 (+91 88965 87151) for 40 kg J.V. Wall Putty orders and dispatch inquiries.',
    keywords:
      'JV Wall Care Udyog contact number, 8896587151, j.v.wallcare01@gmail.com, buy 40kg wall putty Bhadohi UP',
    robots: 'index, follow',
  },
  admin: {
    title: 'Admin CRM & CMS Dashboard | J.V. Wall Care Udyog',
    description: 'Protected Admin CRM and CMS portal for J.V. Wall Care Udyog.',
    keywords: 'admin dashboard',
    robots: 'noindex, nofollow',
  },
};

export const SeoHead: React.FC<SeoHeadProps> = ({ activePage }) => {
  useEffect(() => {
    const meta = SEO_CONFIG[activePage] || SEO_CONFIG.catalog;
    document.title = meta.title;

    const setMetaTag = (selector: string, attr: 'name' | 'property', key: string, val: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    };

    setMetaTag('meta[name="description"]', 'name', 'description', meta.description);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', meta.keywords);
    setMetaTag('meta[name="robots"]', 'name', 'robots', meta.robots);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', meta.description);
    setMetaTag(
      'meta[property="og:url"]',
      'property',
      'og:url',
      window.location.origin + window.location.pathname
    );
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title);
    setMetaTag(
      'meta[name="twitter:description"]',
      'name',
      'twitter:description',
      meta.description
    );

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.origin + window.location.pathname);
  }, [activePage]);

  return null;
};
